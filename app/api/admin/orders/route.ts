import { createClient } from "@supabase/supabase-js"
import { createClient as createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

// Helper function to check if user is admin
async function checkAdmin() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabaseAdmin.from("profiles").select("role").eq("id", user.id).single()

  if (profile?.role !== "admin") return null

  return user
}

export async function GET() {
  const admin = await checkAdmin()
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { data: orders, error } = await supabaseAdmin
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching orders:", error)
      return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
    }

    if (!orders || orders.length === 0) {
      return NextResponse.json({ orders: [] })
    }

    // Get unique product and user IDs
    const productIds = [...new Set(orders.map((o) => o.product_id).filter(Boolean))]
    const userIds = [...new Set(orders.map((o) => o.user_id).filter(Boolean))]

    // Fetch products and profiles in parallel
    const [productsRes, profilesRes] = await Promise.all([
      productIds.length > 0
        ? supabaseAdmin.from("products").select("id, title, slug, image_url, product_type").in("id", productIds)
        : { data: [], error: null },
      userIds.length > 0
        ? supabaseAdmin.from("profiles").select("id, email, full_name").in("id", userIds)
        : { data: [], error: null },
    ])

    // Create lookup maps
    const productsMap = new Map(productsRes.data?.map((p) => [p.id, p]) || [])
    const usersMap = new Map(profilesRes.data?.map((u) => [u.id, u]) || [])

    // Enrich orders with product and user data
    const enrichedOrders = orders.map((order) => ({
      ...order,
      product: productsMap.get(order.product_id) || null,
      user: usersMap.get(order.user_id) || null,
    }))

    return NextResponse.json({ orders: enrichedOrders })
  } catch (error) {
    console.error("Error in orders API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
