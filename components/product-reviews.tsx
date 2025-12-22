import { ProductReviewsClient } from "./product-reviews-client"

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

interface ProductReviewsProps {
  productId: string
  productName: string
  initialStats?: {
    average_rating: number | null
    review_count: number | null
  }
  initialReviews?: Review[]
  initialTotal?: number
}

// Re-export for backward compatibility
export function ProductReviews({
  productId,
  productName,
  initialStats,
  initialReviews = [],
  initialTotal = 0,
}: ProductReviewsProps) {
  const stats = {
    average: initialStats?.average_rating || 0,
    total: initialStats?.review_count || initialTotal || 0,
  }

  return (
    <ProductReviewsClient
      productId={productId}
      productName={productName}
      initialReviews={initialReviews}
      initialStats={stats}
      initialTotal={initialTotal}
    />
  )
}

export { ProductReviewsClient } from "./product-reviews-client"
export { ProductReviewsServer } from "./product-reviews-server"
