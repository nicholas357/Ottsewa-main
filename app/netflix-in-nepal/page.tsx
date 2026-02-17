import type { Metadata } from "next"
import Link from "next/link"
import { Play, Check, Globe, Zap, Users, DollarSign, Shield, Clock, Smartphone, Tv, Film, Headphones } from "lucide-react"
import { PageHeader } from "@/components/info-pages/page-header"
import { SectionCard } from "@/components/info-pages/section-card"
import { QuickLinks } from "@/components/info-pages/quick-links"

export const metadata: Metadata = {
  title: "Netflix in Nepal 2026 - Price, Plans, Best Deal Starting Rs. 350 | OTTSewa",
  description:
    "Netflix in Nepal 2026 - Complete guide to Netflix pricing in Nepal starting from Rs. 350. Compare Netflix plans: Mobile, Basic, Standard, Premium with instant delivery. Netflix 4K Ultra HD, HD, streaming quality, multiple screens. How to buy Netflix in Nepal with OTTSewa.",
  keywords: [
    "Netflix Nepal 2026",
    "Netflix price Nepal",
    "Netflix plans Nepal 2026",
    "Netflix subscription Nepal",
    "Netflix 4K Nepal",
    "Netflix Premium Nepal Rs.",
    "Netflix Basic plan Nepal",
    "Netflix Standard plan Nepal",
    "Netflix Mobile plan Nepal Rs. 350",
    "Netflix cost Nepal NPR",
    "Netflix streaming Nepal",
    "best Netflix plan Nepal",
    "Netflix account Nepal subscription",
    "Netflix in Nepal buy",
    "Netflix subscription cost Nepal",
    "Netflix delivery Nepal instant",
    "Netflix price Rs. 350 Nepal",
    "Netflix HD quality Nepal",
    "Netflix 4K ultra HD Nepal",
    "Netflix two screens Nepal",
    "Netflix four screens Nepal",
    "Netflix download content Nepal",
    "Netflix family sharing Nepal",
    "Netflix payment methods Nepal eSewa Khalti",
    "buy Netflix online Nepal",
    "Netflix subscription discount Nepal",
    "Netflix best deal Nepal",
    "Netflix streaming quality Nepal",
    "Netflix watch offline Nepal",
    "Netflix original content Nepal",
  ],
  authors: [{ name: "OTTSewa", url: "https://www.ottsewa.store" }],
  creator: "OTTSewa",
  publisher: "OTTSewa",
  metadataBase: new URL("https://www.ottsewa.store"),
  alternates: {
    canonical: "/netflix-in-nepal",
  },
  openGraph: {
    type: "article",
    locale: "en_US",
    url: "https://www.ottsewa.store/netflix-in-nepal",
    siteName: "OTTSewa",
    title: "Netflix in Nepal 2026 - Price, Plans, Pricing Starting Rs. 350",
    description:
      "Netflix in Nepal 2026 - Complete guide with pricing starting from Rs. 350, plan comparison, 4K quality, instant delivery. Buy Netflix subscription code now on OTTSewa.",
    images: [
      {
        url: "/og-netflix-nepal.png",
        width: 1200,
        height: 630,
        alt: "Netflix in Nepal 2026 - Plans, Pricing & Subscription Guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Netflix in Nepal 2026 - From Rs. 350 | Instant Delivery",
    description: "Netflix pricing in Nepal starting at Rs. 350. Compare plans, get 4K quality, family sharing. Buy instant Netflix codes on OTTSewa.",
    images: ["/og-netflix-nepal.png"],
    creator: "@ottsewa",
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

const netflixPlans = [
  {
    name: "Mobile",
    price: "Rs. 350",
    nprPrice: "NPR 350",
    duration: "1 Month",
    features: [
      "Watch on mobile phones only",
      "Resolution: 480p SD Quality",
      "Single screen at a time",
      "Download content to watch offline",
      "Access to full Netflix library",
      "Ad-supported streaming",
    ],
    best: false,
    availability: "Available in Nepal 2026",
  },
  {
    name: "Basic",
    price: "Rs. 350",
    nprPrice: "NPR 350",
    duration: "1 Month",
    features: [
      "Watch on TV, computer, mobile",
      "Resolution: 720p (HD Quality)",
      "Single screen at a time",
      "Download content to watch offline",
      "Full Netflix library access",
      "No ads included",
    ],
    best: false,
    availability: "Available in Nepal 2026",
  },
  {
    name: "Standard",
    price: "Rs. 499",
    nprPrice: "NPR 499",
    duration: "1 Month",
    features: [
      "Watch on TV, computer, mobile",
      "Resolution: 1080p (Full HD Quality)",
      "Two screens at the same time",
      "Download content for offline viewing",
      "Full Netflix library access",
      "Group watch & screen sharing feature",
    ],
    best: true,
    availability: "Most Popular in Nepal 2026",
  },
  {
    name: "Premium",
    price: "Rs. 999",
    nprPrice: "NPR 999",
    duration: "1 Month",
    features: [
      "Watch on TV, computer, mobile",
      "Resolution: 4K Ultra HD Quality",
      "Four screens simultaneously",
      "Download unlimited content",
      "Full Netflix library access",
      "Group watch & screen sharing",
      "Spatial audio & Dolby Atmos support",
      "HDR & HDR10+ content access",
    ],
    best: false,
    availability: "4K Experience Available 2026",
  },
]

const benefits = [
  {
    title: "Instant Streaming",
    description: "Watch thousands of movies, series, and documentaries anytime, anywhere without ads.",
    icon: Play,
  },
  {
    title: "Multiple Screens",
    description: "Watch on different devices simultaneously with Standard and Premium plans.",
    icon: Tv,
  },
  {
    title: "Download & Watch Offline",
    description: "Download your favorite content and enjoy it offline on mobile devices.",
    icon: Smartphone,
  },
  {
    title: "4K Ultra HD Quality",
    description: "Experience premium content in stunning 4K Ultra HD resolution with Premium plan.",
    icon: Film,
  },
  {
    title: "Personalized Recommendations",
    description: "AI-powered recommendations tailored to your viewing preferences and history.",
    icon: Headphones,
  },
  {
    title: "24/7 Customer Support",
    description: "Dedicated support team available round the clock to assist with any issues.",
    icon: Clock,
  },
]

const whyNetflix = [
  {
    title: "Largest Content Library",
    description:
      "Netflix has one of the largest streaming libraries with thousands of movies, TV series, documentaries, stand-up comedy, and original content. New content is added daily.",
  },
  {
    title: "Original Content",
    description:
      "Exclusive Netflix originals like Stranger Things, The Crown, Bridgerton, Money Heist, and many more award-winning shows and movies available only on Netflix.",
  },
  {
    title: "Quality & Performance",
    description:
      "Netflix offers superior streaming quality with adaptive bitrate technology ensuring smooth playback. Support for 4K HDR content provides the best visual experience.",
  },
  {
    title: "User-Friendly Interface",
    description:
      "Easy-to-navigate interface with personalized recommendations, watch history, and smart search. Seamless experience across all devices and platforms.",
  },
  {
    title: "Family-Friendly Options",
    description:
      "Netflix offers Kids profile with parental controls, ensuring safe entertainment for children. Content is organized by age groups and genres.",
  },
  {
    title: "Global Availability",
    description:
      "Netflix is available in 190+ countries with local content, subtitles, and dubbed versions. Consistent experience worldwide with same high standards.",
  },
]

const faqItems = [
  {
    q: "Is Netflix available and working in Nepal 2026?",
    a: "Yes, Netflix is fully available and working in Nepal 2026. You can subscribe directly from Nepal using local payment methods like eSewa, Khalti, bank transfer, or purchase from authorized resellers like OTTSewa for instant delivery of subscription codes.",
  },
  {
    q: "What is the Netflix price in Nepal - Complete pricing breakdown?",
    a: "Netflix pricing in Nepal 2026: Mobile plan starts at Rs. 350/month (480p single screen), Basic at Rs. 350/month (720p HD single screen), Standard at Rs. 499/month (1080p Full HD two screens), Premium at Rs. 999/month (4K Ultra HD four screens). Prices subject to change.",
  },
  {
    q: "Can I share Netflix account with family members?",
    a: "Yes, Netflix allows family account sharing. Standard plan (Rs. 499) allows 2 simultaneous screens, Premium plan (Rs. 999) allows 4 screens at same time. Create up to 5 profiles per account. Each family member gets separate viewing history and personalized recommendations.",
  },
  {
    q: "How to buy Netflix in Nepal with instant delivery?",
    a: "Buy Netflix through OTTSewa for instant delivery. Choose your preferred plan (Mobile, Basic, Standard, Premium), make payment via eSewa, Khalti, or bank transfer, and get genuine Netflix subscription code delivered instantly. Activate code to start streaming.",
  },
  {
    q: "What payment methods work for Netflix in Nepal?",
    a: "Netflix and OTTSewa in Nepal accept multiple local payment methods: eSewa, Khalti, Visa, Mastercard, debit card, bank transfer, and FonePay. Choose the most convenient payment option for buying Netflix subscription.",
  },
  {
    q: "Can I download Netflix content to watch offline?",
    a: "Yes, all Netflix plans support downloading movies, series, and content to watch offline on mobile devices. Downloaded content is available for 30 days. Perfect for watching on flights or without internet.",
  },
  {
    q: "Is Netflix 4K Ultra HD available in Nepal?",
    a: "Yes, Netflix Premium 4K plan is available in Nepal for Rs. 999/month. Enjoy movies and series in 4K Ultra HD resolution with HDR support. Requires Premium plan, 4K compatible device, and high-speed internet (25 Mbps+).",
  },
  {
    q: "How many profiles can I create on one Netflix account?",
    a: "Netflix allows creating up to 5 profiles per account. Each profile maintains separate viewing history, watchlist, recommendations, and parental controls. Perfect for family members to have personalized Netflix experience.",
  },
]

const quickLinks = [
  { title: "Browse Products", description: "See all Netflix plans", href: "/category", icon: null },
  { title: "How It Works", description: "Complete purchase guide", href: "/how-it-works", icon: null },
  { title: "FAQs", description: "Common questions", href: "/faq", icon: null },
  { title: "Contact Support", description: "Get help anytime", href: "/contact", icon: null },
]

// Schema.org structured data
const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Netflix in Nepal 2026 - Price, Plans, Best Deal Starting Rs. 350",
  description: "Complete guide to Netflix in Nepal 2026 including pricing from Rs. 350, plans comparison (Mobile, Basic, Standard, Premium), 4K features, and how to buy with instant delivery.",
  image: ["/og-netflix-nepal.png"],
  datePublished: "2024-01-15",
  dateModified: new Date().toISOString(),
  author: {
    "@type": "Organization",
    name: "OTTSewa",
    url: "https://www.ottsewa.store",
  },
  publisher: {
    "@type": "Organization",
    name: "OTTSewa",
    logo: {
      "@type": "ImageObject",
      url: "https://www.ottsewa.store/logo.png",
      width: 512,
      height: 512,
    },
  },
}

const productJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: netflixPlans.map((plan, index) => ({
    "@type": "Product",
    position: index + 1,
    name: `Netflix ${plan.name} Plan`,
    description: `Netflix ${plan.name} streaming plan with ${plan.features.length} features`,
    offers: {
      "@type": "Offer",
      price: plan.nprPrice,
      priceCurrency: "NPR",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "OTTSewa",
        url: "https://www.ottsewa.store",
      },
    },
  })),
}

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
}

export default function NetflixNepalPage() {
  return (
    <div className="min-h-screen bg-transparent">
      {/* Schema.org markup */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} suppressHydrationWarning />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} suppressHydrationWarning />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} suppressHydrationWarning />

      {/* Page Header */}
      <PageHeader
        title="Netflix in Nepal 2026 - Complete Guide to Plans, Pricing & Subscription Starting Rs. 350"
        description="Netflix in Nepal 2026 - Complete guide to Netflix subscription plans, pricing from Rs. 350, features, 4K quality, and how to buy Netflix online instantly. Compare Mobile, Basic, Standard, Premium plans with family sharing options and instant delivery by OTTSewa."
        badge="Netflix in Nepal 2026"
      >
        <div className="mt-8 flex gap-3 flex-wrap">
          <Link
            href="/category?search=netflix"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold px-8 py-3 rounded-lg transition-all shadow-lg shadow-amber-500/20"
          >
            <Play className="w-5 h-5" />
            Buy Netflix at Rs. 350
          </Link>
          <Link
            href="#plans"
            className="inline-flex items-center gap-2 border border-amber-500/30 hover:border-amber-500/60 text-amber-400 font-semibold px-8 py-3 rounded-lg transition-all"
          >
            View All Plans
          </Link>
        </div>
      </PageHeader>

      {/* Quick Overview */}
      <section className="py-12 border-b border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">About Netflix in Nepal 2026</h2>
              <p className="text-gray-300 mb-4 leading-relaxed">
                Netflix is the world's leading entertainment and streaming platform with a massive library of thousands of movies, TV series, documentaries, stand-up comedy shows, and award-winning Netflix original content. In Nepal, Netflix offers multiple subscription plans starting from just Rs. 350 with instant streaming, offline download to watch content anytime, and support for multiple devices and screens.
              </p>
              <p className="text-gray-300 mb-4 leading-relaxed">
                With over 200 million subscribers worldwide, Netflix dominates the streaming industry with exclusive Netflix originals, award-winning shows, and an ever-growing library of quality entertainment suitable for families, kids, and all age groups. Netflix Nepal subscription is available for instant delivery through OTTSewa.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Whether you're looking for the latest movies, classic TV series, premium 4K ultra HD content, or exclusive Netflix originals like Stranger Things and The Crown, there's something for everyone at affordable Netflix prices starting from Rs. 350 per month.
              </p>
            </div>
            <div className="space-y-4">
              <div className="bg-[#1a1a1a] border border-amber-500/20 hover:border-amber-500/40 rounded-xl p-6 transition-all">
                <div className="flex items-start gap-3 mb-4">
                  <Globe className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-white font-semibold mb-1">Global Streaming Platform</h3>
                    <p className="text-gray-400 text-sm">Netflix available in 190+ countries including Nepal with local payment</p>
                  </div>
                </div>
              </div>
              <div className="bg-[#1a1a1a] border border-amber-500/20 hover:border-amber-500/40 rounded-xl p-6 transition-all">
                <div className="flex items-start gap-3 mb-4">
                  <Users className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-white font-semibold mb-1">200M+ Global Subscribers</h3>
                    <p className="text-gray-400 text-sm">Millions trust Netflix for quality entertainment streaming</p>
                  </div>
                </div>
              </div>
              <div className="bg-[#1a1a1a] border border-amber-500/20 hover:border-amber-500/40 rounded-xl p-6 transition-all">
                <div className="flex items-start gap-3 mb-4">
                  <Zap className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-white font-semibold mb-1">Instant Delivery in Nepal</h3>
                    <p className="text-gray-400 text-sm">Buy Netflix and get access immediately via OTTSewa</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Netflix Plans Comparison */}
      <section id="plans" className="py-16 border-b border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-2">Netflix Plans & Pricing in Nepal 2026</h2>
            <p className="text-amber-400/80 text-sm font-semibold mb-4">Starting from Rs. 350</p>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Choose the perfect Netflix plan for your viewing needs in Nepal. All subscription plans include access to our full Netflix library with thousands of movies, series, and originals. New content added daily.
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.08] p-3">
            <div className="bg-[#0f0f0f] rounded-xl p-4">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {netflixPlans.map((plan) => (
                  <div
                    key={plan.name}
                    className={`relative border rounded-xl p-6 transition-all ${
                      plan.best
                        ? "border-amber-500/60 bg-gradient-to-br from-amber-500/10 to-transparent"
                        : "border-white/[0.05] bg-[#1a1a1a] hover:border-amber-500/30"
                    }`}
                  >
                    {plan.best && (
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-black px-4 py-1 rounded-full text-xs font-semibold shadow-lg shadow-amber-500/30">
                          BEST VALUE ✨
                        </span>
                      </div>
                    )}

                    <h3 className="text-lg font-bold text-white mb-1">{plan.name} Plan</h3>
                    <p className="text-xs text-amber-400/70 font-semibold mb-4">{plan.availability}</p>

                    <div className="mb-6 p-3 bg-black/30 rounded-lg">
                      <p className="text-3xl font-bold text-amber-400 mb-1">{plan.price}</p>
                      <p className="text-xs text-gray-400">{plan.duration} subscription</p>
                    </div>

                    <div className="space-y-2 mb-6">
                      {plan.features.map((feature) => (
                        <div key={feature} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Link
                      href="/category?search=netflix"
                      className={`block text-center py-2.5 rounded-lg font-semibold transition-all w-full ${
                        plan.best
                          ? "bg-gradient-to-r from-amber-500 to-amber-600 text-black hover:from-amber-400 hover:to-amber-500 shadow-lg shadow-amber-500/20"
                          : "bg-white/10 text-white hover:bg-white/20 border border-white/10"
                      }`}
                    >
                      Buy {plan.name} Plan
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <p className="text-center text-gray-400 text-sm mt-8">
            Netflix prices in Nepal 2026 are shown in Nepali Rupees (NPR). Standard Netflix plan starting from Rs. 350 for Mobile plan, Rs. 350 Basic, Rs. 499 Standard, Rs. 999 Premium. Prices may vary based on promotions. Get instant Netflix delivery on OTTSewa.
          </p>
        </div>
      </section>

      {/* Key Features & Benefits */}
      <section className="py-16 bg-transparent border-b border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Netflix Features & Benefits in Nepal</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Discover the amazing features that make Netflix the world's most popular streaming service. Get instant access with streaming from Rs. 350 plan.
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.08] p-3">
            <div className="bg-[#0f0f0f] rounded-xl p-4">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {benefits.map((benefit) => (
                  <SectionCard
                    key={benefit.title}
                    title={benefit.title}
                    description={benefit.description}
                    icon={benefit.icon}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Netflix */}
      <section className="py-16 border-b border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4 text-center">Why Netflix is the Best Choice in Nepal</h2>
          <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">Learn why millions of Nepali users choose Netflix over other streaming platforms for entertainment, quality, and value.</p>

          <div className="space-y-6">
            {whyNetflix.map((item, idx) => (
              <div key={idx} className="bg-[#1a1a1a] border border-amber-500/20 hover:border-amber-500/40 rounded-xl p-6 transition-all">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-amber-400 font-bold text-sm">{idx + 1}</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                    <p className="text-gray-400">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Get Netflix in Nepal */}
      <section className="py-16 border-b border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4 text-center">How to Buy Netflix in Nepal - Easy 4 Step Process</h2>
          <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">Get Netflix subscription instantly delivered to your account in just 4 simple steps. Fastest way to buy Netflix in Nepal starting from Rs. 350.</p>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                step: "1",
                title: "Choose Netflix Plan",
                description: "Select from Mobile (Rs. 350), Basic (Rs. 350), Standard (Rs. 499), or Premium 4K (Rs. 999) Netflix plans",
              },
              {
                step: "2",
                title: "Make Payment",
                description: "Pay securely using eSewa, Khalti, bank transfer, FonePay, or credit/debit card",
              },
              {
                step: "3",
                title: "Instant Delivery",
                description: "Receive your genuine Netflix subscription code instantly after payment confirmation",
              },
              {
                step: "4",
                title: "Start Streaming",
                description: "Activate Netflix code and enjoy unlimited movies, series, originals in HD/4K quality",
              },
            ].map((item) => (
              <div key={item.step} className="bg-[#1a1a1a] border border-amber-500/20 hover:border-amber-500/40 rounded-xl p-6 text-center transition-all">
                <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-amber-400 font-bold text-lg">{item.step}</span>
                </div>
                <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/how-it-works"
              className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 font-semibold transition-colors"
            >
              View Detailed Netflix Buying Guide →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 border-b border-white/[0.05]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4 text-center">Netflix in Nepal - Frequently Asked Questions</h2>
          <p className="text-center text-gray-400 mb-12">Common questions about Netflix plans, pricing, features, payment methods, and account management in Nepal</p>

          <div className="space-y-4">
            {faqItems.map((item, idx) => (
              <details
                key={idx}
                className="group bg-[#1a1a1a] border border-white/[0.05] rounded-xl hover:border-white/[0.1] transition-all"
              >
                <summary className="flex items-center justify-between cursor-pointer p-6 font-semibold text-white">
                  <span>{item.q}</span>
                  <span className="text-gray-400 group-open:rotate-180 transition-transform">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </span>
                </summary>
                <div className="px-6 pb-6 text-gray-400 border-t border-white/[0.05]">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Content Library Highlight */}
      <section className="py-16 border-b border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#1E1E1E]/30 backdrop-blur-sm border border-amber-500/20 rounded-2xl p-8 sm:p-12">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Netflix Content Library - What's Available</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { category: "Movies", count: "6000+", icon: "🎬" },
                { category: "TV Series", count: "2000+", icon: "📺" },
                { category: "Documentaries", count: "500+", icon: "📚" },
                { category: "Stand-up Comedy", count: "200+", icon: "🎤" },
              ].map((item) => (
                <div key={item.category} className="text-center">
                  <p className="text-4xl mb-2">{item.icon}</p>
                  <p className="text-gray-300 font-semibold mb-1">{item.category}</p>
                  <p className="text-amber-400 font-bold">{item.count}</p>
                </div>
              ))}
            </div>

            <p className="text-center text-gray-400 mt-8">
              Netflix adds new movies, series, documentaries, and originals every day, ensuring there's always something fresh to watch. From award-winning Netflix originals to classic films, find your next favorite entertainment on Netflix Nepal.
            </p>
          </div>
        </div>
      </section>

      {/* Comparison with Other Platforms */}
      <section className="py-16 border-b border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4 text-center">Netflix vs Other Streaming Platforms in Nepal</h2>
          <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">Compare Netflix with Amazon Prime Video, Disney+ and other streaming services available in Nepal</p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#1a1a1a] border-b border-amber-500/20">
                  <th className="px-4 py-3 text-left text-white font-semibold">Feature</th>
                  <th className="px-4 py-3 text-center text-amber-400 font-semibold">Netflix</th>
                  <th className="px-4 py-3 text-center text-white font-semibold">Prime Video</th>
                  <th className="px-4 py-3 text-center text-white font-semibold">Disney+</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {[
                  { feature: "Content Library", netflix: "6000+ Titles", prime: "5000+ Titles", disney: "2000+ Titles" },
                  { feature: "Original Content", netflix: "Excellent", prime: "Good", disney: "Excellent" },
                  { feature: "4K Ultra HD", netflix: "Yes (Premium)", prime: "Yes", disney: "Yes" },
                  { feature: "Offline Download", netflix: "All Plans", prime: "Yes", disney: "Yes" },
                  { feature: "Simultaneous Screens", netflix: "2-4 Screens", prime: "3 Screens", disney: "4 Screens" },
                  { feature: "Starting Price Nepal", netflix: "Rs. 350", prime: "Rs. 399", disney: "Rs. 99" },
                  { feature: "Ad-free Option", netflix: "All Plans", prime: "Premium Only", disney: "Yes" },
                ].map((row, idx) => (
                  <tr key={idx} className="bg-[#0f0f0f]">
                    <td className="px-4 py-3 text-gray-300 font-medium">{row.feature}</td>
                    <td className="px-4 py-3 text-center text-amber-400 font-semibold">{row.netflix}</td>
                    <td className="px-4 py-3 text-center text-gray-400">{row.prime}</td>
                    <td className="px-4 py-3 text-center text-gray-400">{row.disney}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Trust & Security */}
      <section className="py-16 bg-amber-500/5 border-y border-amber-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Why Buy from OTTSewa?</h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: "100% Genuine", desc: "Official Netflix codes only" },
              { icon: Zap, title: "Instant Delivery", desc: "Get access within minutes" },
              { icon: Clock, title: "24/7 Support", desc: "Always here to help you" },
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <item.icon className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-b from-transparent to-amber-500/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Start Streaming Netflix in Nepal?</h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Get your Netflix subscription instantly with OTTSewa. Choose your plan (Rs. 350 to Rs. 999), make payment via eSewa/Khalti/Bank transfer, and start streaming thousands of movies, series, and Netflix originals immediately in Nepal.
          </p>
          <Link
            href="/category?search=netflix"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold px-8 py-4 rounded-lg transition-all shadow-lg shadow-amber-500/30"
          >
            <Play className="w-5 h-5" />
            Get Netflix Now - From Rs. 350
          </Link>
        </div>
      </section>

      {/* Related Links Section */}
      <QuickLinks
        title="Explore More Streaming Services"
        links={[
          { title: "All Products", description: "Browse all available subscriptions", href: "/category", icon: null },
          { title: "How It Works", description: "Learn our process", href: "/how-it-works", icon: null },
          { title: "FAQs", description: "Common questions answered", href: "/faq", icon: null },
          { title: "Contact Us", description: "Get in touch with us", href: "/contact", icon: null },
        ]}
      />
    </div>
  )
}
