import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

// In-memory search cache for blazing fast repeated searches
const searchCache = new Map<string, { data: any; timestamp: number }>()
const SEARCH_CACHE_TTL = 60 * 1000 // 1 minute

function getCachedSearch(key: string) {
  const cached = searchCache.get(key)
  if (cached && Date.now() - cached.timestamp < SEARCH_CACHE_TTL) {
    return cached.data
  }
  searchCache.delete(key)
  return null
}

function setCachedSearch(key: string, data: any) {
  // Limit cache size
  if (searchCache.size > 100) {
    const firstKey = searchCache.keys().next().value
    if (firstKey) searchCache.delete(firstKey)
  }
  searchCache.set(key, { data, timestamp: Date.now() })
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")?.trim() || ""
  const category = searchParams.get("category") || "all"
  const type = searchParams.get("type") || "all"
  const sort = searchParams.get("sort") || "newest"
  const limit = Number.parseInt(searchParams.get("limit") || "20")

  // Create cache key
  const cacheKey = `search_${query}_${category}_${type}_${sort}_${limit}`

  // Check cache first
  const cached = getCachedSearch(cacheKey)
  if (cached) {
    return NextResponse.json(cached, {
      headers: {
        "X-Cache": "HIT",
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    })
  }

  try {
    const supabase = await createClient()

    // Build optimized query - only select needed fields for search results
    let queryBuilder = supabase
      .from("products")
      .select(
        `
        id,
        title,
        slug,
        short_description,
        product_type,
        base_price,
        discount_percent,
        image_url,
        thumbnail_url,
        region,
        is_featured,
        is_bestseller,
        average_rating,
        review_count,
        category:categories(id,name,slug)
      `,
        { count: "exact" },
      )
      .eq("is_active", true)

    // Apply search filter with optimized text search
    if (query) {
      // Use ilike for simple search, could use full-text search for better results
      queryBuilder = queryBuilder.or(
        `title.ilike.%${query}%,short_description.ilike.%${query}%,tags.cs.{${query.toLowerCase()}}`,
      )
    }

    // Apply category filter
    if (category !== "all") {
      const { data: categoryData } = await supabase.from("categories").select("id").eq("slug", category).single()

      if (categoryData) {
        queryBuilder = queryBuilder.eq("category_id", categoryData.id)
      }
    }

    // Apply type filter
    if (type !== "all") {
      queryBuilder = queryBuilder.eq("product_type", type)
    }

    // Apply sorting
    switch (sort) {
      case "price_asc":
        queryBuilder = queryBuilder.order("base_price", { ascending: true })
        break
      case "price_desc":
        queryBuilder = queryBuilder.order("base_price", { ascending: false })
        break
      case "popular":
        queryBuilder = queryBuilder.order("review_count", { ascending: false })
        break
      case "rating":
        queryBuilder = queryBuilder.order("average_rating", { ascending: false })
        break
      case "newest":
      default:
        queryBuilder = queryBuilder.order("created_at", { ascending: false })
        break
    }

    // Limit results
    queryBuilder = queryBuilder.limit(limit)

    const { data: products, error, count } = await queryBuilder

    if (error) {
      console.error("Search error:", error)
      return NextResponse.json({ products: [], count: 0, error: error.message }, { status: 500 })
    }

    const result = { products: products || [], count: count || 0 }

    // Cache the result
    setCachedSearch(cacheKey, result)

    return NextResponse.json(result, {
      headers: {
        "X-Cache": "MISS",
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    })
  } catch (error) {
    console.error("Search API error:", error)
    return NextResponse.json({ products: [], count: 0, error: "Search failed" }, { status: 500 })
  }
}
