"use client"

import { useEffect, useState, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Home,
  Loader2,
  AlertTriangle,
  Star,
  Zap,
  TrendingUp,
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

interface Product {
  id: string
  title: string
  slug: string
  product_type: string
  base_price: number
  original_price: number | null
  discount_percent: number
  image_url: string | null
  is_active: boolean
  is_featured: boolean
  is_bestseller: boolean
  is_new: boolean
  stock: number
  created_at: string
  category: { id: string; name: string; slug: string } | null
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; product: Product | null }>({
    open: false,
    product: null,
  })
  const [deleting, setDeleting] = useState(false)

  const limit = 10
  const router = useRouter()
  const supabase = createClient()
  const { toast } = useToast()

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      })
      if (search) params.set("search", search)
      if (typeFilter) params.set("type", typeFilter)
      if (statusFilter) params.set("status", statusFilter)

      const res = await fetch(`/api/admin/products?${params}`)
      const data = await res.json()

      if (res.ok) {
        setProducts(data.products || [])
        setTotal(data.total || 0)
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to fetch products",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [page, search, typeFilter, statusFilter, toast])

  useEffect(() => {
    const checkAdmin = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/login")
        return
      }

      const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

      if (profile?.role !== "admin") {
        router.push("/dashboard")
        return
      }

      setIsAdmin(true)
    }

    checkAdmin()
  }, [router, supabase])

  useEffect(() => {
    if (isAdmin) {
      fetchProducts()
    }
  }, [isAdmin, fetchProducts])

  const handleDelete = async () => {
    if (!deleteModal.product) return

    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/products/${deleteModal.product.id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        toast({
          title: "Success",
          description: "Product deleted successfully",
        })
        fetchProducts()
      } else {
        const data = await res.json()
        toast({
          title: "Error",
          description: data.error || "Failed to delete product",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      })
    } finally {
      setDeleting(false)
      setDeleteModal({ open: false, product: null })
    }
  }

  const totalPages = Math.ceil(total / limit)

  const getTypeColor = (type: string) => {
    switch (type) {
      case "game":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20"
      case "giftcard":
        return "bg-green-500/10 text-green-400 border-green-500/20"
      case "subscription":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20"
      case "software":
        return "bg-orange-500/10 text-orange-400 border-orange-500/20"
      default:
        return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
    }
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 p-4 sm:p-6 lg:p-8">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link href="/admin" className="p-2 hover:bg-zinc-900 rounded-lg transition-colors">
                <Home className="w-5 h-5 text-zinc-400 hover:text-white" />
              </Link>
              <Package className="w-6 h-6 text-amber-500" />
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Product Management</h1>
            </div>
            <p className="text-zinc-400 text-sm ml-14">Manage all products in the store</p>
          </div>
          <Link href="/admin/products/new">
            <Button className="bg-amber-500 hover:bg-amber-400 text-black font-medium cursor-pointer">
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <Input
                placeholder="Search products..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
                className="pl-10 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
              />
            </div>
            <div className="flex gap-3">
              <Select
                value={typeFilter}
                onValueChange={(value) => {
                  setTypeFilter(value === "all" ? "" : value)
                  setPage(1)
                }}
              >
                <SelectTrigger className="w-[140px] bg-zinc-800 border-zinc-700 text-white cursor-pointer">
                  <Filter className="w-4 h-4 mr-2 text-zinc-500" />
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                  <SelectItem value="all" className="text-white cursor-pointer">
                    All Types
                  </SelectItem>
                  <SelectItem value="game" className="text-white cursor-pointer">
                    Games
                  </SelectItem>
                  <SelectItem value="giftcard" className="text-white cursor-pointer">
                    Gift Cards
                  </SelectItem>
                  <SelectItem value="subscription" className="text-white cursor-pointer">
                    Subscriptions
                  </SelectItem>
                  <SelectItem value="software" className="text-white cursor-pointer">
                    Software
                  </SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={statusFilter}
                onValueChange={(value) => {
                  setStatusFilter(value === "all" ? "" : value)
                  setPage(1)
                }}
              >
                <SelectTrigger className="w-[140px] bg-zinc-800 border-zinc-700 text-white cursor-pointer">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                  <SelectItem value="all" className="text-white cursor-pointer">
                    All Status
                  </SelectItem>
                  <SelectItem value="active" className="text-white cursor-pointer">
                    Active
                  </SelectItem>
                  <SelectItem value="inactive" className="text-white cursor-pointer">
                    Inactive
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          {loading ? (
            <div className="p-8 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 animate-pulse">
                  <div className="w-16 h-16 bg-zinc-800 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-zinc-800 rounded w-1/3" />
                    <div className="h-3 bg-zinc-800 rounded w-1/4" />
                  </div>
                  <div className="h-6 w-20 bg-zinc-800 rounded" />
                  <div className="h-8 w-8 bg-zinc-800 rounded" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="p-12 text-center">
              <Package className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No products found</h3>
              <p className="text-zinc-500 text-sm mb-6">
                {search || typeFilter || statusFilter
                  ? "Try adjusting your filters"
                  : "Get started by adding your first product"}
              </p>
              {!search && !typeFilter && !statusFilter && (
                <Link href="/admin/products/new">
                  <Button className="bg-amber-500 hover:bg-amber-400 text-black cursor-pointer">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-zinc-800/50">
                    <tr>
                      <th className="text-left text-xs font-medium text-zinc-400 uppercase tracking-wider px-6 py-4">
                        Product
                      </th>
                      <th className="text-left text-xs font-medium text-zinc-400 uppercase tracking-wider px-6 py-4">
                        Type
                      </th>
                      <th className="text-left text-xs font-medium text-zinc-400 uppercase tracking-wider px-6 py-4">
                        Price
                      </th>
                      <th className="text-left text-xs font-medium text-zinc-400 uppercase tracking-wider px-6 py-4">
                        Stock
                      </th>
                      <th className="text-left text-xs font-medium text-zinc-400 uppercase tracking-wider px-6 py-4">
                        Status
                      </th>
                      <th className="text-left text-xs font-medium text-zinc-400 uppercase tracking-wider px-6 py-4">
                        Badges
                      </th>
                      <th className="text-right text-xs font-medium text-zinc-400 uppercase tracking-wider px-6 py-4">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-zinc-800/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-zinc-800 flex-shrink-0">
                              {product.image_url ? (
                                <Image
                                  src={product.image_url || "/placeholder.svg"}
                                  alt={product.title}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package className="w-6 h-6 text-zinc-600" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-white font-medium truncate max-w-[200px]">{product.title}</p>
                              <p className="text-zinc-500 text-xs truncate max-w-[200px]">
                                {product.category?.name || "No category"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${getTypeColor(
                              product.product_type,
                            )}`}
                          >
                            {product.product_type}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-white font-medium">NPR {product.base_price}</p>
                            {product.discount_percent > 0 && (
                              <p className="text-emerald-400 text-xs">-{product.discount_percent}%</p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`text-sm ${
                              product.stock > 10
                                ? "text-emerald-400"
                                : product.stock > 0
                                  ? "text-amber-400"
                                  : "text-red-400"
                            }`}
                          >
                            {product.stock}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                              product.is_active ? "bg-emerald-500/10 text-emerald-400" : "bg-zinc-500/10 text-zinc-400"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                product.is_active ? "bg-emerald-400" : "bg-zinc-400"
                              }`}
                            />
                            {product.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5">
                            {product.is_featured && (
                              <span className="p-1 bg-amber-500/10 rounded" title="Featured">
                                <Star className="w-3.5 h-3.5 text-amber-400" />
                              </span>
                            )}
                            {product.is_bestseller && (
                              <span className="p-1 bg-emerald-500/10 rounded" title="Bestseller">
                                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                              </span>
                            )}
                            {product.is_new && (
                              <span className="p-1 bg-blue-500/10 rounded" title="New">
                                <Zap className="w-3.5 h-3.5 text-blue-400" />
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-zinc-400 hover:text-white cursor-pointer"
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-zinc-800 border-zinc-700 w-48">
                              <DropdownMenuItem asChild className="text-white cursor-pointer">
                                <Link href={`/product/${product.slug}`}>
                                  <Eye className="w-4 h-4 mr-2" />
                                  View
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild className="text-white cursor-pointer">
                                <Link href={`/admin/products/${product.id}/edit`}>
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-zinc-700" />
                              <DropdownMenuItem
                                className="text-red-400 cursor-pointer focus:text-red-400 focus:bg-red-500/10"
                                onClick={() => setDeleteModal({ open: true, product })}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden divide-y divide-zinc-800">
                {products.map((product) => (
                  <div key={product.id} className="p-4 hover:bg-zinc-800/50 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-zinc-800 flex-shrink-0">
                        {product.image_url ? (
                          <Image
                            src={product.image_url || "/placeholder.svg"}
                            alt={product.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-6 h-6 text-zinc-600" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-white font-medium line-clamp-1">{product.title}</p>
                            <p className="text-zinc-500 text-xs">{product.category?.name || "No category"}</p>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-zinc-400 hover:text-white cursor-pointer flex-shrink-0"
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-zinc-800 border-zinc-700 w-48">
                              <DropdownMenuItem asChild className="text-white cursor-pointer">
                                <Link href={`/product/${product.slug}`}>
                                  <Eye className="w-4 h-4 mr-2" />
                                  View
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild className="text-white cursor-pointer">
                                <Link href={`/admin/products/${product.id}/edit`}>
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-zinc-700" />
                              <DropdownMenuItem
                                className="text-red-400 cursor-pointer focus:text-red-400 focus:bg-red-500/10"
                                onClick={() => setDeleteModal({ open: true, product })}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div className="flex items-center gap-3 mt-2">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${getTypeColor(
                              product.product_type,
                            )}`}
                          >
                            {product.product_type}
                          </span>
                          <span className="text-white text-sm font-medium">NPR {product.base_price}</span>
                          <span
                            className={`inline-flex items-center gap-1 text-xs ${
                              product.is_active ? "text-emerald-400" : "text-zinc-400"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                product.is_active ? "bg-emerald-400" : "bg-zinc-400"
                              }`}
                            />
                            {product.is_active ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-zinc-500 text-sm">
              Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} products
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="border-zinc-700 text-zinc-400 hover:text-white cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-white text-sm px-3">
                {page} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="border-zinc-700 text-zinc-400 hover:text-white cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModal.open} onOpenChange={(open) => setDeleteModal({ open, product: null })}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-md">
          <DialogHeader>
            <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <DialogTitle className="text-center">Delete Product</DialogTitle>
            <DialogDescription className="text-center text-zinc-400">
              Are you sure you want to delete{" "}
              <span className="text-white font-medium">{deleteModal.product?.title}</span>? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-3 sm:gap-3">
            <Button
              variant="outline"
              onClick={() => setDeleteModal({ open: false, product: null })}
              className="flex-1 border-zinc-700 text-zinc-400 hover:text-white cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={deleting}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white cursor-pointer"
            >
              {deleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
