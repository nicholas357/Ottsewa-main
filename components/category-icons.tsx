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
      <nav
        className="relative bg-zinc-950 border-y border-amber-500/[0.08] px-3 sm:px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:py-10"
        aria-label="Product categories"
        aria-busy="true"
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
        <div className="max-w-7xl mx-auto grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-3 md:gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2 sm:gap-3">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-zinc-800 rounded-full animate-pulse" />
              <div className="w-16 h-3 bg-zinc-800 rounded animate-pulse" />
            </div>
          ))}
        </div>
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
      </nav>
    )
  }

  if (categories.length === 0) {
    return null
  }

  return (
    <nav
      className="relative bg-zinc-950 border-y border-amber-500/[0.08] px-3 sm:px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:py-10"
      aria-label="Browse product categories"
      itemScope
      itemType="https://schema.org/SiteNavigationElement"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />

      <h2 className="sr-only">Shop by Category</h2>

      <ul
        className={`max-w-7xl mx-auto grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 ${categories.length > 6 ? "lg:grid-cols-8" : `lg:grid-cols-${Math.min(categories.length, 6)}`} gap-2 sm:gap-3 md:gap-4 list-none`}
        role="list"
      >
        {categories.map((category) => {
          const iconKey = (category.icon || category.slug || "package").toLowerCase()
          const IconComponent = iconMap[iconKey] || Package

          return (
            <li key={category.id} itemProp="name">
              <a
                href={`/category/${category.slug}`}
                onClick={(e) => handleCategoryClick(e, category.slug)}
                onMouseEnter={() => handleCategoryHover(category.slug)}
                className="flex flex-col items-center gap-2 sm:gap-3 transition-all duration-200 group cursor-pointer"
                itemProp="url"
                title={`Browse ${category.name} - ${category.productCount} products available`}
              >
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-zinc-900 rounded-full flex items-center justify-center group-hover:bg-zinc-800 transition-all duration-200 border border-amber-500/[0.1] group-hover:border-amber-500/25 shine-inner group-hover:shadow-[0_0_20px_rgba(245,158,11,0.08)]">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-b from-amber-500/[0.08] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <IconComponent
                    className="relative w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-zinc-400 group-hover:text-amber-400 transition-colors"
                    aria-hidden="true"
                  />
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <span className="text-zinc-400 group-hover:text-amber-400 text-xs sm:text-xs md:text-sm text-center font-medium leading-tight transition-colors">
                    {category.name}
                  </span>
                  <span className="text-zinc-500 text-[10px] sm:text-xs">
                    {category.productCount} {category.productCount === 1 ? "product" : "products"}
                  </span>
                </div>
              </a>
            </li>
          )
        })}
      </ul>

      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
    </nav>
  )
}
