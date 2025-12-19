"use client"

import { Shield, Clock, CreditCard, Headphones, CheckCircle, Users, TrendingUp, Sparkles, Star } from "lucide-react"
import { useEffect, useRef, useState } from "react"

const trustBadges = [
  {
    icon: Shield,
    title: "100% Genuine",
    description: "All codes are sourced directly from authorized distributors ensuring authenticity",
  },
  {
    icon: Clock,
    title: "Instant Delivery",
    description: "Receive your codes within seconds after payment confirmation",
  },
  {
    icon: CreditCard,
    title: "Secure Payment",
    description: "Multiple payment options with bank-grade encryption and security",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Our dedicated team is always ready to help you with any issues",
  },
]

const stats = [
  { value: 1000, suffix: "+", label: "Happy Customers", icon: Users },
  { value: 99.9, suffix: "%", label: "Delivery Success", icon: TrendingUp },
  { value: 500, suffix: "+", label: "Products Sold", icon: Sparkles },
  { value: 4.9, suffix: "/5", label: "Customer Rating", icon: Star },
]

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true)
          const duration = 2000
          const steps = 60
          const increment = value / steps
          let current = 0

          const timer = setInterval(() => {
            current += increment
            if (current >= value) {
              setCount(value)
              clearInterval(timer)
            } else {
              setCount(Math.floor(current * 10) / 10)
            }
          }, duration / steps)

          return () => clearInterval(timer)
        }
      },
      { threshold: 0.5 },
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [value, hasAnimated])

  return (
    <div ref={ref} className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
      {Number.isInteger(value) ? Math.floor(count).toLocaleString() : count.toFixed(1)}
      <span className="text-amber-500">{suffix}</span>
    </div>
  )
}

export default function TrustSection() {
  return (
    <section
      className="px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative overflow-hidden"
      itemScope
      itemType="https://schema.org/Organization"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-amber-500/4 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 text-balance" itemProp="name">
            Why Choose <span className="text-amber-500">OTTSewa</span>?
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed" itemProp="description">
            Nepal's leading destination for premium streaming subscriptions. We provide genuine codes at the best prices
            with instant delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 mb-14">
          {trustBadges.map((badge, index) => (
            <article
              key={index}
              className="p-6 rounded-xl bg-zinc-900/30 border border-zinc-800/40 hover:border-zinc-700/60 transition-colors"
            >
              <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center mb-4">
                <badge.icon className="w-6 h-6 text-amber-500" aria-hidden="true" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">{badge.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{badge.description}</p>
            </article>
          ))}
        </div>

        <div className="rounded-2xl bg-zinc-900/30 border border-zinc-800/40 p-6 sm:p-8 lg:p-10 mb-14">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center mb-3">
                    <stat.icon className="w-5 h-5 text-amber-500" aria-hidden="true" />
                  </div>
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  <p className="text-zinc-400 text-sm mt-1">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {["Verified Seller", "SSL Secured", "Trusted by 1K+ Users", "Nepal Based Support"].map((signal, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-900/30 border border-zinc-800/40 rounded-full"
            >
              <CheckCircle className="w-4 h-4 text-amber-500" aria-hidden="true" />
              <span className="text-zinc-300 text-sm">{signal}</span>
            </div>
          ))}
        </div>

        {/* SEO Schema Markup */}
        <meta itemProp="url" content="https://ottsewa.store" />
        <meta itemProp="logo" content="https://ottsewa.store/logo.png" />
        <div itemProp="address" itemScope itemType="https://schema.org/PostalAddress" className="hidden">
          <meta itemProp="addressCountry" content="Nepal" />
        </div>
        <meta itemProp="telephone" content="+977 9869671451" />
        <meta itemProp="email" content="support@ottsewa.store" />
      </div>
    </section>
  )
}
