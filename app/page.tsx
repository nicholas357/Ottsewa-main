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
    target: "https://ottsewa.store/search?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
  publisher: {
    "@type": "Organization",
    name: "OTTSewa",
    url: "https://ottsewa.store",
    logo: "https://ottsewa.store/logo.png",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+977 9869671451",
      contactType: "customer service",
      email: "support@ottsewa.store",
      areaServed: "NP",
      availableLanguage: ["English", "Nepali"],
    },
    sameAs: ["https://facebook.com/ottsewa", "https://instagram.com/ottsewa", "https://twitter.com/ottsewa"],
  },
}

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

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
