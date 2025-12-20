import HeroBanner from "@/components/hero-banner"
import CategoryIcons from "@/components/category-icons"
import RecommendedSection from "@/components/recommended-section"
import TrustSection from "@/components/trust-section"
import ProductTagsSEO from "@/components/product-tags-seo"

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "OTTSewa",
  url: "https://ottsewa.store",
  description:
    "Nepal's trusted reseller for Netflix, Spotify, Disney+, YouTube Premium and more streaming subscriptions. Genuine codes, instant delivery, best prices.",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://ottsewa.store/search?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
  publisher: {
    "@type": "Organization",
    name: "OTTSewa",
    url: "https://ottsewa.store",
    logo: {
      "@type": "ImageObject",
      url: "https://ottsewa.store/logo.png",
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
  url: "https://ottsewa.store",
  logo: "https://ottsewa.store/logo.png",
  description:
    "Nepal's leading destination for premium streaming subscriptions. Genuine codes for Netflix, Amazon Prime Video, HBO Max, JioHotstar, Disney+, Spotify and more.",
  address: {
    "@type": "PostalAddress",
    addressCountry: "NP",
    addressLocality: "Kathmandu",
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
  url: "https://ottsewa.store",
  description: "Nepal's trusted digital marketplace for streaming subscriptions and gift cards",
  priceRange: "NPR 100 - NPR 50000",
  currenciesAccepted: "NPR",
  paymentAccepted: "eSewa, Khalti, Bank Transfer, Credit Card",
  address: {
    "@type": "PostalAddress",
    addressCountry: "NP",
    addressLocality: "Kathmandu",
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    opens: "00:00",
    closes: "23:59",
  },
}

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(storeJsonLd) }} />

      <main className="min-h-screen bg-black" aria-label="OTTSewa Home - Digital Subscriptions & Gift Cards Nepal">
        <HeroBanner />
        <CategoryIcons />
        <RecommendedSection />
        <ProductTagsSEO />
        <TrustSection />
      </main>
    </>
  )
}
