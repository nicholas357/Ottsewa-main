"use client"

import { useEffect, useState, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import {
  MessageSquare,
  Search,
  Star,
  CheckCircle,
  XCircle,
  Trash2,
  Eye,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Home,
  Loader2,
  Sparkles,
  Clock,
  ThumbsUp,
  ExternalLink,
  User,
  Package,
  Calendar,
  Filter,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface Review {
  id: string
  rating: number
  title: string | null
  content: string | null
  is_verified_purchase: boolean
  is_approved: boolean
  is_featured: boolean
  helpful_count: number
  created_at: string
  user_id: string
  product_id: string
  product: {
    title: string
    slug: string
    image_url: string | null
  } | null
  user: {
    full_name: string | null
    email: string
  } | null
}

interface Stats {
  total: number
  pending: number
  approved: number
  featured: number
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn("w-3.5 h-3.5", star <= rating ? "text-amber-400 fill-amber-400" : "text-zinc-600")}
        />
      ))}
    </div>
  )
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function getRelativeTime(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return "Today"
  if (diffDays === 1) return "Yesterday"
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  return `${Math.floor(diffDays / 30)} months ago`
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, approved: 0, featured: 0 })
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; review: Review | null }>({
    open: false,
    review: null,
  })
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const limit = 20
  const supabase = createClient()
  const { toast } = useToast()

  useEffect(() => {
    checkAdmin()
  }, [])

  useEffect(() => {
    if (isAdmin) {
      fetchReviews()
    }
  }, [isAdmin, page, statusFilter])

  const checkAdmin = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      setIsAdmin(false)
      setLoading(false)
      return
    }

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    setIsAdmin(profile?.role === "admin")
    setLoading(false)
  }

  const fetchReviews = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        status: statusFilter,
      })
      if (search) params.set("search", search)

      const res = await fetch(`/api/admin/reviews?${params}`)
      const data = await res.json()

      if (res.ok) {
        setReviews(data.reviews || [])
        setTotal(data.total || 0)
        setStats(data.stats || { total: 0, pending: 0, approved: 0, featured: 0 })
      }
    } catch (error) {
      console.error("Error fetching reviews:", error)
      toast({
        title: "Error",
        description: "Failed to load reviews",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [page, statusFilter, search])

  const handleApprove = async (review: Review, approve: boolean) => {
    setActionLoading(review.id)
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: review.id, is_approved: approve }),
      })

      if (res.ok) {
        toast({
          title: approve ? "Review Approved" : "Review Rejected",
          description: `The review has been ${approve ? "approved and is now visible" : "rejected"}`,
        })
        fetchReviews()
      } else {
        throw new Error("Failed to update review")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update review status",
        variant: "destructive",
      })
    } finally {
      setActionLoading(null)
    }
  }

  const handleFeature = async (review: Review, feature: boolean) => {
    setActionLoading(review.id)
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: review.id, is_featured: feature }),
      })

      if (res.ok) {
        toast({
          title: feature ? "Review Featured" : "Feature Removed",
          description: `The review has been ${feature ? "featured and will appear prominently" : "unfeatured"}`,
        })
        fetchReviews()
      } else {
        throw new Error("Failed to update review")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update feature status",
        variant: "destructive",
      })
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = async () => {
    if (!deleteModal.review) return
    setActionLoading(deleteModal.review.id)
    try {
      const res = await fetch(`/api/admin/reviews?id=${deleteModal.review.id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        toast({
          title: "Review Deleted",
          description: "The review has been permanently removed",
        })
        setDeleteModal({ open: false, review: null })
        fetchReviews()
      } else {
        throw new Error("Failed to delete review")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete review",
        variant: "destructive",
      })
    } finally {
      setActionLoading(null)
    }
  }

  const totalPages = Math.ceil(total / limit)

  if (!isAdmin && !loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white mb-2">Access Denied</h2>
          <p className="text-zinc-400">You don't have permission to access this page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-zinc-500 mb-1">
            <Link href="/admin" className="hover:text-white transition-colors">
              <Home className="w-4 h-4" />
            </Link>
            <span>/</span>
            <span className="text-white">Reviews</span>
          </div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-amber-400" />
            Review Management
          </h1>
          <p className="text-zinc-500 text-sm mt-1">Moderate and manage customer reviews</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <button
          onClick={() => setStatusFilter("all")}
          className={cn(
            "p-4 rounded-xl border transition-all text-left",
            statusFilter === "all"
              ? "bg-zinc-800 border-zinc-700"
              : "bg-zinc-900 border-zinc-800 hover:border-zinc-700",
          )}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
              <p className="text-xs text-zinc-500">Total Reviews</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setStatusFilter("pending")}
          className={cn(
            "p-4 rounded-xl border transition-all text-left",
            statusFilter === "pending"
              ? "bg-zinc-800 border-amber-500/50"
              : "bg-zinc-900 border-zinc-800 hover:border-zinc-700",
          )}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.pending}</p>
              <p className="text-xs text-zinc-500">Pending</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setStatusFilter("approved")}
          className={cn(
            "p-4 rounded-xl border transition-all text-left",
            statusFilter === "approved"
              ? "bg-zinc-800 border-green-500/50"
              : "bg-zinc-900 border-zinc-800 hover:border-zinc-700",
          )}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.approved}</p>
              <p className="text-xs text-zinc-500">Approved</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setStatusFilter("featured")}
          className={cn(
            "p-4 rounded-xl border transition-all text-left",
            statusFilter === "featured"
              ? "bg-zinc-800 border-purple-500/50"
              : "bg-zinc-900 border-zinc-800 hover:border-zinc-700",
          )}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.featured}</p>
              <p className="text-xs text-zinc-500">Featured</p>
            </div>
          </div>
        </button>
      </div>

      {/* Double-box container */}
      <div className="rounded-2xl border border-zinc-800 p-3 bg-transparent">
        <div className="rounded-xl bg-zinc-900 p-4">
          {/* Search */}
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <Input
                placeholder="Search reviews..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchReviews()}
                className="pl-9 bg-zinc-800 border-zinc-700"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => fetchReviews()}
              className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700"
            >
              <Filter className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>

          {/* Reviews List */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-800 flex items-center justify-center">
                <MessageSquare className="w-8 h-8 text-zinc-600" />
              </div>
              <h3 className="text-white font-medium mb-1">No Reviews Found</h3>
              <p className="text-zinc-500 text-sm">
                {statusFilter !== "all"
                  ? `No ${statusFilter} reviews at the moment`
                  : "No reviews have been submitted yet"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className={cn(
                    "p-4 rounded-xl border transition-colors",
                    review.is_featured
                      ? "bg-purple-500/5 border-purple-500/20"
                      : !review.is_approved
                        ? "bg-amber-500/5 border-amber-500/20"
                        : "bg-zinc-800 border-zinc-700",
                  )}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                    {/* Product Info */}
                    <div className="flex items-center gap-3 lg:w-64 flex-shrink-0">
                      <div className="w-12 h-12 rounded-lg bg-zinc-700 overflow-hidden flex-shrink-0">
                        {review.product?.image_url ? (
                          <img
                            src={review.product.image_url || "/placeholder.svg"}
                            alt={review.product.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-5 h-5 text-zinc-500" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-white text-sm font-medium truncate">
                          {review.product?.title || "Unknown Product"}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <StarRating rating={review.rating} />
                        </div>
                      </div>
                    </div>

                    {/* Review Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-white text-sm font-medium">
                          {review.user?.full_name || review.user?.email || "Anonymous"}
                        </span>
                        {review.is_verified_purchase && (
                          <span className="text-[10px] text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded">
                            Verified
                          </span>
                        )}
                        {!review.is_approved && (
                          <span className="text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                            Pending
                          </span>
                        )}
                        {review.is_featured && (
                          <span className="text-[10px] text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded">
                            Featured
                          </span>
                        )}
                        <span className="text-xs text-zinc-500">{getRelativeTime(review.created_at)}</span>
                      </div>
                      {review.title && <h4 className="text-white text-sm font-medium mb-1">{review.title}</h4>}
                      {review.content && <p className="text-zinc-400 text-sm line-clamp-2">{review.content}</p>}
                      {review.helpful_count > 0 && (
                        <div className="flex items-center gap-1 mt-2 text-xs text-zinc-500">
                          <ThumbsUp className="w-3 h-3" />
                          {review.helpful_count} helpful
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 lg:flex-shrink-0">
                      {!review.is_approved && (
                        <Button
                          size="sm"
                          onClick={() => handleApprove(review, true)}
                          disabled={actionLoading === review.id}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          {actionLoading === review.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <CheckCircle className="w-4 h-4" />
                          )}
                          <span className="ml-1.5 hidden sm:inline">Approve</span>
                        </Button>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="bg-zinc-700 border-zinc-600 hover:bg-zinc-600">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-700">
                          <DropdownMenuItem
                            onClick={() => setSelectedReview(review)}
                            className="text-zinc-300 hover:text-white focus:text-white"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          {review.product && (
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/product/${review.product.slug}`}
                                target="_blank"
                                className="text-zinc-300 hover:text-white focus:text-white"
                              >
                                <ExternalLink className="w-4 h-4 mr-2" />
                                View Product
                              </Link>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator className="bg-zinc-700" />
                          {review.is_approved && (
                            <DropdownMenuItem
                              onClick={() => handleFeature(review, !review.is_featured)}
                              className="text-zinc-300 hover:text-white focus:text-white"
                            >
                              <Sparkles className="w-4 h-4 mr-2" />
                              {review.is_featured ? "Remove Feature" : "Feature Review"}
                            </DropdownMenuItem>
                          )}
                          {review.is_approved && (
                            <DropdownMenuItem
                              onClick={() => handleApprove(review, false)}
                              className="text-zinc-300 hover:text-white focus:text-white"
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Reject Review
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator className="bg-zinc-700" />
                          <DropdownMenuItem
                            onClick={() => setDeleteModal({ open: true, review })}
                            className="text-red-400 hover:text-red-300 focus:text-red-300"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-zinc-800">
              <p className="text-sm text-zinc-500">
                Showing {(page - 1) * limit + 1}-{Math.min(page * limit, total)} of {total}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="bg-zinc-800 border-zinc-700"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm text-zinc-400 px-2">
                  {page} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                  className="bg-zinc-800 border-zinc-700"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* View Details Dialog */}
      <Dialog open={!!selectedReview} onOpenChange={() => setSelectedReview(null)}>
        <DialogContent className="bg-zinc-900 border-zinc-700 max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white">Review Details</DialogTitle>
          </DialogHeader>
          {selectedReview && (
            <div className="space-y-4">
              {/* Product */}
              <div className="flex items-center gap-3 p-3 bg-zinc-800 rounded-lg">
                <div className="w-14 h-14 rounded-lg bg-zinc-700 overflow-hidden">
                  {selectedReview.product?.image_url ? (
                    <img
                      src={selectedReview.product.image_url || "/placeholder.svg"}
                      alt={selectedReview.product.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-6 h-6 text-zinc-500" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-white font-medium">{selectedReview.product?.title}</p>
                  <StarRating rating={selectedReview.rating} />
                </div>
              </div>

              {/* User */}
              <div className="flex items-center gap-3 p-3 bg-zinc-800 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center">
                  <User className="w-5 h-5 text-zinc-400" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{selectedReview.user?.full_name || "Anonymous"}</p>
                  <p className="text-zinc-500 text-xs">{selectedReview.user?.email}</p>
                </div>
              </div>

              {/* Content */}
              <div className="p-3 bg-zinc-800 rounded-lg space-y-2">
                {selectedReview.title && <h4 className="text-white font-medium">{selectedReview.title}</h4>}
                {selectedReview.content ? (
                  <p className="text-zinc-400 text-sm">{selectedReview.content}</p>
                ) : (
                  <p className="text-zinc-600 text-sm italic">No content provided</p>
                )}
              </div>

              {/* Meta */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-zinc-400">
                  <Calendar className="w-4 h-4" />
                  {formatDate(selectedReview.created_at)}
                </div>
                {selectedReview.helpful_count > 0 && (
                  <div className="flex items-center gap-2 text-zinc-400">
                    <ThumbsUp className="w-4 h-4" />
                    {selectedReview.helpful_count} helpful
                  </div>
                )}
              </div>

              {/* Status badges */}
              <div className="flex flex-wrap gap-2">
                {selectedReview.is_verified_purchase && (
                  <span className="text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded-lg flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Verified Purchase
                  </span>
                )}
                {selectedReview.is_approved ? (
                  <span className="text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded-lg">Approved</span>
                ) : (
                  <span className="text-xs text-amber-400 bg-amber-500/10 px-2 py-1 rounded-lg">Pending Approval</span>
                )}
                {selectedReview.is_featured && (
                  <span className="text-xs text-purple-400 bg-purple-500/10 px-2 py-1 rounded-lg flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Featured
                  </span>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedReview(null)} className="bg-zinc-800 border-zinc-700">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteModal.open} onOpenChange={(open) => !open && setDeleteModal({ open: false, review: null })}>
        <DialogContent className="bg-zinc-900 border-zinc-700">
          <DialogHeader>
            <DialogTitle className="text-white">Delete Review</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Are you sure you want to delete this review? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteModal({ open: false, review: null })}
              className="bg-zinc-800 border-zinc-700"
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={actionLoading === deleteModal.review?.id}>
              {actionLoading === deleteModal.review?.id ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Trash2 className="w-4 h-4 mr-2" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
