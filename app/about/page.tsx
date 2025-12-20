import type { Metadata } from "next"
import {
  Shield,
  Zap,
  Users,
  Globe,
  Play,
  Tv,
  Music,
  Gamepad2,
  Star,
  Clock,
  Award,
  Heart,
  TrendingUp,
  CheckCircle,
} from "lucide-react"
import Link from "next/link"
import { PageHeader } from "@/components/info-pages/page-header"
import { SectionCard } from "@/components/info-pages/section-card"
import { QuickLinks } from "@/components/info-pages/quick-links"
import { HelpCircle, FileText, MessageSquare, BookOpen } from "lucide-react"

export const metadata: Metadata = {
  title: "About Us | OTTSewa - Nepal's Best Streaming Subscription Provider",
  description:
    "OTTSewa is Nepal's leading digital subscription provider for streaming platforms like Netflix, HBO, Spotify, Disney+, and gaming services. Get instant delivery and 24/7 support.",
  keywords:
    "OTTSewa, digital subscriptions Nepal, Netflix Nepal, HBO Max Nepal, Spotify Nepal, Disney+ Nepal, streaming services Nepal",
}

const streamingPlatforms = [
  { name: "Netflix", icon: Play, color: "text-red-500", bg: "bg-red-500/10" },
  { name: "HBO Max", icon: Tv, color: "text-purple-500", bg: "bg-purple-500/10" },
  { name: "Disney+", icon: Play, color: "text-blue-500", bg: "bg-blue-500/10" },
  { name: "Spotify", icon: Music, color: "text-green-500", bg: "bg-green-500/10" },
  { name: "Apple TV+", icon: Tv, color: "text-zinc-400", bg: "bg-zinc-500/10" },
  { name: "Amazon Prime", icon: Play, color: "text-cyan-500", bg: "bg-cyan-500/10" },
  { name: "YouTube Premium", icon: Play, color: "text-red-600", bg: "bg-red-500/10" },
  { name: "Gaming Services", icon: Gamepad2, color: "text-amber-500", bg: "bg-amber-500/10" },
]

const stats = [
  { value: "10,000+", label: "Happy Customers", icon: Users },
  { value: "50+", label: "Digital Products", icon: Award },
  { value: "24/7", label: "Customer Support", icon: Clock },
  { value: "99.9%", label: "Delivery Success", icon: TrendingUp },
]

const values = [
  {
    title: "Instant Delivery",
    description: "Get your digital codes and subscriptions delivered instantly after payment confirmation.",
    icon: Zap,
  },
  {
    title: "100% Genuine",
    description: "All our products are 100% authentic and sourced directly from official distributors.",
    icon: Shield,
  },
  {
    title: "24/7 Support",
    description: "Our dedicated support team is available round the clock to assist you with any queries.",
    icon: Users,
  },
  {
    title: "Best Prices",
    description: "We offer competitive pricing ensuring you get the best value for your money.",
    icon: Star,
  },
  {
    title: "Secure Payments",
    description: "Multiple secure payment options including local wallets and bank transfers.",
    icon: CheckCircle,
  },
  {
    title: "Customer First",
    description: "Your satisfaction is our priority. We go above and beyond to ensure a great experience.",
    icon: Heart,
  },
]

const quickLinks = [
  { title: "How It Works", description: "Learn how to purchase", href: "/how-it-works", icon: BookOpen },
  { title: "Contact Us", description: "Get in touch", href: "/contact", icon: MessageSquare },
  { title: "FAQ", description: "Common questions", href: "/faq", icon: HelpCircle },
  { title: "Help Center", description: "Need assistance?", href: "/help", icon: FileText },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-transparent">
      <PageHeader
        title="Nepal's #1 Digital Subscription Provider"
        description="Your one-stop destination for all streaming platforms and digital subscriptions. Get Netflix, HBO Max, Disney+, Spotify, and more at the best prices in Nepal."
        badge="About OTTSewa"
      >
        <div className="mt-8">
          <Link
            href="/category"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold px-8 py-3 rounded-lg transition-all shadow-lg shadow-amber-500/20"
          >
            Explore Products
          </Link>
        </div>
      </PageHeader>

      {/* Stats Section */}
      <section className="py-12 border-y border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-white/[0.08] p-3">
            <div className="bg-[#0f0f0f] rounded-xl p-4">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="relative text-center p-6 bg-[#1a1a1a] border border-white/[0.05] rounded-xl hover:border-amber-500/20 transition-all group"
                  >
                    <stat.icon className="w-6 h-6 text-amber-500/60 mx-auto mb-3" />
                    <p className="text-3xl sm:text-4xl font-bold text-amber-500 mb-1">{stat.value}</p>
                    <p className="text-zinc-400 text-sm">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Streaming Platforms */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Streaming Platforms We Offer</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Access all your favorite streaming services with instant digital delivery
            </p>
          </div>
          <div className="rounded-2xl border border-white/[0.08] p-3">
            <div className="bg-[#0f0f0f] rounded-xl p-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {streamingPlatforms.map((platform) => (
                  <div
                    key={platform.name}
                    className="relative bg-[#1a1a1a] border border-white/[0.05] rounded-xl p-6 text-center hover:border-amber-500/20 transition-all group overflow-hidden"
                  >
                    <div
                      className={`w-14 h-14 ${platform.bg} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}
                    >
                      <platform.icon className={`w-7 h-7 ${platform.color}`} />
                    </div>
                    <p className="text-white font-medium">{platform.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-transparent border-y border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Why Choose OTTSewa?</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              We're committed to providing the best digital subscription experience in Nepal
            </p>
          </div>
          <div className="rounded-2xl border border-white/[0.08] p-3">
            <div className="bg-[#0f0f0f] rounded-xl p-4">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {values.map((value) => (
                  <SectionCard
                    key={value.title}
                    title={value.title}
                    description={value.description}
                    icon={value.icon}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="relative bg-[#1E1E1E]/30 backdrop-blur-sm border border-zinc-800/30 rounded-2xl p-8 sm:p-12 overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl" />
            <Globe className="w-16 h-16 text-amber-500 mx-auto mb-6 relative" />
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 relative">Our Mission</h2>
            <p className="text-lg text-zinc-400 leading-relaxed relative">
              At OTTSewa, we're on a mission to make premium digital entertainment accessible to everyone in Nepal. We
              believe that geographical boundaries shouldn't limit your access to world-class streaming platforms and
              digital services. That's why we've built a seamless platform that brings Netflix, HBO Max, Disney+,
              Spotify, and many more services right to your doorstep with instant delivery and local payment options.
            </p>
          </div>
        </div>
      </section>

      {/* Trust Banner */}
      <section className="py-12 bg-amber-500/5 border-y border-amber-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-amber-500" />
              <span className="text-white font-medium">Trusted by 10,000+ Customers</span>
            </div>
            <div className="hidden sm:block w-px h-8 bg-amber-500/20" />
            <div className="flex items-center gap-3">
              <Award className="w-8 h-8 text-amber-500" />
              <span className="text-white font-medium">Official Authorized Reseller</span>
            </div>
            <div className="hidden sm:block w-px h-8 bg-amber-500/20" />
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-amber-500" />
              <span className="text-white font-medium">100% Secure Transactions</span>
            </div>
          </div>
        </div>
      </section>

      <QuickLinks title="Explore More" links={quickLinks} />
    </div>
  )
}
