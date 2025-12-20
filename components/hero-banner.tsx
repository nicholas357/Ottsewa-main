"use client"

import type React from "react"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { createBrowserClient } from "@/lib/supabase/client"
import { appCache, CACHE_KEYS, CACHE_TTL, STALE_TTL } from "@/lib/cache"

interface Banner {
  id: string
  title: string
  subtitle: string | null
  image_url: string
  link_type: "none" | "product" | "category" | "custom"
  link_url: string | null
  product_id: string | null
  category_id: string | null
  banner_type: "main" | "side"
  sort_order: number
  product?: { slug: string } | null
  category?: { slug: string } | null
}

interface CachedBanners {
  main: Banner[]
  side: Banner[]
}

function BannerSkeleton() {
  return (
    <section className="bg-black">
      <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Main banner skeleton */}
            <div className="relative w-full lg:w-[70%]">
              <div
                className="relative rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900"
                style={{ aspectRatio: "16/9" }}
              >
                <div
                  className="absolute inset-0 animate-pulse bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 bg-[length:200%_100%]"
                  style={{ animation: "shimmer 1.5s infinite" }}
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 space-y-3">
                  <div className="h-5 w-24 bg-zinc-800 rounded-full animate-pulse" />
                  <div className="h-8 w-48 bg-zinc-800 rounded animate-pulse" />
                </div>
              </div>
              {/* Indicator skeleton */}
              <div className="flex justify-center gap-2 mt-3">
                <div className="h-1.5 w-8 bg-zinc-800 rounded-full animate-pulse" />
                <div className="h-1.5 w-2 bg-zinc-800 rounded-full animate-pulse" />
                <div className="h-1.5 w-2 bg-zinc-800 rounded-full animate-pulse" />
              </div>
            </div>

            {/* Side banners skeleton */}
            <div className="w-full lg:w-[30%]">
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-4">
                {[1, 2].map((i) => (
                  <div key={i} className="relative rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900">
                    <div className="relative aspect-[16/10] sm:aspect-[16/9]">
                      <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900" />
                      <div className="absolute bottom-0 left-0 right-0 p-2.5 sm:p-3">
                        <div className="h-4 w-20 bg-zinc-800 rounded animate-pulse" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function NoBannersState() {
  return (
    <section className="bg-black">
      <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto">
          <div
            className="relative rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900/50 flex items-center justify-center"
            style={{ aspectRatio: "21/9" }}
          >
            <div className="text-center p-6">
              <p className="text-zinc-500 text-sm">No banners available</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function HeroBanner() {
  const [mainBanners, setMainBanners] = useState<Banner[]>([])
  const [sideBanners, setSideBanners] = useState<Banner[]>([])
  const [mainIndex, setMainIndex] = useState(0)
  const [sideIndex, setSideIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchBanners() {
      const cacheKey = CACHE_KEYS.BANNERS
      const cached = appCache.getWithStatus<CachedBanners>(cacheKey)

      if (cached.data) {
        setMainBanners(cached.data.main)
        setSideBanners(cached.data.side)
        setIsLoading(false)

        if (!cached.needsRevalidation) {
          return
        }

        appCache.markRevalidating(cacheKey)
      }

      try {
        const supabase = createBrowserClient()
        const { data, error } = await supabase
          .from("hero_banners")
          .select("*")
          .eq("is_active", true)
          .order("sort_order")

        if (error) throw error

        if (data && data.length > 0) {
          const bannersWithLinks = await Promise.all(
            data.map(async (banner) => {
              let product = null
              let category = null
              if (banner.product_id) {
                const { data: p } = await supabase.from("products").select("slug").eq("id", banner.product_id).single()
                product = p
              }
              if (banner.category_id) {
                const { data: c } = await supabase
                  .from("categories")
                  .select("slug")
                  .eq("id", banner.category_id)
                  .single()
                category = c
              }
              return { ...banner, product, category }
            }),
          )

          const main = bannersWithLinks.filter((b) => b.banner_type === "main")
          const side = bannersWithLinks.filter((b) => b.banner_type === "side")

          appCache.set<CachedBanners>(cacheKey, { main, side }, CACHE_TTL.BANNERS, STALE_TTL.BANNERS)

          setMainBanners(main)
          setSideBanners(side)
        } else {
          appCache.set<CachedBanners>(cacheKey, { main: [], side: [] }, CACHE_TTL.BANNERS, STALE_TTL.BANNERS)
        }
      } catch (error) {
        console.error("Error fetching banners:", error)
      } finally {
        setIsLoading(false)
        appCache.clearRevalidating(cacheKey)
      }
    }

    fetchBanners()
  }, [])

  const nextMain = useCallback(() => {
    setMainIndex((prev) => (prev + 1) % mainBanners.length)
  }, [mainBanners.length])

  const prevMain = useCallback(() => {
    setMainIndex((prev) => (prev - 1 + mainBanners.length) % mainBanners.length)
  }, [mainBanners.length])

  useEffect(() => {
    if (mainBanners.length <= 1) return
    const mainTimer = setInterval(nextMain, 5000)
    return () => clearInterval(mainTimer)
  }, [nextMain, mainBanners.length])

  useEffect(() => {
    if (sideBanners.length <= 2) return
    const sideTimer = setInterval(() => {
      setSideIndex((prev) => (prev + 1) % sideBanners.length)
    }, 4000)
    return () => clearInterval(sideTimer)
  }, [sideBanners.length])

  if (isLoading) {
    return <BannerSkeleton />
  }

  if (mainBanners.length === 0 && sideBanners.length === 0) {
    return <NoBannersState />
  }

  function getBannerLink(banner: Banner): string {
    if (banner.link_type === "product" && banner.product?.slug) {
      return `/product/${banner.product.slug}`
    }
    if (banner.link_type === "category" && banner.category?.slug) {
      return `/category/${banner.category.slug}`
    }
    if (banner.link_type === "custom" && banner.link_url) {
      return banner.link_url
    }
    return "#"
  }

  const currentMain = mainBanners[mainIndex] || null
  const currentSide =
    sideBanners.length > 0
      ? [sideBanners[sideIndex % sideBanners.length], sideBanners[(sideIndex + 1) % sideBanners.length]].filter(Boolean)
      : []

  const MainBannerWrapper = ({ children, banner }: { children: React.ReactNode; banner: Banner }) => {
    const link = getBannerLink(banner)
    if (link === "#") {
      return (
        <div
          className="relative block rounded-xl overflow-hidden border border-amber-500/[0.1]"
          style={{ aspectRatio: "16/9" }}
        >
          {children}
        </div>
      )
    }
    return (
      <Link
        href={link}
        className="relative block rounded-xl overflow-hidden border border-amber-500/[0.1] hover:border-amber-500/20 transition-colors cursor-pointer"
        style={{ aspectRatio: "16/9" }}
        prefetch={true}
      >
        {children}
      </Link>
    )
  }

  const SideBannerWrapper = ({ children, banner }: { children: React.ReactNode; banner: Banner }) => {
    const link = getBannerLink(banner)
    if (link === "#") {
      return (
        <div className="relative rounded-xl overflow-hidden border border-amber-500/[0.1] transition-all duration-300 group">
          {children}
        </div>
      )
    }
    return (
      <Link
        href={link}
        className="relative rounded-xl overflow-hidden border border-amber-500/[0.1] hover:border-amber-500/20 transition-all duration-300 group cursor-pointer"
        prefetch={true}
      >
        {children}
      </Link>
    )
  }

  return (
    <section
      className="bg-black"
      aria-label="Featured promotions and offers"
      itemScope
      itemType="https://schema.org/ItemList"
    >
      <meta itemProp="name" content="Featured Products and Promotions" />
      <meta itemProp="description" content="Browse our featured streaming subscriptions and digital products" />
      <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="sr-only">OTTSewa - Buy Streaming Subscriptions in Nepal</h1>
          <div className="flex flex-col lg:flex-row gap-4">
            {currentMain && (
              <div className={`relative w-full ${currentSide.length > 0 ? "lg:w-[70%]" : "lg:w-full"}`}>
                <MainBannerWrapper banner={currentMain}>
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/25 to-transparent z-10" />

                  <div className="absolute inset-0" role="img" aria-label={currentMain.title}>
                    {mainBanners.map((slide, idx) => (
                      <img
                        key={slide.id}
                        src={slide.image_url || "/placeholder.svg"}
                        alt={slide.title}
                        loading={idx === 0 ? "eager" : "lazy"}
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
                          idx === mainIndex ? "opacity-100" : "opacity-0"
                        }`}
                      />
                    ))}
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 z-10">
                    {currentMain.subtitle && (
                      <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-sm border border-white/[0.1] rounded-full text-[10px] sm:text-xs text-white/90 mb-2">
                        {currentMain.subtitle}
                      </span>
                    )}
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight">
                      {currentMain.title}
                    </h2>
                  </div>

                  {mainBanners.length > 1 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          prevMain()
                        }}
                        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/60 backdrop-blur-sm border border-white/[0.1] hover:border-white/[0.2] hover:bg-black/80 transition-all cursor-pointer"
                        aria-label="Previous banner"
                      >
                        <ChevronLeft className="w-5 h-5 text-white" aria-hidden="true" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          nextMain()
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/60 backdrop-blur-sm border border-white/[0.1] hover:border-white/[0.2] hover:bg-black/80 transition-all cursor-pointer"
                        aria-label="Next banner"
                      >
                        <ChevronRight className="w-5 h-5 text-white" aria-hidden="true" />
                      </button>
                    </>
                  )}
                </MainBannerWrapper>

                {mainBanners.length > 1 && (
                  <div className="flex justify-center gap-2 mt-3" role="tablist" aria-label="Banner navigation">
                    {mainBanners.map((banner, idx) => (
                      <button
                        key={idx}
                        onClick={() => setMainIndex(idx)}
                        className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                          idx === mainIndex ? "w-8 bg-amber-500" : "w-2 bg-amber-500/25 hover:bg-amber-500/50"
                        }`}
                        role="tab"
                        aria-selected={idx === mainIndex}
                        aria-label={`View ${banner.title}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {currentSide.length > 0 && (
              <aside className="w-full lg:w-[30%]" aria-label="Additional offers">
                <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-4">
                  {currentSide.map((banner, idx) => (
                    <SideBannerWrapper key={`${banner.id}-${idx}`} banner={banner}>
                      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent z-10" />

                      <div className="relative aspect-[16/10] sm:aspect-[16/9]">
                        <img
                          src={banner.image_url || "/placeholder.svg"}
                          alt={banner.title}
                          loading="lazy"
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                        <div className="absolute bottom-0 left-0 right-0 p-2.5 sm:p-3">
                          <h3 className="text-xs sm:text-sm font-medium text-white line-clamp-1">{banner.title}</h3>
                        </div>
                      </div>
                    </SideBannerWrapper>
                  ))}
                </div>
              </aside>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
