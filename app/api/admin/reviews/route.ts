import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// Check if user is admin
async function checkAdmin(supabase: any) {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return false

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  return profile?.role === "admin"
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const isAdmin = await checkAdmin(supabase)
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const productId = searchParams.get("productId")
    const rating = searchParams.get("rating")
    const search = searchParams.get("search")

    let query = supabase
      .from("reviews")
      .select(`
        *,
        products:product_id (
          id,
          title,
          slug,
          image_url
        )
      `)
      .order("created_at", { ascending: false })

    if (productId) {
      query = query.eq("product_id", productId)
    }

    if (rating) {
      query = query.eq("rating", Number.parseInt(rating))
    }

    if (search) {
      query = query.or(`reviewer_name.ilike.%${search}%,content.ilike.%${search}%,title.ilike.%${search}%`)
    }

    const { data: reviews, error } = await query

    if (error) {
      console.error("Error fetching reviews:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Get stats
    const { data: allReviews } = await supabase.from("reviews").select("rating")

    const stats = {
      total: allReviews?.length || 0,
      average: 0,
      distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } as Record<number, number>,
    }

    if (allReviews && allReviews.length > 0) {
      let sum = 0
      allReviews.forEach((r) => {
        sum += r.rating
        stats.distribution[r.rating as keyof typeof stats.distribution]++
      })
      stats.average = Math.round((sum / allReviews.length) * 10) / 10
    }

    return NextResponse.json({ reviews, stats })
  } catch (error) {
    console.error("Error in admin reviews API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const isAdmin = await checkAdmin(supabase)
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { product_id, reviewer_name, reviewer_location, rating, title, content, verified_purchase } = body

    if (!product_id || !reviewer_name || !rating || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { data: review, error } = await supabase
      .from("reviews")
      .insert({
        product_id,
        reviewer_name,
        reviewer_location: reviewer_location || null,
        rating,
        title: title || null,
        content,
        verified_purchase: verified_purchase || false,
        helpful_count: 0,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating review:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ review })
  } catch (error) {
    console.error("Error in admin reviews POST:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()

    const isAdmin = await checkAdmin(supabase)
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Review ID required" }, { status: 400 })
    }

    const { error } = await supabase.from("reviews").delete().eq("id", id)

    if (error) {
      console.error("Error deleting review:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in admin reviews DELETE:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
