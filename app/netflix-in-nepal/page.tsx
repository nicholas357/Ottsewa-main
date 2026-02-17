import type { Metadata } from "next"
import Link from "next/link"
import { Play, Check, Globe, Zap, Users, DollarSign, Shield, Clock, Smartphone, Tv, Film, Headphones } from "lucide-react"
import { PageHeader } from "@/components/info-pages/page-header"
import { SectionCard } from "@/components/info-pages/section-card"
import { QuickLinks } from "@/components/info-pages/quick-links"

export const metadata: Metadata = {
  title: "Netflix in Nepal - Price, Plans, Best Deal 2025 | OTTSewa",
  description:
    "Netflix in Nepal 2025 - Complete guide to Netflix pricing, plans, benefits, and how to buy. Get the best Netflix plans in Nepal with instant delivery. Netflix 4K, HD, Standard plans at affordable prices with OTTSewa.",
  keywords: [
    "Netflix Nepal",
    "Netflix price Nepal",
    "Netflix plans Nepal 2025",
    "Netflix subscription Nepal",
    "Netflix 4K Nepal",
    "Netflix Premium Nepal",
    "buy Netflix Nepal",
    "Netflix cost Nepal",
    "Netflix streaming Nepal",
    "best Netflix plan Nepal",
    "Netflix account Nepal",
    "Netflix in Nepal",
    "Netflix subscription cost Nepal",
    "Netflix delivery Nepal",
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
    title: "Netflix in Nepal - Price, Plans, Best Deal 2025",
    description:
      "Complete guide to Netflix in Nepal - pricing, plans, features, and how to buy. Get instant delivery of Netflix subscriptions.",
    images: [
      {
        url: "/og-netflix-nepal.png",
        width: 1200,
        height: 630,
        alt: "Netflix in Nepal - OTTSewa",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Netflix in Nepal - Price & Plans",
    description: "Complete guide to Netflix in Nepal with best prices and instant delivery.",
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
    price: "₹149",
    nprPrice: "NPR 250-300",
    features: [
      "Watch on mobile phones",
      "Resolution: 480p",
      "One screen at a time",
      "Download content",
      "Access to all content",
    ],
    best: false,
    availability: "Available in Nepal",
  },
  {
    name: "Basic",
    price: "₹199",
    nprPrice: "NPR 350-400",
    features: [
      "Watch on TV, computer, mobile",
      "Resolution: 720p (HD)",
      "One screen at a time",
      "Download content",
      "Full library access",
    ],
    best: false,
    availability: "Available in Nepal",
  },
  {
    name: "Standard",
    price: "₹499",
    nprPrice: "NPR 750-850",
    features: [
      "Watch on TV, computer, mobile",
      "Resolution: 1080p (Full HD)",
      "Two screens at the same time",
      "Download content",
      "Full library access",
      "Group watch feature",
    ],
    best: true,
    availability: "Most Popular",
  },
  {
    name: "Premium",
    price: "₹649",
    nprPrice: "NPR 950-1100",
    features: [
      "Watch on TV, computer, mobile",
      "Resolution: 4K Ultra HD",
      "Four screens simultaneously",
      "Download content",
      "Full library access",
      "Group watch feature",
      "Spatial audio support",
      "HDR content access",
    ],
    best: false,
    availability: "4K Experience",
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
    q: "Is Netflix available in Nepal?",
    a: "Yes, Netflix is fully available in Nepal. You can subscribe directly from Nepal using local payment methods or purchase from authorized resellers like OTTSewa for instant delivery.",
  },
  {
    q: "What is the price of Netflix in Nepal?",
    a: "Netflix plans in Nepal range from NPR 250-1100 depending on the plan. Mobile plan starts from NPR 250, Basic at NPR 350, Standard at NPR 750-850, and Premium at NPR 950-1100. Prices are subject to change.",
  },
  {
    q: "Can I share Netflix account with family?",
    a: "Netflix allows account sharing with restrictions. Standard plan allows 2 simultaneous screens, Premium allows 4 screens. Each profile has separate viewing history and recommendations.",
  },
  {
    q: "How to buy Netflix in Nepal?",
    a: "You can buy Netflix through OTTSewa with instant delivery using local payment methods like eSewa, Khalti, or bank transfer. We provide genuine subscription codes delivered instantly after payment confirmation.",
  },
  {
    q: "What payment methods work in Nepal?",
    a: "Netflix in Nepal accepts eSewa, Khalti, Visa, Mastercard, and bank transfers. OTTSewa also accepts all these methods with additional local payment options for convenience.",
  },
  {
    q: "Can I download content on Netflix?",
    a: "Yes, all Netflix plans support downloading content to watch offline on mobile devices. Downloaded content is available for 30 days.",
  },
  {
    q: "Is Netflix 4K available in Nepal?",
    a: "Yes, Netflix Premium plan with 4K Ultra HD is available in Nepal. You need a Premium account and 4K-compatible device with high-speed internet (25 Mbps+) for 4K streaming.",
  },
  {
    q: "How many profiles can I create?",
    a: "Netflix allows up to 5 profiles per account. Each profile maintains separate viewing history, watchlist, and recommendations. You can create profiles for family members.",
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
  headline: "Netflix in Nepal - Price, Plans, Best Deal 2025",
  description: "Complete guide to Netflix in Nepal including pricing, plans, features, and how to buy with instant delivery.",
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
        title="Netflix in Nepal - Complete Guide to Plans & Pricing"
        description="Explore Netflix subscription plans available in Nepal with detailed pricing, features comparison, and instant delivery. Get the best Netflix deals with OTTSewa."
        badge="Netflix Guide"
      >
        <div className="mt-8">
          <Link
            href="/category?search=netflix"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold px-8 py-3 rounded-lg transition-all shadow-lg shadow-red-600/20"
          >
            <Play className="w-5 h-5" />
            Buy Netflix Now
          </Link>
        </div>
      </PageHeader>

      {/* Quick Overview */}
      <section className="py-12 border-b border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">About Netflix in Nepal</h2>
              <p className="text-gray-300 mb-4 leading-relaxed">
                Netflix is the world's leading entertainment platform with a library of thousands of movies, TV series, documentaries, stand-up comedy, and original content. In Nepal, Netflix offers multiple subscription plans with instant streaming, offline download, and support for multiple devices.
              </p>
              <p className="text-gray-300 mb-4 leading-relaxed">
                With over 200 million subscribers worldwide, Netflix dominates the streaming industry with award-winning original content and an ever-growing library of entertainment options suitable for all ages.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Whether you're looking for the latest movies, classic TV series, or exclusive Netflix originals, there's something for everyone at an affordable price point.
              </p>
            </div>
            <div className="space-y-4">
              <div className="bg-[#1a1a1a] border border-white/[0.05] rounded-xl p-6">
                <div className="flex items-start gap-3 mb-4">
                  <Globe className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-white font-semibold mb-1">Global Presence</h3>
                    <p className="text-gray-400 text-sm">Available in 190+ countries including Nepal</p>
                  </div>
                </div>
              </div>
              <div className="bg-[#1a1a1a] border border-white/[0.05] rounded-xl p-6">
                <div className="flex items-start gap-3 mb-4">
                  <Users className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-white font-semibold mb-1">200M+ Subscribers</h3>
                    <p className="text-gray-400 text-sm">Trusted by millions worldwide</p>
                  </div>
                </div>
              </div>
              <div className="bg-[#1a1a1a] border border-white/[0.05] rounded-xl p-6">
                <div className="flex items-start gap-3 mb-4">
                  <Zap className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-white font-semibold mb-1">Instant Delivery</h3>
                    <p className="text-gray-400 text-sm">Get access immediately after purchase</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Netflix Plans Comparison */}
      <section className="py-16 border-b border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Netflix Plans in Nepal 2025</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Choose the perfect Netflix plan for your viewing needs. All plans include access to our full library with new content added daily.
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
                        ? "border-red-500/50 bg-[#1a0a0a]"
                        : "border-white/[0.05] bg-[#1a1a1a] hover:border-white/[0.1]"
                    }`}
                  >
                    {plan.best && (
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <span className="bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-1 rounded-full text-xs font-semibold">
                          MOST POPULAR
                        </span>
                      </div>
                    )}

                    <h3 className="text-lg font-bold text-white mb-2">{plan.name}</h3>
                    <p className="text-sm text-gray-400 mb-4">{plan.availability}</p>

                    <div className="mb-6">
                      <p className="text-2xl font-bold text-red-500 mb-1">{plan.nprPrice}</p>
                      <p className="text-xs text-gray-500">per month</p>
                    </div>

                    <div className="space-y-2 mb-6">
                      {plan.features.map((feature) => (
                        <div key={feature} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Link
                      href="/category?search=netflix"
                      className={`block text-center py-2 rounded-lg font-semibold transition-all w-full ${
                        plan.best
                          ? "bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-500 hover:to-red-600"
                          : "bg-[#222222] text-white hover:bg-[#2a2a2a]"
                      }`}
                    >
                      Choose Plan
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <p className="text-center text-gray-400 text-sm mt-8">
            Prices shown are in Nepali Rupees. Actual prices may vary based on current exchange rates and promotional offers. All plans include free trial period (where applicable).
          </p>
        </div>
      </section>

      {/* Key Features & Benefits */}
      <section className="py-16 bg-transparent border-b border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Netflix Features & Benefits</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Discover what makes Netflix the world's most popular streaming platform
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
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Why Netflix is the Best Choice</h2>

          <div className="space-y-6">
            {whyNetflix.map((item, idx) => (
              <div key={idx} className="bg-[#1a1a1a] border border-white/[0.05] rounded-xl p-6 hover:border-white/[0.1] transition-all">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-red-500 font-bold text-sm">{idx + 1}</span>
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
          <h2 className="text-3xl font-bold text-white mb-12 text-center">How to Get Netflix in Nepal</h2>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                step: "1",
                title: "Choose Your Plan",
                description: "Select from Mobile, Basic, Standard, or Premium Netflix plans",
              },
              {
                step: "2",
                title: "Make Payment",
                description: "Pay using eSewa, Khalti, bank transfer, or credit card",
              },
              {
                step: "3",
                title: "Instant Delivery",
                description: "Receive your Netflix subscription code instantly after payment",
              },
              {
                step: "4",
                title: "Start Streaming",
                description: "Use the code to activate Netflix and enjoy unlimited entertainment",
              },
            ].map((item) => (
              <div key={item.step} className="bg-[#1a1a1a] border border-white/[0.05] rounded-xl p-6 text-center hover:border-red-500/30 transition-all">
                <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-red-500 font-bold text-lg">{item.step}</span>
                </div>
                <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/how-it-works"
              className="inline-flex items-center gap-2 text-red-500 hover:text-red-400 font-semibold transition-colors"
            >
              View Detailed Guide →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 border-b border-white/[0.05]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Frequently Asked Questions</h2>

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
          <div className="bg-[#1E1E1E]/30 backdrop-blur-sm border border-zinc-800/30 rounded-2xl p-8 sm:p-12">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">What's On Netflix</h2>

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
                  <p className="text-red-500 font-bold">{item.count}</p>
                </div>
              ))}
            </div>

            <p className="text-center text-gray-400 mt-8">
              Netflix adds new content every day, ensuring there's always something fresh to watch. From award-winning originals to classic films, find your next favorite show.
            </p>
          </div>
        </div>
      </section>

      {/* Comparison with Other Platforms */}
      <section className="py-16 border-b border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Netflix vs Other Streaming Platforms</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#1a1a1a] border-b border-white/[0.05]">
                  <th className="px-4 py-3 text-left text-white font-semibold">Feature</th>
                  <th className="px-4 py-3 text-center text-white font-semibold">Netflix</th>
                  <th className="px-4 py-3 text-center text-white font-semibold">Prime Video</th>
                  <th className="px-4 py-3 text-center text-white font-semibold">Disney+</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {[
                  { feature: "Content Library", netflix: "6000+", prime: "5000+", disney: "2000+" },
                  { feature: "Original Content", netflix: "Excellent", prime: "Good", disney: "Excellent" },
                  { feature: "4K Support", netflix: "Yes", prime: "Yes", disney: "Yes" },
                  { feature: "Offline Download", netflix: "Yes", prime: "Yes", disney: "Yes" },
                  { feature: "Simultaneous Streams", netflix: "2-4", prime: "3", disney: "4" },
                  { feature: "Starting Price", netflix: "₹250", prime: "₹299", disney: "₹99" },
                  { feature: "Ad-free Option", netflix: "All", prime: "Premium", disney: "Yes" },
                ].map((row, idx) => (
                  <tr key={idx} className="bg-[#0f0f0f]">
                    <td className="px-4 py-3 text-gray-300 font-medium">{row.feature}</td>
                    <td className="px-4 py-3 text-center text-white">{row.netflix}</td>
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
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Start Streaming?</h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Get your Netflix subscription instantly with OTTSewa. Choose your plan, make payment, and start streaming thousands of movies and shows immediately.
          </p>
          <Link
            href="/category?search=netflix"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold px-8 py-4 rounded-lg transition-all shadow-lg shadow-red-600/20"
          >
            <Play className="w-5 h-5" />
            Browse Netflix Plans
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
