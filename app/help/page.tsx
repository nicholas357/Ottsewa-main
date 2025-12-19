import type { Metadata } from "next"
import {
  Search,
  MessageSquare,
  FileText,
  CreditCard,
  Package,
  Shield,
  ArrowRight,
  Zap,
  BookOpen,
  HelpCircle,
  Clock,
  Mail,
} from "lucide-react"
import Link from "next/link"
import { PageHeader } from "@/components/info-pages/page-header"
import { SectionCard } from "@/components/info-pages/section-card"

export const metadata: Metadata = {
  title: "Help Center | OTTSewa - Get Support",
  description: "Get help with your OTTSewa orders, payments, and account. Find answers to common questions.",
  keywords: "OTTSewa help, customer support, FAQ, order help, payment help",
}

const helpCategories = [
  {
    title: "Orders & Delivery",
    description: "Track orders, delivery issues, and order history",
    icon: Package,
    href: "/faq#orders",
    articles: 12,
  },
  {
    title: "Payments & Billing",
    description: "Payment methods, billing, and refunds",
    icon: CreditCard,
    href: "/faq#payments",
    articles: 8,
  },
  {
    title: "Account & Security",
    description: "Account settings, password, and security",
    icon: Shield,
    href: "/faq#account",
    articles: 10,
  },
  {
    title: "Products & Activation",
    description: "Product info, activation, and redemption",
    icon: FileText,
    href: "/faq#products",
    articles: 15,
  },
]

const popularArticles = [
  {
    title: "How do I track my order?",
    category: "Orders",
    href: "/faq#orders",
  },
  {
    title: "What payment methods do you accept?",
    category: "Payments",
    href: "/faq#payments",
  },
  {
    title: "How do I redeem my digital code?",
    category: "Products",
    href: "/faq#products",
  },
  {
    title: "Can I get a refund?",
    category: "Refunds",
    href: "/refund-policy",
  },
  {
    title: "How do I reset my password?",
    category: "Account",
    href: "/faq#account",
  },
  {
    title: "What if my code doesn't work?",
    category: "Products",
    href: "/faq#products",
  },
]

const supportChannels = [
  {
    title: "Live Chat",
    description: "Get instant help from our team",
    icon: MessageSquare,
    availability: "24/7",
    responseTime: "< 5 minutes",
  },
  {
    title: "Email Support",
    description: "Detailed assistance via email",
    icon: Mail,
    availability: "24/7",
    responseTime: "< 24 hours",
  },
  {
    title: "Knowledge Base",
    description: "Self-service help articles",
    icon: BookOpen,
    availability: "Always available",
    responseTime: "Instant",
  },
]

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-black">
      <PageHeader
        icon={HelpCircle}
        title="Help Center"
        description="Find answers to your questions or contact our support team. We're here to help you 24/7."
        badge="Support"
      >
        {/* Search Bar */}
        <div className="max-w-xl mx-auto mt-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search for help articles, topics, or questions..."
              className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl pl-12 pr-4 py-4 text-white placeholder:text-zinc-500 focus:outline-none focus:border-amber-500/50 transition-colors"
            />
          </div>
        </div>
      </PageHeader>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Help Categories */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
            <span className="w-1 h-6 bg-amber-500 rounded-full" />
            Browse by Category
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {helpCategories.map((category) => (
              <Link
                key={category.title}
                href={category.href}
                className="group relative bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-amber-500/30 transition-all"
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-amber-500/20 transition-colors">
                  <category.icon className="w-6 h-6 text-amber-500" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-amber-400 transition-colors">
                  {category.title}
                </h3>
                <p className="text-zinc-500 text-sm mb-3">{category.description}</p>
                <span className="text-amber-500/60 text-xs">{category.articles} articles</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Popular Articles & Support Channels */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Popular Articles */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
              <span className="w-1 h-6 bg-amber-500 rounded-full" />
              Popular Articles
            </h2>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl divide-y divide-zinc-800">
              {popularArticles.map((article, index) => (
                <Link
                  key={index}
                  href={article.href}
                  className="flex items-center justify-between p-4 hover:bg-zinc-800/50 transition-colors group first:rounded-t-xl last:rounded-b-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center">
                      <FileText className="w-4 h-4 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-white font-medium group-hover:text-amber-400 transition-colors">
                        {article.title}
                      </p>
                      <span className="text-zinc-500 text-xs">{article.category}</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
          </div>

          {/* Support Channels */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
              <span className="w-1 h-6 bg-amber-500 rounded-full" />
              Get Support
            </h2>
            <div className="space-y-4">
              {supportChannels.map((channel) => (
                <div
                  key={channel.title}
                  className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 hover:border-amber-500/30 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <channel.icon className="w-5 h-5 text-amber-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-medium mb-1">{channel.title}</h3>
                      <p className="text-zinc-500 text-sm mb-2">{channel.description}</p>
                      <div className="flex items-center gap-4 text-xs">
                        <span className="flex items-center gap-1 text-zinc-400">
                          <Clock className="w-3 h-3" />
                          {channel.availability}
                        </span>
                        <span className="flex items-center gap-1 text-amber-400">
                          <Zap className="w-3 h-3" />
                          {channel.responseTime}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
            <span className="w-1 h-6 bg-amber-500 rounded-full" />
            Quick Actions
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <SectionCard title="Track Your Order" description="Check the status of your recent orders" icon={Package}>
              <Link
                href="/orders"
                className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 text-sm mt-3 font-medium"
              >
                View Orders <ArrowRight className="w-3 h-3" />
              </Link>
            </SectionCard>
            <SectionCard title="Browse FAQ" description="Find answers to common questions" icon={HelpCircle}>
              <Link
                href="/faq"
                className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 text-sm mt-3 font-medium"
              >
                View FAQ <ArrowRight className="w-3 h-3" />
              </Link>
            </SectionCard>
            <SectionCard title="Refund Policy" description="Learn about our refund and return policy" icon={CreditCard}>
              <Link
                href="/refund-policy"
                className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 text-sm mt-3 font-medium"
              >
                View Policy <ArrowRight className="w-3 h-3" />
              </Link>
            </SectionCard>
          </div>
        </section>

        {/* Contact CTA */}
        <div className="relative bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 sm:p-12 text-center overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-60 h-60 bg-amber-500/5 rounded-full blur-3xl" />

          <div className="relative">
            <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-amber-500/20">
              <MessageSquare className="w-8 h-8 text-amber-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Still need help?</h2>
            <p className="text-zinc-400 mb-8 max-w-xl mx-auto">
              Our support team is available 24/7 to assist you with any questions or issues. We typically respond within
              a few hours.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold px-8 py-3 rounded-lg transition-all shadow-lg shadow-amber-500/20"
              >
                Contact Support
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/faq"
                className="inline-flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold px-8 py-3 rounded-lg transition-all border border-zinc-700"
              >
                Browse All FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
