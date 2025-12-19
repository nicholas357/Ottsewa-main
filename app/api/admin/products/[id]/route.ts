import { createClient } from "@supabase/supabase-js"
import { createClient as createServerClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

async function verifyAdmin() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: "Unauthorized", status: 401 }

  const { data: profile } = await supabaseAdmin.from("profiles").select("role").eq("id", user.id).single()

  if (profile?.role !== "admin") return { error: "Forbidden", status: 403 }

  return { user, profile }
}

// GET - Fetch single product with all related data
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await verifyAdmin()
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const { id } = await params

  const { data, error } = await supabaseAdmin
    .from("products")
    .select(`
      *,
      category:categories(id, name, slug),
      platforms:product_platforms(
        id,
        platform_id,
        price_modifier,
        is_available,
        platform:platforms(id, name, slug, icon)
      ),
      editions:game_editions(*),
      denominations:gift_card_denominations(*),
      plans:subscription_plans(*, durations:subscription_durations(*)),
      license_types:software_license_types(*),
      license_durations:software_license_durations(*),
      faqs:product_faqs(*)
    `)
    .eq("id", id)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ product: data })
}

// PUT - Update product
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await verifyAdmin()
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const { id } = await params

  try {
    const body = await request.json()
    const {
      title,
      slug,
      description,
      short_description,
      product_type,
      category_id,
      base_price,
      original_price,
      currency,
      discount_percent,
      cashback_percent,
      image_url,
      thumbnail_url,
      gallery_images,
      video_url,
      stock,
      is_digital,
      is_preorder,
      release_date,
      meta_title,
      meta_description,
      tags,
      is_active,
      is_featured,
      is_bestseller,
      is_new,
      region,
      regions_available,
      publisher,
      developer,
      platforms,
      editions,
      denominations,
      plans,
      durations,
      license_types,
      license_durations,
      faqs,
    } = body

    // Update product
    const { data: product, error: productError } = await supabaseAdmin
      .from("products")
      .update({
        title,
        slug,
        description,
        short_description,
        product_type,
        category_id: category_id || null,
        base_price: Number.parseFloat(base_price) || 0,
        original_price: original_price ? Number.parseFloat(original_price) : null,
        currency: currency || "NPR",
        discount_percent: Number.parseInt(discount_percent) || 0,
        cashback_percent: Number.parseInt(cashback_percent) || 0,
        image_url,
        thumbnail_url,
        gallery_images: gallery_images || [],
        video_url,
        stock: Number.parseInt(stock) || 0,
        is_digital: is_digital ?? true,
        is_preorder: is_preorder ?? false,
        release_date: release_date || null,
        meta_title,
        meta_description,
        tags: tags || [],
        is_active: is_active ?? true,
        is_featured: is_featured ?? false,
        is_bestseller: is_bestseller ?? false,
        is_new: is_new ?? false,
        region: region || "Global",
        regions_available: regions_available || ["Global"],
        publisher,
        developer,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (productError) {
      return NextResponse.json({ error: productError.message }, { status: 500 })
    }

    // Update platforms - delete existing and re-add
    await supabaseAdmin.from("product_platforms").delete().eq("product_id", id)
    if (platforms?.length > 0) {
      const platformData = platforms.map((p: any) => ({
        product_id: id,
        platform_id: p.platform_id,
        price_modifier: Number.parseFloat(p.price_modifier) || 0,
        is_available: p.is_available ?? true,
      }))
      await supabaseAdmin.from("product_platforms").insert(platformData)
    }

    // Update editions
    if (product_type === "game") {
      await supabaseAdmin.from("game_editions").delete().eq("product_id", id)
      if (editions?.length > 0) {
        const editionData = editions.map((e: any, i: number) => ({
          product_id: id,
          name: e.name,
          slug: e.slug || e.name.toLowerCase().replace(/\s+/g, "-"),
          price: Number.parseFloat(e.price) || 0,
          original_price: e.original_price ? Number.parseFloat(e.original_price) : null,
          description: e.description,
          includes: e.includes || [],
          image_url: e.image_url,
          is_default: e.is_default ?? i === 0,
          is_available: e.is_available ?? true,
          sort_order: i,
        }))
        await supabaseAdmin.from("game_editions").insert(editionData)
      }
    }

    // Update denominations
    if (product_type === "giftcard") {
      await supabaseAdmin.from("gift_card_denominations").delete().eq("product_id", id)
      if (denominations?.length > 0) {
        const denomData = denominations.map((d: any, i: number) => ({
          product_id: id,
          value: Number.parseFloat(d.value) || 0,
          price: Number.parseFloat(d.price) || 0,
          currency: d.currency || "NPR",
          bonus_value: Number.parseFloat(d.bonus_value) || 0,
          is_popular: d.is_popular ?? false,
          is_available: d.is_available ?? true,
          stock: Number.parseInt(d.stock) || 0,
          sort_order: i,
        }))
        await supabaseAdmin.from("gift_card_denominations").insert(denomData)
      }
    }

    // Update subscription plans
    if (product_type === "subscription") {
      await supabaseAdmin.from("subscription_plans").delete().eq("product_id", id)
      if (plans?.length > 0) {
        const planData = plans.map((p: any, i: number) => ({
          product_id: id,
          name: p.name,
          slug: p.slug || p.name.toLowerCase().replace(/\s+/g, "-"),
          description: p.description,
          monthly_price: Number.parseFloat(p.monthly_price) || 0,
          features: p.features || [],
          max_devices: Number.parseInt(p.max_devices) || 1,
          max_users: Number.parseInt(p.max_users) || 1,
          quality: p.quality,
          is_popular: p.is_popular ?? false,
          is_available: p.is_available ?? true,
          color: p.color,
          sort_order: i,
        }))
        await supabaseAdmin.from("subscription_plans").insert(planData)
      }

      await supabaseAdmin.from("subscription_durations").delete().eq("product_id", id)
      if (durations?.length > 0) {
        const durationData = durations.map((d: any, i: number) => ({
          product_id: id,
          months: Number.parseInt(d.months) || 1,
          label: d.label,
          discount_percent: Number.parseInt(d.discount_percent) || 0,
          is_popular: d.is_popular ?? false,
          is_available: d.is_available ?? true,
          sort_order: i,
        }))
        await supabaseAdmin.from("subscription_durations").insert(durationData)
      }
    }

    // Update software licenses
    if (product_type === "software") {
      await supabaseAdmin.from("software_license_types").delete().eq("product_id", id)
      if (license_types?.length > 0) {
        const licenseData = license_types.map((l: any, i: number) => ({
          product_id: id,
          name: l.name,
          slug: l.slug || l.name.toLowerCase().replace(/\s+/g, "-"),
          description: l.description,
          price: Number.parseFloat(l.price) || 0,
          features: l.features || [],
          max_users: Number.parseInt(l.max_users) || 1,
          max_devices: Number.parseInt(l.max_devices) || 1,
          is_popular: l.is_popular ?? false,
          is_available: l.is_available ?? true,
          sort_order: i,
        }))
        await supabaseAdmin.from("software_license_types").insert(licenseData)
      }

      await supabaseAdmin.from("software_license_durations").delete().eq("product_id", id)
      if (license_durations?.length > 0) {
        const durData = license_durations.map((d: any, i: number) => ({
          product_id: id,
          duration_type: d.duration_type,
          label: d.label,
          price_multiplier: Number.parseFloat(d.price_multiplier) || 1,
          discount_percent: Number.parseInt(d.discount_percent) || 0,
          is_popular: d.is_popular ?? false,
          is_available: d.is_available ?? true,
          sort_order: i,
        }))
        await supabaseAdmin.from("software_license_durations").insert(durData)
      }
    }

    // Update FAQs
    await supabaseAdmin.from("product_faqs").delete().eq("product_id", id)
    if (faqs?.length > 0) {
      const faqData = faqs.map((f: any, i: number) => ({
        product_id: id,
        question: f.question,
        answer: f.answer,
        sort_order: i,
        is_active: f.is_active ?? true,
      }))
      await supabaseAdmin.from("product_faqs").insert(faqData)
    }

    return NextResponse.json({ product })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE - Delete product
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await verifyAdmin()
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const { id } = await params

  // Delete product (cascades to related tables)
  const { error } = await supabaseAdmin.from("products").delete().eq("id", id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
