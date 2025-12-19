import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronRight, Home, Grid, Star, Eye, Flame, Sparkles, TrendingUp, Clock } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
}

interface Product {
  id: string
  title: string
  slug: string
  image_url: string | null
  thumbnail_url: string | null
  base_price: number
  original_price: number | null
  discount_percent: number | null
  is_new: boolean
  is_bestseller: boolean
  is_featured: boolean
  average_rating: number | null
  review_count: number | null
  short_description: string | null
  product_type: string
  tags: string[] | null
  created_at: string
}

async function getCategory(slug: string): Promise<Category | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("categories").select("*").eq("slug", slug).eq("is_active", true).single()

  if (error || !data) return null
  return data
}

async function getCategoryProducts(categoryId: string): Promise<Product[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("category_id", categoryId)
    .eq("is_active", true)
    .order("is_featured", { ascending: false })
    .order("is_bestseller", { ascending: false })
    .order("created_at", { ascending: false })

  if (error) return []
  return data || []
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const category = await getCategory(slug)

  if (!category) {
    return { title: "Category Not Found | Nepal" }
  }

  // Fetch products for dynamic keywords
  const products = await getCategoryProducts(category.id)

  // Generate product names for keywords
  const productNames = products.map((p) => p.title).slice(0, 20)
  const productKeywords = productNames.join(", ")

  // Generate dynamic keywords including all product names
  const baseKeywords = `${category.name}, ${category.name} Nepal, buy ${category.name} online Nepal, ${category.name} best price Nepal, digital ${category.name} Nepal`
  const allKeywords = productKeywords ? `${baseKeywords}, ${productKeywords}` : baseKeywords

  const title = `${category.name} - Buy ${category.name} Online in Nepal | Best Prices Nepal`

  // Dynamic description with product count and sample products
  const sampleProducts = productNames.slice(0, 3).join(", ")
  const description = category.description
    ? `${category.description} Shop ${products.length}+ ${category.name} products including ${sampleProducts} at the best prices in Nepal. Fast delivery and secure payment.`
    : `Buy ${category.name} online in Nepal. ${products.length}+ products available including ${sampleProducts || category.name}. Instant delivery, secure payment, and 24/7 support. Shop now in Nepal!`

  return {
    title,
    description,
    keywords: allKeywords,
    openGraph: {
      title,
      description,
      type: "website",
      locale: "en_US",
      siteName: "Eneba Nepal",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `/category/${slug}`,
    },
  }
}

function formatPrice(price: number): string {
  return `NPR ${price.toLocaleString("en-NP", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

// Helper functions for new label calculation
function isNewProduct(createdAt: string, days = 7): boolean {
  const created = new Date(createdAt)
  const now = new Date()
  const diffTime = now.getTime() - created.getTime()
  const diffDays = diffTime / (1000 * 60 * 60 * 24)
  return diffDays <= days
}

function getDaysRemaining(createdAt: string, totalDays = 7): number {
  const created = new Date(createdAt)
  const now = new Date()
  const diffTime = now.getTime() - created.getTime()
  const diffDays = diffTime / (1000 * 60 * 60 * 24)
  return Math.max(0, Math.ceil(totalDays - diffDays))
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const category = await getCategory(slug)

  if (!category) {
    notFound()
  }

  const products = await getCategoryProducts(category.id)

  return (
    <div className="min-h-screen bg-zinc-950">
      <nav className="bg-zinc-900/50 border-b border-zinc-800 sticky top-0 z-40 backdrop-blur-sm">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6">
          <ol className="flex items-center gap-1 sm:gap-2 py-3 sm:py-4 text-xs sm:text-sm">
            <li className="flex items-center">
              <Link
                href="/"
                className="flex items-center gap-1 text-zinc-400 hover:text-amber-500 transition-colors cursor-pointer"
              >
                <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Home</span>
              </Link>
            </li>
            <li className="flex items-center">
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-zinc-600 mx-1" />
            </li>
            <li className="flex items-center">
              <Link href="/category" className="text-zinc-400 hover:text-amber-500 transition-colors cursor-pointer">
                Categories
              </Link>
            </li>
            <li className="flex items-center">
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-zinc-600 mx-1" />
            </li>
            <li className="flex items-center">
              <span className="text-amber-500 font-medium">{category.name}</span>
            </li>
          </ol>
        </div>
      </nav>

      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8">
        {/* Category Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">{category.name}</h1>
          {category.description && (
            <p className="text-zinc-400 text-sm sm:text-base max-w-3xl">{category.description}</p>
          )}
          <p className="text-zinc-500 text-sm mt-2">
            {products.length} {products.length === 1 ? "product" : "products"} available in Nepal
          </p>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
            {products.map((product) => {
              const showNewLabel = product.is_new && isNewProduct(product.created_at, 7)
              const daysRemaining = showNewLabel ? getDaysRemaining(product.created_at, 7) : 0
              const showBestsellerLabel = product.is_bestseller
              const showFeaturedLabel = product.is_featured && !showBestsellerLabel

              return (
                <Link
                  key={product.id}
                  href={`/product/${product.slug}`}
                  className="group bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-amber-500/50 transition-all duration-300 cursor-pointer"
                >
                  {/* Product Image */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-zinc-800">
                    <img
                      src={
                        product.thumbnail_url ||
                        product.image_url ||
                        "/placeholder.svg?height=200&width=300&query=product" ||
                        "/placeholder.svg" ||
                        "/placeholder.svg" ||
                        "/placeholder.svg" ||
                        "/placeholder.svg"
                      }
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />

                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {/* New label with countdown */}
                      {showNewLabel && (
                        <span className="flex items-center gap-1 bg-emerald-500 text-white text-[10px] sm:text-xs px-1.5 py-0.5 rounded font-bold shadow-lg">
                          <Sparkles className="w-3 h-3" />
                          NEW
                          {daysRemaining <= 3 && (
                            <span className="flex items-center gap-0.5 text-emerald-100 ml-0.5">
                              <Clock className="w-2.5 h-2.5" />
                              {daysRemaining}d
                            </span>
                          )}
                        </span>
                      )}
                      {/* Bestseller label */}
                      {showBestsellerLabel && (
                        <span className="flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-500 text-black text-[10px] sm:text-xs px-1.5 py-0.5 rounded font-bold shadow-lg">
                          <Flame className="w-3 h-3" />
                          BEST SELLER
                        </span>
                      )}
                      {/* Featured label */}
                      {showFeaturedLabel && (
                        <span className="flex items-center gap-1 bg-violet-500 text-white text-[10px] sm:text-xs px-1.5 py-0.5 rounded font-bold shadow-lg">
                          <TrendingUp className="w-3 h-3" />
                          FEATURED
                        </span>
                      )}
                      {/* Discount label */}
                      {product.discount_percent && product.discount_percent > 0 && (
                        <span className="bg-red-500 text-white text-[10px] sm:text-xs px-1.5 py-0.5 rounded font-bold shadow-lg">
                          -{product.discount_percent}%
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-3 sm:p-4">
                    <h3 className="text-white font-medium text-sm sm:text-base line-clamp-2 mb-2 group-hover:text-amber-500 transition-colors">
                      {product.title}
                    </h3>

                    {/* Rating */}
                    {product.average_rating && (
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-yellow-500 fill-yellow-500" />
                        <span className="text-zinc-400 text-xs">
                          {product.average_rating.toFixed(1)}
                          {product.review_count && <span className="text-zinc-500"> ({product.review_count})</span>}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-amber-500 font-bold text-sm sm:text-base">
                        {formatPrice(product.base_price || 0)}
                      </span>
                      {product.original_price && product.original_price > product.base_price && (
                        <span className="text-zinc-500 text-xs sm:text-sm line-through">
                          {formatPrice(product.original_price)}
                        </span>
                      )}
                    </div>

                    {/* Tags */}
                    {product.tags && product.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {product.tags.slice(0, 2).map((tag, i) => (
                          <span
                            key={i}
                            className="text-[10px] text-zinc-400 bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-700/50"
                          >
                            {tag}
                          </span>
                        ))}
                        {product.tags.length > 2 && (
                          <span className="text-[10px] text-zinc-500">+{product.tags.length - 2}</span>
                        )}
                      </div>
                    )}

                    {/* View Details Button */}
                    <div className="mt-3">
                      <div className="relative w-full bg-gradient-to-r from-amber-500 to-amber-600 group-hover:from-amber-400 group-hover:to-amber-500 text-black font-medium py-2 rounded-lg transition-all text-xs flex items-center justify-center gap-2 overflow-hidden cursor-pointer shadow-[0_0_20px_rgba(245,158,11,0.15)]">
                        <div className="absolute inset-0 bg-gradient-to-b from-white/25 to-transparent h-1/2" />
                        <Eye className="w-3.5 h-3.5 relative" />
                        <span className="relative">View Details</span>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-16 sm:py-24">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-zinc-900 rounded-full flex items-center justify-center">
              <Grid className="w-8 h-8 sm:w-10 sm:h-10 text-zinc-600" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">No Products Yet</h2>
            <p className="text-zinc-400 text-sm sm:text-base mb-6">
              We're working on adding products to this category. Check back soon!
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Browse All Products
            </Link>
          </div>
        )}

        <div className="mt-12 sm:mt-16 pt-8 border-t border-zinc-800">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-4">Buy {category.name} Online in Nepal</h2>
          <div className="prose prose-invert prose-sm max-w-none text-zinc-400">
            <p>
              Looking for the best {category.name.toLowerCase()} deals in Nepal? You've come to the right place! We
              offer {products.length}+ {category.name.toLowerCase()} products at competitive prices with instant digital
              delivery.
              {products.length > 0 && (
                <>
                  {" "}
                  Popular products include{" "}
                  {products
                    .slice(0, 5)
                    .map((p) => p.title)
                    .join(", ")}
                  , and more!
                </>
              )}
            </p>
            <p className="mt-3">
              All our {category.name.toLowerCase()} come with secure payment options, instant delivery, and 24/7
              customer support. Shop with confidence knowing you're getting authentic products at the best prices
              available in Nepal. We accept various payment methods making it easy to buy {category.name.toLowerCase()}{" "}
              online in Nepal.
            </p>
            {products.length > 5 && (
              <p className="mt-3">
                Browse our complete collection of {category.name.toLowerCase()} including{" "}
                {products
                  .slice(5, 15)
                  .map((p) => p.title)
                  .join(", ")}
                . All products are available for instant delivery across Nepal.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
