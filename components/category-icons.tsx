"use client"

import type React from "react"
import { motion } from "framer-motion"
import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  Gamepad2,
  CreditCard,
  Gift,
  Wallet,
  Zap,
  Ticket,
  PlaySquareIcon as Playstation,
  Box as Xbox,
  Trophy,
  Swords,
  Package,
  Tv,
  Music,
  Film,
  ShoppingBag,
  Smartphone,
  Monitor,
  ChevronRight,
  Sparkles,
  type LucideIcon,
} from "lucide-react"
import { createBrowserClient } from "@/lib/supabase/client"
import { appCache, CACHE_TTL, STALE_TTL, CACHE_KEYS } from "@/lib/cache"

const iconMap: Record<string, LucideIcon> = {
  gamepad2: Gamepad2,
  gamepad: Gamepad2,
  games: Gamepad2,
  creditcard: CreditCard,
  "credit-card": CreditCard,
  gift: Gift,
  wallet: Wallet,
  zap: Zap,
  steam: Zap,
  ticket: Ticket,
  playstation: Playstation,
  psn: Playstation,
  xbox: Xbox,
  trophy: Trophy,
  fifa: Trophy,
  swords: Swords,
  fortnite: Swords,
  package: Package,
  amazon: Package,
  tv: Tv,
  music: Music,
  film: Film,
  movie: Film,
  shopping: ShoppingBag,
  shoppingbag: ShoppingBag,
  smartphone: Smartphone,
  phone: Smartphone,
  monitor: Monitor,
  software: Monitor,
}

interface Category {
  id: string
  name: string
  slug: string
  icon: string | null
  is_active: boolean
  sort_order: number
}

interface CategoryWithCount extends Category {
  productCount: number
}

export default function CategoryIcons() {
  const [categories, setCategories] = useState<CategoryWithCount[]>([])
  const [loading, setLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    async function fetchCategories() {
      const cacheKey = CACHE_KEYS.CATEGORY_WITH_COUNT
      const { data: cached, needsRevalidation } = appCache.getWithStatus<CategoryWithCount[]>(cacheKey)

      if (cached) {
        setCategories(cached)
        setLoading(false)

        if (needsRevalidation) {
          appCache.markRevalidating(cacheKey)
          fetchFreshData()
        }
        return
      }

      await fetchFreshData()
    }

    async function fetchFreshData() {
      try {
        const supabase = createBrowserClient()

        // First get categories
        const { data: categoriesData, error: catError } = await supabase
          .from("categories")
          .select("id, name, slug, icon, is_active, sort_order")
          .eq("is_active", true)
          .order("sort_order", { ascending: true })
          .limit(6)

        if (catError || !categoriesData) {
          setLoading(false)
          return
        }

        // Get all product counts in a single query
        const { data: productCounts, error: countError } = await supabase
          .from("products")
          .select("category_id")
          .eq("is_active", true)
          .in(
            "category_id",
            categoriesData.map((c) => c.id),
          )

        // Count products per category
        const countMap: Record<string, number> = {}
        if (productCounts && !countError) {
          productCounts.forEach((p) => {
            countMap[p.category_id] = (countMap[p.category_id] || 0) + 1
          })
        }

        const categoriesWithCounts = categoriesData.map((category) => ({
          ...category,
          productCount: countMap[category.id] || 0,
        }))

        const cacheKey = CACHE_KEYS.CATEGORY_WITH_COUNT
        appCache.set(cacheKey, categoriesWithCounts, CACHE_TTL.CATEGORIES, STALE_TTL.CATEGORIES)
        appCache.clearRevalidating(cacheKey)
        setCategories(categoriesWithCounts)
      } catch (err) {
        console.error("Error fetching categories:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const handleCategoryHover = useCallback(
    (slug: string) => {
      router.prefetch(`/category/${slug}`)
    },
    [router],
  )

  const handleCategoryClick = useCallback(
    (e: React.MouseEvent, slug: string) => {
      e.preventDefault()
      router.push(`/category/${slug}`)
    },
    [router],
  )

  if (loading) {
    return (
      <section
        className="relative px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12"
        aria-label="Product categories"
        aria-busy="true"
      >
        <div className="max-w-7xl mx-auto">
          <div className="relative rounded-2xl border border-white/[0.08] p-3">
            <div className="relative rounded-xl bg-[#0f0f0f] overflow-hidden p-4 sm:p-6 lg:p-8">
              <div className="flex items-center justify-between mb-6 sm:mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#1a1a1a] animate-pulse" />
                  <div className="h-7 w-40 bg-[#1a1a1a] rounded-lg animate-pulse" />
                </div>
                <div className="h-5 w-20 bg-[#1a1a1a] rounded animate-pulse" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="relative rounded-xl p-4 border border-white/[0.04] bg-[#1a1a1a] overflow-hidden"
                  >
                    <div className="w-10 h-10 bg-[#222222] rounded-xl mb-3 animate-pulse" />
                    <div className="w-20 h-4 bg-[#222222] rounded mb-2 animate-pulse" />
                    <div className="w-14 h-3 bg-[#222222] rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (categories.length === 0) {
    return null
  }

  return (
    <section
      className="relative px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12"
      aria-label="Browse product categories"
      itemScope
      itemType="https://schema.org/SiteNavigationElement"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={false}
          animate={isMounted ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.5 }}
        >
          <div className="relative rounded-2xl border border-white/[0.08] p-3">
            <div className="relative rounded-xl bg-[#0f0f0f] overflow-hidden p-4 sm:p-6 lg:p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-6 sm:mb-8">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-semibold text-white">Browse Categories</h2>
                    <p className="text-xs sm:text-sm text-zinc-500 hidden sm:block">Find what you're looking for</p>
                  </div>
                </div>
                <a
                  href="/category"
                  className="flex items-center gap-1 text-xs sm:text-sm text-amber-400 hover:text-amber-300 transition-colors group"
                >
                  View All
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>

              {/* Categories grid */}
              <ul
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 list-none"
                role="list"
              >
                {categories.map((category, index) => {
                  const iconKey = (category.icon || category.slug || "package").toLowerCase()
                  const IconComponent = iconMap[iconKey] || Package

                  return (
                    <motion.li
                      key={category.id}
                      itemProp="name"
                      initial={false}
                      animate={isMounted ? { opacity: 1, y: 0 } : undefined}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      whileHover={{ y: -2, transition: { duration: 0.2 } }}
                    >
                      <a
                        href={`/category/${category.slug}`}
                        onClick={(e) => handleCategoryClick(e, category.slug)}
                        onMouseEnter={() => handleCategoryHover(category.slug)}
                        className="group relative flex flex-col p-3 sm:p-4 rounded-xl bg-[#1a1a1a] border border-white/[0.04] hover:border-amber-500/30 hover:bg-[#1e1e1e] transition-all duration-300 cursor-pointer"
                        itemProp="url"
                        title={`Browse ${category.name} - ${category.productCount} products available`}
                      >
                        {/* Icon */}
                        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#222222] border border-white/[0.04] flex items-center justify-center mb-2.5 sm:mb-3 group-hover:border-amber-500/20 transition-colors">
                          <IconComponent
                            className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-400 group-hover:text-amber-400 transition-colors"
                            aria-hidden="true"
                          />
                        </div>

                        {/* Text */}
                        <span className="text-sm sm:text-base font-medium text-zinc-200 group-hover:text-white transition-colors line-clamp-1 mb-0.5">
                          {category.name}
                        </span>
                        <span className="text-xs text-zinc-500 group-hover:text-zinc-400 transition-colors">
                          {category.productCount} {category.productCount === 1 ? "item" : "items"}
                        </span>
                      </a>
                    </motion.li>
                  )
                })}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
