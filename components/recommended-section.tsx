"use client"
import { Info, ChevronRight, AlertCircle, RefreshCw } from "lucide-react"
import { useState, useEffect, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import { getProducts, type Product } from "@/lib/products"
import { appCache, CACHE_TTL, STALE_TTL, CACHE_KEYS } from "@/lib/cache"
import ProductCard from "@/components/product-card"

export default function RecommendedSection() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const itemListJsonLd = useMemo(() => {
    if (products.length === 0) return null

    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Recommended Products",
      description: "Handpicked streaming subscriptions and digital products recommended for you",
      numberOfItems: products.length,
      itemListElement: products.map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `https://ottsewa.store/product/${product.slug}`,
      })),
    }
  }, [products])

  const fetchProducts = useCallback(async () => {
    const cacheKey = CACHE_KEYS.HOME_PRODUCTS
    const { data: cached, isStale, needsRevalidation } = appCache.getWithStatus<Product[]>(cacheKey)

    if (cached) {
      setProducts(cached)
      setLoading(false)

      if (needsRevalidation) {
        appCache.markRevalidating(cacheKey)
        fetchFreshProducts()
      }
      return
    }

    setLoading(true)
    await fetchFreshProducts()
  }, [])

  const fetchFreshProducts = useCallback(async () => {
    setError(null)

    try {
      const { products: fetchedProducts } = await getProducts({
        is_featured: true,
        limit: 10,
      })

      const finalProducts =
        fetchedProducts.length === 0 ? (await getProducts({ limit: 10, sort_by: "newest" })).products : fetchedProducts

      const cacheKey = CACHE_KEYS.HOME_PRODUCTS
      appCache.set(cacheKey, finalProducts, CACHE_TTL.HOME, STALE_TTL.HOME)
      appCache.clearRevalidating(cacheKey)
      setProducts(finalProducts)
    } catch (err) {
      console.error("Error fetching products:", err)
      setError("Failed to load products. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  if (loading) {
    return (
      <section
        className="px-4 sm:px-6 lg:px-8 py-12 md:py-16 relative overflow-hidden"
        aria-label="Recommended products"
        aria-busy="true"
      >
        <div className="max-w-7xl mx-auto relative">
          <div className="flex items-center justify-between mb-8">
            <div className="h-7 w-48 bg-zinc-800/50 rounded animate-pulse" />
            <div className="h-5 w-20 bg-zinc-800/50 rounded animate-pulse hidden sm:block" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="rounded-xl bg-zinc-900/30 border border-zinc-800/30 overflow-hidden">
                <div className="aspect-[3/4] bg-zinc-800/50 animate-pulse" />
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-zinc-800/50 rounded animate-pulse" />
                  <div className="h-3 w-16 bg-zinc-800/50 rounded animate-pulse" />
                  <div className="h-6 w-24 bg-zinc-800/50 rounded animate-pulse" />
                  <div className="h-8 bg-zinc-800/50 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section
        className="px-4 sm:px-6 lg:px-8 py-12 md:py-16 relative overflow-hidden"
        aria-label="Recommended products"
      >
        <div className="max-w-7xl mx-auto relative">
          <div className="flex flex-col items-center justify-center py-16 text-center" role="alert">
            <AlertCircle className="w-12 h-12 text-red-500 mb-4" aria-hidden="true" />
            <h3 className="text-lg font-medium text-white mb-2">Unable to load products</h3>
            <p className="text-zinc-400 mb-6 max-w-md">{error}</p>
            <button
              onClick={fetchProducts}
              className="flex items-center gap-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-medium rounded-lg transition cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" aria-hidden="true" />
              Try Again
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section
      className="px-4 sm:px-6 lg:px-8 py-12 md:py-16 relative overflow-hidden"
      aria-labelledby="recommended-heading"
    >
      {itemListJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      )}

      <div className="max-w-7xl mx-auto relative">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <h2 id="recommended-heading" className="text-xl sm:text-2xl font-semibold text-white">
              Recommended for you
            </h2>
            <button
              className="text-amber-500/40 hover:text-amber-400 transition cursor-pointer"
              aria-label="Learn more about recommendations"
            >
              <Info className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
          <button
            onClick={() => router.push("/category")}
            className="hidden sm:flex items-center gap-1 text-amber-500/60 hover:text-amber-400 text-sm transition cursor-pointer"
          >
            View all
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <ul
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 list-none"
          role="list"
        >
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </ul>

        <div className="flex justify-center mt-10">
          <button
            onClick={() => router.push("/category")}
            className="relative px-8 py-2.5 border border-amber-500/30 text-amber-400 font-medium rounded-lg hover:bg-amber-500/10 hover:border-amber-500/50 transition-all text-sm overflow-hidden cursor-pointer"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
            <span className="relative">See all products</span>
          </button>
        </div>
      </div>
    </section>
  )
}
