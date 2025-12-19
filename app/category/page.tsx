import Link from "next/link"
import {
  Gamepad2,
  CreditCard,
  Gift,
  Wallet,
  Zap,
  Ticket,
  PlaySquare,
  Box,
  Trophy,
  Swords,
  Package,
  ChevronRight,
  Home,
  Monitor,
  Tv,
  Music,
  Film,
  Sparkles,
} from "lucide-react"
import { createServerClient } from "@/lib/supabase/server"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "All Categories - Digital Products Nepal",
  description:
    "Browse all categories of digital products, games, gift cards, subscriptions, and software available in Nepal.",
  keywords: ["digital products nepal", "game categories", "gift cards nepal", "subscriptions nepal"],
}

export const revalidate = 120

// Icon mapping for categories
const iconMap: Record<string, any> = {
  games: Gamepad2,
  "gaming-ecards": CreditCard,
  "egift-cards": Gift,
  "gift-cards": Gift,
  "e-money": Wallet,
  steam: Zap,
  "steam-gift-cards": Ticket,
  psn: PlaySquare,
  xbox: Box,
  fifa: Trophy,
  fortnite: Swords,
  amazon: Package,
  software: Monitor,
  streaming: Tv,
  music: Music,
  movies: Film,
  subscriptions: Sparkles,
}

async function getCategoriesWithCounts() {
  const supabase = await createServerClient()

  // Fetch all active categories
  const { data: categories, error } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })

  if (error || !categories) return []

  // Fetch product counts for each category
  const categoriesWithCounts = await Promise.all(
    categories.map(async (category) => {
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

  return categoriesWithCounts
}

export default async function CategoryPage() {
  const categories = await getCategoriesWithCounts()

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-white/[0.01] rounded-full blur-3xl" />

      {/* Breadcrumb */}
      <div className="border-b border-white/[0.06] bg-zinc-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-zinc-500 hover:text-white transition flex items-center gap-1 cursor-pointer">
              <Home className="w-4 h-4" />
            </Link>
            <ChevronRight className="w-4 h-4 text-zinc-700" />
            <span className="text-white font-medium">Categories</span>
          </nav>
        </div>
      </div>

      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">Browse All Categories</h1>
          <p className="text-zinc-500 text-base sm:text-lg max-w-xl mx-auto">
            Explore our wide selection of digital products, games, and gift cards in Nepal
          </p>
        </div>

        {/* Categories Grid */}
        {categories.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">No Categories Available</h2>
            <p className="text-zinc-500">Check back later for new categories.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => {
              const IconComponent = iconMap[category.slug] || iconMap[category.icon] || Package
              return (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  prefetch={true}
                  className="group cursor-pointer"
                >
                  <div className="bg-zinc-900/80 border border-white/[0.06] rounded-xl p-5 hover:border-amber-500/30 transition-all duration-200 h-full shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)] hover:shadow-[0_0_20px_rgba(245,158,11,0.1)]">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(245,158,11,0.2)] group-hover:shadow-[0_0_25px_rgba(245,158,11,0.3)] transition-shadow">
                      <IconComponent className="w-6 h-6 text-black" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-amber-500 transition">
                      {category.name}
                    </h3>
                    <p className="text-zinc-500 text-sm mb-3 line-clamp-2">
                      {category.description || `Browse ${category.name} products`}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-amber-500/80 font-medium text-sm">
                        {category.productCount} {category.productCount === 1 ? "product" : "products"}
                      </span>
                      <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
