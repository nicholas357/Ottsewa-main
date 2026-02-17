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
  title: "All Digital Products & Subscriptions - Netflix, Spotify, Gaming, Gift Cards Nepal | OTTSewa",
  description:
    "Browse all digital products in Nepal - Netflix, Spotify, Disney+, Amazon Prime Video, gaming subscriptions, gift cards, and software. Instant delivery with OTTSewa.",
  keywords: [
    "digital products nepal",
    "Netflix Nepal",
    "Spotify Nepal",
    "gift cards nepal",
    "steam gift cards",
    "PSN gift cards",
    "subscriptions nepal",
    "game cards nepal",
    "Disney+ Nepal",
    "HBO Max Nepal",
    "YouTube Premium Nepal",
    "buy subscriptions online",
  ],
  metadataBase: new URL("https://www.ottsewa.store"),
  alternates: {
    canonical: "/category",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.ottsewa.store/category",
    siteName: "OTTSewa",
    title: "All Digital Products & Subscriptions Nepal",
    description: "Browse Netflix, Spotify, gaming, and gift cards in Nepal with instant delivery.",
    images: [
      {
        url: "/og-categories.png",
        width: 1200,
        height: 630,
        alt: "OTTSewa All Categories",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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
    <div className="min-h-screen bg-transparent relative">
      {/* Breadcrumb */}
      <div className="border-b border-white/[0.06] bg-[#0f0f0f]/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-zinc-500 hover:text-white transition flex items-center gap-1 cursor-pointer">
              <Home className="w-4 h-4" />
            </Link>
            <ChevronRight className="w-4 h-4 text-zinc-700" />
            <span className="text-amber-400 font-medium">Categories</span>
          </nav>
        </div>
      </div>

      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">Browse All Categories</h1>
          <p className="text-zinc-500 text-sm sm:text-base max-w-xl mx-auto">
            Explore our wide selection of digital products, games, and gift cards in Nepal
          </p>
        </div>

        {/* Categories Grid with double-box design */}
        {categories.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">No Categories Available</h2>
            <p className="text-zinc-500">Check back later for new categories.</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-white/[0.08] p-3 bg-transparent">
            <div className="rounded-xl bg-[#0f0f0f] p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {categories.map((category) => {
                  const IconComponent = iconMap[category.slug] || iconMap[category.icon] || Package
                  return (
                    <Link
                      key={category.id}
                      href={`/category/${category.slug}`}
                      prefetch={true}
                      className="group cursor-pointer"
                    >
                      <div className="bg-[#1a1a1a] border border-white/[0.06] rounded-xl p-4 hover:border-amber-500/30 transition-all duration-200 h-full">
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-500 rounded-lg flex items-center justify-center mb-3">
                          <IconComponent className="w-5 h-5 text-black" />
                        </div>
                        <h3 className="text-base font-semibold text-white mb-1 group-hover:text-amber-400 transition">
                          {category.name}
                        </h3>
                        <p className="text-zinc-500 text-sm mb-2 line-clamp-2">
                          {category.description || `Browse ${category.name} products`}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-amber-500/80 font-medium text-sm">
                            {category.productCount} {category.productCount === 1 ? "product" : "products"}
                          </span>
                          <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
