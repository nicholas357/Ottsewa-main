"use client"

import { motion } from "framer-motion"
import { Shield, Clock, CreditCard, Headphones, CheckCircle, Users, TrendingUp, Sparkles, Star } from "lucide-react"
import AnimatedCounter from "./AnimatedCounter"

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

const trustBadges = [
  { icon: Shield, title: "Secure Transactions", description: "Your data is protected with encryption." },
  { icon: Clock, title: "Fast Delivery", description: "Get your codes quickly and easily." },
  { icon: CreditCard, title: "Multiple Payment Options", description: "Pay with your preferred method." },
  { icon: Headphones, title: "24/7 Customer Support", description: "Get help whenever you need it." },
]

const stats = [
  { icon: Users, value: 1000, suffix: "+", label: "Happy Customers" },
  { icon: TrendingUp, value: 50, suffix: "%", label: "Growth Rate" },
  { icon: Sparkles, value: 10, suffix: "k", label: "Codes Sold" },
  { icon: Star, value: 4.5, suffix: "/5", label: "Customer Rating" },
]

export default function TrustSection() {
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-12 md:py-16" itemScope itemType="https://schema.org/Organization">
      <div className="max-w-7xl mx-auto">
        <motion.div initial="hidden" animate="visible" variants={sectionVariants}>
          <div className="relative rounded-2xl border border-white/[0.08] p-3">
            <div className="relative rounded-xl bg-[#0f0f0f] overflow-hidden p-6 sm:p-8 lg:p-10">
              {/* Header */}
              <div className="text-center mb-10">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 text-balance" itemProp="name">
                  Why Choose <span className="text-amber-500">OTTSewa</span>?
                </h2>
                <p
                  className="text-zinc-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed"
                  itemProp="description"
                >
                  Nepal's leading destination for premium streaming subscriptions. We provide genuine codes for genuine
                  subscriptions to Netflix, Amazon Prime Video, HBO Max, JioHotstar, Disney+, Spotify, and more.
                </p>
              </div>

              {/* Trust badges grid */}
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {trustBadges.map((badge, index) => (
                  <motion.article
                    key={index}
                    className="p-4 rounded-xl bg-[#1a1a1a] border border-white/[0.04] hover:border-amber-500/20 transition-colors"
                    variants={itemVariants}
                    whileHover={{ y: -3, transition: { duration: 0.2 } }}
                  >
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center mb-3">
                      <badge.icon className="w-5 h-5 text-amber-500" aria-hidden="true" />
                    </div>
                    <h3 className="text-white font-medium text-sm mb-1">{badge.title}</h3>
                    <p className="text-zinc-500 text-xs leading-relaxed">{badge.description}</p>
                  </motion.article>
                ))}
              </motion.div>

              {/* Stats section */}
              <motion.div
                className="rounded-xl bg-[#1a1a1a] border border-white/[0.04] p-5 sm:p-6 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <motion.div
                  className="grid grid-cols-2 lg:grid-cols-4 gap-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {stats.map((stat, index) => (
                    <motion.div key={index} className="text-center" variants={itemVariants}>
                      <div className="flex flex-col items-center">
                        <div className="w-9 h-9 rounded-full bg-amber-500/10 flex items-center justify-center mb-2">
                          <stat.icon className="w-4 h-4 text-amber-500" aria-hidden="true" />
                        </div>
                        <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                        <p className="text-zinc-500 text-xs mt-1">{stat.label}</p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>

              {/* Trust signals */}
              <motion.div
                className="flex flex-wrap items-center justify-center gap-2"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {["Verified Seller", "SSL Secured", "Nepal Based Support"].map((signal, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1a1a1a] border border-white/[0.04] rounded-full"
                    variants={itemVariants}
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />
                    <span className="text-zinc-400 text-xs">{signal}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* SEO Schema Markup */}
        <meta itemProp="url" content="https://www.ottsewa.store" />
        <meta itemProp="logo" content="https://www.ottsewa.store/logo.png" />
        <div itemProp="address" itemScope itemType="https://schema.org/PostalAddress" className="hidden">
          <meta itemProp="addressCountry" content="Nepal" />
        </div>
        <meta itemProp="telephone" content="+977 9869671451" />
        <meta itemProp="email" content="support@ottsewa.store" />
      </div>
    </section>
  )
}
