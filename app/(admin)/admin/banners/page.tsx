"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Plus,
  Pencil,
  Trash2,
  ImageIcon,
  LinkIcon,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Calendar,
  Loader2,
  Upload,
  X,
} from "lucide-react"

interface Banner {
  id: string
  title: string
  subtitle: string | null
  image_url: string
  link_type: "none" | "product" | "category" | "custom"
  link_url: string | null
  product_id: string | null
  category_id: string | null
  banner_type: "main" | "side"
  sort_order: number
  is_active: boolean
  starts_at: string | null
  ends_at: string | null
  created_at: string
  product?: { title: string; slug: string } | null
  category?: { name: string; slug: string } | null
}

interface Product {
  id: string
  title: string
  slug: string
}

interface Category {
  id: string
  name: string
  slug: string
}

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
  const [uploading, setUploading] = useState(false)
  const [activeTab, setActiveTab] = useState<"main" | "side">("main")

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    image_url: "",
    link_type: "none" as "none" | "product" | "category" | "custom",
    link_url: "",
    product_id: "",
    category_id: "",
    banner_type: "main" as "main" | "side",
    is_active: true,
    starts_at: "",
    ends_at: "",
  })

  const supabase = createBrowserClient()

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    try {
      const [bannersRes, productsRes, categoriesRes] = await Promise.all([
        supabase.from("hero_banners").select("*").order("banner_type").order("sort_order"),
        supabase.from("products").select("id, title, slug").eq("is_active", true).order("title"),
        supabase.from("categories").select("id, name, slug").eq("is_active", true).order("name"),
      ])

      if (bannersRes.data) {
        // Fetch related product/category data
        const bannersWithRelations = await Promise.all(
          bannersRes.data.map(async (banner) => {
            let product = null
            let category = null
            if (banner.product_id) {
              const { data } = await supabase
                .from("products")
                .select("title, slug")
                .eq("id", banner.product_id)
                .single()
              product = data
            }
            if (banner.category_id) {
              const { data } = await supabase
                .from("categories")
                .select("name, slug")
                .eq("id", banner.category_id)
                .single()
              category = data
            }
            return { ...banner, product, category }
          }),
        )
        setBanners(bannersWithRelations)
      }
      if (productsRes.data) setProducts(productsRes.data)
      if (categoriesRes.data) setCategories(categoriesRes.data)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  function resetForm() {
    setFormData({
      title: "",
      subtitle: "",
      image_url: "",
      link_type: "none",
      link_url: "",
      product_id: "",
      category_id: "",
      banner_type: activeTab,
      is_active: true,
      starts_at: "",
      ends_at: "",
    })
    setEditingBanner(null)
  }

  function openAddDialog() {
    resetForm()
    setFormData((prev) => ({ ...prev, banner_type: activeTab }))
    setDialogOpen(true)
  }

  function openEditDialog(banner: Banner) {
    setEditingBanner(banner)
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle || "",
      image_url: banner.image_url,
      link_type: banner.link_type,
      link_url: banner.link_type === "custom" ? banner.link_url : "",
      product_id: banner.link_type === "product" ? banner.product_id : "",
      category_id: banner.link_type === "category" ? banner.category_id : "",
      banner_type: banner.banner_type,
      is_active: banner.is_active,
      starts_at: banner.starts_at ? banner.starts_at.slice(0, 16) : "",
      ends_at: banner.ends_at ? banner.ends_at.slice(0, 16) : "",
    })
    setDialogOpen(true)
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session?.access_token) {
        throw new Error("Not authenticated")
      }

      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Upload failed")
      }

      const { url } = await response.json()
      setFormData((prev) => ({ ...prev, image_url: url }))
    } catch (error) {
      console.error("Upload error:", error)
      alert(error instanceof Error ? error.message : "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    try {
      const payload: Record<string, unknown> = {
        title: formData.title,
        subtitle: formData.subtitle || null,
        image_url: formData.image_url,
        link_type: formData.link_type,
        link_url: formData.link_type === "custom" ? formData.link_url : null,
        product_id: formData.link_type === "product" ? formData.product_id : null,
        category_id: formData.link_type === "category" ? formData.category_id : null,
        banner_type: formData.banner_type,
        is_active: formData.is_active,
        starts_at: formData.starts_at || null,
        ends_at: formData.ends_at || null,
        updated_at: new Date().toISOString(),
      }

      if (editingBanner) {
        await supabase.from("hero_banners").update(payload).eq("id", editingBanner.id)
      } else {
        // Get max sort order for this banner type
        const { data: maxOrder } = await supabase
          .from("hero_banners")
          .select("sort_order")
          .eq("banner_type", formData.banner_type)
          .order("sort_order", { ascending: false })
          .limit(1)
          .single()

        payload.sort_order = (maxOrder?.sort_order || 0) + 1
        await supabase.from("hero_banners").insert(payload)
      }

      setDialogOpen(false)
      resetForm()
      fetchData()
    } catch (error) {
      console.error("Save error:", error)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this banner?")) return

    try {
      await supabase.from("hero_banners").delete().eq("id", id)
      fetchData()
    } catch (error) {
      console.error("Delete error:", error)
    }
  }

  async function handleToggleActive(banner: Banner) {
    try {
      await supabase
        .from("hero_banners")
        .update({ is_active: !banner.is_active, updated_at: new Date().toISOString() })
        .eq("id", banner.id)
      fetchData()
    } catch (error) {
      console.error("Toggle error:", error)
    }
  }

  async function handleReorder(banner: Banner, direction: "up" | "down") {
    const sameBanners = banners.filter((b) => b.banner_type === banner.banner_type)
    const currentIndex = sameBanners.findIndex((b) => b.id === banner.id)
    const swapIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1

    if (swapIndex < 0 || swapIndex >= sameBanners.length) return

    const swapBanner = sameBanners[swapIndex]

    try {
      await Promise.all([
        supabase.from("hero_banners").update({ sort_order: swapBanner.sort_order }).eq("id", banner.id),
        supabase.from("hero_banners").update({ sort_order: banner.sort_order }).eq("id", swapBanner.id),
      ])
      fetchData()
    } catch (error) {
      console.error("Reorder error:", error)
    }
  }

  function getBannerLink(banner: Banner): string {
    if (banner.link_type === "product" && banner.product) {
      return `/product/${banner.product.slug}`
    }
    if (banner.link_type === "category" && banner.category) {
      return `/category/${banner.category.slug}`
    }
    if (banner.link_type === "custom" && banner.link_url) {
      return banner.link_url
    }
    return "#"
  }

  const mainBanners = banners.filter((b) => b.banner_type === "main")
  const sideBanners = banners.filter((b) => b.banner_type === "side")

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Banner Management</h1>
          <p className="text-zinc-400 text-sm mt-1">Manage hero banners displayed on the homepage</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog} className="bg-amber-500 hover:bg-amber-600 text-black cursor-pointer">
              <Plus className="w-4 h-4 mr-2" />
              Add Banner
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-zinc-900 border-zinc-800 max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-white">{editingBanner ? "Edit Banner" : "Add New Banner"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              {/* Image Upload */}
              <div className="space-y-2">
                <Label className="text-zinc-300">Banner Image *</Label>
                {formData.image_url ? (
                  <div className="relative rounded-lg overflow-hidden border border-zinc-700">
                    <img
                      src={formData.image_url || "/placeholder.svg"}
                      alt="Banner preview"
                      className="w-full h-40 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, image_url: "" }))}
                      className="absolute top-2 right-2 p-1 bg-black/60 rounded-full hover:bg-black/80 cursor-pointer"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-zinc-700 rounded-lg hover:border-amber-500/50 cursor-pointer transition-colors">
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    {uploading ? (
                      <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-zinc-500 mb-2" />
                        <span className="text-sm text-zinc-500">Click to upload image</span>
                      </>
                    )}
                  </label>
                )}
              </div>

              {/* Title & Subtitle */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-zinc-300">Title *</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="Banner title"
                    className="bg-zinc-800 border-zinc-700 text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-300">Subtitle</Label>
                  <Input
                    value={formData.subtitle}
                    onChange={(e) => setFormData((prev) => ({ ...prev, subtitle: e.target.value }))}
                    placeholder="Optional subtitle"
                    className="bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
              </div>

              {/* Banner Type */}
              <div className="space-y-2">
                <Label className="text-zinc-300">Banner Type *</Label>
                <Select
                  value={formData.banner_type}
                  onValueChange={(value: "main" | "side") => setFormData((prev) => ({ ...prev, banner_type: value }))}
                >
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white cursor-pointer">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    <SelectItem value="main" className="text-white cursor-pointer">
                      Main Banner (Large, left side)
                    </SelectItem>
                    <SelectItem value="side" className="text-white cursor-pointer">
                      Side Banner (Small, right side)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Link Type */}
              <div className="space-y-2">
                <Label className="text-zinc-300">Link Type</Label>
                <Select
                  value={formData.link_type}
                  onValueChange={(value: "none" | "product" | "category" | "custom") =>
                    setFormData((prev) => ({ ...prev, link_type: value }))
                  }
                >
                  <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white cursor-pointer">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    <SelectItem value="none" className="text-white cursor-pointer">
                      No Link
                    </SelectItem>
                    <SelectItem value="product" className="text-white cursor-pointer">
                      Link to Product
                    </SelectItem>
                    <SelectItem value="category" className="text-white cursor-pointer">
                      Link to Category
                    </SelectItem>
                    <SelectItem value="custom" className="text-white cursor-pointer">
                      Custom URL
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Link Target based on type */}
              {formData.link_type === "product" && (
                <div className="space-y-2">
                  <Label className="text-zinc-300">Select Product</Label>
                  <Select
                    value={formData.product_id}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, product_id: value }))}
                  >
                    <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white cursor-pointer">
                      <SelectValue placeholder="Select a product" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700 max-h-60">
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id} className="text-white cursor-pointer">
                          {product.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {formData.link_type === "category" && (
                <div className="space-y-2">
                  <Label className="text-zinc-300">Select Category</Label>
                  <Select
                    value={formData.category_id}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, category_id: value }))}
                  >
                    <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white cursor-pointer">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700">
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id} className="text-white cursor-pointer">
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {formData.link_type === "custom" && (
                <div className="space-y-2">
                  <Label className="text-zinc-300">Custom URL</Label>
                  <Input
                    value={formData.link_url}
                    onChange={(e) => setFormData((prev) => ({ ...prev, link_url: e.target.value }))}
                    placeholder="https://example.com or /page"
                    className="bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
              )}

              {/* Schedule */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-zinc-300">Start Date (Optional)</Label>
                  <Input
                    type="datetime-local"
                    value={formData.starts_at}
                    onChange={(e) => setFormData((prev) => ({ ...prev, starts_at: e.target.value }))}
                    className="bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-300">End Date (Optional)</Label>
                  <Input
                    type="datetime-local"
                    value={formData.ends_at}
                    onChange={(e) => setFormData((prev) => ({ ...prev, ends_at: e.target.value }))}
                    className="bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg">
                <div>
                  <Label className="text-zinc-300">Active</Label>
                  <p className="text-xs text-zinc-500">Banner will be displayed on homepage</p>
                </div>
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_active: checked }))}
                  className="cursor-pointer"
                />
              </div>

              {/* Submit */}
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={saving || !formData.title || !formData.image_url}
                  className="bg-amber-500 hover:bg-amber-600 text-black cursor-pointer"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : editingBanner ? (
                    "Update Banner"
                  ) : (
                    "Add Banner"
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-zinc-800 pb-2">
        <button
          onClick={() => setActiveTab("main")}
          className={`px-4 py-2 rounded-t-lg font-medium transition-colors cursor-pointer ${
            activeTab === "main"
              ? "bg-amber-500/10 text-amber-500 border-b-2 border-amber-500"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          Main Banners ({mainBanners.length})
        </button>
        <button
          onClick={() => setActiveTab("side")}
          className={`px-4 py-2 rounded-t-lg font-medium transition-colors cursor-pointer ${
            activeTab === "side"
              ? "bg-amber-500/10 text-amber-500 border-b-2 border-amber-500"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          Side Banners ({sideBanners.length})
        </button>
      </div>

      {/* Banner List */}
      <div className="space-y-3">
        {(activeTab === "main" ? mainBanners : sideBanners).length === 0 ? (
          <div className="text-center py-12 bg-zinc-900/50 rounded-xl border border-zinc-800">
            <ImageIcon className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
            <p className="text-zinc-400">No {activeTab} banners yet</p>
            <p className="text-zinc-500 text-sm">Click "Add Banner" to create one</p>
          </div>
        ) : (
          (activeTab === "main" ? mainBanners : sideBanners).map((banner, index, arr) => (
            <div
              key={banner.id}
              className={`flex gap-4 p-4 bg-zinc-900/50 rounded-xl border transition-colors ${
                banner.is_active ? "border-zinc-800" : "border-zinc-800/50 opacity-60"
              }`}
            >
              {/* Thumbnail */}
              <div className="w-32 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                <img
                  src={banner.image_url || "/placeholder.svg"}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-medium text-white truncate">{banner.title}</h3>
                    {banner.subtitle && <p className="text-sm text-zinc-400 truncate">{banner.subtitle}</p>}
                  </div>
                  <div className="flex items-center gap-1">
                    {banner.is_active ? (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/10 text-green-400">Active</span>
                    ) : (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-zinc-700 text-zinc-400">Inactive</span>
                    )}
                  </div>
                </div>

                {/* Link info */}
                <div className="flex items-center gap-4 mt-2 text-xs text-zinc-500">
                  {banner.link_type !== "none" && (
                    <span className="flex items-center gap-1">
                      <LinkIcon className="w-3 h-3" />
                      {banner.link_type === "product" && banner.product && <span>Product: {banner.product.title}</span>}
                      {banner.link_type === "category" && banner.category && (
                        <span>Category: {banner.category.name}</span>
                      )}
                      {banner.link_type === "custom" && (
                        <span className="truncate max-w-[200px]">{banner.link_url}</span>
                      )}
                    </span>
                  )}
                  {(banner.starts_at || banner.ends_at) && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {banner.starts_at && <span>From: {new Date(banner.starts_at).toLocaleDateString()}</span>}
                      {banner.ends_at && <span>To: {new Date(banner.ends_at).toLocaleDateString()}</span>}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleReorder(banner, "up")}
                  disabled={index === 0}
                  className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  title="Move up"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleReorder(banner, "down")}
                  disabled={index === arr.length - 1}
                  className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  title="Move down"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleToggleActive(banner)}
                  className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg cursor-pointer"
                  title={banner.is_active ? "Deactivate" : "Activate"}
                >
                  {banner.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => openEditDialog(banner)}
                  className="p-2 text-zinc-400 hover:text-amber-500 hover:bg-zinc-800 rounded-lg cursor-pointer"
                  title="Edit"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(banner.id)}
                  className="p-2 text-zinc-400 hover:text-red-500 hover:bg-zinc-800 rounded-lg cursor-pointer"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Preview Section */}
      {(activeTab === "main" ? mainBanners : sideBanners).length > 0 && (
        <div className="mt-8 p-4 bg-zinc-900/30 rounded-xl border border-zinc-800">
          <h3 className="text-sm font-medium text-zinc-400 mb-3 flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Preview (Active banners only)
          </h3>
          <div className="flex gap-4">
            {activeTab === "main" ? (
              <div className="w-full aspect-video rounded-lg overflow-hidden bg-zinc-800">
                {mainBanners.filter((b) => b.is_active)[0] && (
                  <img
                    src={mainBanners.filter((b) => b.is_active)[0].image_url || "/placeholder.svg"}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 w-full max-w-md">
                {sideBanners
                  .filter((b) => b.is_active)
                  .slice(0, 2)
                  .map((banner) => (
                    <div key={banner.id} className="aspect-video rounded-lg overflow-hidden bg-zinc-800">
                      <img
                        src={banner.image_url || "/placeholder.svg"}
                        alt={banner.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
