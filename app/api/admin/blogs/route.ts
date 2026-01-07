import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status") || ""

    const offset = (page - 1) * limit

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

    let query = supabase.from("blogs").select(
      `
        *,
        author:profiles(id, full_name, email),
        blog_products(
          product:products(id, title, slug, image_url, base_price)
        )
      `,
      { count: "exact" },
    )

    if (search) {
      query = query.ilike("title", `%${search}%`)
    }

    if (status === "published") {
      query = query.eq("is_published", true)
    } else if (status === "draft") {
      query = query.eq("is_published", false)
    }

    const {
      data: blogs,
      error,
      count,
    } = await query.order("created_at", { ascending: false }).range(offset, offset + limit - 1)

    if (error) throw error

    return NextResponse.json({
      blogs: blogs || [],
      total: count || 0,
      page,
      limit,
    })
  } catch (error) {
    console.error("Error fetching blogs:", error)
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
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
    const {
      title,
      slug,
      excerpt,
      content,
      cover_image,
      meta_title,
      meta_description,
      is_published,
      product_ids,
      faqs,
    } = body

    // Validate required fields
    if (!title || !slug || !content) {
      return NextResponse.json({ error: "Title, slug, and content are required" }, { status: 400 })
    }

    // Create blog
    const { data: blog, error } = await supabase
      .from("blogs")
      .insert({
        title,
        slug,
        excerpt,
        content,
        cover_image,
        meta_title,
        meta_description,
        is_published,
        published_at: is_published ? new Date().toISOString() : null,
        author_id: user.id,
        faqs: faqs || [],
      })
      .select()
      .single()

    if (error) throw error

    // Add product connections if any
    if (product_ids?.length > 0) {
      const blogProducts = product_ids.map((productId: string, index: number) => ({
        blog_id: blog.id,
        product_id: productId,
        display_order: index,
      }))

      await supabase.from("blog_products").insert(blogProducts)
    }

    return NextResponse.json({ blog })
  } catch (error) {
    console.error("Error creating blog:", error)
    return NextResponse.json({ error: "Failed to create blog" }, { status: 500 })
  }
}
