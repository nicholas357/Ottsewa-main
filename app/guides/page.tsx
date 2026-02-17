import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, BookOpen, Shield, Zap, Smartphone, Users, DollarSign, FileText } from "lucide-react"
import { PageHeader } from "@/components/info-pages/page-header"

export const metadata: Metadata = {
  title: "Streaming Guides & Tutorials | OTTSewa - Netflix, Spotify, Disney+ Guides",
  description:
    "Comprehensive guides and tutorials for streaming services in Nepal. Learn about Netflix plans, pricing, features, and how to buy subscriptions. Expert guides for all major streaming platforms.",
  keywords: [
    "streaming guides Nepal",
    "Netflix guide Nepal",
    "streaming tutorial",
    "how to buy subscriptions",
    "streaming services comparison",
    "Netflix pricing guide",
    "Spotify guide Nepal",
    "Disney+ Nepal",
    "streaming platform reviews",
  ],
  authors: [{ name: "OTTSewa", url: "https://www.ottsewa.store" }],
  creator: "OTTSewa",
  publisher: "OTTSewa",
  metadataBase: new URL("https://www.ottsewa.store"),
  alternates: {
    canonical: "/guides",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.ottsewa.store/guides",
    siteName: "OTTSewa",
    title: "Streaming Guides & Tutorials | OTTSewa",
    description: "Expert guides for Netflix, Spotify, Disney+, and more streaming services in Nepal.",
    images: [
      {
        url: "/og-guides.png",
        width: 1200,
        height: 630,
        alt: "OTTSewa Streaming Guides",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Streaming Guides & Tutorials",
    description: "Complete guides for all your favorite streaming services in Nepal.",
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

const guides = [
  {
    title: "Netflix in Nepal 2026 - Complete Guide Starting Rs. 350",
    description:
      "Explore Netflix subscription plans in Nepal 2026, pricing from Rs. 350, features, 4K quality, family sharing, and how to buy. Compare Mobile, Basic, Standard, Premium plans.",
    href: "/netflix-in-nepal",
    icon: "🎬",
    category: "Streaming Platform",
    readTime: "12 min",
    featured: true,
    topics: ["Plans", "Pricing Rs. 350", "4K Features", "How to Buy"],
  },
  {
    title: "How to Buy Subscriptions - Step by Step Guide",
    description:
      "Complete guide on how to purchase digital subscriptions from OTTSewa. Learn about payment methods, delivery, and setup process.",
    href: "/how-it-works",
    icon: "✅",
    category: "How-To",
    readTime: "5 min",
    featured: true,
    topics: ["Payment", "Delivery", "Setup", "Support"],
  },
  {
    title: "Choosing the Right Streaming Plan",
    description:
      "Learn how to choose the perfect streaming subscription plan based on your needs, budget, and viewing preferences.",
    href: "/netflix-in-nepal",
    icon: "💡",
    category: "Tips & Tricks",
    readTime: "8 min",
    featured: false,
    topics: ["Plans Comparison", "Budget Tips", "Features"],
  },
  {
    title: "Family Account Setup & Sharing",
    description:
      "Guide on setting up family accounts on streaming platforms and safely sharing access with multiple family members.",
    href: "/netflix-in-nepal",
    icon: "👨‍👩‍👧‍👦",
    category: "Tips & Tricks",
    readTime: "7 min",
    featured: false,
    topics: ["Account Setup", "Family Sharing", "Profiles"],
  },
  {
    title: "Best Netflix Original Content to Watch",
    description:
      "Curated list of must-watch Netflix original series and movies across different genres and preferences.",
    href: "/netflix-in-nepal",
    icon: "⭐",
    category: "Recommendations",
    readTime: "10 min",
    featured: false,
    topics: ["Netflix Originals", "Recommendations", "Genres"],
  },
  {
    title: "Streaming Services Comparison: Netflix vs Competitors",
    description:
      "Detailed comparison between Netflix, Prime Video, Disney+, and other streaming platforms in Nepal. Features, pricing, and content comparison.",
    href: "/netflix-in-nepal",
    icon: "🎯",
    category: "Comparison",
    readTime: "15 min",
    featured: false,
    topics: ["Netflix", "Prime Video", "Disney+", "Pricing"],
  },
  {
    title: "Maximize Your Streaming Experience",
    description:
      "Tips and tricks to get the most out of your streaming subscription including offline downloads, 4K streaming, and personalization.",
    href: "/netflix-in-nepal",
    icon: "🚀",
    category: "Tips & Tricks",
    readTime: "9 min",
    featured: false,
    topics: ["4K Streaming", "Downloads", "Customization"],
  },
  {
    title: "Internet Speed Requirements for Different Streaming Quality",
    description:
      "Comprehensive guide on internet speed needed for 480p, 720p, 1080p, and 4K streaming. Ensure smooth playback without buffering.",
    href: "/netflix-in-nepal",
    icon: "📡",
    category: "Technical",
    readTime: "6 min",
    featured: false,
    topics: ["Internet Speed", "Quality", "Buffering"],
  },
]

const categories = [
  { name: "Streaming Platform", count: 1, icon: "🎬" },
  { name: "How-To", count: 1, icon: "✅" },
  { name: "Tips & Tricks", count: 3, icon: "💡" },
  { name: "Recommendations", count: 1, icon: "⭐" },
  { name: "Comparison", count: 1, icon: "🎯" },
  { name: "Technical", count: 1, icon: "📡" },
]

const schemaData = {
  "@context": "https://schema.org",
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
      name: "Guides",
      item: "https://www.ottsewa.store/guides",
    },
  ],
}

export default function GuidesPage() {
  const featuredGuides = guides.filter((g) => g.featured)
  const otherGuides = guides.filter((g) => !g.featured)

  return (
    <div className="min-h-screen bg-transparent">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} suppressHydrationWarning />

      <PageHeader
        title="Streaming Guides & Tutorials"
        description="Expert guides to help you get the most out of streaming services. Learn about plans, pricing, features, and how to use different platforms."
        badge="Guides & Tutorials"
      >
        <div className="mt-8">
          <Link
            href="/category"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold px-8 py-3 rounded-lg transition-all shadow-lg shadow-amber-500/20"
          >
            <Zap className="w-5 h-5" />
            Browse Products
          </Link>
        </div>
      </PageHeader>

      {/* Featured Guides */}
      {featuredGuides.length > 0 && (
        <section className="py-16 border-b border-white/[0.05]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-12">Featured Guides</h2>

            <div className="grid md:grid-cols-2 gap-6">
              {featuredGuides.map((guide) => (
                <Link
                  key={guide.title}
                  href={guide.href}
                  className="group bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/[0.08] hover:border-amber-500/30 rounded-2xl p-8 transition-all hover:shadow-lg hover:shadow-amber-500/10"
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-4xl">{guide.icon}</span>
                    <span className="text-xs font-semibold text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full">
                      {guide.category}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-amber-400 transition-colors">
                    {guide.title}
                  </h3>

                  <p className="text-gray-400 mb-6 line-clamp-2">{guide.description}</p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{guide.readTime} read</span>
                    <ArrowRight className="w-5 h-5 text-amber-500 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Categories Filter */}
      <section className="py-12 border-b border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-sm font-semibold text-gray-400 mb-6 uppercase tracking-wider">Browse by Category</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <div
                key={cat.name}
                className="bg-[#1a1a1a] border border-white/[0.05] hover:border-white/[0.1] rounded-xl p-4 text-center transition-all cursor-pointer group"
              >
                <div className="text-2xl mb-2">{cat.icon}</div>
                <p className="text-xs text-gray-300 font-medium mb-1">{cat.name}</p>
                <p className="text-xs text-gray-500">{cat.count} guide{cat.count !== 1 ? "s" : ""}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Guides */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-12">All Guides</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherGuides.map((guide) => (
              <Link
                key={guide.title}
                href={guide.href}
                className="group bg-[#1a1a1a] border border-white/[0.05] hover:border-white/[0.1] rounded-xl p-6 transition-all hover:bg-[#222222]"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl">{guide.icon}</span>
                  <span className="text-xs font-semibold text-amber-500/60 group-hover:text-amber-500">{guide.category}</span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-amber-400 transition-colors line-clamp-2">
                  {guide.title}
                </h3>

                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{guide.description}</p>

                <div className="flex items-center justify-between pt-4 border-t border-white/[0.05]">
                  <div className="flex flex-wrap gap-1">
                    {guide.topics.slice(0, 2).map((topic) => (
                      <span key={topic} className="text-xs text-gray-500 bg-white/[0.05] px-2 py-1 rounded">
                        {topic}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-gray-500 flex-shrink-0">{guide.readTime}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-amber-500/5 border-y border-amber-500/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Have Questions?</h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Can't find what you're looking for? Check out our comprehensive FAQ or get in touch with our support team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/faq"
              className="inline-flex items-center justify-center gap-2 bg-[#1a1a1a] hover:bg-[#222222] text-white font-semibold px-8 py-3 rounded-lg transition-all"
            >
              <FileText className="w-5 h-5" />
              View FAQ
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold px-8 py-3 rounded-lg transition-all shadow-lg shadow-amber-500/20"
            >
              <Users className="w-5 h-5" />
              Contact Support
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
