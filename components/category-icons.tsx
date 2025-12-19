"use client"

import type React from "react"

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

const categoryColors: Record<string, { bg: string; text: string; glow: string }> = {
  games: { bg: "from-violet-500/20 to-purple-600/10", text: "text-violet-400", glow: "shadow-violet-500/20" },
  gamepad: { bg: "from-violet-500/20 to-purple-600/10", text: "text-violet-400", glow: "shadow-violet-500/20" },
  gamepad2: { bg: "from-violet-500/20 to-purple-600/10", text: "text-violet-400", glow: "shadow-violet-500/20" },
  gift: { bg: "from-pink-500/20 to-rose-600/10", text: "text-pink-400", glow: "shadow-pink-500/20" },
  wallet: { bg: "from-emerald-500/20 to-green-600/10", text: "text-emerald-400", glow: "shadow-emerald-500/20" },
  creditcard: { bg: "from-blue-500/20 to-cyan-600/10", text: "text-blue-400", glow: "shadow-blue-500/20" },
  "credit-card": { bg: "from-blue-500/20 to-cyan-600/10", text: "text-blue-400", glow: "shadow-blue-500/20" },
  tv: { bg: "from-red-500/20 to-orange-600/10", text: "text-red-400", glow: "shadow-red-500/20" },
  music: { bg: "from-green-500/20 to-emerald-600/10", text: "text-green-400", glow: "shadow-green-500/20" },
  film: { bg: "from-amber-500/20 to-yellow-600/10", text: "text-amber-400", glow: "shadow-amber-500/20" },
  movie: { bg: "from-amber-500/20 to-yellow-600/10", text: "text-amber-400", glow: "shadow-amber-500/20" },
  zap: { bg: "from-orange-500/20 to-amber-600/10", text: "text-orange-400", glow: "shadow-orange-500/20" },
  steam: { bg: "from-slate-500/20 to-zinc-600/10", text: "text-slate-300", glow: "shadow-slate-500/20" },
  playstation: { bg: "from-blue-500/20 to-indigo-600/10", text: "text-blue-400", glow: "shadow-blue-500/20" },
  psn: { bg: "from-blue-500/20 to-indigo-600/10", text: "text-blue-400", glow: "shadow-blue-500/20" },
  xbox: { bg: "from-green-500/20 to-emerald-600/10", text: "text-green-400", glow: "shadow-green-500/20" },
  default: { bg: "from-amber-500/20 to-yellow-600/10", text: "text-amber-400", glow: "shadow-amber-500/20" },
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
  const router = useRouter()

  useEffect(() => {
    async function fetchCategories() {
      const cacheKey = CACHE_KEYS.CATEGORY_WITH_COUNT
      const { data: cached, isStale, needsRevalidation } = appCache.getWithStatus<CategoryWithCount[]>(cacheKey)

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
      const supabase = createBrowserClient()
      const { data, error } = await supabase
        .from("categories")
        .select("id, name, slug, icon, is_active, sort_order")
        .eq("is_active", true)
        .order("sort_order", { ascending: true })

      if (!error && data) {
        const categoriesWithCounts = await Promise.all(
          data.map(async (category) => {
            const { count } = await supabase
              .from("products")
              .select("*", { count: "exact", head: true })
              .eq("category_id", category.id)
              .eq("is_active", true)

            return {
              ...category,
              productCount: count || 0,
            }
          }),
        )

        const cacheKey = CACHE_KEYS.CATEGORY_WITH_COUNT
        appCache.set(cacheKey, categoriesWithCounts, CACHE_TTL.CATEGORIES, STALE_TTL.CATEGORIES)
        appCache.clearRevalidating(cacheKey)
        setCategories(categoriesWithCounts)
      }
      setLoading(false)
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
        className="relative px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12 overflow-hidden"
        aria-label="Product categories"
        aria-busy="true"
      >
        <div className="max-w-7xl mx-auto relative">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <div className="h-7 w-40 bg-zinc-800/50 rounded-lg animate-pulse" />
            <div className="h-5 w-20 bg-zinc-800/50 rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-zinc-900/30 rounded-xl p-4 animate-pulse border border-zinc-800/30">
                <div className="w-10 h-10 bg-zinc-800/50 rounded-lg mb-3" />
                <div className="w-20 h-4 bg-zinc-800/50 rounded mb-2" />
                <div className="w-14 h-3 bg-zinc-800/50 rounded" />
              </div>
            ))}
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
      className="relative px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12 overflow-hidden"
      aria-label="Browse product categories"
      itemScope
      itemType="https://schema.org/SiteNavigationElement"
    >
      <div className="max-w-7xl mx-auto relative">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-amber-500/10 border border-amber-500/20">
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

        <ul
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 list-none"
          role="list"
        >
          {categories.map((category, index) => {
            const iconKey = (category.icon || category.slug || "package").toLowerCase()
            const IconComponent = iconMap[iconKey] || Package
            const colors = categoryColors[iconKey] || categoryColors.default

            return (
              <li key={category.id} itemProp="name">
                <a
                  href={`/category/${category.slug}`}
                  onClick={(e) => handleCategoryClick(e, category.slug)}
                  onMouseEnter={() => handleCategoryHover(category.slug)}
                  className="group relative flex flex-col p-3 sm:p-4 rounded-xl bg-zinc-900/30 border border-zinc-800/40 hover:border-zinc-700/60 transition-all duration-300 cursor-pointer overflow-hidden"
                  itemProp="url"
                  title={`Browse ${category.name} - ${category.productCount} products available`}
                >
                  {/* Hover gradient overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${colors.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                  />

                  {/* Icon container */}
                  <div
                    className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-zinc-800/60 flex items-center justify-center mb-2.5 sm:mb-3 group-hover:${colors.glow} group-hover:shadow-lg transition-all duration-300`}
                  >
                    <IconComponent
                      className={`w-4 h-4 sm:w-5 sm:h-5 text-zinc-400 group-hover:${colors.text} transition-colors duration-300`}
                      aria-hidden="true"
                    />
                  </div>

                  {/* Category name */}
                  <span className="relative text-sm sm:text-base font-medium text-zinc-200 group-hover:text-white transition-colors line-clamp-1 mb-0.5">
                    {category.name}
                  </span>

                  {/* Product count */}
                  <span className="relative text-xs text-zinc-500 group-hover:text-zinc-400 transition-colors">
                    {category.productCount} {category.productCount === 1 ? "item" : "items"}
                  </span>

                  {/* Arrow indicator on hover */}
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                    <ChevronRight className={`w-4 h-4 ${colors.text}`} />
                  </div>
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
