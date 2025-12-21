"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { X, Zap, Clock } from "lucide-react"

interface FlashDeal {
  id: string
  title: string
  description: string | null
  discount_percentage: number
  start_time: string
  end_time: string
  is_active: boolean
  product: {
    id: string
    title: string
    slug: string
    image_url: string
    base_price: number
    original_price: number | null
  } | null
}

export function FlashDealBanner() {
  const [deal, setDeal] = useState<FlashDeal | null>(null)
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 })
  const [dismissed, setDismissed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const fetchDeal = useCallback(async () => {
    try {
      const res = await fetch("/api/flash-deals/active", {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      })

      if (!res.ok) {
        setDeal(null)
        setIsLoading(false)
        return
      }

      const contentType = res.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        setDeal(null)
        setIsLoading(false)
        return
      }

      const text = await res.text()
      if (!text || text.trim() === "") {
        setDeal(null)
        setIsLoading(false)
        return
      }

      let data
      try {
        data = JSON.parse(text)
      } catch {
        setDeal(null)
        setIsLoading(false)
        return
      }

      if (data && data.deal && data.deal.product) {
        setDeal(data.deal)
      } else {
        setDeal(null)
      }
    } catch {
      setDeal(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDeal()
    const interval = setInterval(fetchDeal, 60000)
    return () => clearInterval(interval)
  }, [fetchDeal])

  useEffect(() => {
    if (!deal) return

    const calculateTimeLeft = () => {
      const endTime = new Date(deal.end_time).getTime()
      const now = Date.now()
      const diff = endTime - now

      if (diff <= 0) {
        setDeal(null)
        return
      }

      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setTimeLeft({ hours, minutes, seconds })
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(timer)
  }, [deal])

  if (dismissed || isLoading || !deal || !deal.product) return null

  const discountedPrice = deal.product.base_price * (1 - deal.discount_percentage / 100)

  return (
    <div className="fixed bottom-24 sm:bottom-6 left-4 right-4 sm:left-6 sm:right-auto z-[55] animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="relative rounded-xl border border-white/[0.08] bg-[#0f0f0f] shadow-lg max-w-[320px] sm:max-w-[280px] mx-auto sm:mx-0">
        {/* Close button */}
        <button
          onClick={() => setDismissed(true)}
          className="absolute -top-2 -right-2 w-6 h-6 bg-[#1a1a1a] border border-white/[0.1] rounded-full flex items-center justify-center hover:bg-white/[0.1] transition-colors z-10"
          aria-label="Dismiss"
        >
          <X className="w-3.5 h-3.5 text-zinc-400" />
        </button>

        <Link href={`/product/${deal.product.slug}`} className="block">
          {/* Header with flash icon */}
          <div className="flex items-center gap-1.5 px-3 pt-3 pb-2">
            <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span className="text-[11px] font-medium text-amber-500 uppercase tracking-wide">Flash Deal</span>
            <div className="flex-1" />
            <div className="flex items-center gap-1 text-[10px] text-zinc-500">
              <Clock className="w-3 h-3" />
              <span className="font-mono">
                {String(timeLeft.hours).padStart(2, "0")}:{String(timeLeft.minutes).padStart(2, "0")}:
                {String(timeLeft.seconds).padStart(2, "0")}
              </span>
            </div>
          </div>

          {/* Product info */}
          <div className="flex items-center gap-3 px-3 pb-3">
            {/* Product Image */}
            <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-[#1a1a1a] border border-white/[0.05] shrink-0">
              <Image
                src={deal.product.image_url || "/placeholder.svg?height=56&width=56&query=product"}
                alt={deal.product.title}
                fill
                className="object-cover"
                priority
              />
              {/* Discount badge on image */}
              <div className="absolute top-0.5 right-0.5 bg-amber-500 text-black text-[9px] font-bold px-1 py-0.5 rounded">
                -{deal.discount_percentage}%
              </div>
            </div>

            {/* Product details */}
            <div className="flex-1 min-w-0">
              <p className="text-xs text-white font-medium truncate leading-tight">{deal.product.title}</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-sm font-semibold text-amber-400">
                  NPR {Math.round(discountedPrice).toLocaleString()}
                </span>
                <span className="text-[10px] text-zinc-500 line-through">
                  NPR {deal.product.base_price.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
