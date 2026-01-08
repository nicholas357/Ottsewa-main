"use client"

import type React from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, Eye, Star, Flame, Sparkles, TrendingUp, Clock } from "lucide-react"
import { useMemo, memo, useState, useCallback, useEffect, useRef } from "react"
import { useWishlist } from "@/contexts/wishlist-context"
import type { Product } from "@/lib/products"

const loadedProductImages = new Set<string>()

interface ProductCardProps {
  product: Product
  index?: number
  showTags?: boolean
}

function isNewProduct(createdAt: string, days = 7): boolean {
  const created = new Date(createdAt)
  const now = new Date()
  const diffTime = now.getTime() - created.getTime()
  const diffDays = diffTime / (1000 * 60 * 60 * 24)
  return diffDays <= days
}

function getDaysRemaining(createdAt: string, totalDays = 7): number {
  const created = new Date(createdAt)
  const now = new Date()
  const diffTime = now.getTime() - created.getTime()
  const diffDays = diffTime / (1000 * 60 * 60 * 24)
  return Math.max(0, Math.ceil(totalDays - diffDays))
}

function getPriceValidUntil(): string {
  const date = new Date()
  date.setDate(date.getDate() + 30)
  return date.toISOString().split("T")[0]
}

const ProductCard = memo(function ProductCard({ product, index = 0, showTags = true }: ProductCardProps) {
  const { isInWishlist, addItem, removeItem } = useWishlist()
  const imageRef = useRef<HTMLDivElement>(null)
  const imageSrc = product.image_url || product.thumbnail_url || "/placeholder.svg"

  const [hasLoaded, setHasLoaded] = useState(() => loadedProductImages.has(imageSrc))
  const [isVisible, setIsVisible] = useState(index < 4)

  useEffect(() => {
    if (hasLoaded || index < 4) return

    const element = imageRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.disconnect()
          }
        })
      },
      { rootMargin: "300px", threshold: 0 },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [hasLoaded, index])

  const handleImageLoad = useCallback(() => {
    loadedProductImages.add(imageSrc)
    setHasLoaded(true)
  }, [imageSrc])

  const discountedPrice =
    product.discount_percent > 0 ? product.base_price * (1 - product.discount_percent / 100) : product.base_price
  const isFavorite = isInWishlist(product.id)

  const showNewLabel = product.is_new && isNewProduct(product.created_at, 7)
  const daysRemaining = showNewLabel ? getDaysRemaining(product.created_at, 7) : 0
  const showBestsellerLabel = product.is_bestseller
  const showFeaturedLabel = product.is_featured && !showBestsellerLabel

  const jsonLd = useMemo(() => {
    const priceValue = Math.floor(discountedPrice)
    const hasRating = product.average_rating > 0
    const hasReviews = product.review_count > 0

    const structuredData: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.title,
      image: product.image_url || product.thumbnail_url || "https://www.ottsewa.store/placeholder.svg",
      description: product.short_description || `Buy ${product.title} at best price in Nepal`,
      sku: product.id,
      mpn: product.id,
      brand: {
        "@type": "Brand",
        name: product.platforms?.[0]?.name || "OTTSewa",
      },
      category: product.product_type,
      ...(hasRating && hasReviews
        ? {
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: product.average_rating.toFixed(1),
              reviewCount: product.review_count,
              bestRating: "5",
              worstRating: "1",
            },
          }
        : {}),
      offers: {
        "@type": "Offer",
        url: `https://www.ottsewa.store/product/${product.slug}`,
        priceCurrency: "NPR",
        price: priceValue.toString(),
        priceValidUntil: getPriceValidUntil(),
        availability: product.is_active ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        itemCondition: "https://schema.org/NewCondition",
        hasMerchantReturnPolicy: {
          "@type": "MerchantReturnPolicy",
          applicableCountry: "NP",
          returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
          merchantReturnDays: 7,
          returnMethod: "https://schema.org/ReturnByMail",
          returnFees: "https://schema.org/FreeReturn",
        },
        shippingDetails: {
          "@type": "OfferShippingDetails",
          shippingRate: {
            "@type": "MonetaryAmount",
            value: "0",
            currency: "NPR",
          },
          shippingDestination: {
            "@type": "DefinedRegion",
            addressCountry: "NP",
          },
          deliveryTime: {
            "@type": "ShippingDeliveryTime",
            handlingTime: {
              "@type": "QuantitativeValue",
              minValue: 0,
              maxValue: 0,
              unitCode: "d",
            },
            transitTime: {
              "@type": "QuantitativeValue",
              minValue: 0,
              maxValue: 0,
              unitCode: "d",
            },
          },
        },
        seller: {
          "@type": "Organization",
          name: "OTTSewa",
          url: "https://www.ottsewa.store",
        },
      },
    }

    return structuredData
  }, [product, discountedPrice])

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isFavorite) {
      removeItem(product.id)
    } else {
      addItem({
        productId: product.id,
        productTitle: product.title,
        productSlug: product.slug,
        productImage: product.image_url || product.thumbnail_url || "/placeholder.svg",
        price: discountedPrice,
        originalPrice: product.base_price,
      })
    }
  }

  return (
    <li>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Link
        href={`/product/${product.slug}`}
        prefetch={true}
        className="group relative overflow-hidden rounded-xl bg-zinc-900/50 border border-amber-500/[0.08] transition-all duration-200 hover:border-amber-500/20 flex flex-col cursor-pointer h-full image-stable"
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/15 to-transparent z-10" />

        <div
          ref={imageRef}
          className="relative w-full aspect-[3/4] overflow-hidden bg-zinc-800"
          style={{
            // Force GPU layer promotion to prevent Chrome compositor issues
            transform: "translateZ(0)",
            backfaceVisibility: "hidden",
            contain: "layout paint",
          }}
        >
          {isVisible && (
            <Image
              src={imageSrc || "/placeholder.svg"}
              alt={product.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              loading={hasLoaded || index < 4 ? "eager" : "lazy"}
              decoding="async"
              onLoad={handleImageLoad}
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Wishlist button */}
          <button
            onClick={toggleFavorite}
            className="absolute top-2 right-2 w-8 h-8 bg-black/60 backdrop-blur-sm rounded-lg flex items-center justify-center transition-all duration-200 hover:bg-black/80 z-10 border border-white/[0.08] cursor-pointer"
            aria-label={isFavorite ? `Remove ${product.title} from wishlist` : `Add ${product.title} to wishlist`}
          >
            <Heart
              className={`w-4 h-4 transition-all ${isFavorite ? "fill-amber-500 text-amber-500" : "text-white/70"}`}
              aria-hidden="true"
            />
          </button>

          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {/* New label with days remaining indicator */}
            {showNewLabel && (
              <div className="flex items-center gap-1 bg-emerald-500 text-white px-1.5 py-0.5 rounded text-[10px] font-bold shadow-lg">
                <Sparkles className="w-3 h-3" />
                <span>NEW</span>
                {daysRemaining <= 3 && (
                  <span className="flex items-center gap-0.5 text-emerald-100 ml-0.5">
                    <Clock className="w-2.5 h-2.5" />
                    {daysRemaining}d
                  </span>
                )}
              </div>
            )}

            {/* Bestseller label */}
            {showBestsellerLabel && (
              <div className="flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-500 text-black px-1.5 py-0.5 rounded text-[10px] font-bold shadow-lg">
                <Flame className="w-3 h-3" />
                <span>BEST SELLER</span>
              </div>
            )}

            {/* Featured label */}
            {showFeaturedLabel && (
              <div className="flex items-center gap-1 bg-violet-500 text-white px-1.5 py-0.5 rounded text-[10px] font-bold shadow-lg">
                <TrendingUp className="w-3 h-3" />
                <span>FEATURED</span>
              </div>
            )}

            {/* Discount label */}
            {product.discount_percent > 0 && (
              <div className="bg-red-500 text-white px-1.5 py-0.5 rounded text-[10px] font-bold shadow-lg">
                -{product.discount_percent}%
              </div>
            )}
          </div>

          {/* Cashback badge */}
          {product.cashback_percent > 0 && (
            <div className="absolute bottom-12 left-2 bg-amber-500/90 text-black px-2 py-0.5 text-[10px] font-medium rounded-md">
              {product.cashback_percent}% BACK
            </div>
          )}

          {/* Platform/type banner */}
          <div className="absolute bottom-0 left-0 right-0 bg-zinc-900/90 backdrop-blur-sm text-white px-3 py-1.5 text-xs font-medium text-center border-t border-white/[0.06]">
            <span>{product.platforms?.[0]?.name || product.product_type.toUpperCase()}</span>
          </div>
        </div>

        <div className="p-3 flex flex-col flex-grow bg-gradient-to-b from-amber-500/[0.02] to-transparent">
          <h3 className="text-xs sm:text-sm font-medium text-white mb-1 line-clamp-2 leading-tight min-h-[2rem]">
            {product.title}
          </h3>

          <div className="text-[10px] text-zinc-500 font-medium mb-2 uppercase tracking-wider">
            {product.region || "GLOBAL"}
          </div>

          {/* Rating */}
          {product.average_rating > 0 && (
            <div className="flex items-center gap-1 mb-2">
              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
              <span className="text-zinc-400 text-[10px]">
                {product.average_rating.toFixed(1)}
                {product.review_count > 0 && <span className="text-zinc-500"> ({product.review_count})</span>}
              </span>
            </div>
          )}

          {showTags && product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {product.tags.slice(0, 2).map((tag, i) => (
                <span
                  key={i}
                  className="text-[9px] text-zinc-400 bg-zinc-800/80 px-1.5 py-0.5 rounded border border-zinc-700/50"
                >
                  {tag}
                </span>
              ))}
              {product.tags.length > 2 && <span className="text-[9px] text-zinc-500">+{product.tags.length - 2}</span>}
            </div>
          )}

          <div className="space-y-1 mb-3">
            <div className="text-[10px] text-zinc-600 uppercase tracking-wide">From</div>
            {product.discount_percent > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-zinc-600 line-through">NPR {product.base_price.toFixed(0)}</span>
                <span className="text-[10px] font-medium text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-md border border-emerald-500/20">
                  -{product.discount_percent}%
                </span>
              </div>
            )}
            <div className="text-lg sm:text-xl font-semibold text-white">
              NPR {Math.floor(discountedPrice).toFixed(0)}
            </div>
          </div>

          <div className="flex items-center gap-1 text-zinc-600 text-[10px] mb-3">
            <Heart className="w-3 h-3" aria-hidden="true" />
            <span>{product.review_count?.toLocaleString() || 0} reviews</span>
          </div>

          <div className="mt-auto">
            <div className="relative w-full bg-gradient-to-r from-amber-500 to-amber-600 group-hover:from-amber-400 group-hover:to-amber-500 text-black font-medium py-2 rounded-lg transition-all text-xs flex items-center justify-center gap-2 overflow-hidden cursor-pointer shadow-[0_0_20px_rgba(245,158,11,0.15)]">
              <div className="absolute inset-0 bg-gradient-to-b from-white/25 to-transparent h-1/2" />
              <Eye className="w-3.5 h-3.5 relative" aria-hidden="true" />
              <span className="relative">View Details</span>
            </div>
          </div>
        </div>
      </Link>
    </li>
  )
})

export default ProductCard
