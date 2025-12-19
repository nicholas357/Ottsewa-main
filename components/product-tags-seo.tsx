"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Tag, Gamepad2, Gift, Tv, Monitor, ChevronDown, ChevronUp, Sparkles, TrendingUp } from "lucide-react"
import { createBrowserClient } from "@/lib/supabase/client"
import { appCache, CACHE_TTL, STALE_TTL } from "@/lib/cache"

interface ProductItem {
  id: string
  title: string
  slug: string
  product_type: "game" | "giftcard" | "subscription" | "software"
  category?: {
    name: string
    slug: string
  }
}

interface CategoryGroup {
  type: "game" | "giftcard" | "subscription" | "software"
  label: string
  icon: React.ReactNode
  products: ProductItem[]
}

const typeConfig = {
  game: {
    label: "Games",
    icon: <Gamepad2 className="w-4 h-4" aria-hidden="true" />,
    description: "PC, PlayStation, Xbox and Nintendo games",
  },
  giftcard: {
    label: "Gift Cards",
    icon: <Gift className="w-4 h-4" aria-hidden="true" />,
    description: "Digital gift cards for gaming and shopping",
  },
  subscription: {
    label: "Subscriptions",
    icon: <Tv className="w-4 h-4" aria-hidden="true" />,
    description: "Streaming and premium service subscriptions",
  },
  software: {
    label: "Software",
    icon: <Monitor className="w-4 h-4" aria-hidden="true" />,
    description: "Productivity and utility software licenses",
  },
}

export default function ProductTagsSEO() {
  const [products, setProducts] = useState<ProductItem[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["subscription", "giftcard"]))

  useEffect(() => {
    const fetchProducts = async () => {
      const cacheKey = "seo_all_product_tags"
      const cached = appCache.get<ProductItem[]>(cacheKey)

      if (cached) {
        setProducts(cached)
        setLoading(false)
        return
      }

      try {
        const supabase = createBrowserClient()
        const { data } = await supabase
          .from("products")
          .select("id, title, slug, product_type, category:categories(name, slug)")
          .eq("is_active", true)
          .order("title", { ascending: true })

        if (data) {
          setProducts(data as ProductItem[])
          appCache.set(cacheKey, data, CACHE_TTL.PRODUCTS, STALE_TTL.PRODUCTS)
        }
      } catch (error) {
        console.error("Error fetching product tags:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const toggleSection = (type: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev)
      if (next.has(type)) {
        next.delete(type)
      } else {
        next.add(type)
      }
      return next
    })
  }

  // Group products by type
  const groupedProducts: CategoryGroup[] = (["subscription", "giftcard", "game", "software"] as const)
    .map((type) => ({
      type,
      label: typeConfig[type].label,
      icon: typeConfig[type].icon,
      products: products.filter((p) => p.product_type === type),
    }))
    .filter((group) => group.products.length > 0)

  if (loading) {
    return (
      <section className="px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-xl animate-pulse" />
            <div className="space-y-2">
              <div className="h-6 w-48 bg-gradient-to-r from-zinc-800 to-zinc-900 rounded-lg animate-pulse" />
              <div className="h-4 w-32 bg-zinc-800/50 rounded animate-pulse" />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-zinc-900/50 rounded-xl border border-zinc-800/50 p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 bg-zinc-800 rounded animate-pulse" />
                  <div className="h-5 w-24 bg-zinc-800 rounded animate-pulse" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {[...Array(6)].map((_, j) => (
                    <div
                      key={j}
                      className="h-8 bg-zinc-800/50 rounded-full animate-pulse"
                      style={{ width: `${Math.random() * 60 + 80}px` }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (products.length === 0) return null

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-12 md:py-16 border-t border-zinc-800/30 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-amber-500/[0.03] rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-amber-500/[0.03] rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Tag className="w-5 h-5 text-zinc-900" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-white">Browse All Products</h2>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 bg-amber-500/10 text-amber-500 text-xs font-medium rounded-full border border-amber-500/20">
                  <Sparkles className="w-3 h-3" aria-hidden="true" />
                  {products.length}+ Items
                </span>
              </div>
              <p className="text-sm text-zinc-400">Discover games, subscriptions, gift cards & more</p>
            </div>
          </div>

          {/* Quick stats */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5 text-zinc-400">
              <TrendingUp className="w-4 h-4 text-green-500" aria-hidden="true" />
              <span>Updated daily</span>
            </div>
          </div>
        </header>

        <div className="grid gap-4 md:grid-cols-2">
          {groupedProducts.map((group) => {
            const isExpanded = expandedSections.has(group.type)
            const displayProducts = isExpanded ? group.products : group.products.slice(0, 12)
            const hasMore = group.products.length > 12

            return (
              <article
                key={group.type}
                className="bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-800/50 overflow-hidden hover:border-zinc-700/50 transition-colors group"
              >
                <header className="px-4 py-3 border-b border-zinc-800/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 group-hover:bg-amber-500/20 transition-colors">
                        {group.icon}
                      </span>
                      <h3 className="text-sm font-semibold text-white">{group.label}</h3>
                    </div>
                    <span className="text-xs text-zinc-500 bg-zinc-800/50 px-2.5 py-1 rounded-full font-medium">
                      {group.products.length} items
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 mt-1.5 ml-9">{typeConfig[group.type].description}</p>
                </header>

                {/* Products Grid */}
                <div className="p-4">
                  <nav aria-label={`${group.label} products`}>
                    <ul className="flex flex-wrap gap-2">
                      {displayProducts.map((product, index) => (
                        <li key={product.id}>
                          <Link
                            href={`/product/${product.slug}`}
                            className={`inline-flex items-center px-3 py-1.5 text-sm rounded-full transition-all duration-200 ${
                              index < 3
                                ? "bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 hover:border-amber-500/30"
                                : "text-zinc-400 bg-zinc-800/50 border border-transparent hover:bg-zinc-800 hover:text-white hover:border-zinc-700"
                            }`}
                            title={`Buy ${product.title} in Nepal`}
                          >
                            {product.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </nav>

                  {hasMore && (
                    <button
                      onClick={() => toggleSection(group.type)}
                      className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-500 bg-amber-500/10 rounded-full hover:bg-amber-500/20 transition-colors border border-amber-500/20"
                      aria-expanded={isExpanded}
                    >
                      {isExpanded ? (
                        <>
                          Show less
                          <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" />
                        </>
                      ) : (
                        <>
                          Show all {group.products.length}
                          <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </article>
            )
          })}
        </div>

        <footer className="mt-10 space-y-4">
          <div className="p-5 rounded-xl bg-gradient-to-br from-zinc-900/80 to-zinc-900/40 border border-zinc-800/50 backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4 text-amber-500" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white mb-2">Buy Digital Products in Nepal</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  OTTSewa offers the best prices for digital products in Nepal. Browse our collection of{" "}
                  {groupedProducts.map((g, i) => (
                    <span key={g.type}>
                      <span className="text-zinc-300">
                        {g.products
                          .slice(0, 3)
                          .map((p) => p.title)
                          .join(", ")}
                      </span>
                      {i < groupedProducts.length - 1 ? ", " : ""}
                    </span>
                  ))}{" "}
                  and more. Get instant delivery with secure payment options including eSewa, Khalti, and bank transfer.
                </p>
              </div>
            </div>
          </div>

          {/* Additional SEO Keywords */}
          <div className="text-xs text-zinc-600 leading-relaxed px-1">
            <p>
              Nepal's trusted digital marketplace for streaming subscriptions, gaming gift cards, software licenses, and
              video games. Available products include Netflix Nepal, Spotify Premium Nepal, YouTube Premium Nepal,
              Disney+ Hotstar Nepal, PlayStation Store gift cards, Xbox Game Pass, Steam Wallet codes, Microsoft Office,
              and many more digital products with genuine codes and instant email delivery.
            </p>
          </div>
        </footer>
      </div>
    </section>
  )
}
