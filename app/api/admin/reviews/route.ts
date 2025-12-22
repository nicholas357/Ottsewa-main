import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const supabase = await createClient()

  // Check admin
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

  const { searchParams } = new URL(request.url)
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "20")
  const status = searchParams.get("status") || "all"
  const search = searchParams.get("search") || ""

  const offset = (page - 1) * limit

  let query = supabase.from("reviews").select(
    `
      id,
      rating,
      title,
      content,
      is_verified_purchase,
      is_approved,
      is_featured,
      helpful_count,
      created_at,
      user_id,
      product_id
    `,
    { count: "exact" },
  )

  if (status === "pending") {
    query = query.eq("is_approved", false)
  } else if (status === "approved") {
    query = query.eq("is_approved", true)
  } else if (status === "featured") {
    query = query.eq("is_featured", true)
  }

  const {
    data: reviews,
    error,
    count,
  } = await query.order("created_at", { ascending: false }).range(offset, offset + limit - 1)

  if (error) {
    console.error("Error fetching reviews:", error)
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
  }

  // Get product and user info
  const productIds = [...new Set(reviews?.map((r) => r.product_id) || [])]
  const userIds = [...new Set(reviews?.map((r) => r.user_id) || [])]

  let productMap: Record<string, { title: string; slug: string; image_url: string | null }> = {}
  let userMap: Record<string, { full_name: string | null; email: string }> = {}

  if (productIds.length > 0) {
    const { data: products } = await supabase.from("products").select("id, title, slug, image_url").in("id", productIds)

    if (products) {
      productMap = products.reduce(
        (acc, p) => {
          acc[p.id] = { title: p.title, slug: p.slug, image_url: p.image_url }
          return acc
        },
        {} as Record<string, { title: string; slug: string; image_url: string | null }>,
      )
    }
  }

  if (userIds.length > 0) {
    const { data: profiles } = await supabase.from("profiles").select("id, full_name, email").in("id", userIds)

    if (profiles) {
      userMap = profiles.reduce(
        (acc, p) => {
          acc[p.id] = { full_name: p.full_name, email: p.email }
          return acc
        },
        {} as Record<string, { full_name: string | null; email: string }>,
      )
    }
  }

  // Get stats
  const { data: allReviews } = await supabase.from("reviews").select("is_approved, is_featured")

  const stats = {
    total: allReviews?.length || 0,
    pending: allReviews?.filter((r) => !r.is_approved).length || 0,
    approved: allReviews?.filter((r) => r.is_approved).length || 0,
    featured: allReviews?.filter((r) => r.is_featured).length || 0,
  }

  const reviewsWithInfo =
    reviews?.map((r) => ({
      ...r,
      product: productMap[r.product_id] || null,
      user: userMap[r.user_id] || null,
    })) || []

  return NextResponse.json({
    reviews: reviewsWithInfo,
    total: count || 0,
    page,
    limit,
    stats,
  })
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient()

  // Check admin
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
  const { id, is_approved, is_featured } = body

  if (!id) {
    return NextResponse.json({ error: "Review ID required" }, { status: 400 })
  }

  const updates: Record<string, boolean> = {}
  if (typeof is_approved === "boolean") updates.is_approved = is_approved
  if (typeof is_featured === "boolean") updates.is_featured = is_featured

  const { error } = await supabase.from("reviews").update(updates).eq("id", id)

  if (error) {
    console.error("Error updating review:", error)
    return NextResponse.json({ error: "Failed to update review" }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient()

  // Check admin
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

  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "Review ID required" }, { status: 400 })
  }

  const { error } = await supabase.from("reviews").delete().eq("id", id)

  if (error) {
    console.error("Error deleting review:", error)
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
