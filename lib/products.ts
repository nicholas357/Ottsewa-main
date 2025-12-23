import { createClient } from "@/lib/supabase/client"
import { appCache, CACHE_KEYS, CACHE_TTL } from "@/lib/cache"

// Types matching our database schema
export interface Product {
  id: string
  title: string
  slug: string
  description: string
  short_description: string
  product_type: "game" | "giftcard" | "subscription" | "software"
  base_price: number
  original_price: number
  discount_percent: number
  cashback_percent: number
  currency: string
  image_url: string
  thumbnail_url: string
  video_url: string
  gallery_images: string[]
  stock: number
  is_digital: boolean
  is_preorder: boolean
  release_date: string
  is_active: boolean
  is_featured: boolean
  is_bestseller: boolean
  is_new: boolean
  average_rating: number
  review_count: number
  region: string
  regions_available: string[]
  publisher: string
  developer: string
  tags: string[]
  category_id: string
  created_at: string
  updated_at: string
  // Joined data
  category?: Category
  platforms?: Platform[]
  editions?: GameEdition[]
  denominations?: GiftCardDenomination[]
  subscription_plans?: SubscriptionPlan[]
  license_types?: SoftwareLicenseType[]
  license_durations?: SoftwareLicenseDuration[]
  faqs?: ProductFAQ[]
}

export interface Category {
  id: string
  name: string
  slug: string
  icon: string
  description: string
  parent_id: string | null
  sort_order: number
  is_active: boolean
}

export interface Platform {
  id: string
  name: string
  slug: string
  icon: string
  sort_order: number
  is_active: boolean
}

export interface GameEdition {
  id: string
  product_id: string
  name: string
  slug: string
  description: string
  price: number
  original_price: number
  image_url: string
  includes: string[]
  is_default: boolean
  is_available: boolean
  sort_order: number
}

export interface GiftCardDenomination {
  id: string
  product_id: string
  value: number
  price: number
  currency: string
  bonus_value: number
  is_popular: boolean
  is_available: boolean
  stock: number
  sort_order: number
}

export interface SubscriptionPlan {
  id: string
  product_id: string
  name: string
  slug: string
  description: string
  features: string[]
  max_devices: number
  max_users: number
  quality: string
  color: string
  is_popular: boolean
  is_available: boolean
  sort_order: number
  durations?: SubscriptionDuration[]
}

export interface SubscriptionDuration {
  id: string
  plan_id?: string
  product_id?: string
  months: number
  label: string
  price?: number
  discount_percent: number
  is_popular: boolean
  is_available: boolean
  sort_order: number
}

export interface SoftwareLicenseType {
  id: string
  product_id: string
  name: string
  slug: string
  description: string
  price: number
  max_devices: number
  max_users: number
  features: string[]
  is_popular: boolean
  is_available: boolean
  sort_order: number
}

export interface SoftwareLicenseDuration {
  id: string
  product_id: string
  duration_type: "1year" | "2year" | "lifetime"
  label: string
  price_multiplier: number
  discount_percent: number
  is_popular: boolean
  is_available: boolean
  sort_order: number
}

export interface ProductFAQ {
  id: string
  product_id: string
  question: string
  answer: string
  sort_order: number
  is_active: boolean
}

let supabaseInstance: ReturnType<typeof createClient> | null = null

function getSupabase() {
  if (!supabaseInstance) {
    supabaseInstance = createClient()
  }
  return supabaseInstance
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs = 12000): Promise<T> {
  const timeout = new Promise<never>((_, reject) => setTimeout(() => reject(new Error("Request timeout")), timeoutMs))
  return Promise.race([promise, timeout])
}

async function safeQuery<T>(
  queryFn: () => Promise<{ data: T | null; error: any }>,
  retries = 2,
): Promise<{ data: T | null; error: any }> {
  let lastError: any = null

  for (let i = 0; i <= retries; i++) {
    try {
      const result = await withTimeout(queryFn(), 10000)
      if (!result.error) {
        return result
      }
      lastError = result.error
    } catch (err) {
      lastError = err
      // Wait before retry with exponential backoff
      if (i < retries) {
        await new Promise((resolve) => setTimeout(resolve, Math.pow(2, i) * 300))
      }
    }
  }

  return { data: null, error: lastError }
}

// Fetch all products with optional filters
export async function getProducts(options?: {
  limit?: number
  offset?: number
  category?: string
  product_type?: string
  is_featured?: boolean
  is_bestseller?: boolean
  is_new?: boolean
  search?: string
  platform?: string
  sort_by?: "price_asc" | "price_desc" | "newest" | "popular" | "rating"
}): Promise<{ products: Product[]; count: number }> {
  // Create cache key from options
  const cacheKey = `products_${JSON.stringify(options || {})}`
  const cached = appCache.get<{ products: Product[]; count: number }>(cacheKey)
  if (cached) {
    return cached
  }

  const supabase = getSupabase()

  const executeQuery = async () => {
    let query = supabase
      .from("products")
      .select(
        `
        *,
        category:categories(id,name,slug),
        platforms:product_platforms(platform:platforms(id,name,slug,icon)),
        editions:game_editions(*),
        denominations:gift_card_denominations(*),
        subscription_plans(*, durations:subscription_durations(*)),
        license_types:software_license_types(*),
        license_durations:software_license_durations(*),
        faqs:product_faqs(*)
      `,
        { count: "exact" },
      )
      .eq("is_active", true)

    if (options?.category) {
      query = query.eq("category.slug", options.category)
    }
    if (options?.product_type) {
      query = query.eq("product_type", options.product_type)
    }
    if (options?.is_featured) {
      query = query.eq("is_featured", true)
    }
    if (options?.is_bestseller) {
      query = query.eq("is_bestseller", true)
    }
    if (options?.is_new) {
      query = query.eq("is_new", true)
    }
    if (options?.search) {
      query = query.or(
        `title.ilike.%${options.search}%,description.ilike.%${options.search}%,tags.cs.{${options.search}}`,
      )
    }

    switch (options?.sort_by) {
      case "price_asc":
        query = query.order("base_price", { ascending: true })
        break
      case "price_desc":
        query = query.order("base_price", { ascending: false })
        break
      case "newest":
        query = query.order("created_at", { ascending: false })
        break
      case "popular":
        query = query.order("review_count", { ascending: false })
        break
      case "rating":
        query = query.order("average_rating", { ascending: false })
        break
      default:
        query = query.order("created_at", { ascending: false })
    }

    const limit = options?.limit || 10
    const offset = options?.offset || 0
    query = query.range(offset, offset + limit - 1)

    return query
  }

  const { data, error } = await safeQuery(executeQuery)

  if (error) {
    console.error("Error fetching products:", error)
    return { products: [], count: 0 }
  }

  const products = (data || []).map((product: any) => {
    const platforms = product.platforms?.map((pp: any) => pp.platform).filter(Boolean) || []
    const subscription_plans = (product.subscription_plans || []).map((plan: any) => ({
      ...plan,
      durations: plan.durations || [],
    }))

    return {
      ...product,
      platforms,
      subscription_plans,
      editions: product.editions || [],
      denominations: product.denominations || [],
      license_types: product.license_types || [],
      license_durations: product.license_durations || [],
      faqs: product.faqs || [],
    }
  })

  const response = await executeQuery()
  const count = (response as any).count || products.length

  const result = { products, count }

  // Cache for 2 minutes
  appCache.set(cacheKey, result, CACHE_TTL.PRODUCTS)

  return result
}

// Fetch single product by slug with all related data
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const cacheKey = CACHE_KEYS.PRODUCT(slug)
  const cached = appCache.get<Product>(cacheKey)
  if (cached) {
    return cached
  }

  const supabase = getSupabase()

  const executeQuery = () =>
    supabase
      .from("products")
      .select(`
        *,
        category:categories(id,name,slug),
        platforms:product_platforms(platform:platforms(id,name,slug,icon)),
        editions:game_editions(*),
        denominations:gift_card_denominations(*),
        subscription_plans(*, durations:subscription_durations(*)),
        license_types:software_license_types(*),
        license_durations:software_license_durations(*),
        faqs:product_faqs(*)
      `)
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle()

  const { data, error } = await safeQuery(executeQuery)

  if (error) {
    console.error("Error fetching product:", error)
    return null
  }

  if (!data) {
    return null
  }

  const platforms = data.platforms?.map((pp: any) => pp.platform).filter(Boolean) || []
  const subscription_plans = (data.subscription_plans || []).map((plan: any) => ({
    ...plan,
    durations: plan.durations || [],
  }))

  const product = {
    ...data,
    platforms,
    subscription_plans,
    editions: data.editions || [],
    denominations: data.denominations || [],
    license_types: data.license_types || [],
    license_durations: data.license_durations || [],
    faqs: data.faqs || [],
  }

  // Cache for 2 minutes
  appCache.set(cacheKey, product, CACHE_TTL.PRODUCTS)

  return product
}

// Fetch featured products
export async function getFeaturedProducts(limit = 5): Promise<Product[]> {
  const { products } = await getProducts({ is_featured: true, limit })
  return products
}

// Fetch bestseller products
export async function getBestsellerProducts(limit = 10): Promise<Product[]> {
  const { products } = await getProducts({ is_bestseller: true, limit })
  return products
}

// Fetch new products
export async function getNewProducts(limit = 10): Promise<Product[]> {
  const { products } = await getProducts({ is_new: true, limit, sort_by: "newest" })
  return products
}

// Fetch products by category
export async function getProductsByCategory(categorySlug: string, limit = 20): Promise<Product[]> {
  const { products } = await getProducts({ category: categorySlug, limit })
  return products
}

// Fetch products by type
export async function getProductsByType(type: string, limit = 20): Promise<Product[]> {
  const { products } = await getProducts({ product_type: type, limit })
  return products
}

// Fetch all categories
export async function getCategories(): Promise<Category[]> {
  const cacheKey = CACHE_KEYS.CATEGORIES
  const cached = appCache.get<Category[]>(cacheKey)
  if (cached) {
    return cached
  }

  const supabase = getSupabase()

  const executeQuery = () =>
    supabase.from("categories").select("*").eq("is_active", true).order("sort_order", { ascending: true })

  const { data, error } = await safeQuery(executeQuery)

  if (error) {
    console.error("Error fetching categories:", error)
    return []
  }

  const categories = data || []

  // Cache for 5 minutes
  appCache.set(cacheKey, categories, CACHE_TTL.CATEGORIES)

  return categories
}

// Fetch all platforms
export async function getPlatforms(): Promise<Platform[]> {
  const supabase = getSupabase()

  const executeQuery = () =>
    supabase.from("platforms").select("*").eq("is_active", true).order("sort_order", { ascending: true })

  const { data, error } = await safeQuery(executeQuery)

  if (error) {
    console.error("Error fetching platforms:", error)
    return []
  }

  return data || []
}

// Search products
export async function searchProducts(
  query: string,
  options?: {
    category?: string
    platform?: string
    product_type?: string
    limit?: number
  },
): Promise<Product[]> {
  const { products } = await getProducts({
    search: query,
    ...options,
  })
  return products
}
