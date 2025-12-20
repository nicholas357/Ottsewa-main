import type { Metadata } from "next"
import { Search, CreditCard, Zap, CheckCircle, ArrowRight, ShoppingCart, Mail, Shield, Clock } from "lucide-react"
import Link from "next/link"
import { PageHeader } from "@/components/info-pages/page-header"
import { SectionCard } from "@/components/info-pages/section-card"
import { QuickLinks } from "@/components/info-pages/quick-links"
import { HelpCircle, MessageSquare, BookOpen } from "lucide-react"

export const metadata: Metadata = {
  title: "How It Works | OTTSewa - Simple 4-Step Process",
  description:
    "Learn how to purchase digital subscriptions and gift cards from OTTSewa. Simple 4-step process with instant delivery.",
  keywords: "how to buy digital subscription Nepal, OTTSewa guide, buy Netflix Nepal, streaming subscription guide",
}

const steps = [
  {
    number: "01",
    title: "Browse Products",
    description:
      "Explore our wide range of digital subscriptions, streaming services, and gift cards. Use filters to find exactly what you need.",
    icon: Search,
    tips: [
      "Use search to find products quickly",
      "Filter by category or platform",
      "Check product details and reviews",
    ],
  },
  {
    number: "02",
    title: "Add to Cart",
    description:
      "Choose your preferred plan, duration, and quantity. Add the products to your cart and review your selection.",
    icon: ShoppingCart,
    tips: [
      "Select the right subscription duration",
      "Verify product compatibility",
      "Check for any ongoing promotions",
    ],
  },
  {
    number: "03",
    title: "Secure Payment",
    description:
      "Pay securely using your preferred payment method. We accept various local and international payment options.",
    icon: CreditCard,
    tips: [
      "eSewa, Khalti, and bank transfers accepted",
      "All transactions are encrypted",
      "Instant payment confirmation",
    ],
  },
  {
    number: "04",
    title: "Instant Delivery",
    description:
      "Receive your digital codes or subscription credentials instantly via email and in your account dashboard.",
    icon: Zap,
    tips: ["Codes delivered within minutes", "Check email and dashboard", "Easy redemption instructions included"],
  },
]

const features = [
  {
    title: "Instant Access",
    description: "Get your digital products delivered instantly after payment",
    icon: Clock,
  },
  {
    title: "Secure Process",
    description: "Your payment and personal data are always protected",
    icon: Shield,
  },
  {
    title: "Email Confirmation",
    description: "Receive detailed instructions and codes via email",
    icon: Mail,
  },
  {
    title: "Quality Guarantee",
    description: "All products are 100% genuine and verified",
    icon: CheckCircle,
  },
]

const quickLinks = [
  { title: "Browse Products", description: "Explore our catalog", href: "/category", icon: Search },
  { title: "About Us", description: "Learn about OTTSewa", href: "/about", icon: BookOpen },
  { title: "FAQ", description: "Common questions", href: "/faq", icon: HelpCircle },
  { title: "Contact Us", description: "Get in touch", href: "/contact", icon: MessageSquare },
]

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-transparent">
      <PageHeader
        title="How It Works"
        description="Getting your favorite digital subscriptions is easy. Follow these simple steps to get started with OTTSewa."
        badge="Simple 4-Step Process"
      />

      {/* Steps Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-white/[0.08] p-3">
            <div className="bg-[#0f0f0f] rounded-xl p-4 sm:p-6">
              <div className="space-y-8 lg:space-y-0 lg:grid lg:grid-cols-4 lg:gap-6">
                {steps.map((step, index) => (
                  <div key={step.number} className="relative">
                    {/* Connector line for desktop */}
                    {index < steps.length - 1 && (
                      <div className="hidden lg:block absolute top-16 left-[60%] w-full h-0.5">
                        <div className="w-full h-full bg-gradient-to-r from-amber-500/50 to-transparent" />
                        <ArrowRight className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500/50" />
                      </div>
                    )}

                    <div className="relative bg-[#1a1a1a] border border-white/[0.05] rounded-xl p-6 hover:border-amber-500/20 transition-all h-full group">
                      <div className="flex items-center gap-4 mb-4">
                        <span className="text-5xl font-bold text-amber-500/20">{step.number}</span>
                        <div className="w-14 h-14 bg-amber-500/10 rounded-xl flex items-center justify-center group-hover:bg-amber-500/20 transition-colors">
                          <step.icon className="w-7 h-7 text-amber-500" />
                        </div>
                      </div>

                      <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                      <p className="text-zinc-400 mb-4">{step.description}</p>

                      <ul className="space-y-2">
                        {step.tips.map((tip, tipIndex) => (
                          <li key={tipIndex} className="flex items-start gap-2 text-sm text-zinc-500">
                            <CheckCircle className="w-4 h-4 text-amber-500/60 flex-shrink-0 mt-0.5" />
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-zinc-900/30 border-y border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Why Shop With Us</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              We make it easy and secure to get your digital subscriptions
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <SectionCard
                key={feature.title}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-white/[0.08] p-3">
            <div className="bg-[#0f0f0f] rounded-xl p-4 sm:p-6">
              <div className="relative">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
                <p className="text-zinc-400 mb-8 max-w-xl mx-auto">
                  Browse our collection of digital subscriptions and get instant access to your favorite platforms. Join
                  thousands of happy customers today!
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    href="/category"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold px-8 py-3 rounded-lg transition-all shadow-lg shadow-amber-500/20"
                  >
                    Browse Products
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold px-8 py-3 rounded-lg transition-all border border-zinc-700"
                  >
                    Contact Support
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <QuickLinks title="Helpful Resources" links={quickLinks} />
    </div>
  )
}
