// Server-safe review schema generation for SEO
export interface ReviewData {
  reviewer_name: string
  rating: number
  created_at: string
  title?: string
  content: string
}

export function generateReviewSchema(productName: string, reviews: ReviewData[] | null | undefined): object[] {
  // Ensure reviews is a valid array
  if (!reviews || !Array.isArray(reviews) || reviews.length === 0) {
    return []
  }

  return reviews.map((review) => ({
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: {
      "@type": "Product",
      name: productName,
    },
    author: {
      "@type": "Person",
      name: review.reviewer_name,
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: review.rating,
      bestRating: 5,
      worstRating: 1,
    },
    datePublished: review.created_at,
    name: review.title || "Customer Review",
    reviewBody: review.content,
  }))
}

// Default fallback reviews for schema generation (server-side)
export const DEFAULT_REVIEWS: ReviewData[] = [
  {
    reviewer_name: "Rajesh Sharma",
    rating: 5,
    created_at: "2024-12-22",
    title: "Instant delivery, genuine product!",
    content:
      "I was skeptical at first but OTTSewa delivered within minutes. The subscription activated immediately and works perfectly. Best price in Nepal!",
  },
  {
    reviewer_name: "Priya Thapa",
    rating: 5,
    created_at: "2024-12-22",
    title: "Amazing service and support",
    content:
      "Customer support helped me with activation. Very professional team. Will definitely buy again for all my digital needs.",
  },
  {
    reviewer_name: "Bikash Gurung",
    rating: 4,
    created_at: "2024-12-23",
    title: "Great value for money",
    content:
      "Much cheaper than official prices. Works on all my devices. The only reason for 4 stars is I wish they had more payment options.",
  },
  {
    reviewer_name: "Sita Rai",
    rating: 5,
    created_at: "2024-12-23",
    title: "Trustworthy seller",
    content:
      "This is my third purchase from OTTSewa. Always reliable, always fast. Highly recommend to everyone in Nepal looking for digital subscriptions.",
  },
]
