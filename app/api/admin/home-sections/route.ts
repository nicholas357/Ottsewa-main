import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const supabase = await createClient()

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
    const sectionType = searchParams.get("section_type")

    let query = supabase.from("home_sections").select("*").order("sort_order", { ascending: true })

    if (sectionType) {
      query = query.eq("section_type", sectionType)
    }

    const { data: sections, error } = await query

    if (error) {
      console.error("Error fetching home sections:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!sections || sections.length === 0) {
      return NextResponse.json({ sections: [] })
    }

    const productIds = sections.map((s) => s.product_id)
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("id, title, slug, image_url, base_price, discount_percent")
      .in("id", productIds)

    if (productsError) {
      console.error("Error fetching products:", productsError)
      return NextResponse.json({ error: productsError.message }, { status: 500 })
    }

    const productMap = new Map(products?.map((p) => [p.id, p]) || [])
    const sectionsWithProducts = sections.map((section) => {
      const product = productMap.get(section.product_id)
      return {
        ...section,
        product: product
          ? {
              id: product.id,
              name: product.title,
              slug: product.slug,
              image_url: product.image_url,
              price: product.base_price,
              original_price: product.discount_percent
                ? Math.round(product.base_price / (1 - product.discount_percent / 100))
                : null,
            }
          : null,
      }
    })

    return NextResponse.json({ sections: sectionsWithProducts })
  } catch (error) {
    console.error("Error in home sections GET:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

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
    const { section_type, product_id } = body

    if (!section_type || !product_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get max sort order for this section
    const { data: maxOrder } = await supabase
      .from("home_sections")
      .select("sort_order")
      .eq("section_type", section_type)
      .order("sort_order", { ascending: false })
      .limit(1)
      .single()

    const newOrder = (maxOrder?.sort_order || 0) + 1

    const { data, error } = await supabase
      .from("home_sections")
      .insert({
        section_type,
        product_id,
        sort_order: newOrder,
        is_active: true,
      })
      .select()
      .single()

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ error: "Product already exists in this section" }, { status: 400 })
      }
      console.error("Error adding to home section:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ section: data })
  } catch (error) {
    console.error("Error in home sections POST:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createClient()

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
    const { sections } = body

    if (!sections || !Array.isArray(sections)) {
      return NextResponse.json({ error: "Invalid sections data" }, { status: 400 })
    }

    // Update sort orders
    for (let i = 0; i < sections.length; i++) {
      const { error } = await supabase
        .from("home_sections")
        .update({ sort_order: i + 1 })
        .eq("id", sections[i].id)

      if (error) {
        console.error("Error updating section order:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in home sections PUT:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient()

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
      return NextResponse.json({ error: "Missing section id" }, { status: 400 })
    }

    const { error } = await supabase.from("home_sections").delete().eq("id", id)

    if (error) {
      console.error("Error deleting home section:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in home sections DELETE:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
