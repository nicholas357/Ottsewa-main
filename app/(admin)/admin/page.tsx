"use client"

import { useEffect, useState, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Stats {
  totalProducts: number
  totalOrders: number
  totalUsers: number
  totalRevenue: number
  pendingOrders: number
  completedOrders: number
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
  })
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true)
      const [productsRes, ordersRes, usersRes] = await Promise.all([
        supabase.from("products").select("id", { count: "exact", head: true }),
        supabase.from("orders").select("id, status, amount"),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
      ])

      const orders = ordersRes.data || []
      const completedOrders = orders.filter((o) => o.status === "completed")
      const pendingOrders = orders.filter((o) => o.status === "pending")

      setStats({
        totalProducts: productsRes.count || 0,
        totalOrders: orders.length,
        totalUsers: usersRes.count || 0,
        totalRevenue: completedOrders.reduce((sum, o) => sum + (o.amount || 0), 0),
        pendingOrders: pendingOrders.length,
        completedOrders: completedOrders.length,
      })
    } catch (err) {
      console.error("Error fetching stats:", err)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  const statCards = [
    {
      label: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      href: "/admin/products",
    },
    {
      label: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      href: "/admin/orders",
    },
    {
      label: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      href: "/admin/users",
    },
    {
      label: "Total Revenue",
      value: `NPR ${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Pending Orders",
      value: stats.pendingOrders,
      icon: Clock,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      href: "/admin/orders",
    },
    {
      label: "Completed Orders",
      value: stats.completedOrders,
      icon: CheckCircle2,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      href: "/admin/orders",
    },
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-zinc-800 rounded animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-28 bg-zinc-900/50 border border-zinc-800/50 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-zinc-400 text-sm mt-1">Overview of your store</p>
        </div>
        <Button onClick={fetchStats} variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          const content = (
            <Card
              key={index}
              className="bg-zinc-900/50 border-zinc-800/50 rounded-xl p-5 hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-zinc-500 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                </div>
                <div className={`p-2.5 rounded-lg ${stat.bg}`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
              {stat.href && (
                <div className="mt-3 flex items-center gap-1 text-xs text-zinc-500">
                  View details <ArrowRight className="w-3 h-3" />
                </div>
              )}
            </Card>
          )

          return stat.href ? (
            <Link key={index} href={stat.href}>
              {content}
            </Link>
          ) : (
            <div key={index}>{content}</div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/admin/products/new">
          <Card className="bg-zinc-900/50 border-zinc-800/50 rounded-xl p-4 hover:border-amber-500/50 transition-colors group">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-lg group-hover:bg-amber-500/20 transition-colors">
                <Package className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-white font-medium text-sm">Add Product</p>
                <p className="text-zinc-500 text-xs">Create new product</p>
              </div>
            </div>
          </Card>
        </Link>
        <Link href="/admin/orders">
          <Card className="bg-zinc-900/50 border-zinc-800/50 rounded-xl p-4 hover:border-amber-500/50 transition-colors group">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-lg group-hover:bg-amber-500/20 transition-colors">
                <ShoppingCart className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-white font-medium text-sm">Manage Orders</p>
                <p className="text-zinc-500 text-xs">{stats.pendingOrders} pending</p>
              </div>
            </div>
          </Card>
        </Link>
        <Link href="/admin/users">
          <Card className="bg-zinc-900/50 border-zinc-800/50 rounded-xl p-4 hover:border-amber-500/50 transition-colors group">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-lg group-hover:bg-amber-500/20 transition-colors">
                <Users className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-white font-medium text-sm">View Users</p>
                <p className="text-zinc-500 text-xs">{stats.totalUsers} registered</p>
              </div>
            </div>
          </Card>
        </Link>
        <Link href="/admin/banners">
          <Card className="bg-zinc-900/50 border-zinc-800/50 rounded-xl p-4 hover:border-amber-500/50 transition-colors group">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-lg group-hover:bg-amber-500/20 transition-colors">
                <TrendingUp className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-white font-medium text-sm">Banners</p>
                <p className="text-zinc-500 text-xs">Manage promotions</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  )
}
