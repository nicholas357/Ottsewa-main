"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Package, Heart, UserIcon, Settings, ShoppingBag, TrendingUp } from "lucide-react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DashboardSkeleton } from "@/components/skeleton-loader"
import { useWishlist } from "@/contexts/wishlist-context"

interface Profile {
  id: string
  email: string
  full_name: string
  avatar_url: string
  role: string
}

interface Stats {
  totalOrders: number
  totalSpent: number
}

const actionCards = [
  {
    title: "My Orders",
    description: "View your order history and track deliveries",
    icon: Package,
    href: "/orders",
  },
  {
    title: "My Wishlist",
    description: "View and manage your saved items",
    icon: Heart,
    href: "/wishlist",
  },
  {
    title: "My Profile",
    description: "Update your personal information",
    icon: UserIcon,
    href: "/profile",
  },
  {
    title: "Account Settings",
    description: "Manage your account preferences and security",
    icon: Settings,
    href: "/profile",
  },
]

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<Stats>({ totalOrders: 0, totalSpent: 0 })
  const supabase = createClient()
  const { itemCount: wishlistCount } = useWishlist()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) return

        const [profileResult, ordersResult] = await Promise.all([
          supabase.from("profiles").select("*").eq("id", user.id).single(),
          supabase.from("orders").select("id, amount").eq("user_id", user.id),
        ])

        if (profileResult.data) {
          setProfile(profileResult.data)
        }

        const orders = ordersResult.data || []
        const totalSpent = orders.reduce((sum, order) => sum + (Number(order.amount) || 0), 0)

        setStats({
          totalOrders: orders.length,
          totalSpent,
        })
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return <DashboardSkeleton />
  }

  const userInitial = profile?.full_name?.charAt(0).toUpperCase() || profile?.email?.charAt(0).toUpperCase() || "U"

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-white">My Account</h1>
        <p className="text-zinc-400 mt-2">Manage your account and view your activity</p>
      </div>

      {/* Profile Banner */}
      {profile && (
        <Card className="bg-gradient-to-br from-amber-500/10 via-zinc-900/50 to-zinc-900/50 border-amber-500/20 rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16 md:w-20 md:h-20 ring-2 ring-amber-500/20">
              <AvatarFallback className="bg-gradient-to-br from-amber-400 to-amber-600 text-black text-2xl md:text-3xl font-bold">
                {userInitial}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl md:text-2xl font-bold text-white truncate">
                {profile.full_name || profile.email?.split("@")[0]}
              </h2>
              <p className="text-zinc-400 text-sm md:text-base truncate mt-1">{profile.email}</p>
              {profile.role === "admin" && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/20 border border-amber-500/30 rounded-full mt-2">
                  <span className="text-amber-400 text-xs font-medium">Administrator</span>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Quick Stats - Now uses real stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-zinc-900/50 border-zinc-800/50 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/10 rounded-lg">
              <ShoppingBag className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.totalOrders}</p>
              <p className="text-zinc-500 text-sm">Total Orders</p>
            </div>
          </div>
        </Card>

        <Card className="bg-zinc-900/50 border-zinc-800/50 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-500/10 rounded-lg">
              <Heart className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{wishlistCount}</p>
              <p className="text-zinc-500 text-sm">Wishlist Items</p>
            </div>
          </div>
        </Card>

        <Card className="bg-zinc-900/50 border-zinc-800/50 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-green-500/10 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">NPR {stats.totalSpent.toLocaleString()}</p>
              <p className="text-zinc-500 text-sm">Total Spent</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Action Cards Grid */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {actionCards.map((card) => (
            <Link key={card.title} href={card.href} className="group cursor-pointer">
              <Card className="bg-zinc-900/50 border-zinc-800/50 hover:border-amber-500/50 hover:bg-zinc-900/70 rounded-xl p-5 transition-all h-full cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className="bg-amber-500/10 rounded-xl p-3 flex-shrink-0 group-hover:bg-amber-500/20 transition-colors">
                    <card.icon className="w-6 h-6 text-amber-500" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold text-base mb-1 group-hover:text-amber-500 transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-zinc-500 text-sm leading-relaxed">{card.description}</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
