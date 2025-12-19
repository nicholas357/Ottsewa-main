import { createClient } from "@supabase/supabase-js"
import { createClient as createServerClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

// Create admin client with service role key to bypass RLS
const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

// Verify admin access
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

// GET - Fetch all products with related data
export async function GET(request: NextRequest) {
  const auth = await verifyAdmin()
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const { searchParams } = new URL(request.url)
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "20")
  const search = searchParams.get("search") || ""
  const type = searchParams.get("type") || ""
  const status = searchParams.get("status") || ""

  let query = supabaseAdmin
    .from("products")
    .select(
      `
      *,
      category:categories(id, name, slug),
      platforms:product_platforms(
        platform:platforms(id, name, slug, icon)
      ),
      editions:game_editions(*),
      denominations:gift_card_denominations(*),
      plans:subscription_plans(*, durations:subscription_durations(*)),
      license_types:software_license_types(*),
      license_durations:software_license_durations(*),
      faqs:product_faqs(*) // Include FAQs in the query
    `,
      { count: "exact" },
    )
    .order("created_at", { ascending: false })
    .range((page - 1) * limit, page * limit - 1)

  if (search) {
    query = query.or(`title.ilike.%${search}%,slug.ilike.%${search}%`)
  }
  if (type) {
    query = query.eq("product_type", type)
  }
  if (status === "active") {
    query = query.eq("is_active", true)
  } else if (status === "inactive") {
    query = query.eq("is_active", false)
  }

  const { data, error, count } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const products = (data || []).map((product: any) => {
    const plans =
      product.plans?.map((plan: any) => ({
        ...plan,
        durations:
          product.durations?.filter((d: any) => (d.plan_id ? d.plan_id === plan.id : d.product_id === product.id)) ||
          [],
      })) || []

    return {
      ...product,
      subscription_plans: plans,
    }
  })

  return NextResponse.json({ products, total: count, page, limit })
}

// POST - Create new product
export async function POST(request: NextRequest) {
  const auth = await verifyAdmin()
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  try {
    const body = await request.json()
    const {
      // Basic info
      title,
      slug,
      description,
      short_description,
      product_type,
      category_id,
      // Pricing
      base_price,
      original_price,
      currency,
      discount_percent,
      cashback_percent,
      // Media
      image_url,
      thumbnail_url,
      gallery_images,
      video_url,
      // Inventory
      stock,
      is_digital,
      is_preorder,
      release_date,
      // SEO
      meta_title,
      meta_description,
      tags,
      // Status
      is_active,
      is_featured,
      is_bestseller,
      is_new,
      // Region
      region,
      regions_available,
      // Additional
      publisher,
      developer,
      // Related data
      platforms,
      editions,
      denominations,
      plans,
      durations,
      license_types,
      license_durations,
      faqs, // Add FAQs
    } = body

    // Create product
    const { data: product, error: productError } = await supabaseAdmin
      .from("products")
      .insert({
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
      })
      .select()
      .single()

    if (productError) {
      return NextResponse.json({ error: productError.message }, { status: 500 })
    }

    // Add platforms
    if (platforms?.length > 0) {
      const platformData = platforms.map((p: any) => ({
        product_id: product.id,
        platform_id: p.platform_id,
        price_modifier: Number.parseFloat(p.price_modifier) || 0,
        is_available: p.is_available ?? true,
      }))
      await supabaseAdmin.from("product_platforms").insert(platformData)
    }

    // Add editions (for games)
    if (product_type === "game" && editions?.length > 0) {
      const editionData = editions.map((e: any, i: number) => ({
        product_id: product.id,
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

    // Add denominations (for gift cards)
    if (product_type === "giftcard" && denominations?.length > 0) {
      const denomData = denominations.map((d: any, i: number) => ({
        product_id: product.id,
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

    // Add subscription plans with their durations
    if (product_type === "subscription" && plans?.length > 0) {
      for (const plan of plans) {
        // Insert the plan first
        const { data: insertedPlan, error: planError } = await supabaseAdmin
          .from("subscription_plans")
          .insert({
            product_id: product.id,
            name: plan.name,
            slug: plan.slug || plan.name.toLowerCase().replace(/\s+/g, "-"),
            description: plan.description,
            features: plan.features || [],
            max_devices: Number.parseInt(plan.max_devices) || 1,
            max_users: Number.parseInt(plan.max_users) || 1,
            quality: plan.quality,
            is_popular: plan.is_popular ?? false,
            is_available: plan.is_available ?? true,
            color: plan.color,
            sort_order: plans.indexOf(plan),
          })
          .select()
          .single()

        if (planError) {
          console.error("Error inserting plan:", planError)
          continue
        }

        // Insert durations for this plan
        if (plan.durations && plan.durations.length > 0) {
          const durationData = plan.durations.map((d: any, i: number) => {
            const duration: any = {
              months: Number.parseInt(d.months) || 1,
              label: d.label,
              discount_percent: Number.parseInt(d.discount_percent) || 0,
              is_popular: d.is_popular ?? false,
              is_available: d.is_available ?? true,
              sort_order: i,
            }

            // Try plan_id first (new schema), fallback to product_id
            try {
              duration.plan_id = insertedPlan.id
            } catch {
              duration.product_id = product.id
            }

            // Add price if provided (new schema)
            if (d.price) {
              duration.price = Number.parseFloat(d.price)
            }

            return duration
          })

          await supabaseAdmin.from("subscription_durations").insert(durationData)
        }
      }
    }

    // Add software license types
    if (product_type === "software" && license_types?.length > 0) {
      const licenseData = license_types.map((l: any, i: number) => ({
        product_id: product.id,
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

    // Add software license durations
    if (product_type === "software" && license_durations?.length > 0) {
      const durData = license_durations.map((d: any, i: number) => ({
        product_id: product.id,
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

    if (faqs?.length > 0) {
      const faqData = faqs.map((f: any, i: number) => ({
        product_id: product.id,
        question: f.question,
        answer: f.answer,
        sort_order: i,
        is_active: f.is_active ?? true,
      }))
      await supabaseAdmin.from("product_faqs").insert(faqData)
    }

    return NextResponse.json({ product }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
