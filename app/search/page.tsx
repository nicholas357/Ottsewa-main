"use client"

import type React from "react"
import { useState, useEffect, useCallback, useRef, useMemo } from "react"
import { Search, SlidersHorizontal, X, Loader2, Clock, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSearchParams, useRouter } from "next/navigation"
import { getCategories, getPlatforms, type Category, type Platform, type Product } from "@/lib/products"
import ProductCard from "@/components/product-card"

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
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [platforms, setPlatforms] = useState<Platform[]>([])
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

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
    }, 150)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Fetch products when filters change
  const fetchProducts = useCallback(async () => {
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

  const popularSearches = useMemo(() => ["Netflix", "Spotify", "PlayStation", "Xbox", "Steam"], [])

  return (
    <div className="min-h-screen bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="rounded-2xl border border-white/[0.08] p-3 mb-6">
          <div className="bg-[#0f0f0f] rounded-xl p-4 sm:p-6">
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
                    className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-3.5 bg-[#1a1a1a] border border-white/[0.08] rounded-xl text-white text-sm sm:text-base placeholder:text-zinc-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all"
                    autoComplete="off"
                  />
                  {loading && (
                    <Loader2 className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-amber-500 animate-spin" />
                  )}

                  {/* Search Suggestions Dropdown */}
                  {showSuggestions && !debouncedQuery && (searchHistory.length > 0 || popularSearches.length > 0) && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a] border border-white/[0.08] rounded-xl overflow-hidden z-50 shadow-xl">
                      {/* Recent Searches */}
                      {searchHistory.length > 0 && (
                        <div className="p-3 border-b border-white/[0.05]">
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
                                className="flex items-center gap-2 w-full px-2 py-1.5 text-sm text-zinc-300 hover:bg-[#222222] rounded-lg transition-colors cursor-pointer"
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
                              className="px-3 py-1 text-xs bg-[#222222] text-zinc-300 rounded-full hover:bg-amber-500/20 hover:text-amber-400 transition-colors cursor-pointer"
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
                  className="px-3 sm:px-4 bg-[#1a1a1a] hover:bg-[#222222] border border-white/[0.08] text-white cursor-pointer"
                >
                  <SlidersHorizontal className="w-4 h-4 sm:w-5 sm:h-5 sm:mr-2" />
                  <span className="hidden sm:inline">Filters</span>
                </Button>
              </form>

              {/* Filters Panel */}
              {isFilterOpen && (
                <div className="bg-[#1a1a1a] border border-white/[0.08] rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 animate-in slide-in-from-top-2 duration-200">
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
                      <label className="block text-xs sm:text-sm font-medium text-zinc-400 mb-1.5 sm:mb-2">
                        Category
                      </label>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-[#222222] border border-white/[0.08] rounded-lg text-white text-sm focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 cursor-pointer"
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
                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-[#222222] border border-white/[0.08] rounded-lg text-white text-sm focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 cursor-pointer"
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
                      <label className="block text-xs sm:text-sm font-medium text-zinc-400 mb-1.5 sm:mb-2">
                        Platform
                      </label>
                      <select
                        value={selectedPlatform}
                        onChange={(e) => setSelectedPlatform(e.target.value)}
                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-[#222222] border border-white/[0.08] rounded-lg text-white text-sm focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 cursor-pointer"
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
                      <label className="block text-xs sm:text-sm font-medium text-zinc-400 mb-1.5 sm:mb-2">
                        Sort By
                      </label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-[#222222] border border-white/[0.08] rounded-lg text-white text-sm focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 cursor-pointer"
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
                      className="border-white/[0.08] text-zinc-400 hover:text-white hover:bg-[#222222] cursor-pointer text-sm"
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
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.08] p-3">
          <div className="bg-[#0f0f0f] rounded-xl p-4 sm:p-6">
            {/* Results Grid */}
            {initialLoading ? (
              <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                {[...Array(10)].map((_, i) => (
                  <li key={i} className="bg-[#1a1a1a] border border-white/[0.05] rounded-xl overflow-hidden">
                    <div className="aspect-[3/4] bg-[#222222] animate-pulse" />
                    <div className="p-3 space-y-2">
                      <div className="h-4 bg-[#222222] rounded animate-pulse" />
                      <div className="h-3 w-20 bg-[#222222] rounded animate-pulse" />
                      <div className="h-5 w-24 bg-[#222222] rounded animate-pulse" />
                    </div>
                  </li>
                ))}
              </ul>
            ) : products.length > 0 ? (
              <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                {products.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} showTags={true} />
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-20 h-20 bg-[#1a1a1a] rounded-full flex items-center justify-center mb-4">
                  <Search className="w-10 h-10 text-zinc-700" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">No products found</h3>
                <p className="text-zinc-500 text-center text-sm max-w-sm">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
