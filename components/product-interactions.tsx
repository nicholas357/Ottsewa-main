"use client"

import { useState, useCallback, useEffect, useMemo } from "react"
import Link from "next/link"
import { ShoppingCart, Heart, Share2, Loader2, Minus, Plus, Zap, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/cart-context"
import { useWishlist } from "@/contexts/wishlist-context"
import { useFlashDeals } from "@/contexts/flash-deal-context"
import { useToast } from "@/hooks/use-toast"
import type { Product } from "@/lib/products"

// Platform Icons
const PCIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801" />
  </svg>
)

const PlayStationIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M8.985 2.596v17.548l3.915 1.261V6.688c0-.69.304-1.151.794-.991.636.181.76.814.76 1.505v5.876c2.441 1.193 4.362-.002 4.362-3.153 0-3.237-1.126-4.675-4.438-5.827-1.307-.448-3.728-1.186-5.391-1.502h-.002zm4.656 16.242l6.296-2.275c.715-.258.826-.625.246-.818-.586-.192-1.637-.139-2.357.123l-4.205 1.5v-2.385l.24-.085s1.201-.42 2.913-.615c1.696-.18 3.778.029 5.404.661 1.858.585 2.067 1.453 1.6 2.138-.468.682-1.61 1.089-1.61 1.089l-8.529 3.017v-2.349l.002-.001zM1.89 18.77c-1.904-.548-2.198-1.701-1.345-2.376.783-.619 2.122-1.087 2.122-1.087l5.51-1.964v2.38l-3.96 1.418c-.715.254-.822.621-.246.814.586.192 1.637.139 2.357-.123l1.852-.669v2.128c-.156.028-.328.056-.5.076-1.648.188-3.411-.037-5.79-.597z" />
  </svg>
)

const XboxIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M4.102 21.033C6.211 22.881 8.977 24 12 24c3.026 0 5.789-1.119 7.902-2.967 1.877-1.912-4.316-8.709-7.902-11.417-3.582 2.708-9.779 9.505-7.898 11.417zm11.16-14.406c2.5 2.961 7.484 10.313 6.076 12.912C23.056 17.036 24 14.615 24 12c0-4.124-2.093-7.764-5.27-9.911-.545-.158-2.211-.151-3.468 4.538zm-6.532 0C7.5 2.085 5.814 2.093 5.27 2.089 2.093 4.236 0 7.876 0 12c0 2.615.944 5.036 2.662 6.539-1.408-2.599 3.576-9.951 6.068-12.912zM12 3.735S9.751 1.985 7.821 1.732c-.389.109-.772.29-1.14.514C8.41 1.449 10.133 1 12 1c1.867 0 3.59.449 5.319 1.246-.368-.224-.75-.405-1.14-.514-1.93.253-4.179 2.003-4.179 2.003z" />
  </svg>
)

const NintendoIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M0 .6h7.1c2.4 0 4.3 1.9 4.3 4.3v14.2c0 2.4-1.9 4.3-4.3 4.3H0V.6zM24 .6h-7.1c-2.4 0-4.3 1.9-4.3 4.3v14.2c0 2.4 1.9 4.3 4.3 4.3H24V.6zm-9.3 9.4c0-2.6 2.1-4.7 4.7-4.7 2.6 0 4.7 2.1 4.7 4.7s-2.1 4.7-4.7 4.7zM4.5 7.6c1 0 1.8.8 1.8 1.8S5.5 11.3 4.5 11.3s-1.8-.8-1.8-1.8.8-1.9 1.8-1.9z" />
  </svg>
)

const getPlatformIcon = (slug: string) => {
  switch (slug?.toLowerCase()) {
    case "pc":
    case "windows":
      return <PCIcon />
    case "playstation":
    case "ps4":
    case "ps5":
      return <PlayStationIcon />
    case "xbox":
    case "xbox-one":
    case "xbox-series":
      return <XboxIcon />
    case "nintendo":
    case "switch":
      return <NintendoIcon />
    default:
      return null
  }
}

interface ProductInteractionsProps {
  product: Product
  initialPrice?: number
}

export function ProductInteractions({ product }: ProductInteractionsProps) {
  const editions = useMemo(() => product.editions?.filter(Boolean) || [], [product.editions])
  const platforms = useMemo(() => product.platforms?.filter(Boolean) || [], [product.platforms])
  const plans = useMemo(() => product.subscription_plans?.filter(Boolean) || [], [product.subscription_plans])
  const denominations = useMemo(() => product.denominations?.filter(Boolean) || [], [product.denominations])
  const licenseTypes = useMemo(() => product.license_types?.filter(Boolean) || [], [product.license_types])

  // State for selections
  const [selectedEdition, setSelectedEdition] = useState<string | null>(null)
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [selectedDuration, setSelectedDuration] = useState<string | null>(null)
  const [selectedDenomination, setSelectedDenomination] = useState<string | null>(null)
  const [selectedLicenseType, setSelectedLicenseType] = useState<string | null>(null)
  const [selectedLicenseDuration, setSelectedLicenseDuration] = useState<string | null>(null)

  const [quantity, setQuantity] = useState(1)
  const [addingToCart, setAddingToCart] = useState(false)
  const [copied, setCopied] = useState(false)

  const { addItem } = useCart()
  const { toast } = useToast()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist()
  const { getFlashDealForProduct } = useFlashDeals()
  const flashDeal = getFlashDealForProduct(product.id)

  const [flashDealTimeLeft, setFlashDealTimeLeft] = useState<{
    hours: number
    minutes: number
    seconds: number
  } | null>(null)

  useEffect(() => {
    if (!flashDeal) {
      setFlashDealTimeLeft(null)
      return
    }

    const updateTimer = () => {
      const now = new Date().getTime()
      const endTime = new Date(flashDeal.end_time).getTime()
      const diff = endTime - now

      if (diff <= 0) {
        setFlashDealTimeLeft(null)
        return
      }

      setFlashDealTimeLeft({
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      })
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [flashDeal])

  const isFavorite = isInWishlist(product.id)

  useEffect(() => {
    if (product.product_type === "subscription" && plans.length > 0 && !selectedPlan) {
      const firstPlan = plans[0]
      setSelectedPlan(firstPlan?.id || null)
      if (firstPlan?.durations?.length) {
        setSelectedDuration(firstPlan.durations[0]?.id || null)
      }
    }
  }, [plans, product.product_type, selectedPlan])

  useEffect(() => {
    if (product.product_type === "game" && editions.length > 0 && !selectedEdition) {
      setSelectedEdition(editions[0]?.id || null)
    }
  }, [editions, product.product_type, selectedEdition])

  useEffect(() => {
    if (
      (product.product_type === "game" || product.product_type === "software") &&
      platforms.length > 0 &&
      !selectedPlatform
    ) {
      setSelectedPlatform(platforms[0]?.id || null)
    }
  }, [platforms, product.product_type, selectedPlatform])

  useEffect(() => {
    if (product.product_type === "giftcard" && denominations.length > 0 && !selectedDenomination) {
      setSelectedDenomination(denominations[0]?.id || null)
    }
  }, [denominations, product.product_type, selectedDenomination])

  useEffect(() => {
    if (product.product_type === "software" && licenseTypes.length > 0 && !selectedLicenseType) {
      setSelectedLicenseType(licenseTypes[0]?.id || null)
    }
  }, [licenseTypes, product.product_type, selectedLicenseType])

  useEffect(() => {
    if (product.product_type === "subscription") {
      console.log("[v0] Product type:", product.product_type)
      console.log("[v0] Subscription plans from product:", product.subscription_plans)
      console.log("[v0] Plans variable:", plans)
      console.log("[v0] hasPlans:", plans.length > 0)
      if (plans.length) {
        console.log("[v0] First plan:", plans[0])
        console.log("[v0] First plan durations:", plans[0]?.durations)
      }
    }
  }, [product, plans])

  const calculatePrice = useCallback(() => {
    try {
      const productType = product.product_type

      if (productType === "game") {
        if (editions.length > 0 && selectedEdition) {
          const edition = editions.find((e) => e?.id === selectedEdition)
          return edition?.price || product.base_price || 0
        }
        return product.base_price || 0
      }

      if (productType === "giftcard") {
        if (denominations.length > 0 && selectedDenomination) {
          const denom = denominations.find((d) => d?.id === selectedDenomination)
          return denom?.price || product.base_price || 0
        }
        return product.base_price || 0
      }

      if (productType === "subscription") {
        if (plans.length > 0 && selectedPlan && selectedDuration) {
          const plan = plans.find((p) => p?.id === selectedPlan)
          const duration = plan?.durations?.find((d: any) => d?.id === selectedDuration)
          return duration?.price || product.base_price || 0
        }
        return product.base_price || 0
      }

      if (productType === "software") {
        let price = product.base_price || 0
        if (licenseTypes.length > 0 && selectedLicenseType) {
          const licenseType = licenseTypes.find((l) => l?.id === selectedLicenseType)
          price = licenseType?.price || price
        }
        if (product.license_durations && product.license_durations.length > 0 && selectedLicenseDuration) {
          const duration = product.license_durations?.find((d) => d?.id === selectedLicenseDuration)
          const multiplier = duration?.price_multiplier || 1
          price = price * multiplier
        }
        return price
      }

      return product.base_price || 0
    } catch (error) {
      return product.base_price || 0
    }
  }, [
    product,
    selectedEdition,
    selectedDenomination,
    selectedPlan,
    selectedDuration,
    selectedLicenseType,
    selectedLicenseDuration,
    editions.length,
    denominations.length,
    plans.length,
    licenseTypes.length,
    product.license_durations,
  ])

  const currentPrice = calculatePrice()

  const handlePlanChange = (planId: string) => {
    setSelectedPlan(planId)
    const plan = plans.find((p) => p?.id === planId)
    if (plan?.durations?.length) {
      setSelectedDuration(plan.durations[0]?.id || null)
    } else {
      setSelectedDuration(null)
    }
  }

  const currentPlanDurations = selectedPlan ? plans.find((p) => p?.id === selectedPlan)?.durations || [] : []

  const flashDealPrice = flashDeal ? Math.floor(currentPrice * (1 - flashDeal.discount_percentage / 100)) : null
  const displayPrice = flashDealPrice ?? currentPrice

  const handleAddToCart = useCallback(async () => {
    setAddingToCart(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 400))

      const selectedEditionObj = selectedEdition ? editions.find((e) => e?.id === selectedEdition) : null
      const selectedPlatformObj = selectedPlatform ? platforms.find((p) => p?.id === selectedPlatform) : null
      const selectedPlanObj = selectedPlan ? plans.find((p) => p?.id === selectedPlan) : null
      const selectedDurationObj = selectedDuration
        ? currentPlanDurations.find((d: any) => d?.id === selectedDuration)
        : null
      const selectedDenominationObj = selectedDenomination
        ? denominations.find((d) => d?.id === selectedDenomination)
        : null
      const selectedLicenseTypeObj = selectedLicenseType
        ? licenseTypes.find((l) => l?.id === selectedLicenseType)
        : null
      const selectedLicenseDurationObj = selectedLicenseDuration
        ? product.license_durations?.find((d) => d?.id === selectedLicenseDuration)
        : null

      addItem({
        productId: product.id,
        productTitle: product.title,
        productImage: product.image_url || "",
        productSlug: product.slug,
        productType: product.product_type || "subscription",
        price: displayPrice,
        quantity,
        // Edition
        editionId: selectedEditionObj?.id,
        editionName: selectedEditionObj?.name,
        // Platform
        platformId: selectedPlatformObj?.id,
        platformName: selectedPlatformObj?.name,
        // Plan
        planId: selectedPlanObj?.id,
        planName: selectedPlanObj?.name,
        // Duration
        durationId: selectedDurationObj?.id,
        durationLabel: selectedDurationObj?.label,
        durationMonths: selectedDurationObj?.months,
        // Denomination
        denominationId: selectedDenominationObj?.id,
        denominationValue: selectedDenominationObj?.value,
        // License Type
        licenseTypeId: selectedLicenseTypeObj?.id,
        licenseTypeName: selectedLicenseTypeObj?.name,
        // License Duration
        licenseDurationId: selectedLicenseDurationObj?.id,
        licenseDurationLabel: selectedLicenseDurationObj?.label,
      })

      toast({
        title: "Added to cart",
        description: flashDeal
          ? `${product.title} added with ${flashDeal.discount_percentage}% flash deal discount!`
          : `${product.title} has been added to your cart`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add to cart",
        variant: "destructive",
      })
    } finally {
      setAddingToCart(false)
    }
  }, [
    product,
    selectedEdition,
    selectedPlatform,
    selectedPlan,
    selectedDuration,
    selectedDenomination,
    selectedLicenseType,
    selectedLicenseDuration,
    editions,
    platforms,
    plans,
    currentPlanDurations,
    denominations,
    licenseTypes,
    quantity,
    addItem,
    toast,
    displayPrice,
    flashDeal,
  ])

  const handleToggleWishlist = () => {
    if (isFavorite) {
      removeFromWishlist(product.id)
      toast({
        title: "Removed from Wishlist",
        description: product.title,
        variant: "default",
      })
    } else {
      addToWishlist({
        productId: product.id,
        productTitle: product.title,
        productImage: product.image_url || "/placeholder.svg",
        productSlug: product.slug,
        price: currentPrice,
        originalPrice: product.original_price,
      })
      toast({
        title: "Added to Wishlist",
        description: product.title,
        variant: "success",
        action: (
          <Link href="/wishlist">
            <button className="inline-flex h-6 items-center justify-center rounded-md bg-zinc-800 px-2.5 text-[11px] font-medium text-zinc-300 transition-colors hover:bg-zinc-700">
              View
            </button>
          </Link>
        ),
      })
    }
  }

  const handleShare = async () => {
    const url = window.location.href
    const title = product.title

    // Try native share API first (mobile)
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `Check out ${title} on OTTSewa`,
          url: url,
        })
        toast({
          title: "Shared Successfully",
          description: "Thanks for sharing!",
          variant: "success",
        })
      } catch (err) {
        // User cancelled or share failed, fall back to copy
        if ((err as Error).name !== "AbortError") {
          await copyToClipboard(url)
        }
      }
    } else {
      // Fallback to clipboard
      await copyToClipboard(url)
    }
  }

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast({
        title: "Link Copied",
        description: "Product link copied to clipboard",
        variant: "success",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast({
        title: "Failed to Copy",
        description: "Please copy the URL manually",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {flashDeal && flashDealTimeLeft && (
        <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-xl p-3 sm:p-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                <Zap className="w-4 h-4 text-black" />
              </div>
              <div>
                <div className="text-amber-400 font-bold text-sm">FLASH DEAL</div>
                <div className="text-white/70 text-xs">Save {flashDeal.discount_percentage}% off</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <div className="flex items-center gap-1 text-xs font-mono">
                <span className="bg-black/40 px-1.5 py-0.5 rounded text-white">
                  {String(flashDealTimeLeft.hours).padStart(2, "0")}
                </span>
                <span className="text-amber-400">:</span>
                <span className="bg-black/40 px-1.5 py-0.5 rounded text-white">
                  {String(flashDealTimeLeft.minutes).padStart(2, "0")}
                </span>
                <span className="text-amber-400">:</span>
                <span className="bg-black/40 px-1.5 py-0.5 rounded text-white">
                  {String(flashDealTimeLeft.seconds).padStart(2, "0")}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {product.product_type === "game" && editions.length > 0 && (
        <div>
          <h3 className="text-xs sm:text-sm font-medium text-zinc-400 mb-2 sm:mb-3">Select Edition</h3>
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-3">
            {editions.map((edition) => (
              <button
                key={edition.id}
                onClick={() => setSelectedEdition(edition.id)}
                className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 text-left transition-all cursor-pointer ${
                  selectedEdition === edition.id
                    ? "border-amber-500 bg-amber-500/10"
                    : "border-zinc-700 bg-zinc-900 hover:border-zinc-600"
                }`}
              >
                <div className="font-semibold text-white text-sm sm:text-base">{edition.name}</div>
                <div className="text-amber-500 font-bold mt-0.5 sm:mt-1 text-sm sm:text-base">
                  {product.currency} {Number(edition.price).toLocaleString()}
                </div>
                {edition.description && (
                  <div className="text-[10px] sm:text-xs text-zinc-500 mt-1 line-clamp-2">{edition.description}</div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {(product.product_type === "game" || product.product_type === "software") && platforms.length > 0 && (
        <div>
          <h3 className="text-xs sm:text-sm font-medium text-zinc-400 mb-2 sm:mb-3">Select Platform</h3>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {platforms.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPlatform(p.id)}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border-2 transition-all cursor-pointer text-xs sm:text-sm ${
                  selectedPlatform === p.id
                    ? "border-amber-500 bg-amber-500/10 text-white"
                    : "border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-600"
                }`}
              >
                <span className="w-4 h-4 sm:w-5 sm:h-5">{getPlatformIcon(p.slug || "")}</span>
                <span>{p.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {product.product_type === "giftcard" && denominations.length > 0 && (
        <div>
          <h3 className="text-xs sm:text-sm font-medium text-zinc-400 mb-2 sm:mb-3">Select Value</h3>
          <div className="grid grid-cols-2 xs:grid-cols-3 gap-2 sm:gap-3">
            {denominations.map((denom) => (
              <button
                key={denom.id}
                onClick={() => setSelectedDenomination(denom.id)}
                className={`relative p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 text-center transition-all cursor-pointer ${
                  selectedDenomination === denom.id
                    ? "border-amber-500 bg-amber-500/10"
                    : "border-zinc-700 bg-zinc-900 hover:border-zinc-600"
                }`}
              >
                {denom.is_popular && (
                  <span className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 bg-amber-500 text-white text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full">
                    Popular
                  </span>
                )}
                <div className="text-base sm:text-xl font-bold text-white">
                  {denom.currency} {Number(denom.value).toLocaleString()}
                </div>
                <div className="text-xs sm:text-sm text-zinc-400 mt-0.5 sm:mt-1">
                  Pay {denom.currency} {Number(denom.price).toLocaleString()}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {product.product_type === "subscription" && plans.length > 0 && (
        <div className="space-y-3 sm:space-y-4">
          <div>
            <h3 className="text-xs sm:text-sm font-medium text-zinc-400 mb-2 sm:mb-3">Select Plan</h3>
            <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-3">
              {plans.map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => handlePlanChange(plan.id)}
                  className={`relative p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 text-left transition-all cursor-pointer ${
                    selectedPlan === plan.id
                      ? "border-amber-500 bg-amber-500/10"
                      : "border-zinc-700 bg-zinc-900 hover:border-zinc-600"
                  }`}
                >
                  {plan.is_popular && (
                    <span className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 bg-amber-500 text-white text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full">
                      Popular
                    </span>
                  )}
                  <div className="font-semibold text-white text-sm sm:text-base">{plan.name}</div>
                  {plan.description && (
                    <div className="text-[10px] sm:text-xs text-zinc-500 mt-0.5 sm:mt-1 line-clamp-2">
                      {plan.description}
                    </div>
                  )}
                  {plan.features && plan.features.length > 0 && (
                    <ul className="mt-1.5 sm:mt-2 space-y-0.5 sm:space-y-1">
                      {plan.features.slice(0, 3).map((feature, i) => (
                        <li key={i} className="text-[10px] sm:text-xs text-zinc-400 flex items-center gap-1">
                          <span className="text-amber-500">✓</span> {feature}
                        </li>
                      ))}
                    </ul>
                  )}
                </button>
              ))}
            </div>
          </div>

          {selectedPlan && currentPlanDurations.length > 0 && (
            <div>
              <h3 className="text-xs sm:text-sm font-medium text-zinc-400 mb-2 sm:mb-3">Select Duration</h3>
              <div className="grid grid-cols-2 xs:grid-cols-3 gap-2 sm:gap-3">
                {currentPlanDurations.map((duration: any) => (
                  <button
                    key={duration.id}
                    onClick={() => setSelectedDuration(duration.id)}
                    className={`relative p-2.5 sm:p-3 rounded-lg sm:rounded-xl border-2 text-center transition-all cursor-pointer ${
                      selectedDuration === duration.id
                        ? "border-amber-500 bg-amber-500/10"
                        : "border-zinc-700 bg-zinc-900 hover:border-zinc-600"
                    }`}
                  >
                    {duration.is_popular && (
                      <span className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 bg-amber-500 text-white text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full">
                        Best
                      </span>
                    )}
                    <div className="font-semibold text-white text-xs sm:text-sm">{duration.label}</div>
                    <div className="text-amber-500 font-bold mt-0.5 sm:mt-1 text-sm sm:text-base">
                      {product.currency} {Number(duration.price).toLocaleString()}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {product.product_type === "software" && licenseTypes.length > 0 && (
        <div>
          <h3 className="text-xs sm:text-sm font-medium text-zinc-400 mb-2 sm:mb-3">Select License Type</h3>
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-3">
            {licenseTypes.map((license) => (
              <button
                key={license.id}
                onClick={() => setSelectedLicenseType(license.id)}
                className={`relative p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 text-left transition-all cursor-pointer ${
                  selectedLicenseType === license.id
                    ? "border-amber-500 bg-amber-500/10"
                    : "border-zinc-700 bg-zinc-900 hover:border-zinc-600"
                }`}
              >
                {license.is_popular && (
                  <span className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 bg-amber-500 text-white text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full">
                    Popular
                  </span>
                )}
                <div className="font-semibold text-white text-sm sm:text-base">{license.name}</div>
                <div className="text-amber-500 font-bold mt-0.5 sm:mt-1 text-sm sm:text-base">
                  {product.currency} {Number(license.price).toLocaleString()}
                </div>
                {license.description && (
                  <div className="text-[10px] sm:text-xs text-zinc-500 mt-1 line-clamp-2">{license.description}</div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {product.product_type === "software" && product.license_durations && product.license_durations.length > 0 && (
        <div>
          <h3 className="text-xs sm:text-sm font-medium text-zinc-400 mb-2 sm:mb-3">Select Duration</h3>
          <div className="grid grid-cols-2 xs:grid-cols-3 gap-2 sm:gap-3">
            {product.license_durations.map((duration) => (
              <button
                key={duration.id}
                onClick={() => setSelectedLicenseDuration(duration.id)}
                className={`relative p-2.5 sm:p-3 rounded-lg sm:rounded-xl border-2 text-center transition-all cursor-pointer ${
                  selectedLicenseDuration === duration.id
                    ? "border-amber-500 bg-amber-500/10"
                    : "border-zinc-700 bg-zinc-900 hover:border-zinc-600"
                }`}
              >
                {duration.is_popular && (
                  <span className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 bg-amber-500 text-white text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full">
                    Best
                  </span>
                )}
                <div className="font-semibold text-white text-xs sm:text-sm">{duration.label}</div>
                <div className="text-[10px] sm:text-xs text-zinc-400 mt-0.5">{duration.price_multiplier}x price</div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="bg-zinc-900 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-zinc-800">
        <div className="flex items-baseline gap-2 sm:gap-3 mb-3 sm:mb-4">
          <span className="text-2xl sm:text-3xl font-bold text-white">
            {product.currency} {displayPrice.toLocaleString()}
          </span>
          {(flashDeal || (product.original_price && product.original_price > displayPrice)) && (
            <span className="text-base sm:text-lg text-zinc-500 line-through">
              {product.currency} {(flashDeal ? currentPrice : product.original_price)?.toLocaleString()}
            </span>
          )}
          {flashDeal && (
            <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-black text-xs font-bold px-2 py-0.5 rounded">
              -{flashDeal.discount_percentage}%
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
          <span className="text-xs sm:text-sm text-zinc-400">Quantity:</span>
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            <span className="w-8 sm:w-10 text-center text-white font-medium text-sm sm:text-base">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-col xs:flex-row gap-2 sm:gap-3">
          <Button
            onClick={handleAddToCart}
            className="bg-amber-500 text-white hover:bg-amber-600 rounded-lg px-4 py-2.5 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            disabled={addingToCart}
          >
            {addingToCart ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </>
            )}
          </Button>
          <Button
            variant="outline"
            className="border-zinc-700 text-zinc-400 hover:bg-zinc-800 rounded-lg px-4 py-2.5 transition-colors bg-transparent cursor-pointer"
            onClick={handleToggleWishlist}
          >
            {isFavorite ? <Heart className="w-4 h-4 text-red-500 fill-red-500" /> : <Heart className="w-4 h-4" />}
            {isFavorite ? "Remove from Wishlist" : "Add to Wishlist"}
          </Button>
          <Button
            variant="outline"
            className="border-zinc-700 text-zinc-400 hover:bg-zinc-800 rounded-lg px-4 py-2.5 transition-colors bg-transparent cursor-pointer"
            onClick={handleShare}
          >
            <Share2 className="w-4 h-4" />
            Share
          </Button>
        </div>
      </div>
    </div>
  )
}
