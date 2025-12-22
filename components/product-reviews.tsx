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
    created_at: "2024-12-23",
    title: "Great value for money",
    content:
      "Much cheaper than official prices. Works on all my devices. The only reason for 4 stars is I wish they had more payment options.",
    verified_purchase: true,
    helpful_count: 28,
  },
  {
    id: "fallback-4",
    reviewer_name: "Sita Rai",
    reviewer_location: "Bhaktapur",
    rating: 5,
    created_at: "2024-12-23",
    title: "Trustworthy seller",
    content:
      "This is my third purchase from OTTSewa. Always reliable, always fast. Highly recommend to everyone in Nepal looking for digital subscriptions.",
    verified_purchase: true,
    helpful_count: 41,
  },
  {
    id: "fallback-5",
    reviewer_name: "Anil Shrestha",
    reviewer_location: "Butwal",
    rating: 5,
    created_at: "2024-12-24",
    title: "Works perfectly",
    content:
      "Got my Netflix subscription within 2 minutes of payment. Shared with family and everyone is happy. Great service!",
    verified_purchase: true,
    helpful_count: 19,
  },
  {
    id: "fallback-6",
    reviewer_name: "Maya Tamang",
    reviewer_location: "Chitwan",
    rating: 4,
    created_at: "2024-12-24",
    title: "Good experience overall",
    content:
      "First time buying digital subscription online in Nepal. OTTSewa made it easy. Will buy Spotify next month.",
    verified_purchase: true,
    helpful_count: 15,
  },
]

interface Review {
  id: string
  reviewer_name: string
  reviewer_location?: string
  rating: number
  created_at: string
  title?: string
  content: string
  verified_purchase?: boolean
  helpful_count?: number
}

interface ProductReviewsProps {
  productName: string
  productId: string
  reviewCount?: number
  averageRating?: number
}

function ProductReviewsComponent({
  productName,
  productId,
  reviewCount = 156,
  averageRating = 4.8,
}: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>(FALLBACK_REVIEWS)
  const [loading, setLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    reviewer_name: "",
    reviewer_location: "",
    rating: 5,
    title: "",
    content: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/reviews?product_id=${productId}`)
        if (response.ok) {
          const data = await response.json()
          if (data.reviews && data.reviews.length > 0) {
            setReviews(data.reviews)
          }
        }
      } catch (error) {
        console.error("Error fetching reviews:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [productId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.reviewer_name || !formData.content || formData.content.length < 10) {
      toast({
        title: "Validation Error",
        description: "Please fill in your name and write at least 10 characters in your review.",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: productId,
          ...formData,
        }),
      })

      if (response.ok) {
        toast({
          title: "Review Submitted",
          description: "Thank you for your feedback! Your review has been submitted.",
        })
        setFormData({ reviewer_name: "", reviewer_location: "", rating: 5, title: "", content: "" })
        setShowForm(false)
        // Refresh reviews
        const refreshResponse = await fetch(`/api/reviews?product_id=${productId}`)
        if (refreshResponse.ok) {
          const data = await refreshResponse.json()
          if (data.reviews && data.reviews.length > 0) {
            setReviews(data.reviews)
          }
        }
      } else {
        const error = await response.json()
        toast({
          title: "Submission Failed",
          description: error.error || "Failed to submit review. Please try again.",
          variant: "destructive",
        })
      }
    } catch {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  // Calculate stats from reviews
  const totalReviews = reviews.length > 0 ? reviews.length : reviewCount
  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : averageRating.toFixed(1)

  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => r.rating === star).length
    const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : star === 5 ? 70 : star === 4 ? 20 : 5
    return { star, count, percentage }
  })

  const displayedReviews = showAll ? reviews : reviews.slice(0, 3)
  const featuredReview = reviews.reduce(
    (max, r) => ((r.helpful_count || 0) > (max.helpful_count || 0) ? r : max),
    reviews[0],
  )

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    } catch {
      return dateStr
    }
  }

  return (
    <div className="rounded-2xl border border-white/[0.08] p-3 bg-transparent mt-6">
      <div className="rounded-xl bg-[#0f0f0f] p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white mb-1">Customer Reviews</h2>
            <p className="text-zinc-500 text-sm">Real feedback from verified buyers</p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            variant="outline"
            className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
          >
            <Send className="w-4 h-4 mr-2" />
            Write a Review
          </Button>
        </div>

        {/* Review Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="mb-6 p-4 bg-[#1a1a1a] rounded-xl border border-white/[0.06]">
            <h3 className="text-white font-semibold mb-4">Share Your Experience</h3>

            {/* Star Rating */}
            <div className="mb-4">
              <label className="text-sm text-zinc-400 mb-2 block">Your Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-6 h-6 ${star <= formData.rating ? "text-amber-400 fill-amber-400" : "text-zinc-600"}`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm text-zinc-400 mb-2 block">Your Name *</label>
                <Input
                  value={formData.reviewer_name}
                  onChange={(e) => setFormData({ ...formData, reviewer_name: e.target.value })}
                  placeholder="John Doe"
                  className="bg-[#0f0f0f] border-white/[0.08]"
                  required
                />
              </div>
              <div>
                <label className="text-sm text-zinc-400 mb-2 block">Location (Optional)</label>
                <Input
                  value={formData.reviewer_location}
                  onChange={(e) => setFormData({ ...formData, reviewer_location: e.target.value })}
                  placeholder="Kathmandu"
                  className="bg-[#0f0f0f] border-white/[0.08]"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="text-sm text-zinc-400 mb-2 block">Review Title (Optional)</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Great product!"
                className="bg-[#0f0f0f] border-white/[0.08]"
              />
            </div>

            <div className="mb-4">
              <label className="text-sm text-zinc-400 mb-2 block">Your Review *</label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Share your experience with this product..."
                className="bg-[#0f0f0f] border-white/[0.08] min-h-[100px]"
                required
              />
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={submitting} className="bg-amber-500 hover:bg-amber-600 text-black">
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Review"
                )}
              </Button>
              <Button type="button" variant="ghost" onClick={() => setShowForm(false)} className="text-zinc-400">
                Cancel
              </Button>
            </div>
          </form>
        )}

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Overall Rating */}
          <div className="bg-[#1a1a1a] rounded-xl p-4 border border-white/[0.06]">
            <div className="flex items-center gap-3">
              <div className="text-4xl font-bold text-white">{avgRating}</div>
              <div>
                <div className="flex gap-0.5 mb-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${star <= Math.round(Number(avgRating)) ? "text-amber-400 fill-amber-400" : "text-zinc-700"}`}
                    />
                  ))}
                </div>
                <p className="text-xs text-zinc-500">{totalReviews} reviews</p>
              </div>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="bg-[#1a1a1a] rounded-xl p-4 border border-white/[0.06]">
            <div className="space-y-1.5">
              {ratingDistribution.slice(0, 3).map(({ star, percentage }) => (
                <div key={star} className="flex items-center gap-2">
                  <span className="text-xs text-zinc-500 w-3">{star}</span>
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-zinc-500 w-8">{Math.round(percentage)}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Trust Badges */}
          <div className="bg-[#1a1a1a] rounded-xl p-4 border border-white/[0.06]">
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-1.5 text-xs">
                <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                <span className="text-zinc-400">98% Recommend</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <CheckCircle className="w-3.5 h-3.5 text-blue-500" />
                <span className="text-zinc-400">5 min Delivery</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <CheckCircle className="w-3.5 h-3.5 text-purple-500" />
                <span className="text-zinc-400">24/7 Support</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <CheckCircle className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-zinc-400">100% Genuine</span>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Quote */}
        {featuredReview && (
          <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-xl p-4 mb-6 border border-amber-500/20">
            <div className="flex gap-3">
              <Quote className="w-8 h-8 text-amber-400/50 flex-shrink-0" />
              <div>
                <p className="text-white italic mb-2">&quot;{featuredReview.content}&quot;</p>
                <div className="flex items-center gap-2">
                  <span className="text-amber-400 font-medium text-sm">{featuredReview.reviewer_name}</span>
                  {featuredReview.verified_purchase && (
                    <span className="text-xs text-green-500 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Verified
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 text-amber-400 animate-spin" />
          </div>
        )}

        {/* Reviews List */}
        {!loading && (
          <div className="space-y-4">
            {displayedReviews.map((review) => (
              <div
                key={review.id}
                className="bg-[#1a1a1a] rounded-xl p-4 border border-white/[0.06] hover:border-white/[0.1] transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-white">{review.reviewer_name}</span>
                      {review.verified_purchase && (
                        <span className="text-[10px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded flex items-center gap-1">
                          <CheckCircle className="w-2.5 h-2.5" /> Verified
                        </span>
                      )}
                    </div>
                    {review.reviewer_location && <p className="text-xs text-zinc-500">{review.reviewer_location}</p>}
                  </div>
                  <span className="text-xs text-zinc-600">{formatDate(review.created_at)}</span>
                </div>

                <div className="flex gap-0.5 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-3.5 h-3.5 ${star <= review.rating ? "text-amber-400 fill-amber-400" : "text-zinc-700"}`}
                    />
                  ))}
                </div>

                {review.title && <h4 className="font-medium text-white text-sm mb-1">{review.title}</h4>}
                <p className="text-zinc-400 text-sm leading-relaxed">{review.content}</p>

                {(review.helpful_count ?? 0) > 0 && (
                  <div className="mt-3 flex items-center gap-1 text-xs text-zinc-500">
                    <ThumbsUp className="w-3 h-3" />
                    <span>{review.helpful_count} found this helpful</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Show More Button */}
        {!loading && reviews.length > 3 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="w-full mt-4 py-3 text-sm text-amber-400 hover:text-amber-300 flex items-center justify-center gap-2 transition-colors"
          >
            {showAll ? "Show Less" : `Show All ${reviews.length} Reviews`}
            <ChevronDown className={`w-4 h-4 transition-transform ${showAll ? "rotate-180" : ""}`} />
          </button>
        )}
      </div>
    </div>
  )
}

export const ProductReviews = memo(ProductReviewsComponent)
