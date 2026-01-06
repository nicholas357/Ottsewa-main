"use client"

import type React from "react"
import Image from "next/image"
import {
  Search,
  Heart,
  ShoppingCart,
  User,
  Menu,
  X,
  LogOut,
  ChevronRight,
  ChevronDown,
  Package,
  Home,
  Settings,
  Gamepad2,
  Gift,
  Monitor,
  Key,
  Tv,
  Sparkles,
  Folder,
  Zap,
  LayoutGrid,
} from "lucide-react"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useCart } from "@/contexts/cart-context"
import { useWishlist } from "@/contexts/wishlist-context"
import { useAuth, clearUserCache, getCachedUser } from "@/hooks/use-auth"

interface Profile {
  role: string
  full_name: string | null
}

interface Category {
  id: string
  name: string
  slug: string
  icon: string | null
  description: string | null
  productCount: number
}

interface CategoryProduct {
  id: string
  title: string
  slug: string
  thumbnail_url: string | null
  base_price: number
  discount_percent: number | null
}

const categoryIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  gamepad: Gamepad2,
  gift: Gift,
  monitor: Monitor,
  key: Key,
  tv: Tv,
  sparkles: Sparkles,
  folder: Folder,
}

const UserMenu = ({
  user,
  profile,
  isAdmin,
  isOpen,
  onToggle,
  onClose,
  menuRef,
}: {
  user: any
  profile: Profile | null
  isAdmin: boolean
  isOpen: boolean
  onToggle: () => void
  onClose: () => void
  menuRef: React.RefObject<HTMLDivElement>
}) => {
  const router = useRouter()
  const supabase = createClient()
  const { itemCount } = useCart()

  const handleSignOut = async () => {
    clearUserCache()
    await supabase.auth.signOut()
    onClose()
    router.push("/")
    router.refresh()
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={onToggle}
        className="group relative w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-bold text-black text-sm cursor-pointer transition-transform duration-200 hover:scale-105 active:scale-95"
      >
        {profile?.full_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || "U"}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={onClose} />

          <div className="fixed right-3 top-14 sm:absolute sm:right-0 sm:top-full sm:mt-2 w-[calc(100vw-24px)] max-w-[240px] sm:w-56 z-50 max-h-[calc(100vh-80px)] overflow-hidden flex flex-col">
            {/* Outer box */}
            <div className="rounded-2xl border border-white/[0.08] p-[3px]">
              {/* Inner box */}
              <div className="bg-[#0f0f0f] rounded-xl overflow-hidden">
                {/* User Header */}
                <div className="p-3 border-b border-white/[0.06]">
                  <p className="text-white font-medium text-sm truncate">
                    {profile?.full_name || user.email?.split("@")[0]}
                  </p>
                  <p className="text-gray-500 text-xs mt-0.5 truncate">{user.email}</p>
                  <span
                    className={`inline-block mt-1.5 px-2 py-0.5 rounded text-xs font-medium ${
                      isAdmin ? "bg-amber-500 text-black" : "bg-[#1a1a1a] text-gray-300"
                    }`}
                  >
                    {isAdmin ? "Admin" : "Member"}
                  </span>
                </div>

                <div className="py-1 overflow-y-auto flex-1">
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-[#1a1a1a] transition-colors"
                    onClick={onClose}
                  >
                    <User className="w-4 h-4 shrink-0" />
                    <span className="text-sm">Profile</span>
                  </Link>

                  <Link
                    href="/wishlist"
                    className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-[#1a1a1a] transition-colors"
                    onClick={onClose}
                  >
                    <Heart className="w-4 h-4 shrink-0" />
                    <span className="text-sm">Wishlist</span>
                  </Link>

                  <Link
                    href="/cart"
                    className="flex items-center justify-between px-3 py-2 text-gray-300 hover:text-white hover:bg-[#1a1a1a] transition-colors"
                    onClick={onClose}
                  >
                    <div className="flex items-center gap-3">
                      <ShoppingCart className="w-4 h-4 shrink-0" />
                      <span className="text-sm">Cart</span>
                    </div>
                    {itemCount > 0 && (
                      <span className="w-5 h-5 flex items-center justify-center bg-amber-500 text-black text-xs font-bold rounded-full">
                        {itemCount}
                      </span>
                    )}
                  </Link>

                  <Link
                    href="/orders"
                    className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-[#1a1a1a] transition-colors"
                    onClick={onClose}
                  >
                    <Package className="w-4 h-4 shrink-0" />
                    <span className="text-sm">Orders</span>
                  </Link>

                  <Link
                    href="/settings"
                    className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-[#1a1a1a] transition-colors"
                    onClick={onClose}
                  >
                    <Settings className="w-4 h-4 shrink-0" />
                    <span className="text-sm">Settings</span>
                  </Link>

                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-[#1a1a1a] transition-colors"
                      onClick={onClose}
                    >
                      <LayoutGrid className="w-4 h-4 shrink-0" />
                      <span className="text-sm">Admin Dashboard</span>
                    </Link>
                  )}
                </div>

                {/* Logout */}
                <div className="border-t border-white/[0.06] py-1">
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 px-3 py-2 w-full text-gray-300 hover:text-white hover:bg-[#1a1a1a] transition-colors"
                  >
                    <LogOut className="w-4 h-4 shrink-0" />
                    <span className="text-sm">Log out</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  const { user: authUser, profile: authProfile, loading: authLoading } = useAuth()

  const [categories, setCategories] = useState<Category[]>([])
  const [categoryProducts, setCategoryProducts] = useState<Record<string, CategoryProduct[]>>({})
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [loadingProducts, setLoadingProducts] = useState<string | null>(null)
  const [expandedMobileCategory, setExpandedMobileCategory] = useState<string | null>(null)
  const [categoriesLoading, setCategoriesLoading] = useState(true)

  const router = useRouter()
  const supabase = createClient()
  const userMenuRef = useRef<HTMLDivElement>(null)
  const categoryDropdownRef = useRef<HTMLDivElement>(null)
  const { getCartCount } = useCart()
  const cartCount = getCartCount()
  const { itemCount: wishlistCount } = useWishlist()

  const user = authUser ? { id: authUser.id, email: authUser.email } : null
  const profile: Profile | null = authProfile
    ? {
        role: authProfile.role,
        full_name: authProfile.full_name,
      }
    : null
  const isLoading = authLoading && !getCachedUser()

  useEffect(() => {
    const controller = new AbortController()

    const fetchCategories = async () => {
      try {
        const timeoutId = setTimeout(() => controller.abort(), 5000)

        const { data: allCategories, error } = await supabase
          .from("categories")
          .select("id, name, slug, icon, description")
          .eq("is_active", true)
          .order("sort_order")
          .limit(6)
          .abortSignal(controller.signal)

        clearTimeout(timeoutId)

        if (error) throw error

        if (allCategories) {
          setCategories(allCategories.slice(0, 3).map((cat) => ({ ...cat, productCount: 0 })))
        }
      } catch (error: any) {
        if (error?.name === "AbortError" || controller.signal.aborted) {
          return // Silently ignore abort errors
        }
        console.error("Error fetching categories:", error)
        setCategories([])
      } finally {
        if (!controller.signal.aborted) {
          setCategoriesLoading(false)
        }
      }
    }
    fetchCategories()

    return () => {
      controller.abort()
    }
  }, [])

  const fetchCategoryProducts = async (categoryId: string) => {
    if (categoryProducts[categoryId]) return
    setLoadingProducts(categoryId)
    const { data } = await supabase
      .from("products")
      .select("id, title, slug, thumbnail_url, base_price, discount_percent")
      .eq("category_id", categoryId)
      .eq("is_active", true)
      .limit(6)
      .order("created_at", { ascending: false })
    if (data) {
      setCategoryProducts((prev) => ({ ...prev, [categoryId]: data }))
    }
    setLoadingProducts(null)
  }

  const handleCategoryHover = (categoryId: string) => {
    setActiveCategory(categoryId)
    fetchCategoryProducts(categoryId)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setActiveCategory(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isMenuOpen])

  const isAdmin = profile?.role === "admin"

  return (
    <>
      <header className="relative bg-[#0f0f0f]/90 backdrop-blur-md border-b border-white/[0.06] sticky top-0 z-50">
        {/* Subtle top accent line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />

        {/* ROW 1 - Top bar */}
        <div className="border-b border-white/[0.04]">
          <div className="max-w-7xl mx-auto px-4 lg:px-6 py-3 lg:py-3.5">
            <div className="flex items-center justify-between">
              {/* Left - Logo + Hamburger (mobile) */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="lg:hidden w-10 h-10 rounded-xl bg-[#1a1a1a] border border-white/[0.06] flex items-center justify-center hover:bg-[#222222] hover:border-white/[0.1] transition-all duration-200 cursor-pointer group"
                  aria-label="Menu"
                >
                  <Menu className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                </button>
                <Link href="/" className="flex items-center gap-2 group">
                  <div className="relative flex items-center">
                    {/* Logo container with subtle glow */}
                    <div className="relative px-3 py-1.5 rounded-xl bg-gradient-to-br from-[#1a1a1a] to-[#141414] border border-white/[0.08] group-hover:border-amber-500/30 transition-all duration-300">
                      {/* Subtle inner glow */}
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Logo text */}
                      <div className="relative flex items-center gap-0.5">
                        <span className="font-black text-lg lg:text-xl tracking-tight bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                          OTT
                        </span>
                        <span className="font-black text-lg lg:text-xl tracking-tight bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent">
                          Sewa
                        </span>
                      </div>

                      {/* Top shine line */}
                      <div className="absolute top-0 left-2 right-2 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    </div>
                  </div>
                </Link>
              </div>

              {/* Right - Language + Currency */}
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 rounded-xl bg-[#1a1a1a] border border-white/[0.06] text-gray-300 text-sm flex items-center gap-1.5 hover:bg-[#222222] hover:border-white/[0.1] transition-all duration-200 cursor-pointer">
                  English
                  <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                </button>
                <button className="px-3 py-1.5 rounded-xl bg-[#1a1a1a] border border-white/[0.06] text-gray-300 text-sm flex items-center gap-1.5 hover:bg-[#222222] hover:border-white/[0.1] transition-all duration-200 cursor-pointer">
                  NPR
                  <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ROW 2 - Navigation + Actions */}
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-3 lg:py-3.5">
          <div className="flex items-center justify-between lg:justify-between">
            <nav className="hidden lg:flex items-center gap-1 flex-1" ref={categoryDropdownRef}>
              <Link
                href="/"
                className="flex items-center gap-2 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-[#1a1a1a] rounded-xl transition-all duration-200 text-sm font-medium cursor-pointer group"
              >
                <Home className="w-4 h-4 text-gray-500 group-hover:text-amber-500 transition-colors" />
                Home
              </Link>

              {/* Dynamic Categories */}
              {categories.map((category) => {
                const IconComponent = categoryIconMap[category.icon || "folder"] || Folder
                return (
                  <div key={category.id} className="relative">
                    <button
                      onMouseEnter={() => handleCategoryHover(category.id)}
                      onClick={() => router.push(`/category/${category.slug}`)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium cursor-pointer group ${
                        activeCategory === category.id
                          ? "text-white bg-[#1a1a1a]"
                          : "text-gray-300 hover:text-white hover:bg-[#1a1a1a]"
                      }`}
                    >
                      <IconComponent
                        className={`w-4 h-4 transition-colors ${
                          activeCategory === category.id ? "text-amber-500" : "text-gray-500 group-hover:text-amber-500"
                        }`}
                      />
                      {category.name}
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-all duration-200 ${
                          activeCategory === category.id ? "rotate-180 text-amber-500" : "text-gray-600"
                        }`}
                      />
                    </button>

                    {activeCategory === category.id && (
                      <div
                        className="absolute top-full left-0 mt-3 w-80 z-50 animate-in fade-in slide-in-from-top-3 duration-200"
                        onMouseLeave={() => setActiveCategory(null)}
                      >
                        {/* Outer box */}
                        <div className="rounded-2xl border border-white/[0.08] p-[3px]">
                          {/* Inner box */}
                          <div className="bg-[#0f0f0f] rounded-xl overflow-hidden">
                            <div className="p-4 border-b border-white/[0.06] bg-[#0a0a0a]">
                              <div className="flex items-center justify-between">
                                <h3 className="text-white font-semibold">{category.name}</h3>
                                <Link
                                  href={`/category/${category.slug}`}
                                  className="text-amber-500 text-xs font-medium hover:text-amber-400 transition-colors flex items-center gap-1 cursor-pointer"
                                >
                                  View All
                                  <ChevronRight className="w-3 h-3" />
                                </Link>
                              </div>
                              {category.description && (
                                <p className="text-gray-500 text-sm mt-1">{category.description}</p>
                              )}
                            </div>

                            <div className="p-2 max-h-80 overflow-y-auto">
                              {loadingProducts === category.id ? (
                                <div className="space-y-2 p-2">
                                  {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-center gap-3 p-2 animate-pulse">
                                      <div className="w-12 h-12 rounded-xl bg-[#1a1a1a]" />
                                      <div className="flex-1">
                                        <div className="h-4 bg-[#1a1a1a] rounded-lg w-3/4 mb-2" />
                                        <div className="h-3 bg-[#1a1a1a] rounded-lg w-1/2" />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : categoryProducts[category.id]?.length ? (
                                <div className="space-y-1">
                                  {categoryProducts[category.id].map((product) => (
                                    <Link
                                      key={product.id}
                                      href={`/product/${product.slug}`}
                                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#1a1a1a] transition-all duration-200 group cursor-pointer"
                                    >
                                      <div className="w-12 h-12 rounded-xl bg-[#1a1a1a] overflow-hidden flex-shrink-0 border border-white/[0.05] group-hover:border-white/[0.1] transition-colors">
                                        {product.thumbnail_url ? (
                                          <Image
                                            src={product.thumbnail_url || "/placeholder.svg"}
                                            alt={product.title}
                                            width={48}
                                            height={48}
                                            className="w-full h-full object-cover"
                                          />
                                        ) : (
                                          <div className="w-full h-full flex items-center justify-center text-gray-600">
                                            <Package className="w-5 h-5" />
                                          </div>
                                        )}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-gray-300 text-sm group-hover:text-white transition-colors truncate font-medium">
                                          {product.title}
                                        </p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                          <span className="text-amber-500 text-sm font-semibold">
                                            NPR {product.base_price.toLocaleString()}
                                          </span>
                                          {product.discount_percent && product.discount_percent > 0 && (
                                            <span className="text-[10px] text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded-full font-medium">
                                              -{product.discount_percent}%
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                      <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors" />
                                    </Link>
                                  ))}
                                </div>
                              ) : (
                                <div className="p-6 text-center text-gray-500 text-sm">
                                  No products in this category
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </nav>

            <div className="flex items-center justify-center gap-2 sm:gap-2.5 w-full lg:w-auto lg:justify-end">
              {/* Search */}
              <Link
                href="/search"
                className="group w-10 h-10 sm:w-11 sm:h-11 rounded-xl border border-white/[0.06] bg-[#1a1a1a] flex items-center justify-center text-gray-400 hover:text-white hover:border-white/[0.1] hover:bg-[#222222] transition-all duration-200 cursor-pointer"
              >
                <Search className="w-4 h-4 sm:w-[18px] sm:h-[18px] group-hover:scale-110 transition-transform" />
              </Link>

              {/* User Menu or Login */}
              {isLoading ? (
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#1a1a1a] animate-pulse" />
              ) : user ? (
                <UserMenu
                  user={user}
                  profile={profile}
                  isAdmin={isAdmin}
                  isOpen={isUserMenuOpen}
                  onToggle={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  onClose={() => setIsUserMenuOpen(false)}
                  menuRef={userMenuRef as React.RefObject<HTMLDivElement>}
                />
              ) : (
                <Link
                  href="/auth/login"
                  className="group w-10 h-10 sm:w-11 sm:h-11 rounded-xl border border-white/[0.06] bg-[#1a1a1a] flex items-center justify-center text-gray-400 hover:text-white hover:border-white/[0.1] hover:bg-[#222222] transition-all duration-200 cursor-pointer"
                >
                  <User className="w-4 h-4 sm:w-[18px] sm:h-[18px] group-hover:scale-110 transition-transform" />
                </Link>
              )}

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="group w-10 h-10 sm:w-11 sm:h-11 rounded-xl border border-white/[0.06] bg-[#1a1a1a] flex items-center justify-center text-gray-400 hover:text-white hover:border-white/[0.1] hover:bg-[#222222] transition-all duration-200 relative cursor-pointer"
              >
                <Heart className="w-4 h-4 sm:w-[18px] sm:h-[18px] group-hover:scale-110 transition-transform" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-[10px] font-bold text-black">
                    {wishlistCount > 99 ? "99+" : wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                className="group w-10 h-10 sm:w-11 sm:h-11 rounded-xl border border-white/[0.06] bg-[#1a1a1a] flex items-center justify-center text-gray-400 hover:text-white hover:border-white/[0.1] hover:bg-[#222222] transition-all duration-200 relative cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4 sm:w-[18px] sm:h-[18px] group-hover:scale-110 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-[10px] font-bold text-black">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      <div
        className={`fixed inset-0 z-50 transform transition-transform duration-300 ease-out lg:hidden ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Double-box outer container */}
        <div className="h-full m-2 rounded-2xl border border-white/[0.08] p-[3px]">
          {/* Double-box inner container */}
          <div className="h-full bg-[#0f0f0f] rounded-xl flex flex-col overflow-hidden">
            {/* Mobile menu header */}
            <div className="flex items-center justify-between p-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-black" />
                </div>
                <span className="text-white font-bold text-lg">Menu</span>
              </div>
              <button
                className="w-10 h-10 rounded-xl bg-[#1a1a1a] border border-white/[0.06] flex items-center justify-center text-zinc-400 hover:text-white transition-all duration-200 cursor-pointer"
                onClick={() => setIsMenuOpen(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile menu content */}
            <div className="flex-1 overflow-y-auto">
              <nav className="p-4">
                {/* Home link */}
                <Link
                  href="/"
                  className="flex items-center gap-3 px-4 py-3.5 text-zinc-300 hover:text-white bg-[#1a1a1a] hover:bg-[#222222] border border-white/[0.04] hover:border-white/[0.08] rounded-2xl transition-all duration-200 mb-3 cursor-pointer group"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center group-hover:bg-amber-500/20 transition-colors">
                    <Home className="w-5 h-5 text-amber-500" />
                  </div>
                  <span className="font-medium">Home</span>
                </Link>

                {/* Categories section */}
                <div className="mt-6">
                  <h3 className="px-4 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Categories</h3>

                  {categories.map((category) => {
                    const IconComponent = categoryIconMap[category.icon || "folder"] || Folder
                    const isExpanded = expandedMobileCategory === category.id
                    const products = categoryProducts[category.id] || []

                    return (
                      <div key={category.id} className="mb-2">
                        <button
                          onClick={() => {
                            if (isExpanded) {
                              setExpandedMobileCategory(null)
                            } else {
                              setExpandedMobileCategory(category.id)
                              fetchCategoryProducts(category.id)
                            }
                          }}
                          className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-200 cursor-pointer border ${
                            isExpanded
                              ? "bg-[#1a1a1a] border-white/[0.08] text-white"
                              : "text-zinc-300 hover:text-white bg-[#141414] border-white/[0.04] hover:bg-[#1a1a1a] hover:border-white/[0.06]"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                                isExpanded ? "bg-amber-500/20" : "bg-[#222222]"
                              }`}
                            >
                              <IconComponent className={`w-5 h-5 ${isExpanded ? "text-amber-500" : "text-zinc-500"}`} />
                            </div>
                            <span className="font-medium">{category.name}</span>
                          </div>
                          <ChevronDown
                            className={`w-4 h-4 transition-all duration-200 ${isExpanded ? "rotate-180 text-amber-500" : "text-zinc-600"}`}
                          />
                        </button>

                        {/* Expanded products */}
                        {isExpanded && (
                          <div className="mt-2 ml-4 pl-4 border-l-2 border-amber-500/20">
                            {loadingProducts === category.id ? (
                              <div className="py-3 space-y-2">
                                {[1, 2, 3].map((i) => (
                                  <div key={i} className="h-12 bg-[#1a1a1a] rounded-xl animate-pulse" />
                                ))}
                              </div>
                            ) : products.length ? (
                              <>
                                {products.map((product) => (
                                  <Link
                                    key={product.id}
                                    href={`/product/${product.slug}`}
                                    className="flex items-center gap-3 px-3 py-3 text-zinc-400 hover:text-white hover:bg-[#1a1a1a] rounded-xl transition-colors text-sm cursor-pointer group"
                                    onClick={() => setIsMenuOpen(false)}
                                  >
                                    <div className="w-10 h-10 rounded-xl bg-[#1a1a1a] overflow-hidden flex-shrink-0 border border-white/[0.06] group-hover:border-white/[0.1]">
                                      {product.thumbnail_url ? (
                                        <Image
                                          src={product.thumbnail_url || "/placeholder.svg"}
                                          alt={product.title}
                                          width={40}
                                          height={40}
                                          className="w-full h-full object-cover"
                                        />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                          <Package className="w-4 h-4 text-zinc-600" />
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium truncate">{product.title}</p>
                                      <p className="text-xs text-amber-500 font-semibold">
                                        NPR {product.base_price.toLocaleString()}
                                      </p>
                                    </div>
                                  </Link>
                                ))}
                                <Link
                                  href={`/category/${category.slug}`}
                                  className="flex items-center justify-center gap-2 px-3 py-3 mt-2 text-amber-500 hover:text-amber-400 text-sm font-medium bg-amber-500/5 hover:bg-amber-500/10 rounded-xl transition-colors cursor-pointer"
                                  onClick={() => setIsMenuOpen(false)}
                                >
                                  View All {category.name}
                                  <ChevronRight className="w-4 h-4" />
                                </Link>
                              </>
                            ) : (
                              <p className="py-4 px-3 text-zinc-600 text-sm text-center">No products available</p>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Quick links */}
                <div className="mt-6">
                  <h3 className="px-4 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    Quick Links
                  </h3>
                  <Link
                    href="/search"
                    className="flex items-center gap-3 px-4 py-3.5 text-zinc-300 hover:text-white bg-[#141414] hover:bg-[#1a1a1a] border border-white/[0.04] hover:border-white/[0.06] rounded-2xl transition-all duration-200 cursor-pointer mb-2 group"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#1a1a1a] flex items-center justify-center group-hover:bg-[#222222] transition-colors">
                      <Search className="w-5 h-5 text-zinc-500" />
                    </div>
                    <span>Search Products</span>
                  </Link>
                  <Link
                    href="/wishlist"
                    className="flex items-center gap-3 px-4 py-3.5 text-zinc-300 hover:text-white bg-[#141414] hover:bg-[#1a1a1a] border border-white/[0.04] hover:border-white/[0.06] rounded-2xl transition-all duration-200 cursor-pointer mb-2 group"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#1a1a1a] flex items-center justify-center group-hover:bg-[#222222] transition-colors">
                      <Heart className="w-5 h-5 text-zinc-500" />
                    </div>
                    <span>Wishlist</span>
                    {wishlistCount > 0 && (
                      <span className="ml-auto w-6 h-6 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-[10px] font-bold text-black">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>
                  <Link
                    href="/cart"
                    className="flex items-center gap-3 px-4 py-3.5 text-zinc-300 hover:text-white bg-[#141414] hover:bg-[#1a1a1a] border border-white/[0.04] hover:border-white/[0.06] rounded-2xl transition-all duration-200 cursor-pointer group"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#1a1a1a] flex items-center justify-center group-hover:bg-[#222222] transition-colors">
                      <ShoppingCart className="w-5 h-5 text-zinc-500" />
                    </div>
                    <span>Cart</span>
                    {cartCount > 0 && (
                      <span className="ml-auto w-6 h-6 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-[10px] font-bold text-black">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </div>
              </nav>
            </div>

            <div className="p-4 border-t border-white/[0.06] bg-[#0a0a0a] safe-area-bottom">
              {!isLoading && (
                <>
                  {user ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3.5 bg-[#141414] rounded-2xl border border-white/[0.06]">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center text-base font-bold text-black">
                          {profile?.full_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-semibold truncate">
                            {profile?.full_name || user.email?.split("@")[0]}
                          </p>
                          <p className="text-zinc-500 text-xs truncate flex items-center gap-1.5 mt-0.5">
                            <span className={`w-2 h-2 rounded-full ${isAdmin ? "bg-amber-400" : "bg-zinc-500"}`} />
                            {isAdmin ? "Admin" : "Member"}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link
                          href="/dashboard"
                          className="flex-1 text-center py-3 text-sm font-semibold text-black bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 rounded-xl cursor-pointer hover:opacity-90 transition-all duration-200"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Dashboard
                        </Link>
                        <button
                          onClick={() => {
                            setIsMenuOpen(false)
                            clearUserCache()
                            supabase.auth.signOut()
                            router.push("/")
                            router.refresh()
                          }}
                          className="flex-1 text-center py-3 text-sm font-medium text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl cursor-pointer hover:bg-red-500/20 transition-all duration-200"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Link
                        href="/auth/login"
                        className="flex-1 text-center py-3.5 text-sm font-semibold text-black bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 rounded-xl cursor-pointer hover:opacity-90 transition-all duration-200"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/auth/signup"
                        className="flex-1 text-center py-3.5 text-sm font-medium text-zinc-300 bg-[#1a1a1a] border border-white/[0.08] rounded-xl cursor-pointer hover:bg-[#222222] transition-all duration-200"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Sign Up
                      </Link>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
