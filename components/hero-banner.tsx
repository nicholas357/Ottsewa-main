"use client"

import type React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react"
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
    <section className="relative px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto">
        {/* Outer box - subtle border */}
        <div className="rounded-3xl border border-white/[0.08] p-2 sm:p-3 bg-transparent">
          {/* Inner box - darker background */}
          <div className="rounded-2xl bg-[#0c0c0c] p-4 sm:p-5">
            <div className="flex flex-col lg:flex-row gap-4 sm:gap-5">
              {/* Main banner skeleton */}
              <div className="relative w-full lg:w-[68%]">
                <div
                  className="rounded-xl overflow-hidden bg-[#151515] border border-white/[0.05]"
                  style={{ aspectRatio: "16/9" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent animate-shimmer" />
                </div>
                {/* Dots skeleton */}
                <div className="flex justify-center gap-2 mt-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className={`h-2 rounded-full bg-white/10 ${i === 1 ? "w-8" : "w-2"}`} />
                  ))}
                </div>
              </div>
              {/* Side banners skeleton */}
              <div className="w-full lg:w-[32%]">
                <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-4 h-full">
                  {[1, 2].map((i) => (
                    <div key={i} className="rounded-xl overflow-hidden bg-[#151515] border border-white/[0.05]">
                      <div className="relative aspect-[16/9]">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent animate-shimmer" />
                      </div>
                    </div>
                  ))}
                </div>
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
    <section className="relative px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto">
        <div className="rounded-3xl border border-white/[0.08] p-2 sm:p-3 bg-transparent">
          <div className="rounded-2xl bg-[#0c0c0c] p-4 sm:p-5">
            <div
              className="rounded-xl bg-[#151515] border border-white/[0.05] flex items-center justify-center"
              style={{ aspectRatio: "21/9" }}
            >
              <div className="text-center p-8">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-7 h-7 text-amber-500/70" />
                </div>
                <p className="text-zinc-500 text-sm font-medium">No banners available</p>
              </div>
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
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

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
    const baseClasses = "relative block rounded-xl overflow-hidden group"

    if (link === "#") {
      return (
        <div className={baseClasses} style={{ aspectRatio: "16/9" }}>
          {children}
        </div>
      )
    }
    return (
      <Link href={link} className={`${baseClasses} cursor-pointer`} style={{ aspectRatio: "16/9" }} prefetch={true}>
        {children}
      </Link>
    )
  }

  const SideBannerWrapper = ({ children, banner }: { children: React.ReactNode; banner: Banner }) => {
    const link = getBannerLink(banner)
    const baseClasses = "relative rounded-xl overflow-hidden group"

    if (link === "#") {
      return <div className={baseClasses}>{children}</div>
    }
    return (
      <Link href={link} className={`${baseClasses} cursor-pointer`} prefetch={true}>
        {children}
      </Link>
    )
  }

  return (
    <section
      aria-label="Featured promotions and offers"
      itemScope
      itemType="https://schema.org/ItemList"
      className="relative px-4 sm:px-6 lg:px-8 py-6 sm:py-8"
    >
      <meta itemProp="name" content="Featured Products and Promotions" />
      <meta itemProp="description" content="Browse our featured streaming subscriptions and digital products" />
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={false}
          animate={isMounted ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.5 }}
        >
          {/* Outer box - clean subtle border with more rounded corners */}
          <div className="rounded-3xl border border-white/[0.08] p-2 sm:p-3 bg-transparent">
            {/* Inner box - darker background for depth */}
            <div className="rounded-2xl bg-[#0c0c0c] overflow-hidden">
              <div className="p-4 sm:p-5">
                <h1 className="sr-only">OTTSewa - Buy Streaming Subscriptions in Nepal</h1>

                <div className="flex flex-col lg:flex-row gap-4 sm:gap-5">
                  {/* Main banner */}
                  {currentMain && (
                    <div className={`relative w-full ${currentSide.length > 0 ? "lg:w-[68%]" : "lg:w-full"}`}>
                      {/* Banner container with subtle border */}
                      <div className="rounded-xl border border-white/[0.05] overflow-hidden">
                        <MainBannerWrapper banner={currentMain}>
                          <div className="absolute inset-0" role="img" aria-label={currentMain.title}>
                            <AnimatePresence mode="wait">
                              {mainBanners.map(
                                (slide, idx) =>
                                  idx === mainIndex && (
                                    <motion.img
                                      key={slide.id}
                                      src={slide.image_url || "/placeholder.svg"}
                                      alt={slide.title}
                                      loading={idx === 0 ? "eager" : "lazy"}
                                      className="absolute inset-0 w-full h-full object-cover"
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      exit={{ opacity: 0 }}
                                      transition={{ duration: 0.5 }}
                                    />
                                  ),
                              )}
                            </AnimatePresence>
                          </div>

                          {/* Subtle gradient overlay for text readability */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                          {/* Content overlay */}
                          <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 z-10">
                            <div className="max-w-md space-y-1 sm:space-y-1.5">
                              {currentMain.subtitle && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-500 rounded text-[9px] sm:text-[10px] text-black font-semibold shadow-sm uppercase tracking-wide">
                                  <Sparkles className="w-2.5 h-2.5" />
                                  {currentMain.subtitle}
                                </span>
                              )}
                              <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-white tracking-tight leading-tight drop-shadow-md">
                                {currentMain.title}
                              </h2>
                              {getBannerLink(currentMain) !== "#" && (
                                <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs text-white/70 font-medium group-hover:text-amber-400 transition-colors">
                                  Shop Now
                                  <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Navigation arrows */}
                          {mainBanners.length > 1 && (
                            <>
                              <button
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  prevMain()
                                }}
                                className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 hover:bg-black/60 hover:border-amber-500/40 transition-all duration-200 flex items-center justify-center cursor-pointer"
                                aria-label="Previous banner"
                              >
                                <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/80" aria-hidden="true" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  nextMain()
                                }}
                                className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 hover:bg-black/60 hover:border-amber-500/40 transition-all duration-200 flex items-center justify-center cursor-pointer"
                                aria-label="Next banner"
                              >
                                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/80" aria-hidden="true" />
                              </button>
                            </>
                          )}
                        </MainBannerWrapper>
                      </div>

                      {/* Pagination dots */}
                      {mainBanners.length > 1 && (
                        <div className="flex justify-center gap-1.5 mt-3" role="tablist" aria-label="Banner navigation">
                          {mainBanners.map((banner, idx) => (
                            <button
                              key={idx}
                              onClick={() => setMainIndex(idx)}
                              className={`h-1 rounded-full transition-all duration-300 cursor-pointer ${
                                idx === mainIndex ? "w-5 bg-amber-500" : "w-1 bg-white/20 hover:bg-white/40"
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

                  {/* Side banners */}
                  {currentSide.length > 0 && (
                    <aside className="w-full lg:w-[32%]" aria-label="Additional offers">
                      <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-4 h-full lg:content-stretch">
                        {currentSide.map((banner, idx) => (
                          <motion.div
                            key={`${banner.id}-${idx}`}
                            initial={false}
                            animate={isMounted ? { opacity: 1, x: 0 } : undefined}
                            transition={{ duration: 0.4, delay: idx * 0.1 }}
                            className="lg:flex-1"
                          >
                            {/* Side banner container with subtle border */}
                            <div className="rounded-xl border border-white/[0.05] overflow-hidden h-full">
                              <SideBannerWrapper banner={banner}>
                                <div className="relative aspect-[16/9] lg:h-full lg:min-h-[140px]">
                                  <img
                                    src={banner.image_url || "/placeholder.svg"}
                                    alt={banner.title}
                                    loading="lazy"
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                                  <div className="absolute bottom-0 left-0 right-0 p-2.5 sm:p-3">
                                    <h3 className="text-xs sm:text-sm font-semibold text-white line-clamp-1 drop-shadow-sm">
                                      {banner.title}
                                    </h3>
                                  </div>
                                </div>
                              </SideBannerWrapper>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </aside>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
