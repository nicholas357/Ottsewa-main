"use client"

import { Suspense, useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
  Gamepad2,
  Coins,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Search,
  X,
  Loader2,
  Package,
  GripVertical,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"

interface Product {
  id: string
  name: string
  slug: string
  image_url: string | null
  price: number
  original_price: number | null
}

interface HomeSection {
  id: string
  section_type: string
  product_id: string
  sort_order: number
  is_active: boolean
  product: Product | null
}

const sectionConfig = {
  games: {
    title: "Games",
    icon: Gamepad2,
    color: "purple",
    bgClass: "bg-purple-500/10",
    borderClass: "border-purple-500/20",
    textClass: "text-purple-400",
  },
  game_currency: {
    title: "Game Currency",
    icon: Coins,
    color: "emerald",
    bgClass: "bg-emerald-500/10",
    borderClass: "border-emerald-500/20",
    textClass: "text-emerald-400",
  },
}

export default function HomeSectionsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
        </div>
      }
    >
      <HomeSectionsContent />
    </Suspense>
  )
}

function HomeSectionsContent() {
  const [sections, setSections] = useState<{ games: HomeSection[]; game_currency: HomeSection[] }>({
    games: [],
    game_currency: [],
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<"games" | "game_currency">("games")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [searching, setSearching] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const fetchSections = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/home-sections")
      if (!response.ok) throw new Error("Failed to fetch sections")

      const { sections: data } = await response.json()

      setSections({
        games: data.filter((s: HomeSection) => s.section_type === "games"),
        game_currency: data.filter((s: HomeSection) => s.section_type === "game_currency"),
      })
    } catch (error) {
      console.error("Error fetching sections:", error)
      toast({
        title: "Error",
        description: "Failed to load home sections",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchSections()
  }, [fetchSections])

  const searchProducts = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setSearchResults([])
        return
      }

      setSearching(true)
      try {
        const supabase = createClient()

        const { data: products, error } = await supabase
          .from("products")
          .select("id, title, slug, image_url, base_price, discount_percent")
          .eq("is_active", true)
          .ilike("title", `%${query}%`)
          .limit(20)

        if (error) throw error

        // Filter out products already in the current section
        const existingIds = sections[activeTab].map((s) => s.product_id)
        const mappedProducts = (products || [])
          .filter((p) => !existingIds.includes(p.id))
          .map((p) => ({
            id: p.id,
            name: p.title,
            slug: p.slug,
            image_url: p.image_url,
            price: p.base_price,
            original_price: p.discount_percent ? Math.round(p.base_price / (1 - p.discount_percent / 100)) : null,
          }))

        setSearchResults(mappedProducts)
      } catch (error) {
        console.error("Search error:", error)
        setSearchResults([])
      } finally {
        setSearching(false)
      }
    },
    [activeTab, sections],
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      searchProducts(searchQuery)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery, searchProducts])

  const addProduct = async (product: Product) => {
    try {
      const response = await fetch("/api/admin/home-sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section_type: activeTab,
          product_id: product.id,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to add product")
      }

      toast({
        title: "Product added",
        description: `${product.name} has been added to ${sectionConfig[activeTab].title}`,
      })

      setShowAddDialog(false)
      setSearchQuery("")
      setSearchResults([])
      fetchSections()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const removeProduct = async (sectionId: string) => {
    try {
      const response = await fetch(`/api/admin/home-sections?id=${sectionId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to remove product")

      toast({
        title: "Product removed",
        description: "Product has been removed from the section",
      })

      fetchSections()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove product",
        variant: "destructive",
      })
    }
  }

  const moveProduct = async (index: number, direction: "up" | "down") => {
    const currentSections = [...sections[activeTab]]
    const newIndex = direction === "up" ? index - 1 : index + 1

    if (newIndex < 0 || newIndex >= currentSections.length) return // Swap
    ;[currentSections[index], currentSections[newIndex]] = [currentSections[newIndex], currentSections[index]]

    setSections((prev) => ({
      ...prev,
      [activeTab]: currentSections,
    }))

    setSaving(true)
    try {
      const response = await fetch("/api/admin/home-sections", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sections: currentSections }),
      })

      if (!response.ok) throw new Error("Failed to update order")

      toast({
        title: "Order updated",
        description: "Product order has been saved",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order",
        variant: "destructive",
      })
      fetchSections()
    } finally {
      setSaving(false)
    }
  }

  const config = sectionConfig[activeTab]
  const Icon = config.icon

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Home Sections</h1>
          <p className="text-zinc-400 text-sm mt-1">
            Manage which products appear in the Games and Game Currency sections on the homepage
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
        <TabsList className="bg-zinc-900 border border-zinc-800">
          <TabsTrigger
            value="games"
            className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400"
          >
            <Gamepad2 className="w-4 h-4 mr-2" />
            Games ({sections.games.length})
          </TabsTrigger>
          <TabsTrigger
            value="game_currency"
            className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400"
          >
            <Coins className="w-4 h-4 mr-2" />
            Game Currency ({sections.game_currency.length})
          </TabsTrigger>
        </TabsList>

        {["games", "game_currency"].map((tabKey) => (
          <TabsContent key={tabKey} value={tabKey} className="mt-6">
            <div className="relative rounded-2xl border border-white/[0.08] p-3">
              <div className="relative rounded-xl bg-[#0f0f0f] overflow-hidden p-4 sm:p-6">
                {/* Section Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-xl ${config.bgClass} border ${config.borderClass}`}
                    >
                      <Icon className={`w-5 h-5 ${config.textClass}`} />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-white">{config.title}</h2>
                      <p className="text-sm text-zinc-400">{sections[activeTab].length} products in this section</p>
                    </div>
                  </div>
                  <Button onClick={() => setShowAddDialog(true)} className="bg-amber-500 hover:bg-amber-400 text-black">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </Button>
                </div>

                {/* Products List */}
                {sections[activeTab].length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div
                      className={`w-16 h-16 rounded-2xl ${config.bgClass} border ${config.borderClass} flex items-center justify-center mb-4`}
                    >
                      <Package className={`w-8 h-8 ${config.textClass}`} />
                    </div>
                    <h3 className="text-lg font-medium text-white mb-2">No products yet</h3>
                    <p className="text-zinc-400 text-sm mb-4 max-w-md">
                      Add products to display them in the {config.title} section on the homepage
                    </p>
                    <Button
                      onClick={() => setShowAddDialog(true)}
                      className="bg-amber-500 hover:bg-amber-400 text-black"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add First Product
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {sections[activeTab].map((section, index) => (
                      <div
                        key={section.id}
                        className="flex items-center gap-4 p-3 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-colors"
                      >
                        <div className="text-zinc-600">
                          <GripVertical className="w-5 h-5" />
                        </div>

                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-zinc-800 flex-shrink-0">
                          {section.product?.image_url ? (
                            <Image
                              src={section.product.image_url || "/placeholder.svg"}
                              alt={section.product.name}
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
                          <h3 className="font-medium text-white truncate">
                            {section.product?.name || "Unknown Product"}
                          </h3>
                          <p className="text-sm text-zinc-400">
                            Rs. {section.product?.price?.toLocaleString() || "0"}
                            {section.product?.original_price && (
                              <span className="ml-2 line-through text-zinc-600">
                                Rs. {section.product.original_price.toLocaleString()}
                              </span>
                            )}
                          </p>
                        </div>

                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => moveProduct(index, "up")}
                            disabled={index === 0 || saving}
                            className="h-8 w-8 text-zinc-400 hover:text-white"
                          >
                            <ArrowUp className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => moveProduct(index, "down")}
                            disabled={index === sections[activeTab].length - 1 || saving}
                            className="h-8 w-8 text-zinc-400 hover:text-white"
                          >
                            <ArrowDown className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeProduct(section.id)}
                            className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10"
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
          </TabsContent>
        ))}
      </Tabs>

      {/* Add Product Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="bg-zinc-900 border-zinc-800 max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Icon className={`w-5 h-5 ${config.textClass}`} />
              Add Product to {config.title}
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              Search for a product to add to the {config.title.toLowerCase()} section
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-zinc-800 border-zinc-700 text-white"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("")
                    setSearchResults([])
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="max-h-[300px] overflow-y-auto space-y-2">
              {searching ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
                </div>
              ) : searchResults.length > 0 ? (
                searchResults.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => addProduct(product)}
                    className="w-full flex items-center gap-3 p-3 bg-zinc-800/50 border border-zinc-700 rounded-lg hover:border-amber-500/50 hover:bg-zinc-800 transition-colors cursor-pointer text-left"
                  >
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-zinc-700 flex-shrink-0">
                      {product.image_url ? (
                        <Image
                          src={product.image_url || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-5 h-5 text-zinc-500" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-white truncate">{product.name}</h4>
                      <p className="text-sm text-zinc-400">Rs. {product.price.toLocaleString()}</p>
                    </div>
                    <Plus className="w-5 h-5 text-amber-500" />
                  </button>
                ))
              ) : searchQuery ? (
                <div className="text-center py-8 text-zinc-500">No products found</div>
              ) : (
                <div className="text-center py-8 text-zinc-500">Start typing to search for products</div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
