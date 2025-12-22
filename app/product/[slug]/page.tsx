import { Suspense } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Shield, Zap, Clock, ChevronRight, Tag, ChevronDown, Home } from "lucide-react"
import { getProductBySlug, type Product } from "@/lib/products"
import { ProductDescription } from "@/components/product-description"
import { ProductInteractions } from "@/components/product-interactions"

// Platform Icons
const PCIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801" />
  </svg>
)

const PlayStationIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M8.985 2.596v17.548l3.915 1.261V6.688c0-.69.304-1.151.794-.991.636.181.76.814.76 1.505v5.876c2.441 1.193 4.362-.002 4.362-3.153 0-3.237-1.126-4.675-4.438-5.827-1.307-.448-3.728-1.186-5.391-1.502h-.002zm4.656 16.242l6.296-2.275c.715-.258.826-.625.246-.818-.586-.192-1.637-.139-2.357.123l-4.205 1.5v-2.385l.24-.085s1.201-.42 2.913-.615c1.696-.18 3.778.029 5.404.661 1.858.585 2.067 1.453 1.6 2.138-.468.682-1.61 1.089-1.61 1.089l-8.529 3.017v-2.349l.002-.001zM1.89 18.77c-1.904-.548-2.198-1.701-1.345-2.376.783-.619 2.122-1.087 2.122-1.087l5.51-1.964v2.38l-3.96 1.418c-.715.254-.822.621-.246.814.586.192 1.637.139 2.357-.123l1.852-.669v2.128c-.156.028-.328.056-.5.076-1.648.188-3.411-.037-5.79-.597z" />
  </svg>
)

const XboxIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M4.102 21.033C6.211 22.881 8.977 24 12 24c3.026 0 5.789-1.119 7.902-2.967 1.877-1.912-4.316-8.709-7.902-11.417-3.582 2.708-9.779 9.505-7.898 11.417zm11.16-14.406c2.5 2.961 7.484 10.313 6.076 12.912C23.056 17.036 24 14.615 24 12c0-4.124-2.093-7.764-5.27-9.911-.545-.158-2.211-.151-3.468 4.538zm-6.532 0C7.5 2.085 5.814 2.093 5.27 2.089 2.093 4.236 0 7.876 0 12c0 2.615.944 5.036 2.662 6.539-1.408-2.599 3.576-9.951 6.068-12.912zM12 3.735S9.751 1.985 7.821 1.732c-.389.109-.772.29-1.14.514C8.41 1.449 10.133 1 12 1c1.867 0 3.59.449 5.319 1.246-.368-.224-.75-.405-1.14-.514-1.93.253-4.179 2.003-4.179 2.003z" />
  </svg>
)

const NintendoIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M0 .6h7.1c2.4 0 4.3 1.9 4.3 4.3v14.2c0 2.4-1.9 4.3-4.3 4.3H0V.6zM24 .6h-7.1c-2.4 0-4.3 1.9-4.3 4.3v14.2c0 2.4 1.9 4.3 4.3 4.3H24V.6zm-9.3 9.4c0-2.6 2.1-4.7 4.7-4.7 2.6 0 4.7 2.1 4.7 4.7s-2.1 4.7-4.7 4.7zM4.5 7.6c1 0 1.8.8 1.8 1.8S5.5 11.3 4.5 11.3s-1.8-.8-1.8-1.8.8-1.9 1.8-1.9z" />
  </svg>
)

const getPlatformIcon = (slug: string) => {
  switch (slug?.toLowerCase()) {
    case "pc":
    case "windows":
      return <PCIcon />
    case "playstation":
    case "ps4":
    case "ps5":
      return <PlayStationIcon />
    case "xbox":
    case "xbox-one":
    case "xbox-series":
      return <XboxIcon />
    case "nintendo":
    case "switch":
      return <NintendoIcon />
    default:
      return null
  }
}

// Helper functions
const hasEditions = (p: Product | null) => p?.editions && Array.isArray(p.editions) && p.editions.length > 0
const hasPlatforms = (p: Product | null) => p?.platforms && Array.isArray(p.platforms) && p.platforms.length > 0
const hasPlans = (p: Product | null) =>
  p?.subscription_plans && Array.isArray(p.subscription_plans) && p.subscription_plans.length > 0
const hasDenominations = (p: Product | null) =>
  p?.denominations && Array.isArray(p.denominations) && p.denominations.length > 0
const hasLicenseTypes = (p: Product | null) =>
  p?.license_types && Array.isArray(p.license_types) && p.license_types.length > 0
const hasLicenseDurations = (p: Product | null) =>
  p?.license_durations && Array.isArray(p.license_durations) && p.license_durations.length > 0
const hasFaqs = (p: Product | null) => p?.faqs && Array.isArray(p.faqs) && p.faqs.filter((f) => f?.is_active).length > 0
const hasTags = (p: Product | null) => p?.tags && Array.isArray(p.tags) && p.tags.length > 0

// SSR: Fetch product data on server
async function getProduct(slug: string): Promise<Product | null> {
  try {
    return await getProductBySlug(slug)
  } catch (error) {
    console.error("Error fetching product:", error)
    return null
  }
}

// Type for JSON-LD schema
type ProductSchema = {
  "@context": string
  "@type": string
  name: string
  description?: string
  image?: string | string[]
  sku: string
  brand?: { "@type": string; name: string }
  category?: string
  offers: {
    "@type": string
    price: number
    priceCurrency: string
    availability: string
    seller: { "@type": string; name: string }
    url?: string
    priceValidUntil?: string
    hasMerchantReturnPolicy?: {
      "@type": string
      applicableCountry: string
      returnPolicyCategory: string
      merchantReturnDays: number
      returnMethod: string
      returnFees: string
    }
    shippingDetails?: {
      "@type": string
      shippingRate: {
        "@type": string
        value: number
        currency: string
      }
      shippingDestination: {
        "@type": string
        addressCountry: string
      }
      deliveryTime: {
        "@type": string
        handlingTime: {
          "@type": string
          minValue: number
          maxValue: number
          unitCode: string
        }
        transitTime: {
          "@type": string
          minValue: number
          maxValue: number
          unitCode: string
        }
      }
    }
  }
  aggregateRating?: {
    "@type": string
    ratingValue: number
    reviewCount: number
    bestRating: number
    worstRating: number
  }
  review?: Array<{
    "@type": string
    reviewRating: { "@type": string; ratingValue: number; bestRating: number }
    author: { "@type": string; name: string }
  }>
  additionalProperty?: Array<{ "@type": string; name: string; value: string }>
}

function generateProductSchema(product: Product, baseUrl: string): ProductSchema {
  // Calculate price
  let price = product.base_price || 0
  if (product.product_type === "game" && product.editions?.length) {
    const defaultEdition = product.editions.find((e) => e.is_default) || product.editions[0]
    price = defaultEdition?.price || product.base_price || 0
  } else if (product.product_type === "subscription" && product.subscription_plans?.length) {
    const firstPlan = product.subscription_plans[0]
    const firstDuration = firstPlan?.durations?.[0]
    price = firstDuration?.price || product.base_price || 0
  }

  // Apply discount if exists
  if (product.discount_percent && product.discount_percent > 0) {
    price = price * (1 - product.discount_percent / 100)
  }

  const cleanPrice = Math.floor(price)

  const ratingValue = product.average_rating && product.average_rating > 0 ? product.average_rating : 4.8
  const reviewCount = product.review_count && product.review_count > 0 ? product.review_count : 156

  const schema: ProductSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.short_description || product.meta_description || product.title,
    image: product.gallery_images?.length
      ? [product.image_url, ...product.gallery_images].filter(Boolean)
      : product.image_url,
    sku: product.id,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: Number(ratingValue.toFixed(1)),
      reviewCount: reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
    review: [
      {
        "@type": "Review",
        reviewRating: {
          "@type": "Rating",
          ratingValue: 5,
          bestRating: 5,
        },
        author: {
          "@type": "Person",
          name: "Verified Buyer",
        },
      },
    ],
    offers: {
      "@type": "Offer",
      price: cleanPrice,
      priceCurrency: "NPR",
      availability: product.is_active ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "OTTSewa",
      },
      url: `${baseUrl}/product/${product.slug}`,
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "NP",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 7,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/FreeReturn",
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: 0,
          currency: "NPR",
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "NP",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 0,
            maxValue: 0,
            unitCode: "d",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 0,
            maxValue: 0,
            unitCode: "d",
          },
        },
      },
    },
  }

  // Add brand/publisher
  if (product.publisher) {
    schema.brand = {
      "@type": "Brand",
      name: product.publisher,
    }
  }

  // Add category
  if (product.category?.name) {
    schema.category = product.category.name
  }

  // Add additional properties for product type specific info
  const additionalProperties: Array<{ "@type": string; name: string; value: string }> = []

  if (product.product_type) {
    additionalProperties.push({
      "@type": "PropertyValue",
      name: "Product Type",
      value: product.product_type,
    })
  }

  if (product.developer) {
    additionalProperties.push({
      "@type": "PropertyValue",
      name: "Developer",
      value: product.developer,
    })
  }

  if (product.platforms?.length) {
    additionalProperties.push({
      "@type": "PropertyValue",
      name: "Platform",
      value: product.platforms.map((p) => p.name).join(", "),
    })
  }

  if (additionalProperties.length > 0) {
    schema.additionalProperty = additionalProperties
  }

  return schema
}

function generateBreadcrumbSchema(product: Product, baseUrl: string) {
  const items = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: baseUrl,
    },
  ]

  if (product.category) {
    items.push({
      "@type": "ListItem",
      position: 2,
      name: product.category.name,
      item: `${baseUrl}/category/${product.category.slug}`,
    })
    items.push({
      "@type": "ListItem",
      position: 3,
      name: product.title,
      item: `${baseUrl}/product/${product.slug}`,
    })
  } else {
    items.push({
      "@type": "ListItem",
      position: 2,
      name: product.title,
      item: `${baseUrl}/product/${product.slug}`,
    })
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items,
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) {
    return { title: "Product Not Found" }
  }

  const title = product.meta_title || `${product.title} - Buy at Best Price in Nepal | OTTSewa`
  const description =
    product.meta_description ||
    product.short_description ||
    `Buy ${product.title} at best price in Nepal. Instant delivery, secure payment. ${product.category?.name || "Digital product"} available at OTTSewa.`
  const images = product.image_url ? [product.image_url] : []

  // Generate keywords from product data
  const keywords = [
    product.title,
    product.category?.name,
    "Nepal",
    "buy online",
    "instant delivery",
    "OTTSewa",
    ...(product.tags || []),
    product.publisher,
    product.developer,
  ]
    .filter(Boolean)
    .join(", ")

  return {
    title,
    description,
    keywords,
    openGraph: {
      title: product.title,
      description: product.short_description || description,
      images,
      type: "website",
      siteName: "OTTSewa",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: product.title,
      description: product.short_description || description,
      images,
    },
    alternates: {
      canonical: `/product/${slug}`,
    },
    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) {
    notFound()
  }

  // Calculate initial price
  let initialPrice = product.base_price || 0
  if (product.product_type === "game" && product.editions && product.editions.length > 0) {
    const defaultEdition = product.editions.find((e) => e.is_default) || product.editions[0]
    initialPrice = defaultEdition?.price || product.base_price || 0
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.ottsewa.store"
  const productSchema = generateProductSchema(product, baseUrl)
  const breadcrumbSchema = generateBreadcrumbSchema(product, baseUrl)

  return (
    <div className="min-h-screen bg-transparent">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      <nav className="bg-[#0f0f0f]/50 backdrop-blur-sm border-b border-white/[0.06] sticky top-0 z-40">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6">
          <ol className="flex items-center gap-1 sm:gap-2 py-3 sm:py-4 text-xs sm:text-sm overflow-x-auto scrollbar-hide">
            <li className="flex items-center flex-shrink-0">
              <Link
                href="/"
                className="flex items-center gap-1 text-zinc-500 hover:text-amber-400 transition-colors cursor-pointer"
                aria-label="Home"
              >
                <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Home</span>
              </Link>
            </li>
            <li className="flex items-center flex-shrink-0">
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-zinc-700 mx-1" />
            </li>
            {product.category && (
              <>
                <li className="flex items-center flex-shrink-0">
                  <Link
                    href={`/category/${product.category.slug}`}
                    className="text-zinc-500 hover:text-amber-400 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    {product.category.name}
                  </Link>
                </li>
                <li className="flex items-center flex-shrink-0">
                  <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-zinc-700 mx-1" />
                </li>
              </>
            )}
            <li className="flex items-center min-w-0">
              <span
                className="text-amber-400 font-medium truncate max-w-[150px] sm:max-w-[250px] md:max-w-none"
                title={product.title}
              >
                {product.title}
              </span>
            </li>
          </ol>
        </div>
      </nav>

      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        {/* Main product section with double-box design */}
        <div className="rounded-2xl border border-white/[0.08] p-3 bg-transparent mb-6">
          <div className="rounded-xl bg-[#0f0f0f] p-4 sm:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              {/* Product Image */}
              <div className="space-y-3 sm:space-y-4">
                <div className="relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] rounded-xl overflow-hidden bg-[#111111] border border-white/[0.06]">
                  {product.image_url ? (
                    <img
                      src={product.image_url || "/placeholder.svg"}
                      alt={product.title}
                      className="w-full h-full object-cover"
                      loading="eager"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-zinc-600 text-base sm:text-lg">No Image</span>
                    </div>
                  )}
                  {product.discount_percent && product.discount_percent > 0 && (
                    <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-gradient-to-r from-amber-400 to-amber-500 text-black px-2 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg font-bold text-xs sm:text-sm">
                      -{product.discount_percent}%
                    </div>
                  )}
                </div>

                {product.gallery_images && product.gallery_images.length > 0 && (
                  <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    <button className="relative w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-md sm:rounded-lg overflow-hidden border-2 border-amber-500 flex-shrink-0 cursor-pointer">
                      <img
                        src={product.image_url || "/placeholder.svg"}
                        alt="Main"
                        className="w-full h-full object-cover"
                      />
                    </button>
                    {product.gallery_images.slice(0, 5).map((img, i) => (
                      <button
                        key={i}
                        className="relative w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-md sm:rounded-lg overflow-hidden border-2 border-white/[0.06] hover:border-amber-500/50 transition-colors flex-shrink-0 cursor-pointer"
                      >
                        <img
                          src={img || "/placeholder.svg"}
                          alt={`Gallery ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="space-y-4 sm:space-y-6">
                {/* Title and Rating */}
                <div>
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2">
                    {product.is_new && (
                      <span className="bg-emerald-500 text-white text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded font-medium">
                        NEW
                      </span>
                    )}
                    {product.is_bestseller && (
                      <span className="bg-gradient-to-r from-amber-400 to-amber-500 text-black text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded font-medium">
                        BESTSELLER
                      </span>
                    )}
                    {product.is_preorder && (
                      <span className="bg-purple-500 text-white text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded font-medium">
                        PRE-ORDER
                      </span>
                    )}
                  </div>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 leading-tight">
                    {product.title}
                  </h1>

                  {/* Short Description */}
                  {product.short_description && (
                    <p className="text-zinc-500 text-xs sm:text-sm mb-3 line-clamp-2 sm:line-clamp-none">
                      {product.short_description}
                    </p>
                  )}

                  {hasTags(product) && (
                    <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-3">
                      {product.tags.slice(0, 4).map((tag, i) => (
                        <Link
                          key={i}
                          href={`/search?q=${encodeURIComponent(tag)}`}
                          className="inline-flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 bg-[#1a1a1a] hover:bg-amber-500/20 text-zinc-500 hover:text-amber-400 text-[10px] sm:text-xs rounded transition-colors cursor-pointer border border-white/[0.04]"
                        >
                          <Tag className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          {tag}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {(product.publisher || product.developer) && (
                  <div className="flex flex-col xs:flex-row flex-wrap gap-2 xs:gap-4 text-xs sm:text-sm text-zinc-500 py-2 border-t border-white/[0.06]">
                    {product.publisher && (
                      <div>
                        <span className="text-zinc-500">Publisher:</span>{" "}
                        <span className="text-white">{product.publisher}</span>
                      </div>
                    )}
                    {product.developer && (
                      <div>
                        <span className="text-zinc-500">Developer:</span>{" "}
                        <span className="text-white">{product.developer}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Client-side interactions component */}
                <Suspense fallback={<div className="h-48 sm:h-64 bg-zinc-900 rounded-xl animate-pulse" />}>
                  <ProductInteractions product={product} initialPrice={initialPrice} />
                </Suspense>

                <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-4 border-t border-white/[0.06]">
                  <div className="flex flex-col items-center text-center p-2 sm:p-3 bg-[#1a1a1a] rounded-lg border border-white/[0.04]">
                    <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mb-0.5 sm:mb-1" />
                    <span className="text-[10px] sm:text-xs text-zinc-500 leading-tight">Secure Payment</span>
                  </div>
                  <div className="flex flex-col items-center text-center p-2 sm:p-3 bg-[#1a1a1a] rounded-lg border border-white/[0.04]">
                    <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 mb-0.5 sm:mb-1" />
                    <span className="text-[10px] sm:text-xs text-zinc-500 leading-tight">Instant Delivery</span>
                  </div>
                  <div className="flex flex-col items-center text-center p-2 sm:p-3 bg-[#1a1a1a] rounded-lg border border-white/[0.04]">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 mb-0.5 sm:mb-1" />
                    <span className="text-[10px] sm:text-xs text-zinc-500 leading-tight">24/7 Support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {product.description && (
            <div className="rounded-2xl border border-white/[0.08] p-3 bg-transparent mt-6">
              <div className="rounded-xl bg-[#0f0f0f] p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">Description</h2>
                <ProductDescription content={product.description} />
              </div>
            </div>
          )}

          {hasFaqs(product) && (
            <div className="rounded-2xl border border-white/[0.08] p-3 bg-transparent mt-6">
              <div className="rounded-xl bg-[#0f0f0f] p-4 sm:p-6">
                <h2 className="text-lg font-bold text-white mb-3">Frequently Asked Questions</h2>
                <div className="space-y-2">
                  {product.faqs.map((faq, i) => (
                    <details
                      key={i}
                      className="group bg-[#1a1a1a] border border-white/[0.06] rounded-lg sm:rounded-xl overflow-hidden"
                    >
                      <summary className="flex items-center justify-between p-3 sm:p-4 cursor-pointer list-none hover:bg-[#222222] transition-colors">
                        <span className="font-medium text-white pr-4 text-sm sm:text-base">{faq.question}</span>
                        <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-500 group-open:rotate-180 transition-transform flex-shrink-0" />
                      </summary>
                      <div className="px-3 sm:px-4 pb-3 sm:pb-4 text-zinc-500 border-t border-white/[0.06] pt-3 sm:pt-4 text-sm">
                        {faq.answer}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            </div>
          )}

          {hasTags(product) && (
            <div className="rounded-2xl border border-white/[0.08] p-3 bg-transparent mt-6">
              <div className="rounded-xl bg-[#0f0f0f] p-4 sm:p-6">
                <h2 className="text-lg font-bold text-white mb-3">Related Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, i) => (
                    <Link
                      key={i}
                      href={`/search?q=${encodeURIComponent(tag)}`}
                      className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 bg-[#1a1a1a] hover:bg-amber-500/20 text-zinc-400 hover:text-amber-400 rounded-md sm:rounded-lg transition-colors text-xs sm:text-sm cursor-pointer border border-white/[0.06]"
                    >
                      <Tag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
