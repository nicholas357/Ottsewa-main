"use client"

import { useEffect, useState } from "react"
import { getNetflixConfig, type NetflixPageConfig } from "@/lib/netflix-config"
import { Check } from "lucide-react"
import Link from "next/link"

export function NetflixContent() {
  const [config, setConfig] = useState<NetflixPageConfig | null>(null)

  useEffect(() => {
    const loaded = getNetflixConfig()
    setConfig(loaded)

    // Listen for storage changes to update if admin changes the config
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "netflix-config" && e.newValue) {
        try {
          setConfig(JSON.parse(e.newValue))
        } catch (error) {
          console.error("[v0] Error parsing updated Netflix config:", error)
        }
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  if (!config) {
    return <div className="text-white">Loading Netflix subscription plans...</div>
  }

  return (
    <>
      {/* Netflix Plans Comparison */}
      <section id="plans" className="py-16 border-b border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-2">Netflix Subscription Plans & Pricing in Nepal 2026</h2>
            <p className="text-amber-400/80 text-sm font-semibold mb-4">Starting from Rs. 350</p>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Choose the perfect Netflix subscription plan for your viewing needs in Nepal. All Netflix subscription plans include access to our full Netflix subscription library with thousands of movies, series, and originals.
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-6 mb-8">
            {config.plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative border rounded-xl p-6 transition-all ${
                  plan.best ? "border-amber-500/60 bg-gradient-to-br from-amber-500/10 to-transparent" : "border-white/[0.05] bg-[#1a1a1a] hover:border-amber-500/30"
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
                <p className="text-xs text-amber-400/70 font-semibold mb-4">Netflix subscription {plan.name.toLowerCase()} plan</p>

                <div className="mb-6 p-3 bg-black/30 rounded-lg">
                  <p className="text-3xl font-bold text-amber-400 mb-1">{plan.price}</p>
                  <p className="text-xs text-gray-400">{plan.duration} Netflix subscription</p>
                </div>

                <div className="space-y-2 mb-6">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href={plan.buyLink || "/category?search=netflix"}
                  className={`block text-center py-2.5 rounded-lg font-semibold transition-all w-full ${
                    plan.best
                      ? "bg-gradient-to-r from-amber-500 to-amber-600 text-black hover:from-amber-400 hover:to-amber-500 shadow-lg shadow-amber-500/20"
                      : "bg-white/10 text-white hover:bg-white/20 border border-white/10"
                  }`}
                >
                  Buy {plan.name} Netflix Subscription
                </Link>
              </div>
            ))}
          </div>

          <p className="text-center text-gray-400 text-sm">
            Netflix subscription prices in Nepal 2026 shown in NPR. Buy Netflix subscription with instant delivery. Netflix subscription cost starts from Rs. 350.
          </p>
        </div>
      </section>

      {/* Action Buttons */}
      <section className="py-16 border-b border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {config.actionButtons.map((button) => (
              <Link
                key={button.id}
                href={button.href}
                className={`inline-flex items-center justify-center gap-2 font-semibold px-8 py-3 rounded-lg transition-all ${
                  button.variant === "primary"
                    ? "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black shadow-lg shadow-amber-500/20"
                    : "border border-amber-500/30 hover:border-amber-500/60 text-amber-400"
                }`}
              >
                {button.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
