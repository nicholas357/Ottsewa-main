import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// GET - Fetch products for recommended section management
export async function GET() {
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

    // Fetch all featured products with their recommended order
    const { data: products, error } = await supabase
      .from("products")
      .select("id, title, slug, image_url, is_featured, recommended_order, is_active, base_price")
      .eq("is_featured", true)
      .eq("is_active", true)
      .order("recommended_order", { ascending: true, nullsFirst: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ products: products || [] })
  } catch (error) {
    console.error("Error fetching recommended products:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT - Update recommended order for products
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

    const { products } = await request.json()

    if (!Array.isArray(products)) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 })
    }

    // Update each product's recommended_order
    for (let i = 0; i < products.length; i++) {
      const { error } = await supabase
        .from("products")
        .update({ recommended_order: i + 1 })
        .eq("id", products[i].id)

      if (error) {
        console.error(`Error updating product ${products[i].id}:`, error)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating recommended order:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
