import type { Metadata } from "next"
import {
  Play,
  Check,
  Globe,
  Users,
  Zap,
  HelpCircle,
  FileText,
  MessageSquare,
  BookOpen,
} from "lucide-react"
import Link from "next/link"
import { PageHeader } from "@/components/info-pages/page-header"
import { SectionCard } from "@/components/info-pages/section-card"
import { QuickLinks } from "@/components/info-pages/quick-links"

export const metadata: Metadata = {
  title: "Netflix in Nepal 2026 - Price, Plans, Best Deal Starting Rs. 350 | OTTSewa",
  description:
    "Netflix in Nepal 2026 - Complete guide to Netflix pricing starting from Rs. 350. Compare Netflix plans: Mobile, Basic, Standard, Premium with instant delivery. Netflix 4K Ultra HD, HD, streaming quality, multiple screens. How to buy Netflix in Nepal with OTTSewa.",
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
  ].join(", "),
  openGraph: {
    type: "article",
    locale: "en_US",
    url: "https://www.ottsewa.store/netflix-in-nepal",
    siteName: "OTTSewa",
    title: "Netflix in Nepal 2026 - Price, Plans, Pricing Starting Rs. 350",
    description:
      "Netflix in Nepal 2026 - Complete guide with pricing starting from Rs. 350, plan comparison, 4K quality, instant delivery. Buy Netflix subscription code now on OTTSewa.",
  },
}

const netflixPlans = [
  {
    name: "Mobile",
    price: "Rs. 350",
    duration: "1 Month",
    features: [
      "Watch on mobile phones only",
      "Resolution: 480p SD Quality",
      "Single screen at a time",
      "Download content to watch offline",
      "Access to full Netflix library",
    ],
    best: false,
  },
  {
    name: "Basic",
    price: "Rs. 350",
    duration: "1 Month",
    features: [
      "Watch on TV, computer, mobile",
      "Resolution: 720p (HD Quality)",
      "Single screen at a time",
      "Download content to watch offline",
      "Full Netflix library access",
    ],
    best: false,
  },
  {
    name: "Standard",
    price: "Rs. 499",
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
  },
  {
    name: "Premium",
    price: "Rs. 999",
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
  },
]

const whyNetflix = [
  {
    title: "Largest Content Library",
    description: "Netflix offers 6000+ movies, 2000+ TV series, and exclusive originals updated daily.",
  },
  {
    title: "4K Ultra HD Available",
    description: "Premium plan supports 4K resolution with HDR and Dolby Atmos for the best viewing experience.",
  },
  {
    title: "Download to Watch Offline",
    description: "Download your favorite content and watch it anytime, anywhere without internet connection.",
  },
  {
    title: "Family Sharing",
    description: "Create up to 5 profiles per account. Standard plan supports 2 screens, Premium supports 4 screens.",
  },
  {
    title: "Award-Winning Originals",
    description: "Exclusive Netflix original shows and movies like Stranger Things, The Crown, and more.",
  },
  {
    title: "Multiple Device Support",
    description: "Watch on phones, tablets, TVs, computers, and more. Stream on multiple devices simultaneously.",
  },
]

const faqItems = [
  {
    q: "Is Netflix available and working in Nepal 2026?",
    a: "Yes, Netflix is fully available and working in Nepal 2026. You can subscribe directly or purchase from OTTSewa for instant delivery of subscription codes.",
  },
  {
    q: "What is the Netflix price in Nepal - Complete pricing breakdown?",
    a: "Netflix pricing in Nepal 2026: Mobile plan Rs. 350/month, Basic Rs. 350/month, Standard Rs. 499/month, Premium 4K Rs. 999/month. Prices subject to change.",
  },
  {
    q: "Can I share Netflix account with family members?",
    a: "Yes, Netflix allows family account sharing. Standard plan (Rs. 499) allows 2 simultaneous screens, Premium plan (Rs. 999) allows 4 screens. Create up to 5 profiles per account.",
  },
  {
    q: "How to buy Netflix in Nepal with instant delivery?",
    a: "Buy Netflix through OTTSewa. Choose your plan, make payment via eSewa, Khalti, or bank transfer, and get your subscription code delivered instantly.",
  },
  {
    q: "What payment methods work for Netflix in Nepal?",
    a: "Netflix accepts eSewa, Khalti, Visa, Mastercard, debit card, bank transfer, and FonePay for purchases in Nepal.",
  },
  {
    q: "Can I download Netflix content to watch offline?",
    a: "Yes, all Netflix plans support downloading movies and series to watch offline on mobile devices. Downloaded content is available for 30 days.",
  },
]

const quickLinks = [
  { title: "Browse Products", description: "See all Netflix plans", href: "/category", icon: BookOpen },
  { title: "How It Works", description: "Complete purchase guide", href: "/how-it-works", icon: FileText },
  { title: "FAQ", description: "Common questions", href: "/faq", icon: HelpCircle },
  { title: "Contact Support", description: "Get help anytime", href: "/contact", icon: MessageSquare },
]

export default function NetflixNepalPage() {
  return (
    <div className="min-h-screen bg-transparent">
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

      {/* About Netflix Section */}
      <section className="py-16 border-b border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">About Netflix in Nepal 2026</h2>
              <p className="text-gray-300 mb-4 leading-relaxed">
                Netflix is the world's leading entertainment and streaming platform with a massive library of thousands of movies, TV series, documentaries, stand-up comedy shows, and award-winning Netflix original content. In Nepal, Netflix offers multiple subscription plans starting from just Rs. 350 with instant streaming, offline download to watch content anytime, and support for multiple devices and screens.
              </p>
              <p className="text-gray-300 leading-relaxed">
                With over 200 million subscribers worldwide, Netflix dominates the streaming industry with exclusive Netflix originals, award-winning shows, and an ever-growing library of quality entertainment suitable for families, kids, and all age groups. Netflix Nepal subscription is available for instant delivery through OTTSewa.
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

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                      BEST VALUE
                    </span>
                  </div>
                )}

                <h3 className="text-lg font-bold text-white mb-1">{plan.name} Plan</h3>

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

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyNetflix.map((item, idx) => (
              <div key={idx} className="bg-[#1a1a1a] border border-amber-500/20 hover:border-amber-500/40 rounded-xl p-6 transition-all">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                    <p className="text-gray-400 text-sm">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Get Netflix */}
      <section className="py-16 border-b border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4 text-center">How to Buy Netflix in Nepal - Easy 4 Step Process</h2>
          <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">Get Netflix subscription instantly delivered to your account in just 4 simple steps. Fastest way to buy Netflix in Nepal starting from Rs. 350.</p>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                step: "1",
                title: "Choose Netflix Plan",
                description: "Select from Mobile (Rs. 350), Basic (Rs. 350), Standard (Rs. 499), or Premium 4K (Rs. 999)",
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
              <SectionCard key={idx} title={item.q} description={item.a} />
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

      {/* Quick Links */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Quick Links</h2>
          <QuickLinks links={quickLinks} />
        </div>
      </section>
    </div>
  )
}
