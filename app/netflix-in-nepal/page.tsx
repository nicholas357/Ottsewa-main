import type { Metadata } from "next"
import {
  Play,
  Check,
  Globe,
  Users,
  Zap,
} from "lucide-react"
import Link from "next/link"
import { PageHeader } from "@/components/info-pages/page-header"
import { SectionCard } from "@/components/info-pages/section-card"
import { NetflixContent } from "@/components/netflix-content"

export const metadata: Metadata = {
  title: "Netflix in Nepal 2026 - Netflix Subscription Plans, Price From Rs. 350 | OTTSewa",
  description:
    "Netflix subscription in Nepal 2026 - Buy Netflix subscription plans at best price. Netflix subscription starting Rs. 350. Compare Netflix subscription: Mobile, Basic, Standard, Premium. Netflix 4K ultra HD subscription, HD quality, family sharing, instant delivery. How to buy Netflix subscription online in Nepal.",
  keywords: [
    "Netflix subscription Nepal 2026",
    "Netflix subscription in Nepal",
    "Netflix subscription price Nepal",
    "Netflix subscription plans Nepal",
    "Netflix subscription cost Nepal",
    "Netflix subscription Rs. 350 Nepal",
    "Netflix subscription mobile Nepal",
    "Netflix subscription basic Nepal",
    "Netflix subscription standard Nepal",
    "Netflix subscription premium Nepal",
    "Netflix subscription 4K Nepal",
    "Netflix subscription HD quality Nepal",
    "Netflix subscription family sharing Nepal",
    "Netflix subscription how to buy Nepal",
    "Netflix subscription instant delivery Nepal",
    "Netflix subscription eSewa Khalti Nepal",
    "Netflix subscription download offline Nepal",
    "Netflix subscription multiple screens Nepal",
    "Netflix subscription features Nepal",
    "Netflix subscription comparison Nepal",
    "buy Netflix subscription Nepal",
    "Netflix subscription in Nepal online",
    "best Netflix subscription plan Nepal",
    "Netflix subscription guide Nepal",
    "Netflix subscription payment methods Nepal",
    "Netflix subscription original series Nepal",
    "Netflix subscription movies Nepal",
    "Netflix subscription streaming Nepal",
    "Netflix subscription account Nepal",
    "Netflix subscription free trial Nepal",
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

export default function NetflixNepalPage() {
  return (
    <div className="min-h-screen bg-transparent">
      <PageHeader
        title="Netflix Subscription in Nepal 2026 - Buy Netflix at Best Price Starting Rs. 350"
        description="Netflix subscription in Nepal 2026 - Complete guide to Netflix subscription plans and pricing. Buy Netflix subscription from Rs. 350 with instant delivery. Compare Netflix subscription options: Netflix subscription mobile, Netflix subscription basic, Netflix subscription standard, Netflix subscription premium 4K. Best Netflix subscription price in Nepal with Netflix subscription plans for family sharing."
        badge="Netflix Subscription in Nepal 2026"
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
              <h2 className="text-2xl font-bold text-white mb-4">About Netflix Subscription in Nepal 2026</h2>
              <p className="text-gray-300 mb-4 leading-relaxed">
                Netflix is the world's leading entertainment and streaming platform with a massive library of thousands of movies, TV series, documentaries, stand-up comedy shows, and award-winning Netflix original content. Netflix subscription in Nepal offers multiple subscription plans starting from just Rs. 350 with instant streaming, offline download to watch Netflix subscription content anytime, and support for multiple devices and screens for Netflix subscription sharing.
              </p>
              <p className="text-gray-300 mb-4 leading-relaxed">
                With over 200 million subscribers worldwide, Netflix subscription dominates the streaming industry with exclusive Netflix subscription originals, award-winning shows, and an ever-growing library of quality entertainment suitable for families, kids, and all age groups. Buy Netflix subscription in Nepal with instant delivery through OTTSewa. Netflix subscription is available in multiple plans to suit your needs.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Whether you're looking for the latest movies, classic TV series, premium 4K ultra HD content, or exclusive Netflix subscription originals like Stranger Things and The Crown, there's something for everyone. Netflix subscription pricing in Nepal starts from Rs. 350 per month with affordable Netflix subscription options for all budgets.
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

      {/* Dynamic Netflix Content Component */}
      <NetflixContent />

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
          <h2 className="text-3xl font-bold text-white mb-4 text-center">How to Buy Netflix Subscription in Nepal - Easy 4 Step Process</h2>
          <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">Get Netflix subscription instantly delivered to your account in just 4 simple steps. Fastest way to buy Netflix subscription in Nepal starting from Rs. 350. How to buy Netflix subscription online with instant delivery.</p>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                step: "1",
                title: "Choose Netflix Subscription Plan",
                description: "Select your Netflix subscription plan: Netflix subscription mobile (Rs. 350), Netflix subscription basic (Rs. 350), Netflix subscription standard (Rs. 499), or Netflix subscription premium 4K (Rs. 999)",
              },
              {
                step: "2",
                title: "Make Payment",
                description: "Pay securely for your Netflix subscription using eSewa, Khalti, bank transfer, FonePay, or credit/debit card for Netflix subscription",
              },
              {
                step: "3",
                title: "Instant Netflix Subscription Delivery",
                description: "Receive your genuine Netflix subscription code instantly after payment confirmation. Netflix subscription code delivered immediately.",
              },
              {
                step: "4",
                title: "Start Netflix Subscription Streaming",
                description: "Activate your Netflix subscription code and enjoy unlimited movies, series, Netflix subscription originals in HD/4K quality",
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
          <h2 className="text-3xl font-bold text-white mb-4 text-center">Netflix Subscription in Nepal - Frequently Asked Questions</h2>
          <p className="text-center text-gray-400 mb-12">Common questions about Netflix subscription plans, Netflix subscription pricing, Netflix subscription features, Netflix subscription payment methods, and Netflix subscription account management in Nepal</p>

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


    </div>
  )
}
