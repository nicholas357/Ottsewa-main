"use client"

import { motion } from "framer-motion"
import { Info, ChevronRight, AlertCircle, RefreshCw, Gamepad2, Coins } from "lucide-react"
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import type { Product } from "@/lib/products"
import { appCache, CACHE_TTL, STALE_TTL } from "@/lib/cache"
import ProductCard from "@/components/product-card"
import { createBrowserClient } from "@supabase/ssr"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

interface HomeSectionProps {
  sectionType: "games" | "game_currency"
  title: string
  viewAllLink?: string
}

const sectionIcons = {
  games: Gamepad2,
  game_currency: Coins,
}

const sectionColors = {
  games: {
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    text: "text-purple-400",
    accent: "text-purple-400 hover:text-purple-300",
  },
  game_currency: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    text: "text-emerald-400",
    accent: "text-emerald-400 hover:text-emerald-300",
  },
}

export default function HomeSection({ sectionType, title, viewAllLink }: HomeSectionProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const Icon = sectionIcons[sectionType]
  const colors = sectionColors[sectionType]

  const fetchProducts = useCallback(async () => {
    const cacheKey = `home_section_${sectionType}`
    const { data: cached, needsRevalidation } = appCache.getWithStatus<Product[]>(cacheKey)

    if (cached && cached.length > 0) {
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
  }, [sectionType])

  const fetchFreshProducts = useCallback(async () => {
    setError(null)

    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      )

      const { data: sections, error: sectionsError } = await supabase
        .from("home_sections")
        .select("product_id, sort_order")
        .eq("section_type", sectionType)
        .eq("is_active", true)
        .order("sort_order", { ascending: true })
        .limit(10)

      if (sectionsError) throw sectionsError

      if (!sections || sections.length === 0) {
        setProducts([])
        setLoading(false)
        return
      }

      const productIds = sections.map((s) => s.product_id)

      const { data: productsData, error: productsError } = await supabase
        .from("products")
        .select(`
          id, title, slug, description, image_url, base_price, original_price,
          product_type, is_featured, discount_percent, is_bestseller, is_new,
          platforms:product_platforms(platform:platforms(id, name, slug, icon)),
          category:categories(id, name, slug)
        `)
        .in("id", productIds)

      if (productsError) throw productsError

      const mappedProducts =
        productsData?.map((p) => ({
          ...p,
          name: p.title,
          price: p.base_price,
        })) || []

      const sortedProducts = productIds
        .map((id) => mappedProducts.find((p) => p.id === id))
        .filter((p): p is Product => p !== null && p !== undefined)

      const cacheKey = `home_section_${sectionType}`
      appCache.set(cacheKey, sortedProducts, CACHE_TTL.HOME, STALE_TTL.HOME)
      appCache.clearRevalidating(cacheKey)
      setProducts(sortedProducts)
    } catch (err) {
      console.error(`Error fetching ${sectionType} products:`, err)
      setError("Failed to load products. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [sectionType])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  if (!loading && products.length === 0 && !error) {
    return null
  }

  if (loading) {
    return (
      <section className="px-4 sm:px-6 lg:px-8 py-8 sm:py-10" aria-label={title} aria-busy="true">
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
      <section className="px-4 sm:px-6 lg:px-8 py-8 sm:py-10" aria-label={title}>
        <div className="max-w-7xl mx-auto">
          <div className="relative rounded-2xl border border-white/[0.08] p-3">
            <div className="relative rounded-xl bg-[#0f0f0f] overflow-hidden p-4 sm:p-6">
              <div className="flex flex-col items-center justify-center py-12 text-center" role="alert">
                <AlertCircle className="w-10 h-10 text-red-400 mb-3" aria-hidden="true" />
                <h3 className="text-lg font-medium text-white mb-2">Unable to load {title.toLowerCase()}</h3>
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
    <section className="px-4 sm:px-6 lg:px-8 py-8 sm:py-10" aria-labelledby={`${sectionType}-heading`}>
      <div className="max-w-7xl mx-auto">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="relative rounded-2xl border border-white/[0.08] p-3">
            <div className="relative rounded-xl bg-[#0f0f0f] overflow-hidden">
              <div className="relative p-4 sm:p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div
                      className={`flex items-center justify-center w-9 h-9 rounded-xl ${colors.bg} border ${colors.border}`}
                    >
                      <Icon className={`w-4 h-4 ${colors.text}`} />
                    </div>
                    <h2 id={`${sectionType}-heading`} className="text-lg sm:text-xl font-semibold text-white">
                      {title}
                    </h2>
                    <button
                      className="text-zinc-500 hover:text-zinc-400 transition cursor-pointer"
                      aria-label={`Learn more about ${title.toLowerCase()}`}
                    >
                      <Info className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                  {viewAllLink && (
                    <button
                      onClick={() => router.push(viewAllLink)}
                      className={`hidden sm:flex items-center gap-1 ${colors.accent} text-sm transition cursor-pointer`}
                    >
                      View all
                      <ChevronRight className="w-4 h-4" aria-hidden="true" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3" role="list">
                  {products.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={false}
                      whileHover={{ y: -4, transition: { duration: 0.2 } }}
                      className="animate-in fade-in slide-in-from-bottom-2 duration-300"
                      style={{ animationDelay: `${index * 50}ms`, animationFillMode: "both" }}
                    >
                      <ProductCard product={product} index={index} />
                    </motion.div>
                  ))}
                </div>

                {viewAllLink && (
                  <div
                    className="flex justify-center mt-8 animate-in fade-in duration-500"
                    style={{ animationDelay: "400ms" }}
                  >
                    <button
                      onClick={() => router.push(viewAllLink)}
                      className="px-6 py-2.5 bg-amber-500 text-black font-medium rounded-lg hover:bg-amber-400 transition-all text-sm cursor-pointer"
                    >
                      See all {title.toLowerCase()}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
