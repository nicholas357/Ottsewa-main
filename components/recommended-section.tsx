"use client"

import type React from "react"
import { Heart, Info, ChevronRight, AlertCircle, RefreshCw, Eye } from "lucide-react"
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { getProducts, type Product } from "@/lib/products"
import { useWishlist } from "@/contexts/wishlist-context"
import { appCache, CACHE_TTL, STALE_TTL, CACHE_KEYS } from "@/lib/cache"

export default function RecommendedSection() {
  const { isInWishlist, addItem, removeItem } = useWishlist()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

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

  const handleProductHover = useCallback(
    (slug: string) => {
      router.prefetch(`/product/${slug}`)
    },
    [router],
  )

  const handleProductClick = useCallback(
    (e: React.MouseEvent, slug: string) => {
      e.preventDefault()
      router.push(`/product/${slug}`)
    },
    [router],
  )

  const toggleFavorite = (product: Product, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isInWishlist(product.id)) {
      removeItem(product.id)
    } else {
      addItem({
        productId: product.id,
        productTitle: product.title,
        productSlug: product.slug,
        productImage: product.image_url || product.thumbnail_url || "/placeholder.svg",
        price:
          product.discount_percent > 0 ? product.base_price * (1 - product.discount_percent / 100) : product.base_price,
        originalPrice: product.base_price,
      })
    }
  }

  if (loading) {
    return (
      <section
        className="px-4 sm:px-6 lg:px-8 py-12 md:py-16 bg-black"
        aria-label="Recommended products"
        aria-busy="true"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="h-7 w-48 bg-zinc-800 rounded animate-pulse" />
            <div className="h-5 w-20 bg-zinc-800 rounded animate-pulse hidden sm:block" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="rounded-xl bg-zinc-900/50 border border-zinc-800 overflow-hidden">
                <div className="aspect-[3/4] bg-zinc-800 animate-pulse" />
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-zinc-800 rounded animate-pulse" />
                  <div className="h-3 w-16 bg-zinc-800 rounded animate-pulse" />
                  <div className="h-6 w-24 bg-zinc-800 rounded animate-pulse" />
                  <div className="h-8 bg-zinc-800 rounded animate-pulse" />
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
      <section className="px-4 sm:px-6 lg:px-8 py-12 md:py-16 bg-black" aria-label="Recommended products">
        <div className="max-w-7xl mx-auto">
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
      className="px-4 sm:px-6 lg:px-8 py-12 md:py-16 bg-black"
      aria-labelledby="recommended-heading"
      itemScope
      itemType="https://schema.org/ItemList"
    >
      <meta itemProp="name" content="Recommended Products" />
      <meta
        itemProp="description"
        content="Handpicked streaming subscriptions and digital products recommended for you"
      />

      <div className="max-w-7xl mx-auto">
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
          {products.map((product, index) => {
            const discountedPrice =
              product.discount_percent > 0
                ? product.base_price * (1 - product.discount_percent / 100)
                : product.base_price
            const isFavorite = isInWishlist(product.id)

            return (
              <li key={product.id} itemScope itemType="https://schema.org/Product" itemProp="itemListElement">
                <meta itemProp="position" content={String(index + 1)} />
                <a
                  href={`/product/${product.slug}`}
                  onClick={(e) => handleProductClick(e, product.slug)}
                  onMouseEnter={() => handleProductHover(product.slug)}
                  className="group relative overflow-hidden rounded-xl bg-zinc-900/50 border border-amber-500/[0.08] transition-all duration-200 hover:border-amber-500/20 flex flex-col cursor-pointer h-full"
                  itemProp="url"
                >
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/15 to-transparent z-10" />

                  <div className="relative w-full aspect-[3/4] overflow-hidden">
                    <img
                      src={product.image_url || product.thumbnail_url || "/placeholder.svg"}
                      alt={product.title}
                      loading="lazy"
                      itemProp="image"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    <button
                      onClick={(e) => toggleFavorite(product, e)}
                      className="absolute top-2 right-2 w-8 h-8 bg-black/60 backdrop-blur-sm rounded-lg flex items-center justify-center transition-all duration-200 hover:bg-black/80 z-10 border border-white/[0.08] cursor-pointer"
                      aria-label={
                        isFavorite ? `Remove ${product.title} from wishlist` : `Add ${product.title} to wishlist`
                      }
                    >
                      <Heart
                        className={`w-4 h-4 transition-all ${isFavorite ? "fill-amber-500 text-amber-500" : "text-white/70"}`}
                        aria-hidden="true"
                      />
                    </button>

                    {product.cashback_percent > 0 && (
                      <div className="absolute bottom-12 left-2 bg-amber-500/90 text-black px-2 py-0.5 text-[10px] font-medium rounded-md">
                        {product.cashback_percent}% BACK
                      </div>
                    )}

                    <div className="absolute bottom-0 left-0 right-0 bg-zinc-900/90 backdrop-blur-sm text-white px-3 py-1.5 text-xs font-medium text-center border-t border-white/[0.06]">
                      <span itemProp="category">
                        {product.platforms?.[0]?.name || product.product_type.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 flex flex-col flex-grow bg-gradient-to-b from-amber-500/[0.02] to-transparent">
                    <h3
                      className="text-xs sm:text-sm font-medium text-white mb-1 line-clamp-2 leading-tight min-h-[2rem]"
                      itemProp="name"
                    >
                      {product.title}
                    </h3>

                    <div className="text-[10px] text-zinc-500 font-medium mb-2 uppercase tracking-wider">
                      <span itemProp="offers" itemScope itemType="https://schema.org/Offer">
                        <meta itemProp="availability" content="https://schema.org/InStock" />
                        <meta itemProp="priceCurrency" content="NPR" />
                        <span itemProp="eligibleRegion">{product.region || "GLOBAL"}</span>
                      </span>
                    </div>

                    <div className="space-y-1 mb-3" itemProp="offers" itemScope itemType="https://schema.org/Offer">
                      <div className="text-[10px] text-zinc-600 uppercase tracking-wide">From</div>
                      {product.discount_percent > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-zinc-600 line-through">
                            NPR {product.base_price.toFixed(0)}
                          </span>
                          <span className="text-[10px] font-medium text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-md border border-emerald-500/20">
                            -{product.discount_percent}%
                          </span>
                        </div>
                      )}
                      <div className="text-lg sm:text-xl font-semibold text-white" itemProp="price">
                        NPR {discountedPrice.toFixed(0)}
                      </div>
                      <meta itemProp="priceCurrency" content="NPR" />
                    </div>

                    <div className="flex items-center gap-1 text-zinc-600 text-[10px] mb-3">
                      <Heart className="w-3 h-3" aria-hidden="true" />
                      <span>{product.review_count?.toLocaleString() || 0} reviews</span>
                    </div>

                    <div className="mt-auto">
                      <div className="relative w-full bg-gradient-to-r from-amber-500 to-amber-600 group-hover:from-amber-400 group-hover:to-amber-500 text-black font-medium py-2 rounded-lg transition-all text-xs flex items-center justify-center gap-2 overflow-hidden cursor-pointer shadow-[0_0_20px_rgba(245,158,11,0.15)]">
                        <div className="absolute inset-0 bg-gradient-to-b from-white/25 to-transparent h-1/2" />
                        <Eye className="w-3.5 h-3.5 relative" aria-hidden="true" />
                        <span className="relative">View Details</span>
                      </div>
                    </div>
                  </div>
                </a>
              </li>
            )
          })}
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
