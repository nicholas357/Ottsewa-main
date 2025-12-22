import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const productId = searchParams.get("productId")
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "10")

  if (!productId) {
    return NextResponse.json({ error: "Product ID required" }, { status: 400 })
  }

  const supabase = await createClient()
  const offset = (page - 1) * limit

  // Get approved reviews with user info
  const {
    data: reviews,
    error,
    count,
  } = await supabase
    .from("reviews")
    .select(
      `
      id,
      rating,
      title,
      content,
      is_verified_purchase,
      is_featured,
      helpful_count,
      created_at,
      user_id
    `,
      { count: "exact" },
    )
    .eq("product_id", productId)
    .eq("is_approved", true)
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error("Error fetching reviews:", error)
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
  }

  // Get user names for reviews
  const userIds = reviews?.map((r) => r.user_id).filter(Boolean) || []
  let userMap: Record<string, { full_name: string | null }> = {}

  if (userIds.length > 0) {
    const { data: profiles } = await supabase.from("profiles").select("id, full_name").in("id", userIds)

    if (profiles) {
      userMap = profiles.reduce(
        (acc, p) => {
          acc[p.id] = { full_name: p.full_name }
          return acc
        },
        {} as Record<string, { full_name: string | null }>,
      )
    }
  }

  // Get aggregate stats
  const { data: stats } = await supabase
    .from("reviews")
    .select("rating")
    .eq("product_id", productId)
    .eq("is_approved", true)

  const totalReviews = stats?.length || 0
  const avgRating = totalReviews > 0 ? stats!.reduce((sum, r) => sum + r.rating, 0) / totalReviews : 0

  // Calculate rating distribution
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  stats?.forEach((r) => {
    distribution[r.rating as keyof typeof distribution]++
  })

  const reviewsWithUsers =
    reviews?.map((r) => ({
      ...r,
      user: userMap[r.user_id] || { full_name: null },
    })) || []

  return NextResponse.json({
    reviews: reviewsWithUsers,
    total: count || 0,
    page,
    limit,
    stats: {
      average: Number(avgRating.toFixed(1)),
      total: totalReviews,
      distribution,
    },
  })
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "You must be logged in to submit a review" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { productId, rating, title, content } = body

    if (!productId || !rating) {
      return NextResponse.json({ error: "Product ID and rating are required" }, { status: 400 })
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 })
    }

    const { data: profile } = await supabase.from("profiles").select("full_name, email").eq("id", user.id).single()

    const reviewerName = profile?.full_name || user.email?.split("@")[0] || "Anonymous"

    // Check if user already reviewed this product
    const { data: existingReview } = await supabase
      .from("reviews")
      .select("id")
      .eq("product_id", productId)
      .eq("user_id", user.id)
      .single()

    if (existingReview) {
      return NextResponse.json({ error: "You have already reviewed this product" }, { status: 400 })
    }

    const { data: order } = await supabase
      .from("orders")
      .select("id")
      .eq("product_id", productId)
      .eq("user_id", user.id)
      .eq("payment_proof_status", "verified")
      .limit(1)
      .single()

    const isVerifiedPurchase = !!order

    const { data: review, error } = await supabase
      .from("reviews")
      .insert({
        product_id: productId,
        user_id: user.id,
        reviewer_name: reviewerName,
        rating,
        title: title || null,
        content: content || null,
        is_verified_purchase: isVerifiedPurchase,
        is_approved: false,
        is_featured: false,
        helpful_count: 0,
        order_id: order?.id || null,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating review:", error)
      return NextResponse.json({ error: "Failed to submit review" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      review,
      message: "Your review has been submitted and is pending approval",
    })
  } catch (error) {
    console.error("Error in POST /api/reviews:", error)
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
