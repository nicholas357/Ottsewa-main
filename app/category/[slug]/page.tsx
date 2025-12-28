import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronRight, Home, Grid } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import ProductCard from "@/components/product-card"

export const revalidate = 60

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

function generateCategorySchema(category: Category, products: Product[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${category.name} - OTTSewa Nepal`,
    description:
      category.description ||
      `Buy ${category.name} online in Nepal at best prices. Instant delivery and secure payment.`,
    url: `https://www.ottsewa.store/category/${category.slug}`,
    isPartOf: {
      "@type": "WebSite",
      name: "OTTSewa",
      url: "https://www.ottsewa.store",
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://www.ottsewa.store",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Categories",
          item: "https://www.ottsewa.store/category",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: category.name,
          item: `https://www.ottsewa.store/category/${category.slug}`,
        },
      ],
    },
    mainEntity: {
      "@type": "ItemList",
      name: `${category.name} Products`,
      numberOfItems: products.length,
      itemListElement: products.slice(0, 20).map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `https://www.ottsewa.store/product/${product.slug}`,
        name: product.title,
      })),
    },
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const category = await getCategory(slug)

  if (!category) {
    notFound()
  }

  const products = await getCategoryProducts(category.id)

  const categorySchema = generateCategorySchema(category, products)

  return (
    <div className="min-h-screen bg-transparent">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(categorySchema) }} />

      <nav className="bg-[#0f0f0f]/50 backdrop-blur-sm border-b border-white/[0.06] sticky top-0 z-40">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6">
          <ol className="flex items-center gap-1 sm:gap-2 py-3 sm:py-4 text-xs sm:text-sm">
            <li className="flex items-center">
              <Link
                href="/"
                className="flex items-center gap-1 text-zinc-500 hover:text-amber-400 transition-colors cursor-pointer"
              >
                <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Home</span>
              </Link>
            </li>
            <li className="flex items-center">
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-zinc-700 mx-1" />
            </li>
            <li className="flex items-center">
              <Link href="/category" className="text-zinc-500 hover:text-amber-400 transition-colors cursor-pointer">
                Categories
              </Link>
            </li>
            <li className="flex items-center">
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-zinc-700 mx-1" />
            </li>
            <li className="flex items-center">
              <span className="text-amber-400 font-medium">{category.name}</span>
            </li>
          </ol>
        </div>
      </nav>

      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8">
        {/* Category Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">{category.name}</h1>
          {category.description && (
            <p className="text-zinc-500 text-sm sm:text-base max-w-3xl">{category.description}</p>
          )}
          <p className="text-zinc-600 text-sm mt-2">
            {products.length} {products.length === 1 ? "product" : "products"} available in Nepal
          </p>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="rounded-2xl border border-white/[0.08] p-3 bg-transparent">
            <div className="rounded-xl bg-[#0f0f0f] p-4 sm:p-5">
              <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 list-none">
                {products.map((product, index) => (
                  <ProductCard key={product.id} product={product as any} index={index} showTags={true} />
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-white/[0.08] p-3 bg-transparent">
            <div className="rounded-xl bg-[#0f0f0f] p-8 text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-[#1a1a1a] rounded-full flex items-center justify-center">
                <Grid className="w-8 h-8 sm:w-10 sm:h-10 text-zinc-600" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">No Products Yet</h2>
              <p className="text-zinc-500 text-sm sm:text-base mb-6">
                We're working on adding products to this category. Check back soon!
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Browse All Products
              </Link>
            </div>
          </div>
        )}

        {/* SEO Content */}
        <div className="mt-8 sm:mt-12 rounded-2xl border border-white/[0.08] p-3 bg-transparent">
          <div className="rounded-xl bg-[#0f0f0f] p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-3">Buy {category.name} Online in Nepal</h2>
            <div className="prose prose-invert prose-sm max-w-none text-zinc-500">
              <p>
                Looking for the best {category.name.toLowerCase()} deals in Nepal? You've come to the right place! We
                offer {products.length}+ {category.name.toLowerCase()} products at competitive prices with instant
                digital delivery.
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
                available in Nepal.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
