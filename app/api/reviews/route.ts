import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get("productId")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    let query = supabase
      .from("reviews")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (productId) {
      query = query.eq("product_id", productId)
    }

    const { data: reviews, error, count } = await query

    if (error) {
      console.error("Error fetching reviews:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const stats = {
      total: count || 0,
      average: 0,
      distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } as Record<number, number>,
    }

    // Only query for stats if we have a valid productId
    if (productId) {
      const { data: statsData } = await supabase.from("reviews").select("rating").eq("product_id", productId)

      if (statsData && statsData.length > 0) {
        let sum = 0
        statsData.forEach((r) => {
          sum += r.rating
          stats.distribution[r.rating as keyof typeof stats.distribution]++
        })
        stats.average = Math.round((sum / statsData.length) * 10) / 10
      }
    } else if (reviews && reviews.length > 0) {
      // Calculate stats from fetched reviews if no productId
      let sum = 0
      reviews.forEach((r) => {
        sum += r.rating
        stats.distribution[r.rating as keyof typeof stats.distribution]++
      })
      stats.average = Math.round((sum / reviews.length) * 10) / 10
    }

    return NextResponse.json({ reviews, stats, total: count })
  } catch (error) {
    console.error("Error in reviews API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { product_id, reviewer_name, reviewer_location, rating, title, content } = body

    // Validate required fields
    if (!product_id || !reviewer_name || !rating || !content) {
      return NextResponse.json(
        { error: "Missing required fields: product_id, reviewer_name, rating, content" },
        { status: 400 },
      )
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 })
    }

    // Validate content length
    if (content.trim().length < 20) {
      return NextResponse.json({ error: "Review content must be at least 20 characters" }, { status: 400 })
    }

    // Insert the review
    const { data: review, error } = await supabase
      .from("reviews")
      .insert({
        product_id,
        reviewer_name: reviewer_name.trim(),
        reviewer_location: reviewer_location?.trim() || null,
        rating,
        title: title?.trim() || null,
        content: content.trim(),
        verified_purchase: false, // User-submitted reviews are not verified
        helpful_count: 0,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating review:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ review, message: "Review submitted successfully" })
  } catch (error) {
    console.error("Error in reviews POST API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
