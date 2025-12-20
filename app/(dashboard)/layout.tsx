"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { LayoutDashboard, Package, Heart, UserIcon, LogOut, Menu, X } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { showNotification } from "@/components/notification-provider"
import { useAuth, clearUserCache, getCachedUser } from "@/hooks/use-auth"

interface Profile {
  id: string
  email: string
  full_name: string
  avatar_url: string
  role: string
  created_at: string
}

function LayoutSkeleton() {
  return (
    <div className="min-h-screen bg-transparent">
      <div className="max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
          {/* Sidebar Skeleton - Double-box design */}
          <div className="lg:sticky lg:top-6 lg:self-start">
            <div className="rounded-2xl border border-white/[0.08] p-3">
              <div className="bg-[#0f0f0f] rounded-xl overflow-hidden">
                {/* User Profile Skeleton */}
                <div className="p-6 border-b border-white/[0.05]">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#1a1a1a] animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-24 bg-[#1a1a1a] rounded animate-pulse" />
                      <div className="h-3 w-32 bg-[#1a1a1a] rounded animate-pulse" />
                    </div>
                  </div>
                </div>

                {/* Navigation Skeleton */}
                <div className="p-3 space-y-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-10 bg-[#1a1a1a] rounded-lg animate-pulse" />
                  ))}
                </div>

                {/* Sign Out Skeleton */}
                <div className="p-3 border-t border-white/[0.05]">
                  <div className="h-10 bg-[#1a1a1a] rounded-lg animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          {/* Content Skeleton */}
          <div className="space-y-6">
            <div className="h-8 w-48 bg-[#1a1a1a] rounded animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-[#1a1a1a] border border-white/[0.05] rounded-xl animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user: authUser, profile: authProfile, loading: authLoading } = useAuth()

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState(() => {
    const cachedUser = getCachedUser()
    return !cachedUser
  })

  const profile: Profile | null = authProfile
    ? {
        id: authProfile.id,
        email: authProfile.email || "",
        full_name: authProfile.full_name || "",
        avatar_url: authProfile.avatar_url || "",
        role: authProfile.role,
        created_at: authProfile.created_at,
      }
    : null

  useEffect(() => {
    if (!authLoading && !authUser) {
      router.push("/auth/login")
      return
    }

    if (authUser) {
      setLoading(false)
    }
  }, [authUser, authLoading, router])

  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  const handleLogout = async () => {
    clearUserCache()
    await supabase.auth.signOut()
    showNotification({
      type: "info",
      title: "Logged out",
      message: "You have been successfully logged out",
      duration: 3000,
    })
    router.push("/")
  }

  if (loading) {
    return <LayoutSkeleton />
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 bg-[#1a1a1a] border border-white/[0.05] rounded-xl flex items-center justify-center mx-auto mb-4">
            <UserIcon className="w-7 h-7 text-zinc-500" />
          </div>
          <div className="text-white text-lg font-medium mb-2">Profile not found</div>
          <Link href="/auth/login" className="text-amber-500 hover:text-amber-400 text-sm">
            Sign in again
          </Link>
        </div>
      </div>
    )
  }

  const userInitial = profile.full_name?.charAt(0).toUpperCase() || profile.email?.charAt(0).toUpperCase() || "U"

  const menuItems = [
    { label: "Account Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Orders", href: "/orders", icon: Package },
    { label: "Wishlist", href: "/wishlist", icon: Heart },
    { label: "Profile & Settings", href: "/profile", icon: UserIcon },
  ]

  const SidebarContent = () => (
    <>
      {/* User Profile Summary */}
      <div className="p-6 border-b border-white/[0.05]">
        <div className="flex items-center gap-3">
          <Avatar className="w-12 h-12">
            <AvatarFallback className="bg-amber-500 text-black text-lg font-bold">{userInitial}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h3 className="text-white font-semibold truncate text-sm">
              {profile.full_name || profile.email?.split("@")[0]}
            </h3>
            <p className="text-zinc-500 text-xs truncate">{profile.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="p-3">
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className={`w-full justify-between gap-3 rounded-lg mb-1 ${
                  isActive
                    ? "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 hover:text-amber-500"
                    : "text-zinc-400 hover:text-white hover:bg-[#1a1a1a]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-4 h-4" />
                  <span className="text-sm">{item.label}</span>
                </div>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* Sign Out Button */}
      <div className="p-3 border-t border-white/[0.05]">
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start gap-3 text-zinc-400 hover:text-white hover:bg-[#1a1a1a] rounded-lg"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">SIGN OUT</span>
        </Button>
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-transparent">
      <div className="max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8">
        {/* Mobile Header - Double-box design */}
        <div className="lg:hidden mb-4">
          <div className="rounded-2xl border border-white/[0.08] p-3">
            <div className="bg-[#0f0f0f] rounded-xl p-3 flex items-center justify-between">
              <Button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                size="icon"
                variant="ghost"
                className="text-white hover:bg-[#1a1a1a] rounded-lg"
                aria-label={sidebarOpen ? "Close menu" : "Open menu"}
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
              <h2 className="text-white text-lg font-bold">My Account</h2>
              <div className="w-10" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
          {/* Sidebar - Double-box design */}
          <div
            className={`${
              sidebarOpen ? "block" : "hidden"
            } lg:block lg:sticky lg:top-6 lg:self-start transition-all duration-200 ease-out`}
          >
            <div className="rounded-2xl border border-white/[0.08] p-3">
              <div className="bg-[#0f0f0f] rounded-xl overflow-hidden">
                <SidebarContent />
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </div>
  )
}
