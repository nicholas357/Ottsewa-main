import { Star, MessageSquare, CheckCircle } from "lucide-react"

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
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-3.5 h-3.5 ${
            star <= rating
              ? "text-amber-400 fill-amber-400"
              : star - 0.5 <= rating
                ? "text-amber-400 fill-amber-400/50"
                : "text-zinc-600"
          }`}
        />
      ))}
    </div>
  )
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

// Server component - renders immediately for SEO crawlers
export function ProductReviewsServer({
  reviews,
  stats,
  productName,
  productId,
}: {
  reviews: Review[]
  stats: ReviewStats
  productName: string
  productId: string
}) {
  return (
    <section
      id="reviews-section"
      className="rounded-2xl border border-white/[0.08] p-3 bg-transparent"
      itemScope
      itemType="https://schema.org/Product"
    >
      <meta itemProp="name" content={productName} />
      <div className="rounded-xl bg-[#0f0f0f] p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-amber-400" />
            Customer Reviews
          </h2>
        </div>

        {/* Aggregate Rating for SEO */}
        {stats.total > 0 && (
          <div itemProp="aggregateRating" itemScope itemType="https://schema.org/AggregateRating" className="sr-only">
            <meta itemProp="ratingValue" content={String(stats.average)} />
            <meta itemProp="reviewCount" content={String(stats.total)} />
            <meta itemProp="bestRating" content="5" />
            <meta itemProp="worstRating" content="1" />
          </div>
        )}

        {/* Stats Section - Server rendered */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-[#1a1a1a] rounded-xl border border-white/[0.06]">
          <div className="flex flex-col items-center justify-center text-center p-4">
            <div className="text-4xl sm:text-5xl font-bold text-white mb-2">
              {stats.average > 0 ? stats.average.toFixed(1) : "0.0"}
            </div>
            <div className="flex items-center gap-0.5 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${star <= stats.average ? "text-amber-400 fill-amber-400" : "text-zinc-600"}`}
                />
              ))}
            </div>
            <p className="text-zinc-500 text-sm">
              Based on {stats.total} {stats.total === 1 ? "review" : "reviews"}
            </p>
          </div>
          <div className="flex items-center justify-center">
            <p className="text-zinc-500 text-sm text-center">
              {stats.total > 0
                ? "See what our customers are saying about this product."
                : "Be the first to share your experience with this product."}
            </p>
          </div>
        </div>

        {/* Reviews List - Server rendered for SEO */}
        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <article
                key={review.id}
                className={`p-4 rounded-xl border transition-colors ${
                  review.is_featured ? "bg-amber-500/5 border-amber-500/20" : "bg-[#1a1a1a] border-white/[0.06]"
                }`}
                itemProp="review"
                itemScope
                itemType="https://schema.org/Review"
              >
                {/* Review Rating Schema */}
                <div itemProp="reviewRating" itemScope itemType="https://schema.org/Rating" className="sr-only">
                  <meta itemProp="ratingValue" content={String(review.rating)} />
                  <meta itemProp="bestRating" content="5" />
                  <meta itemProp="worstRating" content="1" />
                </div>

                {/* Author Schema */}
                <div itemProp="author" itemScope itemType="https://schema.org/Person" className="sr-only">
                  <meta itemProp="name" content={review.user?.full_name || "Anonymous"} />
                </div>

                {/* Date */}
                <meta itemProp="datePublished" content={new Date(review.created_at).toISOString().split("T")[0]} />

                {/* Header */}
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
                        <StarRating rating={review.rating} />
                        <span className="text-xs text-zinc-600">
                          {new Date(review.created_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                {review.title && (
                  <h4 className="font-medium text-white mb-1 text-sm" itemProp="name">
                    {review.title}
                  </h4>
                )}
                {review.content && (
                  <p className="text-zinc-400 text-sm leading-relaxed" itemProp="reviewBody">
                    {review.content}
                  </p>
                )}
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#1a1a1a] flex items-center justify-center">
              <MessageSquare className="w-8 h-8 text-zinc-600" />
            </div>
            <h3 className="text-white font-medium mb-1">No Reviews Yet</h3>
            <p className="text-zinc-500 text-sm">Be the first to review this product</p>
          </div>
        )}
      </div>
    </section>
  )
}
