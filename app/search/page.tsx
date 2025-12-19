"use client"

import type React from "react"
import { useState, useEffect, useCallback, useRef, useMemo } from "react"
import { Search, SlidersHorizontal, X, Heart, Loader2, Clock, TrendingUp, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useCart } from "@/contexts/cart-context"
import { useWishlist } from "@/contexts/wishlist-context"
import { useToast } from "@/hooks/use-toast"
import { useSearchParams, useRouter } from "next/navigation"
import { getCategories, getPlatforms, type Category, type Platform } from "@/lib/products"

interface SearchProduct {
  id: string
  title: string
  slug: string
  short_description: string
  product_type: string
  base_price: number
  discount_percent: number
  image_url: string
  thumbnail_url: string
  region: string
  is_featured: boolean
  is_bestseller: boolean
  average_rating: number
  review_count: number
  category?: { id: string; name: string; slug: string }
}

// Local storage keys for search history
const SEARCH_HISTORY_KEY = "search_history"
const MAX_HISTORY_ITEMS = 5

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialQuery = searchParams.get("q") || ""

  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("relevant")
  const [showFilters, setShowFilters] = useState(false)
  const [products, setProducts] = useState<SearchProduct[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [platforms, setPlatforms] = useState<Platform[]>([])
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  const { addItem } = useCart()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlist()
  const { toast } = useToast()

  const searchInputRef = useRef<HTMLInputElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  // Load search history from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const history = localStorage.getItem(SEARCH_HISTORY_KEY)
      if (history) {
        try {
          setSearchHistory(JSON.parse(history))
        } catch (e) {
          console.error("Error parsing search history:", e)
        }
      }
    }
  }, [])

  // Save search to history
  const saveToHistory = useCallback((query: string) => {
    if (!query.trim()) return

    setSearchHistory((prev) => {
      const newHistory = [query, ...prev.filter((h) => h !== query)].slice(0, MAX_HISTORY_ITEMS)
      if (typeof window !== "undefined") {
        localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory))
      }
      return newHistory
    })
  }, [])

  // Fetch categories and platforms on mount
  useEffect(() => {
    async function fetchFilters() {
      const [fetchedCategories, fetchedPlatforms] = await Promise.all([getCategories(), getPlatforms()])
      setCategories(fetchedCategories)
      setPlatforms(fetchedPlatforms)
      setInitialLoading(false)
    }
    fetchFilters()
  }, [])

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery)
    }, 150) // Fast 150ms debounce

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Fetch products when filters change
  const fetchProducts = useCallback(async () => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    abortControllerRef.current = new AbortController()

    setLoading(true)

    try {
      const params = new URLSearchParams()
      if (debouncedQuery) params.set("q", debouncedQuery)
      if (selectedCategory !== "all") params.set("category", selectedCategory)
      if (selectedType !== "all") params.set("type", selectedType)
      params.set("sort", sortBy)
      params.set("limit", "24")

      const response = await fetch(`/api/search?${params.toString()}`, {
        signal: abortControllerRef.current.signal,
      })

      if (!response.ok) throw new Error("Search failed")

      const data = await response.json()
      setProducts(data.products || [])
      setTotalCount(data.count || 0)

      // Save successful search to history
      if (debouncedQuery.trim()) {
        saveToHistory(debouncedQuery.trim())
      }
    } catch (error: any) {
      if (error.name !== "AbortError") {
        console.error("Error fetching products:", error)
        setProducts([])
        setTotalCount(0)
      }
    } finally {
      setLoading(false)
    }
  }, [debouncedQuery, selectedCategory, selectedType, sortBy, saveToHistory])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // Update URL with search query
  useEffect(() => {
    if (debouncedQuery !== initialQuery) {
      const params = new URLSearchParams()
      if (debouncedQuery) params.set("q", debouncedQuery)
      router.replace(`/search${params.toString() ? `?${params.toString()}` : ""}`, { scroll: false })
    }
  }, [debouncedQuery, initialQuery, router])

  const toggleFavorite = (product: SearchProduct, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
      toast({ title: "Removed from wishlist" })
    } else {
      addToWishlist({
        productId: product.id,
        productTitle: product.title,
        productSlug: product.slug,
        productImage: product.image_url || product.thumbnail_url || "/placeholder.svg",
      })
      toast({ title: "Added to wishlist" })
    }
  }

  const formatPrice = (price: number) => {
    return `NPR ${price.toLocaleString()}`
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowSuggestions(false)
    searchInputRef.current?.blur()
  }

  const handleHistoryClick = (query: string) => {
    setSearchQuery(query)
    setShowSuggestions(false)
  }

  const clearHistory = () => {
    setSearchHistory([])
    if (typeof window !== "undefined") {
      localStorage.removeItem(SEARCH_HISTORY_KEY)
    }
  }

  // Popular searches (could be fetched from analytics)
  const popularSearches = useMemo(() => ["Netflix", "Spotify", "PlayStation", "Xbox", "Steam"], [])

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Search Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6">Search Products</h1>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="flex gap-2 sm:gap-3 mb-4 relative">
            <div className="flex-1 relative">
              <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-zinc-500" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="Search games, gift cards, subscriptions..."
                className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-3.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-sm sm:text-base placeholder:text-zinc-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all"
                autoComplete="off"
              />
              {loading && (
                <Loader2 className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-amber-500 animate-spin" />
              )}

              {/* Search Suggestions Dropdown */}
              {showSuggestions && !debouncedQuery && (searchHistory.length > 0 || popularSearches.length > 0) && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden z-50 shadow-xl">
                  {/* Recent Searches */}
                  {searchHistory.length > 0 && (
                    <div className="p-3 border-b border-zinc-800">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-zinc-500 uppercase tracking-wide">Recent</span>
                        <button
                          onClick={clearHistory}
                          className="text-xs text-zinc-500 hover:text-amber-500 transition-colors cursor-pointer"
                        >
                          Clear
                        </button>
                      </div>
                      <div className="space-y-1">
                        {searchHistory.map((query, i) => (
                          <button
                            key={i}
                            onClick={() => handleHistoryClick(query)}
                            className="flex items-center gap-2 w-full px-2 py-1.5 text-sm text-zinc-300 hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                          >
                            <Clock className="w-3.5 h-3.5 text-zinc-500" />
                            {query}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Popular Searches */}
                  <div className="p-3">
                    <span className="text-xs font-medium text-zinc-500 uppercase tracking-wide flex items-center gap-1 mb-2">
                      <TrendingUp className="w-3 h-3" />
                      Popular
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {popularSearches.map((query, i) => (
                        <button
                          key={i}
                          onClick={() => handleHistoryClick(query)}
                          className="px-3 py-1 text-xs bg-zinc-800 text-zinc-300 rounded-full hover:bg-amber-500/20 hover:text-amber-400 transition-colors cursor-pointer"
                        >
                          {query}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <Button
              type="button"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="px-3 sm:px-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4 sm:w-5 sm:h-5 sm:mr-2" />
              <span className="hidden sm:inline">Filters</span>
            </Button>
          </form>

          {/* Filters Panel */}
          {isFilterOpen && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 animate-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold text-sm sm:text-base">Filters</h3>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="text-zinc-500 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                {/* Category Filter */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-zinc-400 mb-1.5 sm:mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 cursor-pointer"
                  >
                    <option value="all">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.slug}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Product Type Filter */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-zinc-400 mb-1.5 sm:mb-2">Type</label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 cursor-pointer"
                  >
                    <option value="all">All Types</option>
                    <option value="game">Games</option>
                    <option value="giftcard">Gift Cards</option>
                    <option value="subscription">Subscriptions</option>
                    <option value="software">Software</option>
                  </select>
                </div>

                {/* Platform Filter */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-zinc-400 mb-1.5 sm:mb-2">Platform</label>
                  <select
                    value={selectedPlatform}
                    onChange={(e) => setSelectedPlatform(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 cursor-pointer"
                  >
                    <option value="all">All Platforms</option>
                    {platforms.map((plat) => (
                      <option key={plat.id} value={plat.slug}>
                        {plat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-zinc-400 mb-1.5 sm:mb-2">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 cursor-pointer"
                  >
                    <option value="relevant">Relevant</option>
                    <option value="newest">Newest</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="popular">Most Popular</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 flex gap-3">
                <Button
                  onClick={() => {
                    setSelectedCategory("all")
                    setSelectedPlatform("all")
                    setSelectedType("all")
                    setSortBy("relevant")
                  }}
                  variant="outline"
                  className="border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800 cursor-pointer text-sm"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          )}

          {/* Results Count */}
          <p className="text-zinc-400 text-xs sm:text-sm">
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="w-3 h-3 animate-spin" />
                Searching...
              </span>
            ) : (
              `${totalCount} ${totalCount === 1 ? "result" : "results"} found`
            )}
          </p>
        </div>

        {/* Results Grid */}
        {initialLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                <div className="aspect-[3/4] bg-zinc-800 animate-pulse" />
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-zinc-800 rounded animate-pulse" />
                  <div className="h-3 w-20 bg-zinc-800 rounded animate-pulse" />
                  <div className="h-5 w-24 bg-zinc-800 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {products.map((product) => {
              const discountedPrice =
                product.discount_percent > 0
                  ? product.base_price * (1 - product.discount_percent / 100)
                  : product.base_price

              return (
                <Link key={product.id} href={`/product/${product.slug}`} prefetch={true}>
                  <div className="group relative overflow-hidden rounded-xl bg-zinc-900/50 border border-amber-500/[0.08] transition-all duration-200 hover:border-amber-500/20 h-full flex flex-col cursor-pointer">
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/15 to-transparent z-10" />

                    <div className="relative w-full aspect-[3/4] overflow-hidden bg-zinc-800">
                      <img
                        src={product.image_url || product.thumbnail_url || "/placeholder.svg"}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      {/* Favorite button */}
                      <button
                        onClick={(e) => toggleFavorite(product, e)}
                        className="absolute top-2 right-2 w-8 h-8 bg-black/60 backdrop-blur-sm rounded-lg flex items-center justify-center transition-all duration-200 hover:bg-black/80 z-10 border border-white/[0.08] cursor-pointer"
                      >
                        <Heart
                          className={`w-4 h-4 transition-all ${isInWishlist(product.id) ? "fill-amber-500 text-amber-500" : "text-white/70"}`}
                        />
                      </button>

                      {/* Discount badge */}
                      {product.discount_percent > 0 && (
                        <div className="absolute bottom-12 left-2 bg-amber-500/90 text-black px-2 py-0.5 text-[10px] font-medium rounded-md">
                          -{product.discount_percent}% OFF
                        </div>
                      )}

                      {/* Platform/Type badge */}
                      <div className="absolute bottom-0 left-0 right-0 bg-zinc-900/90 backdrop-blur-sm text-white px-3 py-1.5 text-xs font-medium text-center border-t border-white/[0.06]">
                        {product.product_type?.toUpperCase() || "GAME"}
                      </div>
                    </div>

                    <div className="p-3 flex flex-col flex-grow bg-gradient-to-b from-amber-500/[0.02] to-transparent">
                      <h3 className="text-xs sm:text-sm font-medium text-white mb-1 line-clamp-2 leading-tight min-h-[2rem]">
                        {product.title}
                      </h3>

                      <div className="text-[10px] text-zinc-500 font-medium mb-2 uppercase tracking-wider">
                        {product.region || "GLOBAL"}
                      </div>

                      <div className="space-y-1 mb-3">
                        <div className="text-[10px] text-zinc-600 uppercase tracking-wide">From</div>
                        {product.discount_percent > 0 && (
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-zinc-600 line-through">
                              NPR {product.base_price.toFixed(0)}
                            </span>
                            <span className="text-[10px] font-medium text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-md border border-emerald-500/20">
                              -{product.discount_percent}%
                            </span>
                          </div>
                        )}
                        <div className="text-lg sm:text-xl font-semibold text-white">
                          NPR{" "}
                          {(product.discount_percent > 0
                            ? product.base_price * (1 - product.discount_percent / 100)
                            : product.base_price
                          ).toFixed(0)}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-zinc-600 text-[10px] mb-3">
                        <Heart className="w-3 h-3" />
                        <span>{product.review_count?.toLocaleString() || 0}</span>
                      </div>

                      <div className="mt-auto">
                        <div className="relative w-full bg-gradient-to-r from-amber-500 to-amber-600 group-hover:from-amber-400 group-hover:to-amber-500 text-black font-medium py-2 rounded-lg transition-all text-xs flex items-center justify-center gap-2 overflow-hidden cursor-pointer shadow-[0_0_20px_rgba(245,158,11,0.15)]">
                          <div className="absolute inset-0 bg-gradient-to-b from-white/25 to-transparent h-1/2" />
                          <Eye className="w-3.5 h-3.5 relative" />
                          <span className="relative">View Details</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12 sm:py-16">
            <Search className="w-12 h-12 sm:w-16 sm:h-16 text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-500 text-base sm:text-lg mb-2">No results found</p>
            <p className="text-zinc-600 text-xs sm:text-sm mb-6">Try adjusting your search or filters</p>
            {searchHistory.length > 0 && (
              <div className="max-w-md mx-auto">
                <p className="text-zinc-500 text-xs mb-3">Try a recent search:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {searchHistory.map((query, i) => (
                    <button
                      key={i}
                      onClick={() => setSearchQuery(query)}
                      className="px-3 py-1.5 text-xs bg-zinc-800 text-zinc-300 rounded-full hover:bg-amber-500/20 hover:text-amber-400 transition-colors cursor-pointer"
                    >
                      {query}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
