"use client"

import { useEffect, useState, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  Sparkles,
  GripVertical,
  Home,
  ChevronRight,
  Save,
  Loader2,
  Package,
  ArrowUp,
  ArrowDown,
  Eye,
  Info,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface Product {
  id: string
  title: string
  slug: string
  image_url: string | null
  is_featured: boolean
  recommended_order: number | null
  is_active: boolean
  base_price: number
}

export default function RecommendedProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  const router = useRouter()
  const supabase = createClient()
  const { toast } = useToast()

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/products/recommended")
      const data = await res.json()

      if (res.ok) {
        setProducts(data.products || [])
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
  }, [toast])

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

  const moveProduct = (index: number, direction: "up" | "down") => {
    const newProducts = [...products]
    const newIndex = direction === "up" ? index - 1 : index + 1

    if (newIndex < 0 || newIndex >= products.length) return

    const temp = newProducts[index]
    newProducts[index] = newProducts[newIndex]
    newProducts[newIndex] = temp

    setProducts(newProducts)
    setHasChanges(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch("/api/admin/products/recommended", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products: products.map((p) => ({ id: p.id })) }),
      })

      if (res.ok) {
        toast({
          title: "Order saved",
          description: "Recommended products order has been updated",
        })
        setHasChanges(false)
      } else {
        const data = await res.json()
        toast({
          title: "Error",
          description: data.error || "Failed to save order",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save order",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-zinc-400">
        <Link href="/admin" className="hover:text-white transition flex items-center gap-1">
          <Home className="w-4 h-4" />
          Dashboard
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link href="/admin/products" className="hover:text-white transition">
          Products
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-white">Recommended Order</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <Sparkles className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Recommended Products</h1>
            <p className="text-sm text-zinc-400">Manage the order of products shown on the homepage</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/" target="_blank">
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Eye className="w-4 h-4" />
              Preview
            </Button>
          </Link>
          <Button
            onClick={handleSave}
            disabled={!hasChanges || saving}
            className="gap-2 bg-amber-500 hover:bg-amber-400 text-black"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Order
          </Button>
        </div>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
        <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="text-blue-300 font-medium">How it works</p>
          <p className="text-zinc-400 mt-1">
            Only products marked as "Featured" appear here. Use the arrows to reorder them. Products at the top will
            appear first in the homepage recommended section.
          </p>
        </div>
      </div>

      {/* Products list */}
      <div className="relative rounded-2xl border border-white/[0.08] p-3">
        <div className="relative rounded-xl bg-[#0f0f0f] overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Package className="w-12 h-12 text-zinc-600 mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No featured products</h3>
              <p className="text-zinc-400 text-sm max-w-md mb-4">
                Mark products as "Featured" in the product editor to have them appear here.
              </p>
              <Link href="/admin/products">
                <Button variant="outline" size="sm">
                  Go to Products
                </Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.06]">
              {products.map((product, index) => (
                <div key={product.id} className="flex items-center gap-4 p-4 hover:bg-white/[0.02] transition">
                  {/* Order number */}
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 font-medium text-sm shrink-0">
                    {index + 1}
                  </div>

                  {/* Drag handle (visual only) */}
                  <GripVertical className="w-5 h-5 text-zinc-600 shrink-0" />

                  {/* Product image */}
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-zinc-800 shrink-0">
                    {product.image_url ? (
                      <Image
                        src={product.image_url || "/placeholder.svg"}
                        alt={product.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-5 h-5 text-zinc-600" />
                      </div>
                    )}
                  </div>

                  {/* Product info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium truncate">{product.title}</h3>
                    <p className="text-zinc-500 text-sm">Rs. {product.base_price}</p>
                  </div>

                  {/* Move buttons */}
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => moveProduct(index, "up")}
                      disabled={index === 0}
                      className="h-8 w-8"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => moveProduct(index, "down")}
                      disabled={index === products.length - 1}
                      className="h-8 w-8"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Edit link */}
                  <Link href={`/admin/products/${product.id}/edit`}>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      {products.length > 0 && (
        <p className="text-center text-sm text-zinc-500">
          {products.length} featured product{products.length !== 1 ? "s" : ""} in recommended section
        </p>
      )}
    </div>
  )
}
