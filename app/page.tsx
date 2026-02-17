import HeroBanner from "@/components/hero-banner"
import CategoryIcons from "@/components/category-icons"
import RecommendedSection from "@/components/recommended-section"
import TrustSection from "@/components/trust-section"
import ProductTagsSEO from "@/components/product-tags-seo"

export const revalidate = 60

async function getBanners() {
  const emptyBanners = { main: [], side: [] }

  try {
    // Dynamic import to prevent build-time initialization errors
    const { createClient } = await import("@supabase/supabase-js")

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.warn("[SSG] Missing Supabase env vars, returning empty banners")
      return emptyBanners
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    const { data: banners, error } = await supabase
      .from("hero_banners")
      .select("*, products:product_id(slug), categories:category_id(slug)")
      .eq("is_active", true)
      .order("sort_order")

    if (error) {
      console.error("[SSG] Error fetching banners:", error.message)
      return emptyBanners
    }

    const formatted = (banners || []).map((b) => ({
      ...b,
      product: b.products,
      category: b.categories,
      products: undefined,
      categories: undefined,
    }))

    return {
      main: formatted.filter((b) => b.banner_type === "main"),
      side: formatted.filter((b) => b.banner_type === "side"),
    }
  } catch (error) {
    console.error("[SSG] Unexpected error in getBanners:", error)
    return emptyBanners
  }
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "OTTSewa",
  url: "https://www.ottsewa.store",
  description:
    "Nepal's trusted reseller for Netflix, Spotify, Disney+, YouTube Premium and more streaming subscriptions. Genuine codes, instant delivery, best prices.",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://www.ottsewa.store/search?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
  publisher: {
    "@type": "Organization",
    name: "OTTSewa",
    url: "https://www.ottsewa.store",
    logo: {
      "@type": "ImageObject",
      url: "https://www.ottsewa.store/logo.png",
      width: 512,
      height: 512,
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+977-9869671451",
      contactType: "customer service",
      email: "support@ottsewa.store",
      areaServed: "NP",
      availableLanguage: ["English", "Nepali"],
    },
    sameAs: ["https://facebook.com/ottsewa", "https://instagram.com/ottsewa", "https://twitter.com/ottsewa"],
  },
}

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "OTTSewa",
  url: "https://www.ottsewa.store",
  logo: "https://www.ottsewa.store/logo.png",
  description:
    "Nepal's leading destination for premium streaming subscriptions. Genuine codes for Netflix, Amazon Prime Video, HBO Max, JioHotstar, Disney+, Spotify and more.",
  address: {
    "@type": "PostalAddress",
    addressCountry: "NP",
    addressLocality: "Kathmandu",
    addressRegion: "Bagmati",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+977-9869671451",
    contactType: "customer service",
    email: "support@ottsewa.store",
    availableLanguage: ["English", "Nepali"],
  },
  sameAs: ["https://facebook.com/ottsewa", "https://instagram.com/ottsewa", "https://twitter.com/ottsewa"],
}

const storeJsonLd = {
  "@context": "https://schema.org",
  "@type": "Store",
  name: "OTTSewa",
  url: "https://www.ottsewa.store",
  description: "Nepal's trusted digital marketplace for streaming subscriptions and gift cards",
  priceRange: "NPR 100 - NPR 50000",
  currenciesAccepted: "NPR",
  paymentAccepted: "eSewa, Khalti, Bank Transfer, Credit Card",
  address: {
    "@type": "PostalAddress",
    addressCountry: "NP",
    addressLocality: "Kathmandu",
    addressRegion: "Bagmati",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: "27.7172",
    longitude: "85.3240",
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    opens: "00:00",
    closes: "23:59",
  },
  hasMerchantReturnPolicy: {
    "@type": "MerchantReturnPolicy",
    applicableCountry: "NP",
    returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
    merchantReturnDays: 7,
    returnMethod: "https://schema.org/ReturnByMail",
    returnFees: "https://schema.org/FreeReturn",
    returnPolicySeasonalOverride: {
      "@type": "MerchantReturnPolicySeasonalOverride",
      startDate: "2024-01-01",
      endDate: "2025-12-31",
      merchantReturnDays: 7,
    },
  },
}

const merchantListingJsonLd = {
  "@context": "https://schema.org",
  "@type": "OnlineStore",
  name: "OTTSewa",
  url: "https://www.ottsewa.store",
  description: "Nepal's leading digital store for streaming subscriptions, game codes, and gift cards",
  shippingDetails: {
    "@type": "OfferShippingDetails",
    shippingRate: {
      "@type": "MonetaryAmount",
      value: "0",
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
  hasMerchantReturnPolicy: {
    "@type": "MerchantReturnPolicy",
    applicableCountry: "NP",
    returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
    merchantReturnDays: 7,
    returnMethod: "https://schema.org/ReturnByMail",
    returnFees: "https://schema.org/FreeReturn",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "OTTSewa Products",
    itemListElement: [
      {
        "@type": "OfferCatalog",
        name: "Streaming Subscriptions",
        itemListElement: ["Netflix", "Amazon Prime Video", "Disney+", "HBO Max", "Spotify", "YouTube Premium"],
      },
      {
        "@type": "OfferCatalog",
        name: "Gift Cards",
        itemListElement: ["Steam", "PlayStation", "Xbox", "Google Play", "Apple"],
      },
    ],
  },
}

export default async function Home() {
  let banners = { main: [], side: [] }
  try {
    banners = await getBanners()
  } catch {
    // Silently fail - banners are not critical for SEO
    console.error("[SSG] Failed to load banners, using empty state")
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        suppressHydrationWarning
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        suppressHydrationWarning
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(storeJsonLd) }}
        suppressHydrationWarning
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(merchantListingJsonLd) }}
        suppressHydrationWarning
      />

      <main
        className="min-h-screen bg-transparent"
        aria-label="OTTSewa Home - Digital Subscriptions & Gift Cards Nepal"
      >
        <HeroBanner initialBanners={banners} />
        <CategoryIcons />
        <RecommendedSection />
        
        {/* Netflix in Nepal - Comprehensive Guide Section */}
        <section className="py-16 border-y border-white/[0.05]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Main Featured Card */}
            <div className="mb-12">
              <div className="bg-gradient-to-br from-red-500/15 via-red-600/5 to-transparent border border-red-500/30 rounded-2xl p-8 sm:p-12 overflow-hidden relative">
                <div className="absolute -right-20 -top-20 w-40 h-40 bg-red-500/5 rounded-full blur-3xl" />
                <div className="relative">
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                    <div className="flex-1">
                      <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-full px-4 py-1.5 mb-4">
                        <span className="text-red-400 text-sm font-semibold">🎬 STREAMING GUIDE</span>
                      </div>
                      <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Netflix in Nepal - Complete Guide 2025</h2>
                      <p className="text-gray-300 text-lg leading-relaxed mb-6">
                        Everything you need to know about Netflix in Nepal. Explore subscription plans from Mobile (₹250/month) to Premium 4K (₹1100/month), pricing comparison, features, and how to buy instantly with OTTSewa.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <a 
                          href="/netflix-in-nepal" 
                          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold px-8 py-3 rounded-lg transition-all shadow-lg shadow-red-600/20"
                        >
                          📖 Read Full Guide
                        </a>
                        <a 
                          href="/category?search=netflix" 
                          className="inline-flex items-center justify-center gap-2 border border-red-500/30 hover:border-red-500/60 text-white font-semibold px-8 py-3 rounded-lg transition-all"
                        >
                          🛒 Buy Netflix
                        </a>
                      </div>
                    </div>
                    <div className="text-6xl flex-shrink-0">🎬</div>
                  </div>

                  {/* Quick Info Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-10 pt-10 border-t border-white/[0.05]">
                    {[
                      { label: "Plans", value: "4" },
                      { label: "From", value: "₹250" },
                      { label: "4K Support", value: "Yes" },
                      { label: "Instant", value: "Delivery" },
                    ].map((item) => (
                      <div key={item.label} className="bg-white/[0.05] rounded-lg p-3 text-center">
                        <p className="text-xs text-gray-400 mb-1">{item.label}</p>
                        <p className="text-red-400 font-bold text-sm">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Related Streaming Guides */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-8">More Streaming Guides</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { emoji: "📚", title: "How to Buy Subscriptions", desc: "Step-by-step guide to purchase", href: "/how-it-works", tag: "Guide" },
                  { emoji: "📖", title: "All Streaming Guides", desc: "Explore all our guides", href: "/guides", tag: "Resource" },
                  { emoji: "💡", title: "Streaming Tips & Tricks", desc: "Maximize your experience", href: "/netflix-in-nepal", tag: "Tips" },
                ].map((item) => (
                  <a
                    key={item.title}
                    href={item.href}
                    className="group bg-[#1a1a1a] border border-white/[0.05] hover:border-white/[0.1] rounded-xl p-6 transition-all hover:bg-[#222222]"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-3xl">{item.emoji}</span>
                      <span className="text-xs font-semibold text-amber-500/60 bg-amber-500/10 px-2 py-1 rounded-full">{item.tag}</span>
                    </div>
                    <h4 className="text-lg font-bold text-white group-hover:text-red-400 transition-colors mb-2">{item.title}</h4>
                    <p className="text-gray-400 text-sm">{item.desc}</p>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        <ProductTagsSEO />
        <TrustSection />
      </main>
    </>
  )
}
