"use client"

import type React from "react"
import { useState } from "react"
import {
  Star,
  ThumbsUp,
  CheckCircle,
  ChevronDown,
  Loader2,
  MessageSquare,
  PenLine,
  Send,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface Review {
  id: string
  rating: number
  title: string | null
  content: string | null
  is_verified_purchase: boolean
  is_featured: boolean
  helpful_count: number
  created_at: string
  user: {
    full_name: string | null
  }
}

interface ReviewStats {
  average: number
  total: number
  distribution: {
    5: number
    4: number
    3: number
    2: number
    1: number
  }
}

interface ProductReviewsClientProps {
  productId: string
  productName: string
  initialReviews: Review[]
  initialStats: { average: number; total: number }
  initialTotal: number
}

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  }

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            sizeClasses[size],
            star <= rating
              ? "text-amber-400 fill-amber-400"
              : star - 0.5 <= rating
                ? "text-amber-400 fill-amber-400/50"
                : "text-zinc-600",
          )}
        />
      ))}
    </div>
  )
}

function InteractiveStarRating({ rating, onRatingChange }: { rating: number; onRatingChange: (r: number) => void }) {
  const [hoverRating, setHoverRating] = useState(0)

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className="p-0.5 focus:outline-none transition-transform hover:scale-110"
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
          onClick={() => onRatingChange(star)}
        >
          <Star
            className={cn(
              "w-7 h-7 transition-colors",
              (hoverRating || rating) >= star
                ? "text-amber-400 fill-amber-400"
                : "text-zinc-600 hover:text-amber-400/50",
            )}
          />
        </button>
      ))}
      <span className="ml-2 text-sm text-zinc-400">
        {hoverRating || rating
          ? `${hoverRating || rating} star${(hoverRating || rating) > 1 ? "s" : ""}`
          : "Select rating"}
      </span>
    </div>
  )
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return "Today"
  if (diffDays === 1) return "Yesterday"
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
}

function getInitials(name: string | null) {
  if (!name) return "U"
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function ProductReviewsClient({
  productId,
  productName,
  initialReviews,
  initialStats,
  initialTotal,
}: ProductReviewsClientProps) {
  const { toast } = useToast()
  const [reviews, setReviews] = useState<Review[]>(initialReviews)
  const [stats, setStats] = useState<ReviewStats | null>(null)
  const [loadingMore, setLoadingMore] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(initialTotal > initialReviews.length)
  const [total, setTotal] = useState(initialTotal)

  const [showReviewForm, setShowReviewForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [reviewRating, setReviewRating] = useState(0)
  const [reviewTitle, setReviewTitle] = useState("")
  const [reviewContent, setReviewContent] = useState("")

  const fetchMoreReviews = async () => {
    setLoadingMore(true)
    try {
      const nextPage = page + 1
      const res = await fetch(`/api/reviews?productId=${productId}&page=${nextPage}&limit=5`)
      const data = await res.json()

      if (res.ok) {
        setReviews((prev) => [...prev, ...(data.reviews || [])])
        if (data.stats) setStats(data.stats)
        setTotal(data.total)
        setPage(nextPage)
        setHasMore((data.reviews?.length || 0) === 5 && reviews.length + (data.reviews?.length || 0) < data.total)
      }
    } catch (error) {
      console.error("Error fetching more reviews:", error)
    } finally {
      setLoadingMore(false)
    }
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()

    if (reviewRating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a star rating before submitting.",
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
          productId,
          rating: reviewRating,
          title: reviewTitle.trim() || null,
          content: reviewContent.trim() || null,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        toast({
          title: "Review Submitted",
          description: "Thank you! Your review is pending approval and will be visible soon.",
        })
        setShowReviewForm(false)
        setReviewRating(0)
        setReviewTitle("")
        setReviewContent("")
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to submit review. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const displayStats = stats || {
    average: initialStats.average,
    total: initialStats.total,
    distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  }

  return (
    <div className="rounded-2xl border border-white/[0.08] p-3 bg-transparent">
      <div className="rounded-xl bg-[#0f0f0f] p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-amber-400" />
            Customer Reviews
          </h2>
          <Button
            onClick={() => setShowReviewForm(!showReviewForm)}
            size="sm"
            className={cn(
              "gap-1.5 text-xs",
              showReviewForm
                ? "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                : "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black",
            )}
          >
            <PenLine className="w-3.5 h-3.5" />
            {showReviewForm ? "Cancel" : "Write Review"}
          </Button>
        </div>

        {/* Review Form */}
        {showReviewForm && (
          <form onSubmit={handleSubmitReview} className="mb-6 p-4 bg-[#1a1a1a] rounded-xl border border-amber-500/20">
            <h3 className="font-medium text-white mb-4 flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400" />
              Write Your Review for {productName}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Your Rating *</label>
                <InteractiveStarRating rating={reviewRating} onRatingChange={setReviewRating} />
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-2">Review Title (Optional)</label>
                <Input
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="Summarize your experience"
                  className="bg-[#0f0f0f] border-white/[0.08] text-white placeholder:text-zinc-600"
                  maxLength={100}
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-2">Your Review (Optional)</label>
                <Textarea
                  value={reviewContent}
                  onChange={(e) => setReviewContent(e.target.value)}
                  placeholder="Share your experience with this product..."
                  className="bg-[#0f0f0f] border-white/[0.08] text-white placeholder:text-zinc-600 min-h-[100px] resize-none"
                  maxLength={1000}
                />
                <p className="text-xs text-zinc-600 mt-1">{reviewContent.length}/1000 characters</p>
              </div>

              <div className="flex items-start gap-2 p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-amber-200/80">
                  Your review will be visible after approval. If you have purchased this product, your review will be
                  marked as a verified purchase.
                </p>
              </div>

              <Button
                type="submit"
                disabled={submitting || reviewRating === 0}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-medium"
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
            </div>
          </form>
        )}

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-[#1a1a1a] rounded-xl border border-white/[0.06]">
          <div className="flex flex-col items-center justify-center text-center p-4">
            <div className="text-4xl sm:text-5xl font-bold text-white mb-2">
              {displayStats.average > 0 ? displayStats.average.toFixed(1) : "0.0"}
            </div>
            <StarRating rating={displayStats.average} size="lg" />
            <p className="text-zinc-500 text-sm mt-2">
              Based on {displayStats.total} {displayStats.total === 1 ? "review" : "reviews"}
            </p>
          </div>

          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = displayStats.distribution[star as keyof typeof displayStats.distribution]
              const percentage = displayStats.total > 0 ? (count / displayStats.total) * 100 : 0
              return (
                <div key={star} className="flex items-center gap-2">
                  <span className="text-xs text-zinc-500 w-6">{star}</span>
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <div className="flex-1 h-2 bg-[#222] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-zinc-500 w-8 text-right">{count}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Reviews List */}
        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className={cn(
                  "p-4 rounded-xl border transition-colors",
                  review.is_featured ? "bg-amber-500/5 border-amber-500/20" : "bg-[#1a1a1a] border-white/[0.06]",
                )}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400/20 to-amber-600/20 flex items-center justify-center text-amber-400 font-medium text-sm">
                      {getInitials(review.user?.full_name)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white text-sm">{review.user?.full_name || "Anonymous"}</span>
                        {review.is_verified_purchase && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded">
                            <CheckCircle className="w-3 h-3" />
                            Verified
                          </span>
                        )}
                        {review.is_featured && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                            <Star className="w-3 h-3 fill-amber-400" />
                            Featured
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <StarRating rating={review.rating} size="sm" />
                        <span className="text-xs text-zinc-600">{formatDate(review.created_at)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {review.title && <h4 className="font-medium text-white mb-1 text-sm">{review.title}</h4>}
                {review.content && <p className="text-zinc-400 text-sm leading-relaxed">{review.content}</p>}

                {review.helpful_count > 0 && (
                  <div className="mt-3 flex items-center gap-1 text-xs text-zinc-500">
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{review.helpful_count} found this helpful</span>
                  </div>
                )}
              </div>
            ))}

            {hasMore && (
              <div className="flex justify-center pt-2">
                <Button
                  variant="outline"
                  onClick={fetchMoreReviews}
                  disabled={loadingMore}
                  className="bg-[#1a1a1a] border-white/[0.06] text-zinc-400 hover:text-white hover:bg-[#222]"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4 mr-2" />
                      Load More Reviews
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#1a1a1a] flex items-center justify-center">
              <MessageSquare className="w-8 h-8 text-zinc-600" />
            </div>
            <h3 className="text-white font-medium mb-1">No Reviews Yet</h3>
            <p className="text-zinc-500 text-sm mb-4">Be the first to review this product</p>
            {!showReviewForm && (
              <Button
                onClick={() => setShowReviewForm(true)}
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black"
              >
                <PenLine className="w-4 h-4 mr-2" />
                Write a Review
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
