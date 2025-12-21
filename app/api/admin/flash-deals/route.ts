import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    // Check admin access
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get all flash deals with product info
    const { data: deals, error } = await supabase
      .from("flash_deals")
      .select(`
        *,
        product:products(id, title, slug, image_url, base_price, original_price)
      `)
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json(deals || [])
  } catch (error) {
    console.error("Error fetching flash deals:", error)
    return NextResponse.json({ error: "Failed to fetch flash deals" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // Check admin access
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { title, description, discount_percentage, product_id, start_time, end_time, is_active } = body

    const { data, error } = await supabase
      .from("flash_deals")
      .insert({
        title,
        description,
        discount_percentage,
        product_id,
        start_time,
        end_time,
        is_active: is_active ?? true,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error creating flash deal:", error)
    return NextResponse.json({ error: "Failed to create flash deal" }, { status: 500 })
  }
}
