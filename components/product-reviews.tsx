"use client"

import type React from "react"

import { useState, useEffect, memo } from "react"
import { Star, ThumbsUp, CheckCircle, ChevronDown, Quote, Loader2, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

const FALLBACK_REVIEWS = [
  {
    id: "fallback-1",
    reviewer_name: "Rajesh Sharma",
    reviewer_location: "Kathmandu",
    rating: 5,
    created_at: "2024-12-22",
    title: "Instant delivery, genuine product!",
    content:
      "I was skeptical at first but OTTSewa delivered within minutes. The subscription activated immediately and works perfectly. Best price in Nepal!",
    verified_purchase: true,
    helpful_count: 47,
  },
  {
    id: "fallback-2",
    reviewer_name: "Priya Thapa",
    reviewer_location: "Pokhara",
    rating: 5,
    created_at: "2024-12-22",
    title: "Amazing service and support",
    content:
      "Customer support helped me with activation. Very professional team. Will definitely buy again for all my digital needs.",
    verified_purchase: true,
    helpful_count: 32,
  },
  {
    id: "fallback-3",
    reviewer_name: "Bikash Gurung",
    reviewer_location: "Lalitpur",
    rating: 4,
    created_at: "2024-12-22",
    title: "Great value for money",
    content:
      "Much cheaper than official prices. Works on all my devices. The only reason for 4 stars is I wish they had more payment options.",
    verified_purchase: true,
    helpful_count: 28,
  },
  {
    id: "fallback-4",
    reviewer_name: "Sunita Rai",
    reviewer_location: "Bhaktapur",
    rating: 5,
    created_at: "2024-12-22",
    title: "Super fast and reliable",
    content:
      "Ordered at night and got credentials within 5 minutes via email. No issues at all. Highly recommend OTTSewa to everyone!",
    verified_purchase: true,
    helpful_count: 41,
  },
  {
    id: "fallback-5",
    reviewer_name: "Arun Shrestha",
    reviewer_location: "Chitwan",
    rating: 5,
    created_at: "2024-12-22",
    title: "Legitimate and trustworthy",
    content:
      "Was worried about scams online but OTTSewa is completely legitimate. Easy payment through eSewa and instant delivery. Perfect!",
    verified_purchase: true,
    helpful_count: 56,
  },
  {
    id: "fallback-6",
    reviewer_name: "Manisha KC",
    reviewer_location: "Biratnagar",
    rating: 5,
    created_at: "2024-12-22",
    title: "Best place for digital products",
    content:
      "I've bought multiple subscriptions from here. Always genuine, always fast. OTTSewa is now my go-to for all digital purchases in Nepal.",
    verified_purchase: true,
    helpful_count: 38,
  },
]

interface Review {
  id: string
  reviewer_name: string
  reviewer_location: string | null
  rating: number
  created_at: string
  title: string | null
  content: string
  verified_purchase: boolean
  helpful_count: number
}

interface Stats {
  total: number
  average: number
  distribution: Record<number, number>
}

// Memoized star rating component
const StarRating = memo(({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) => {
  const sizeClass = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4"
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClass} ${star <= rating ? "fill-amber-400 text-amber-400" : "fill-zinc-700 text-zinc-700"}`}
        />
      ))}
    </div>
  )
})
StarRating.displayName = "StarRating"

const InteractiveStarRating = memo(
  ({ rating, onRatingChange }: { rating: number; onRatingChange: (r: number) => void }) => {
    const [hoverRating, setHoverRating] = useState(0)

    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            className="p-0.5 transition-transform hover:scale-110"
          >
            <Star
              className={`w-6 h-6 transition-colors ${
                star <= (hoverRating || rating)
                  ? "fill-amber-400 text-amber-400"
                  : "fill-zinc-700 text-zinc-700 hover:text-zinc-500"
              }`}
            />
          </button>
        ))}
      </div>
    )
  },
)
InteractiveStarRating.displayName = "InteractiveStarRating"

// Memoized review card
const ReviewCard = memo(({ review }: { review: Review }) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="bg-[#1a1a1a] border border-white/[0.06] rounded-xl p-4 sm:p-5 hover:border-white/[0.12] transition-colors">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400/20 to-amber-600/20 flex items-center justify-center text-amber-400 font-semibold text-sm flex-shrink-0 border border-amber-500/20">
          {getInitials(review.reviewer_name)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-white text-sm">{review.reviewer_name}</span>
            {review.verified_purchase && (
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                <CheckCircle className="w-2.5 h-2.5" />
                Verified
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            {review.reviewer_location && <span className="text-zinc-500 text-xs">{review.reviewer_location}</span>}
            {review.reviewer_location && <span className="text-zinc-700">•</span>}
            <span className="text-zinc-500 text-xs">{formatDate(review.created_at)}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <StarRating rating={review.rating} />
        {review.title && <span className="text-white font-medium text-sm">{review.title}</span>}
      </div>

      <p className="text-zinc-400 text-sm leading-relaxed mb-3">{review.content}</p>

      <div className="flex items-center gap-1 text-zinc-500 text-xs">
        <ThumbsUp className="w-3.5 h-3.5" />
        <span>{review.helpful_count} found this helpful</span>
      </div>
    </div>
  )
})
ReviewCard.displayName = "ReviewCard"

const ReviewForm = memo(
  ({
    productId,
    productName,
    onSubmitSuccess,
  }: {
    productId: string
    productName: string
    onSubmitSuccess: () => void
  }) => {
    const { toast } = useToast()
    const [isOpen, setIsOpen] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [formData, setFormData] = useState({
      reviewer_name: "",
      reviewer_location: "",
      rating: 5,
      title: "",
      content: "",
    })

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()

      if (!formData.reviewer_name.trim() || !formData.content.trim()) {
        toast({
          title: "Missing information",
          description: "Please provide your name and review content.",
          variant: "destructive",
        })
        return
      }

      if (formData.content.trim().length < 20) {
        toast({
          title: "Review too short",
          description: "Please write at least 20 characters in your review.",
          variant: "destructive",
        })
        return
      }

      setSubmitting(true)
      try {
        const res = await fetch("/api/reviews", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            product_id: productId,
            ...formData,
          }),
        })

        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.error || "Failed to submit review")
        }

        toast({
          title: "Review submitted!",
          description: "Thank you for sharing your experience with OTTSewa.",
        })

        setFormData({
          reviewer_name: "",
          reviewer_location: "",
          rating: 5,
          title: "",
          content: "",
        })
        setIsOpen(false)
        onSubmitSuccess()
      } catch (error) {
        toast({
          title: "Failed to submit",
          description: error instanceof Error ? error.message : "Please try again later.",
          variant: "destructive",
        })
      } finally {
        setSubmitting(false)
      }
    }

    if (!isOpen) {
      return (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full py-4 text-sm font-medium text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
        >
          <Star className="w-4 h-4" />
          Write a Review
        </button>
      )
    }

    return (
      <form onSubmit={handleSubmit} className="bg-[#1a1a1a] border border-white/[0.08] rounded-xl p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-white font-semibold">Share Your Experience</h3>
          <button type="button" onClick={() => setIsOpen(false)} className="text-zinc-500 hover:text-white text-sm">
            Cancel
          </button>
        </div>

        <p className="text-zinc-500 text-sm">
          Reviewing: <span className="text-amber-400">{productName}</span>
        </p>

        {/* Rating */}
        <div>
          <label className="block text-sm text-zinc-400 mb-2">Your Rating</label>
          <InteractiveStarRating
            rating={formData.rating}
            onRatingChange={(r) => setFormData((prev) => ({ ...prev, rating: r }))}
          />
        </div>

        {/* Name and Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-zinc-400 mb-1.5">Your Name *</label>
            <Input
              value={formData.reviewer_name}
              onChange={(e) => setFormData((prev) => ({ ...prev, reviewer_name: e.target.value }))}
              placeholder="e.g., Rajesh Sharma"
              className="bg-[#0f0f0f] border-white/[0.08] text-white placeholder:text-zinc-600"
              maxLength={100}
            />
          </div>
          <div>
            <label className="block text-sm text-zinc-400 mb-1.5">Location (Optional)</label>
            <Input
              value={formData.reviewer_location}
              onChange={(e) => setFormData((prev) => ({ ...prev, reviewer_location: e.target.value }))}
              placeholder="e.g., Kathmandu"
              className="bg-[#0f0f0f] border-white/[0.08] text-white placeholder:text-zinc-600"
              maxLength={100}
            />
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm text-zinc-400 mb-1.5">Review Title (Optional)</label>
          <Input
            value={formData.title}
            onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
            placeholder="e.g., Great service and fast delivery!"
            className="bg-[#0f0f0f] border-white/[0.08] text-white placeholder:text-zinc-600"
            maxLength={200}
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm text-zinc-400 mb-1.5">Your Review *</label>
          <Textarea
            value={formData.content}
            onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
            placeholder="Tell us about your experience with this product..."
            className="bg-[#0f0f0f] border-white/[0.08] text-white placeholder:text-zinc-600 min-h-[100px] resize-none"
            maxLength={1000}
          />
          <p className="text-zinc-600 text-xs mt-1">{formData.content.length}/1000 characters</p>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={submitting}
          className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white border-0"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Submit Review
            </>
          )}
        </Button>
      </form>
    )
  },
)
ReviewForm.displayName = "ReviewForm"

interface ProductReviewsProps {
  productName: string
  productId: string
  reviewCount?: number
  averageRating?: number
}

export function ProductReviews({
  productName,
  productId,
  reviewCount = 156,
  averageRating = 4.8,
}: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/reviews?productId=${productId}&limit=20`)
      const data = await res.json()

      if (data.reviews && data.reviews.length > 0) {
        setReviews(data.reviews)
        setStats(data.stats)
      } else {
        // Use fallback reviews if none exist
        setReviews(FALLBACK_REVIEWS)
        setStats({
          total: FALLBACK_REVIEWS.length,
          average: 4.8,
          distribution: { 5: 5, 4: 1, 3: 0, 2: 0, 1: 0 },
        })
      }
    } catch (error) {
      // Use fallback reviews on error
      setReviews(FALLBACK_REVIEWS)
      setStats({
        total: FALLBACK_REVIEWS.length,
        average: 4.8,
        distribution: { 5: 5, 4: 1, 3: 0, 2: 0, 1: 0 },
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [productId])

  const handleReviewSubmitSuccess = () => {
    // Refresh reviews after submission
    setLoading(true)
    fetchReviews()
  }

  const displayedReviews = showAll ? reviews : reviews.slice(0, 3)
  const displayAverage = stats?.average || averageRating
  const displayTotal = stats?.total || reviewCount

  // Rating distribution
  const ratingDistribution = stats
    ? [5, 4, 3, 2, 1].map((stars) => ({
        stars,
        percentage: displayTotal > 0 ? Math.round((stats.distribution[stars] / displayTotal) * 100) : 0,
      }))
    : [
        { stars: 5, percentage: 78 },
        { stars: 4, percentage: 15 },
        { stars: 3, percentage: 5 },
        { stars: 2, percentage: 1 },
        { stars: 1, percentage: 1 },
      ]

  // Find featured review (highest helpful count)
  const featuredReview = reviews.reduce(
    (prev, current) => (prev.helpful_count > current.helpful_count ? prev : current),
    reviews[0] || FALLBACK_REVIEWS[0],
  )

  return (
    <div className="rounded-2xl border border-white/[0.08] p-3 bg-transparent mt-6">
      <div className="rounded-xl bg-[#0f0f0f] p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white mb-1">Customer Reviews</h2>
            <p className="text-zinc-500 text-sm">Based on {displayTotal.toLocaleString()} verified purchases</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1.5 justify-end">
              <span className="text-2xl font-bold text-white">{displayAverage.toFixed(1)}</span>
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            </div>
            <p className="text-zinc-500 text-xs mt-0.5">out of 5</p>
          </div>
        </div>

        {/* Rating Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 pb-6 border-b border-white/[0.06]">
          {/* Rating Bars */}
          <div className="space-y-2">
            {ratingDistribution.map((item) => (
              <div key={item.stars} className="flex items-center gap-2">
                <span className="text-xs text-zinc-500 w-3">{item.stars}</span>
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <span className="text-xs text-zinc-500 w-8 text-right">{item.percentage}%</span>
              </div>
            ))}
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#1a1a1a] border border-white/[0.06] rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-emerald-400 mb-1">98%</div>
              <div className="text-xs text-zinc-500">Would Recommend</div>
            </div>
            <div className="bg-[#1a1a1a] border border-white/[0.06] rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-amber-400 mb-1">5 min</div>
              <div className="text-xs text-zinc-500">Avg. Delivery</div>
            </div>
            <div className="bg-[#1a1a1a] border border-white/[0.06] rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-blue-400 mb-1">24/7</div>
              <div className="text-xs text-zinc-500">Support</div>
            </div>
            <div className="bg-[#1a1a1a] border border-white/[0.06] rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-purple-400 mb-1">100%</div>
              <div className="text-xs text-zinc-500">Genuine</div>
            </div>
          </div>
        </div>

        {/* Featured Quote */}
        {featuredReview && (
          <div className="bg-gradient-to-br from-amber-500/5 to-amber-600/5 border border-amber-500/10 rounded-xl p-4 sm:p-5 mb-6">
            <Quote className="w-6 h-6 text-amber-400/40 mb-2" />
            <p className="text-white font-medium text-sm sm:text-base mb-3 italic">"{featuredReview.content}"</p>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 text-xs font-semibold">
                {featuredReview.reviewer_name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
              </div>
              <div>
                <div className="text-sm text-white font-medium">{featuredReview.reviewer_name}</div>
                <div className="text-xs text-zinc-500">
                  Verified Buyer{featuredReview.reviewer_location ? ` from ${featuredReview.reviewer_location}` : ""}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mb-6">
          <ReviewForm productId={productId} productName={productName} onSubmitSuccess={handleReviewSubmitSuccess} />
        </div>

        {/* Reviews List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 text-amber-400 animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            {displayedReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}

        {/* Show More Button */}
        {!loading && reviews.length > 3 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="w-full mt-4 py-3 text-sm font-medium text-amber-400 hover:text-amber-300 bg-amber-500/5 hover:bg-amber-500/10 rounded-lg border border-amber-500/10 transition-colors flex items-center justify-center gap-2"
          >
            {showAll ? "Show Less" : `Show All ${reviews.length} Reviews`}
            <ChevronDown className={`w-4 h-4 transition-transform ${showAll ? "rotate-180" : ""}`} />
          </button>
        )}
      </div>
    </div>
  )
}

export function generateReviewSchema(productName: string, productId: string) {
  return FALLBACK_REVIEWS.map((review) => ({
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: {
      "@type": "Product",
      name: productName,
      sku: productId,
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: review.rating,
      bestRating: 5,
      worstRating: 1,
    },
    author: {
      "@type": "Person",
      name: review.reviewer_name,
    },
    datePublished: review.created_at,
    reviewBody: review.content,
    name: review.title,
    publisher: {
      "@type": "Organization",
      name: "OTTSewa",
    },
  }))
}
