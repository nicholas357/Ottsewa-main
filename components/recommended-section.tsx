"use client"
import { motion } from "framer-motion"
import { Info, ChevronRight, AlertCircle, RefreshCw, Sparkles } from "lucide-react"
import { useState, useEffect, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import { getProducts, type Product } from "@/lib/products"
import { appCache, CACHE_TTL, STALE_TTL, CACHE_KEYS } from "@/lib/cache"
import ProductCard from "@/components/product-card"

export default function RecommendedSection() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsMounted(true)
  }, [])

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
        url: `https://www.ottsewa.store/product/${product.slug}`,
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
        minimal: true,
      })

      const finalProducts =
        fetchedProducts.length === 0
          ? (await getProducts({ limit: 10, sort_by: "newest", minimal: true })).products
          : fetchedProducts

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
      <section className="px-4 sm:px-6 lg:px-8 py-8 sm:py-10" aria-label="Recommended products" aria-busy="true">
        <div className="max-w-7xl mx-auto">
          <div className="relative rounded-2xl border border-white/[0.08] p-3">
            <div className="relative rounded-xl bg-[#0f0f0f] overflow-hidden p-4 sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#1a1a1a] animate-pulse" />
                  <div className="h-6 w-48 bg-[#1a1a1a] rounded animate-pulse" />
                </div>
                <div className="h-5 w-20 bg-[#1a1a1a] rounded animate-pulse hidden sm:block" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="relative rounded-xl overflow-hidden bg-[#1a1a1a] border border-white/[0.04]">
                    <div className="aspect-[3/4] bg-[#222222] animate-pulse" />
                    <div className="p-3 space-y-2">
                      <div className="h-4 bg-[#222222] rounded animate-pulse" />
                      <div className="h-3 w-16 bg-[#222222] rounded animate-pulse" />
                      <div className="h-6 w-24 bg-[#222222] rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="px-4 sm:px-6 lg:px-8 py-8 sm:py-10" aria-label="Recommended products">
        <div className="max-w-7xl mx-auto">
          <div className="relative rounded-2xl border border-white/[0.08] p-3">
            <div className="relative rounded-xl bg-[#0f0f0f] overflow-hidden p-4 sm:p-6">
              <div className="flex flex-col items-center justify-center py-12 text-center" role="alert">
                <AlertCircle className="w-10 h-10 text-red-400 mb-3" aria-hidden="true" />
                <h3 className="text-lg font-medium text-white mb-2">Unable to load products</h3>
                <p className="text-zinc-400 mb-4 max-w-md text-sm">{error}</p>
                <button
                  onClick={fetchProducts}
                  className="flex items-center gap-2 px-5 py-2 bg-amber-500 hover:bg-amber-400 text-black font-medium rounded-lg transition cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" aria-hidden="true" />
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-8 sm:py-10" aria-labelledby="recommended-heading">
      {itemListJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      )}

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={false}
          animate={isMounted ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.5 }}
        >
          <div className="relative rounded-2xl border border-white/[0.08] p-3">
            <div className="relative rounded-xl bg-[#0f0f0f] overflow-hidden">
              <div className="relative p-4 sm:p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                    </div>
                    <h2 id="recommended-heading" className="text-lg sm:text-xl font-semibold text-white">
                      Recommended for you
                    </h2>
                    <button
                      className="text-zinc-500 hover:text-zinc-400 transition cursor-pointer"
                      aria-label="Learn more about recommendations"
                    >
                      <Info className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                  <button
                    onClick={() => router.push("/category")}
                    className="hidden sm:flex items-center gap-1 text-amber-400 hover:text-amber-300 text-sm transition cursor-pointer"
                  >
                    View all
                    <ChevronRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>

                <ul
                  className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 list-none"
                  role="list"
                >
                  {products.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={false}
                      animate={isMounted ? { opacity: 1, y: 0 } : undefined}
                      transition={{ duration: 0.4, delay: index * 0.03 }}
                      whileHover={{ y: -2, transition: { duration: 0.2 } }}
                    >
                      <ProductCard product={product} index={index} />
                    </motion.div>
                  ))}
                </ul>

                <div className="flex justify-center mt-8">
                  <button
                    onClick={() => router.push("/category")}
                    className="px-6 py-2.5 bg-amber-500 text-black font-medium rounded-lg hover:bg-amber-400 transition-all text-sm cursor-pointer"
                  >
                    See all products
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
