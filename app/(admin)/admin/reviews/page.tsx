"use client"

import { useState, useEffect } from "react"
import {
  Star,
  Trash2,
  Search,
  Filter,
  Plus,
  MessageSquare,
  TrendingUp,
  Users,
  CheckCircle2,
  Package,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface Review {
  id: string
  product_id: string
  reviewer_name: string
  reviewer_location: string | null
  rating: number
  title: string | null
  content: string
  verified_purchase: boolean
  helpful_count: number
  created_at: string
  products?: {
    id: string
    title: string
    slug: string
    image_url: string
  }
}

interface Product {
  id: string
  title: string
  slug: string
  image_url: string
}

interface Stats {
  total: number
  average: number
  distribution: Record<number, number>
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [ratingFilter, setRatingFilter] = useState<string>("all")
  const [productFilter, setProductFilter] = useState<string>("all")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [deleteReview, setDeleteReview] = useState<Review | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()

  // New review form state
  const [newReview, setNewReview] = useState({
    product_id: "",
    reviewer_name: "",
    reviewer_location: "",
    rating: 5,
    title: "",
    content: "",
    verified_purchase: true,
  })

  useEffect(() => {
    fetchReviews()
    fetchProducts()
  }, [ratingFilter, productFilter, searchQuery])

  async function fetchReviews() {
    try {
      const params = new URLSearchParams()
      if (ratingFilter !== "all") params.append("rating", ratingFilter)
      if (productFilter !== "all") params.append("productId", productFilter)
      if (searchQuery) params.append("search", searchQuery)

      const res = await fetch(`/api/admin/reviews?${params}`)
      const data = await res.json()

      if (data.reviews) {
        setReviews(data.reviews)
        setStats(data.stats)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch reviews",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  async function fetchProducts() {
    try {
      const res = await fetch("/api/admin/products")
      const data = await res.json()
      if (data.products) {
        setProducts(data.products)
      }
    } catch (error) {
      console.error("Error fetching products:", error)
    }
  }

  async function handleAddReview() {
    if (!newReview.product_id || !newReview.reviewer_name || !newReview.content) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReview),
      })

      if (!res.ok) throw new Error("Failed to add review")

      toast({
        title: "Review Added",
        description: "The review has been added successfully",
      })

      setShowAddDialog(false)
      setNewReview({
        product_id: "",
        reviewer_name: "",
        reviewer_location: "",
        rating: 5,
        title: "",
        content: "",
        verified_purchase: true,
      })
      fetchReviews()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add review",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDeleteReview(review: Review) {
    try {
      const res = await fetch(`/api/admin/reviews?id=${review.id}`, {
        method: "DELETE",
      })

      if (!res.ok) throw new Error("Failed to delete review")

      toast({
        title: "Review Deleted",
        description: "The review has been deleted successfully",
      })

      setDeleteReview(null)
      fetchReviews()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete review",
        variant: "destructive",
      })
    }
  }

  const timeAgo = (date: string) => {
    const now = new Date()
    const reviewDate = new Date(date)
    const diffDays = Math.floor((now.getTime() - reviewDate.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "Yesterday"
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return new Date(date).toLocaleDateString()
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Reviews Management</h1>
          <p className="text-zinc-500 text-sm mt-1">Manage customer reviews and ratings</p>
        </div>
        <Button
          onClick={() => setShowAddDialog(true)}
          className="bg-amber-500 hover:bg-amber-600 text-black font-medium"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Review
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-white/[0.08] p-3 bg-transparent">
          <div className="rounded-xl bg-[#0f0f0f] p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{stats?.total || 0}</div>
                <div className="text-xs text-zinc-500">Total Reviews</div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.08] p-3 bg-transparent">
          <div className="rounded-xl bg-[#0f0f0f] p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <Star className="w-5 h-5 text-green-400 fill-green-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{stats?.average || 0}</div>
                <div className="text-xs text-zinc-500">Avg Rating</div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.08] p-3 bg-transparent">
          <div className="rounded-xl bg-[#0f0f0f] p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{stats?.distribution[5] || 0}</div>
                <div className="text-xs text-zinc-500">5-Star Reviews</div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.08] p-3 bg-transparent">
          <div className="rounded-xl bg-[#0f0f0f] p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{reviews.filter((r) => r.verified_purchase).length}</div>
                <div className="text-xs text-zinc-500">Verified</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-white/[0.08] p-3 bg-transparent">
        <div className="rounded-xl bg-[#0f0f0f] p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <Input
                placeholder="Search reviews..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-[#1a1a1a] border-white/[0.08] text-white"
              />
            </div>
            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger className="w-full sm:w-40 bg-[#1a1a1a] border-white/[0.08] text-white">
                <Filter className="w-4 h-4 mr-2 text-zinc-500" />
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a1a] border-white/[0.08]">
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="1">1 Star</SelectItem>
              </SelectContent>
            </Select>
            <Select value={productFilter} onValueChange={setProductFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-[#1a1a1a] border-white/[0.08] text-white">
                <Package className="w-4 h-4 mr-2 text-zinc-500" />
                <SelectValue placeholder="Product" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a1a] border-white/[0.08]">
                <SelectItem value="all">All Products</SelectItem>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="rounded-2xl border border-white/[0.08] p-3 bg-transparent">
        <div className="rounded-xl bg-[#0f0f0f] p-4 sm:p-6">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-24 bg-zinc-800 rounded-xl" />
                </div>
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-white mb-1">No reviews found</h3>
              <p className="text-zinc-500 text-sm">Add your first review to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="p-4 bg-[#1a1a1a] rounded-xl border border-white/[0.06] hover:border-white/[0.1] transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                          {review.reviewer_name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-white text-sm">{review.reviewer_name}</span>
                            {review.verified_purchase && (
                              <span className="inline-flex items-center gap-1 text-[10px] text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded-full shrink-0">
                                <CheckCircle2 className="w-2.5 h-2.5" />
                                Verified
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-zinc-500">
                            {review.reviewer_location && <span>{review.reviewer_location}</span>}
                            <span>•</span>
                            <span>{timeAgo(review.created_at)}</span>
                          </div>
                        </div>
                      </div>

                      {review.products && (
                        <div className="flex items-center gap-2 mb-2 p-2 bg-[#0f0f0f] rounded-lg w-fit">
                          {review.products.image_url && (
                            <img
                              src={review.products.image_url || "/placeholder.svg"}
                              alt={review.products.title}
                              className="w-8 h-8 rounded object-cover"
                            />
                          )}
                          <span className="text-xs text-zinc-400">{review.products.title}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-0.5 mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "w-4 h-4",
                              i < review.rating ? "fill-amber-400 text-amber-400" : "fill-zinc-700 text-zinc-700",
                            )}
                          />
                        ))}
                      </div>

                      {review.title && <h4 className="font-medium text-white text-sm mb-1">{review.title}</h4>}

                      <p className="text-zinc-400 text-sm line-clamp-2">{review.content}</p>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteReview(review)}
                      className="text-zinc-500 hover:text-red-400 hover:bg-red-500/10 shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Review Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="bg-[#0f0f0f] border-white/[0.08] text-white max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Add New Review</DialogTitle>
            <DialogDescription className="text-zinc-500">Add a customer review for a product</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <Label className="text-zinc-400 text-sm">Product *</Label>
              <Select value={newReview.product_id} onValueChange={(v) => setNewReview({ ...newReview, product_id: v })}>
                <SelectTrigger className="mt-1.5 bg-[#1a1a1a] border-white/[0.08] text-white">
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-white/[0.08]">
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-zinc-400 text-sm">Reviewer Name *</Label>
                <Input
                  value={newReview.reviewer_name}
                  onChange={(e) => setNewReview({ ...newReview, reviewer_name: e.target.value })}
                  placeholder="John Doe"
                  className="mt-1.5 bg-[#1a1a1a] border-white/[0.08] text-white"
                />
              </div>
              <div>
                <Label className="text-zinc-400 text-sm">Location</Label>
                <Input
                  value={newReview.reviewer_location}
                  onChange={(e) => setNewReview({ ...newReview, reviewer_location: e.target.value })}
                  placeholder="Kathmandu"
                  className="mt-1.5 bg-[#1a1a1a] border-white/[0.08] text-white"
                />
              </div>
            </div>

            <div>
              <Label className="text-zinc-400 text-sm">Rating *</Label>
              <div className="flex items-center gap-1 mt-1.5">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setNewReview({ ...newReview, rating })}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={cn(
                        "w-6 h-6",
                        rating <= newReview.rating ? "fill-amber-400 text-amber-400" : "fill-zinc-700 text-zinc-700",
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-zinc-400 text-sm">Review Title</Label>
              <Input
                value={newReview.title}
                onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                placeholder="Great product!"
                className="mt-1.5 bg-[#1a1a1a] border-white/[0.08] text-white"
              />
            </div>

            <div>
              <Label className="text-zinc-400 text-sm">Review Content *</Label>
              <Textarea
                value={newReview.content}
                onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
                placeholder="Write the review content..."
                rows={4}
                className="mt-1.5 bg-[#1a1a1a] border-white/[0.08] text-white resize-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="verified"
                checked={newReview.verified_purchase}
                onChange={(e) => setNewReview({ ...newReview, verified_purchase: e.target.checked })}
                className="w-4 h-4 rounded border-white/[0.08] bg-[#1a1a1a]"
              />
              <Label htmlFor="verified" className="text-zinc-400 text-sm cursor-pointer">
                Mark as verified purchase
              </Label>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowAddDialog(false)}
                className="flex-1 bg-transparent border-white/[0.08] text-zinc-400 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddReview}
                disabled={submitting}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-black font-medium"
              >
                {submitting ? "Adding..." : "Add Review"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteReview} onOpenChange={() => setDeleteReview(null)}>
        <AlertDialogContent className="bg-[#0f0f0f] border-white/[0.08]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Review</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-500">
              Are you sure you want to delete this review by {deleteReview?.reviewer_name}? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-white/[0.08] text-zinc-400 hover:text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteReview && handleDeleteReview(deleteReview)}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
