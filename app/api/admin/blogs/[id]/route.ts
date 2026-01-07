import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const { id } = params

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

    const { data: blog, error } = await supabase
      .from("blogs")
      .select(`
        *,
        author:profiles(id, full_name, email),
        blog_products(
          product_id,
          display_order,
          product:products(id, title, slug, image_url, base_price)
        )
      `)
      .eq("id", id)
      .single()

    if (error) throw error

    return NextResponse.json({ blog })
  } catch (error) {
    console.error("Error fetching blog:", error)
    return NextResponse.json({ error: "Failed to fetch blog" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const { id } = params

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
    const { title, slug, excerpt, content, cover_image, meta_title, meta_description, is_published, product_ids } = body

    // Get current blog to check publish status
    const { data: currentBlog } = await supabase
      .from("blogs")
      .select("is_published, published_at")
      .eq("id", id)
      .single()

    // Update blog
    const updateData: Record<string, unknown> = {
      title,
      slug,
      excerpt,
      content,
      cover_image,
      meta_title,
      meta_description,
      is_published,
      updated_at: new Date().toISOString(),
    }

    // Set published_at if newly published
    if (is_published && !currentBlog?.is_published) {
      updateData.published_at = new Date().toISOString()
    }

    const { data: blog, error } = await supabase.from("blogs").update(updateData).eq("id", id).select().single()

    if (error) throw error

    // Update product connections
    await supabase.from("blog_products").delete().eq("blog_id", id)

    if (product_ids?.length > 0) {
      const blogProducts = product_ids.map((productId: string, index: number) => ({
        blog_id: id,
        product_id: productId,
        display_order: index,
      }))

      await supabase.from("blog_products").insert(blogProducts)
    }

    return NextResponse.json({ blog })
  } catch (error) {
    console.error("Error updating blog:", error)
    return NextResponse.json({ error: "Failed to update blog" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const { id } = params

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

    const { error } = await supabase.from("blogs").delete().eq("id", id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting blog:", error)
    return NextResponse.json({ error: "Failed to delete blog" }, { status: 500 })
  }
}
