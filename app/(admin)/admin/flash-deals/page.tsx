"use client"

import { useState, useEffect, useCallback } from "react"
import { format } from "date-fns"
import {
  Zap,
  Plus,
  Trash2,
  Edit2,
  Power,
  PowerOff,
  Clock,
  Package,
  Percent,
  Calendar,
  RefreshCw,
  Search,
  Flame,
  TrendingUp,
  Eye,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

interface Product {
  id: string
  title: string
  slug: string
  image_url: string | null
  base_price: number
  original_price: number | null
}

interface FlashDeal {
  id: string
  title: string
  description: string | null
  discount_percentage: number
  product_id: string
  start_time: string
  end_time: string
  is_active: boolean
  created_at: string
  product: Product | null
}

export default function FlashDealsPage() {
  const [deals, setDeals] = useState<FlashDeal[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showDialog, setShowDialog] = useState(false)
  const [editingDeal, setEditingDeal] = useState<FlashDeal | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()

  // Form state
  const [formData, setFormData] = useState({
    title: "Flash Deal",
    description: "",
    discount_percentage: 20,
    product_id: "",
    start_time: "",
    end_time: "",
    is_active: true,
  })

  const fetchDeals = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/admin/flash-deals")
      if (!res.ok) throw new Error("Failed to fetch")
      const data = await res.json()
      setDeals(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch flash deals",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/products?limit=100")
      const data = await response.json()
      const productsList = data.products || []
      setProducts(
        productsList.map((p: any) => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
          image_url: p.image_url,
          base_price: p.base_price,
          original_price: p.original_price,
        })),
      )
    } catch (error) {
      console.error("Error fetching products:", error)
      setProducts([])
    }
  }, [])

  useEffect(() => {
    fetchDeals()
    fetchProducts()
  }, [fetchDeals, fetchProducts])

  const handleSubmit = async () => {
    if (!formData.product_id || !formData.start_time || !formData.end_time) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    try {
      const url = editingDeal ? `/api/admin/flash-deals/${editingDeal.id}` : "/api/admin/flash-deals"
      const method = editingDeal ? "PATCH" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!res.ok) throw new Error("Failed to save")

      toast({
        title: editingDeal ? "Deal Updated" : "Deal Created",
        description: editingDeal ? "Flash deal has been updated successfully" : "New flash deal has been created",
      })

      setShowDialog(false)
      setEditingDeal(null)
      resetForm()
      fetchDeals()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save flash deal",
        variant: "destructive",
      })
    }
  }

  const handleToggleActive = async (deal: FlashDeal) => {
    try {
      const res = await fetch(`/api/admin/flash-deals/${deal.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !deal.is_active }),
      })

      if (!res.ok) throw new Error("Failed to update")

      toast({
        title: deal.is_active ? "Deal Deactivated" : "Deal Activated",
        description: `Flash deal is now ${deal.is_active ? "inactive" : "active"}`,
      })

      fetchDeals()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to toggle deal status",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this flash deal?")) return

    try {
      const res = await fetch(`/api/admin/flash-deals/${id}`, {
        method: "DELETE",
      })

      if (!res.ok) throw new Error("Failed to delete")

      toast({
        title: "Deal Deleted",
        description: "Flash deal has been removed",
      })

      fetchDeals()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete flash deal",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (deal: FlashDeal) => {
    setEditingDeal(deal)
    setFormData({
      title: deal.title,
      description: deal.description || "",
      discount_percentage: deal.discount_percentage,
      product_id: deal.product_id,
      start_time: format(new Date(deal.start_time), "yyyy-MM-dd'T'HH:mm"),
      end_time: format(new Date(deal.end_time), "yyyy-MM-dd'T'HH:mm"),
      is_active: deal.is_active,
    })
    setShowDialog(true)
  }

  const resetForm = () => {
    setFormData({
      title: "Flash Deal",
      description: "",
      discount_percentage: 20,
      product_id: "",
      start_time: "",
      end_time: "",
      is_active: true,
    })
  }

  const getDealStatus = (deal: FlashDeal) => {
    const now = new Date()
    const start = new Date(deal.start_time)
    const end = new Date(deal.end_time)

    if (!deal.is_active) return { label: "Inactive", color: "text-zinc-400", bg: "bg-zinc-500/10" }
    if (now < start) return { label: "Scheduled", color: "text-blue-400", bg: "bg-blue-500/10" }
    if (now > end) return { label: "Expired", color: "text-red-400", bg: "bg-red-500/10" }
    return { label: "Live", color: "text-emerald-400", bg: "bg-emerald-500/10" }
  }

  const filteredDeals = deals.filter(
    (deal) =>
      deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.product?.title.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Stats
  const activeDeals = deals.filter((d) => d.is_active && new Date(d.end_time) > new Date()).length
  const scheduledDeals = deals.filter((d) => d.is_active && new Date(d.start_time) > new Date()).length
  const expiredDeals = deals.filter((d) => new Date(d.end_time) < new Date()).length

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-[#1a1a1a] rounded animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-[#1a1a1a] rounded-xl animate-pulse" />
          ))}
        </div>
        <div className="h-96 bg-[#1a1a1a] rounded-xl animate-pulse" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Zap className="w-6 h-6 text-amber-500" />
            Flash Deals
          </h1>
          <p className="text-zinc-400 text-sm mt-1">Create and manage time-limited promotional deals</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={fetchDeals} variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => {
              resetForm()
              setEditingDeal(null)
              setShowDialog(true)
            }}
            className="bg-amber-500 hover:bg-amber-600 text-black font-medium"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Deal
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-[#1a1a1a] border-white/[0.05] p-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 rounded-lg">
              <Flame className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-zinc-400 text-xs">Live Deals</p>
              <p className="text-2xl font-bold text-white">{activeDeals}</p>
            </div>
          </div>
        </Card>
        <Card className="bg-[#1a1a1a] border-white/[0.05] p-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/10 rounded-lg">
              <Clock className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-zinc-400 text-xs">Scheduled</p>
              <p className="text-2xl font-bold text-white">{scheduledDeals}</p>
            </div>
          </div>
        </Card>
        <Card className="bg-[#1a1a1a] border-white/[0.05] p-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-zinc-500/10 rounded-lg">
              <TrendingUp className="w-5 h-5 text-zinc-400" />
            </div>
            <div>
              <p className="text-zinc-400 text-xs">Total Created</p>
              <p className="text-2xl font-bold text-white">{deals.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <Input
          placeholder="Search deals..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-[#1a1a1a] border-white/[0.05] text-white"
        />
      </div>

      {/* Deals List */}
      <div className="rounded-2xl border border-white/[0.08] p-3">
        <div className="bg-[#0f0f0f] rounded-xl overflow-hidden">
          {filteredDeals.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-[#1a1a1a] rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-zinc-600" />
              </div>
              <p className="text-zinc-400 mb-2">No flash deals found</p>
              <p className="text-zinc-600 text-sm mb-4">Create your first flash deal to boost sales</p>
              <Button
                onClick={() => {
                  resetForm()
                  setShowDialog(true)
                }}
                className="bg-amber-500 hover:bg-amber-600 text-black"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Deal
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.05]">
              {filteredDeals.map((deal) => {
                const status = getDealStatus(deal)
                const discountedPrice = deal.product
                  ? deal.product.base_price * (1 - deal.discount_percentage / 100)
                  : 0

                return (
                  <div key={deal.id} className="p-4 hover:bg-white/[0.02] transition-colors">
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Product Image */}
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-[#1a1a1a] shrink-0">
                        {deal.product ? (
                          <Image
                            src={deal.product.image_url || "/placeholder.svg"}
                            alt={deal.product.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-8 h-8 text-zinc-600" />
                          </div>
                        )}
                        <div className="absolute top-1 right-1 bg-gradient-to-r from-red-500 to-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                          -{deal.discount_percentage}%
                        </div>
                      </div>

                      {/* Deal Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-semibold text-white truncate">{deal.title}</h3>
                            <p className="text-sm text-zinc-400">{deal.product?.title || "Unknown Product"}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                            {status.label}
                          </span>
                        </div>

                        <div className="mt-2 flex flex-wrap items-center gap-4 text-sm">
                          <div className="flex items-center gap-1.5 text-zinc-400">
                            <Percent className="w-3.5 h-3.5" />
                            <span>NPR {Math.round(discountedPrice).toLocaleString()}</span>
                            <span className="text-zinc-500 line-through text-xs">
                              NPR {deal.product?.base_price.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-zinc-400">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>
                              {format(new Date(deal.start_time), "MMM d, HH:mm")} -{" "}
                              {format(new Date(deal.end_time), "MMM d, HH:mm")}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-3 flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleActive(deal)}
                            className={
                              deal.is_active
                                ? "text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                                : "text-zinc-400 hover:text-white hover:bg-white/[0.05]"
                            }
                          >
                            {deal.is_active ? (
                              <>
                                <Power className="w-4 h-4 mr-1.5" />
                                Active
                              </>
                            ) : (
                              <>
                                <PowerOff className="w-4 h-4 mr-1.5" />
                                Inactive
                              </>
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(deal)}
                            className="text-zinc-400 hover:text-white hover:bg-white/[0.05]"
                          >
                            <Edit2 className="w-4 h-4 mr-1.5" />
                            Edit
                          </Button>
                          {deal.product && (
                            <Button
                              variant="ghost"
                              size="sm"
                              asChild
                              className="text-zinc-400 hover:text-white hover:bg-white/[0.05]"
                            >
                              <a href={`/product/${deal.product.slug}`} target="_blank" rel="noopener noreferrer">
                                <Eye className="w-4 h-4 mr-1.5" />
                                View
                              </a>
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(deal.id)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-4 h-4 mr-1.5" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-[#0f0f0f] border-white/[0.08] text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              {editingDeal ? "Edit Flash Deal" : "Create Flash Deal"}
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              {editingDeal ? "Update the flash deal settings" : "Set up a new time-limited promotional deal"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Title */}
            <div className="space-y-2">
              <Label className="text-zinc-300">Deal Title</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Weekend Special"
                className="bg-[#1a1a1a] border-white/[0.05] text-white"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label className="text-zinc-300">Description (Optional)</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of the deal"
                className="bg-[#1a1a1a] border-white/[0.05] text-white resize-none"
                rows={2}
              />
            </div>

            {/* Product Selection */}
            <div className="space-y-2">
              <Label className="text-zinc-300">Select Product *</Label>
              <Select
                value={formData.product_id}
                onValueChange={(value) => setFormData({ ...formData, product_id: value })}
              >
                <SelectTrigger className="bg-[#1a1a1a] border-white/[0.05] text-white">
                  <SelectValue placeholder="Choose a product" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-white/[0.08]">
                  {products.map((product) => (
                    <SelectItem
                      key={product.id}
                      value={product.id}
                      className="text-white hover:bg-white/[0.05] focus:bg-white/[0.05]"
                    >
                      {product.title} - NPR {(product.base_price || 0).toLocaleString()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Discount Percentage */}
            <div className="space-y-2">
              <Label className="text-zinc-300">Discount Percentage: {formData.discount_percentage}%</Label>
              <Input
                type="range"
                min="5"
                max="90"
                step="5"
                value={formData.discount_percentage}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    discount_percentage: Number.parseInt(e.target.value),
                  })
                }
                className="w-full accent-amber-500"
              />
              <div className="flex justify-between text-xs text-zinc-500">
                <span>5%</span>
                <span>90%</span>
              </div>
            </div>

            {/* Time Range */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-zinc-300">Start Time *</Label>
                <Input
                  type="datetime-local"
                  value={formData.start_time}
                  onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                  className="bg-[#1a1a1a] border-white/[0.05] text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">End Time *</Label>
                <Input
                  type="datetime-local"
                  value={formData.end_time}
                  onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                  className="bg-[#1a1a1a] border-white/[0.05] text-white"
                />
              </div>
            </div>

            {/* Active Toggle */}
            <div className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg">
              <div>
                <p className="text-white text-sm font-medium">Active Status</p>
                <p className="text-zinc-500 text-xs">Enable to show deal to customers</p>
              </div>
              <Switch
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => {
                setShowDialog(false)
                setEditingDeal(null)
              }}
              className="text-zinc-400 hover:text-white"
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="bg-amber-500 hover:bg-amber-600 text-black font-medium">
              {editingDeal ? "Update Deal" : "Create Deal"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
