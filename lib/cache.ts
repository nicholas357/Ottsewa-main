// Enhanced in-memory cache with TTL and stale-while-revalidate
interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
  staleTime: number // Time when data becomes stale but still usable
}

class EnhancedCache {
  private cache: Map<string, CacheEntry<any>> = new Map()
  private revalidating: Set<string> = new Set()

  set<T>(key: string, data: T, ttlSeconds = 60, staleSeconds?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlSeconds * 1000,
      staleTime: (staleSeconds || ttlSeconds * 2) * 1000,
    })
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    if (!entry) return null

    const age = Date.now() - entry.timestamp

    // Completely expired - remove and return null
    if (age > entry.staleTime) {
      this.cache.delete(key)
      return null
    }

    return entry.data as T
  }

  // Get data and check if it needs revalidation
  getWithStatus<T>(key: string): { data: T | null; isStale: boolean; needsRevalidation: boolean } {
    const entry = this.cache.get(key)
    if (!entry) return { data: null, isStale: false, needsRevalidation: true }

    const age = Date.now() - entry.timestamp
    const isStale = age > entry.ttl
    const isExpired = age > entry.staleTime

    if (isExpired) {
      this.cache.delete(key)
      return { data: null, isStale: false, needsRevalidation: true }
    }

    return {
      data: entry.data as T,
      isStale,
      needsRevalidation: isStale && !this.revalidating.has(key),
    }
  }

  // Mark key as being revalidated
  markRevalidating(key: string): void {
    this.revalidating.add(key)
  }

  // Clear revalidating status
  clearRevalidating(key: string): void {
    this.revalidating.delete(key)
  }

  has(key: string): boolean {
    return this.get(key) !== null
  }

  delete(key: string): void {
    this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
    this.revalidating.clear()
  }

  // Clean up expired entries
  cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.staleTime) {
        this.cache.delete(key)
      }
    }
  }

  // Get cache stats for debugging
  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    }
  }
}

// Singleton cache instance
export const appCache = new EnhancedCache()

// Cache keys
export const CACHE_KEYS = {
  CATEGORIES: "categories",
  CATEGORY_PRODUCTS: (slug: string) => `category_products_${slug}`,
  CATEGORY_WITH_COUNT: "categories_with_count",
  PRODUCT: (slug: string) => `product_${slug}`,
  FEATURED_PRODUCTS: "featured_products",
  TOP_CATEGORIES: "top_categories",
  BANNERS: "banners",
  NAVBAR_CATEGORIES: "navbar_categories",
  HOME_PRODUCTS: "home_products",
  SEARCH: (query: string, filters: string) => `search_${query}_${filters}`,
  USER_PROFILE: "user_profile",
}

// TTL values in seconds
export const CACHE_TTL = {
  CATEGORIES: 300, // 5 minutes fresh
  PRODUCTS: 120, // 2 minutes fresh
  BANNERS: 300, // 5 minutes fresh
  NAVBAR: 600, // 10 minutes fresh
  HOME: 180, // 3 minutes fresh
  SEARCH: 60, // 1 minute fresh for search results
  USER_PROFILE: 8, // 8 seconds fresh - triggers background revalidation after this
}

// Stale times (data usable while revalidating)
export const STALE_TTL = {
  CATEGORIES: 900, // 15 minutes stale
  PRODUCTS: 300, // 5 minutes stale
  BANNERS: 600, // 10 minutes stale
  NAVBAR: 1200, // 20 minutes stale
  HOME: 600, // 10 minutes stale
  USER_PROFILE: 24, // 24 seconds stale - still usable while background refresh happens
}

// Cleanup interval (run every 5 minutes)
if (typeof window !== "undefined") {
  setInterval(() => appCache.cleanup(), 5 * 60 * 1000)
}
