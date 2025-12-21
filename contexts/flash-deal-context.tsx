"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"

interface FlashDealProduct {
  id: string
  title: string
  slug: string
  image_url: string
  base_price: number
  original_price: number | null
}

interface FlashDeal {
  id: string
  product_id: string
  discount_percentage: number // renamed from discount_percent to discount_percentage to match DB
  start_time: string
  end_time: string
  is_active: boolean
  product: FlashDealProduct
}

interface FlashDealContextType {
  activeDeals: FlashDeal[]
  getFlashDealForProduct: (productId: string) => FlashDeal | null
  isLoading: boolean
}

const FlashDealContext = createContext<FlashDealContextType>({
  activeDeals: [],
  getFlashDealForProduct: () => null,
  isLoading: true,
})

export function FlashDealProvider({ children }: { children: ReactNode }) {
  const [activeDeals, setActiveDeals] = useState<FlashDeal[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchActiveDeals = useCallback(async () => {
    try {
      const res = await fetch("/api/flash-deals/all-active", {
        next: { revalidate: 60 },
      })

      if (!res.ok) {
        setActiveDeals([])
        return
      }

      const contentType = res.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        setActiveDeals([])
        return
      }

      const data = await res.json()
      setActiveDeals(data.deals || [])
    } catch {
      setActiveDeals([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchActiveDeals()

    // Refresh every minute to keep deals updated
    const interval = setInterval(fetchActiveDeals, 60000)
    return () => clearInterval(interval)
  }, [fetchActiveDeals])

  const getFlashDealForProduct = useCallback(
    (productId: string): FlashDeal | null => {
      const now = new Date()
      return (
        activeDeals.find(
          (deal) =>
            deal.product_id === productId &&
            deal.is_active &&
            new Date(deal.start_time) <= now &&
            new Date(deal.end_time) > now,
        ) || null
      )
    },
    [activeDeals],
  )

  return (
    <FlashDealContext.Provider value={{ activeDeals, getFlashDealForProduct, isLoading }}>
      {children}
    </FlashDealContext.Provider>
  )
}

export function useFlashDeals() {
  return useContext(FlashDealContext)
}
