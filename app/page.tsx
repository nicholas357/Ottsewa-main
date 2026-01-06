import HeroBanner from "@/components/hero-banner"
import CategoryIcons from "@/components/category-icons"
import RecommendedSection from "@/components/recommended-section"
import TrustSection from "@/components/trust-section"
import ProductTagsSEO from "@/components/product-tags-seo"
import HomeSection from "@/components/home-section"

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
        <HomeSection sectionType="games" title="Games" viewAllLink="/category/games" />
        <HomeSection sectionType="game_currency" title="Game Currency" viewAllLink="/category/game-currency" />
        <ProductTagsSEO />
        <TrustSection />
      </main>
    </>
  )
}
