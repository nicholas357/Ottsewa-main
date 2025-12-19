"use client"

import type React from "react"

import { useEffect, useState, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import Image from "next/image"
import Link from "next/link"
import {
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Calendar,
  RefreshCw,
  ShieldCheck,
  ShieldX,
  ShieldQuestion,
  Gamepad2,
  CreditCard,
  Monitor,
  Tag,
  Copy,
  Check,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface Order {
  id: string
  product_id: string
  quantity: number
  unit_price: number
  amount: number
  status: string
  payment_method: string
  payment_proof_url: string | null
  payment_proof_status: string | null
  created_at: string
  edition_id: string | null
  denomination_id: string | null
  plan_id: string | null
  duration_months: number | null
  license_type_id: string | null
  license_duration: string | null
  platform_id: string | null
  product?: {
    id: string
    title: string
    slug: string
    image_url: string
    product_type: string
  } | null
  edition_name?: string | null
  denomination_value?: number | null
  denomination_currency?: string | null
  plan_name?: string | null
  license_type_name?: string | null
  platform_name?: string | null
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const supabase = createClient()

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        setError("Please log in to view your orders")
        return
      }

      const { data: ordersData, error: fetchError } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (fetchError) throw fetchError

      if (!ordersData || ordersData.length === 0) {
        setOrders([])
        return
      }

      // Fetch related data
      const productIds = [...new Set(ordersData.map((o) => o.product_id).filter(Boolean))]
      const editionIds = [...new Set(ordersData.map((o) => o.edition_id).filter(Boolean))]
      const denominationIds = [...new Set(ordersData.map((o) => o.denomination_id).filter(Boolean))]
      const planIds = [...new Set(ordersData.map((o) => o.plan_id).filter(Boolean))]
      const licenseTypeIds = [...new Set(ordersData.map((o) => o.license_type_id).filter(Boolean))]
      const platformIds = [...new Set(ordersData.map((o) => o.platform_id).filter(Boolean))]

      const [productsRes, editionsRes, denominationsRes, plansRes, licenseTypesRes, platformsRes] = await Promise.all([
        productIds.length > 0
          ? supabase.from("products").select("id, title, slug, image_url, product_type").in("id", productIds)
          : { data: [] },
        editionIds.length > 0 ? supabase.from("game_editions").select("id, name").in("id", editionIds) : { data: [] },
        denominationIds.length > 0
          ? supabase.from("gift_card_denominations").select("id, value, currency").in("id", denominationIds)
          : { data: [] },
        planIds.length > 0 ? supabase.from("subscription_plans").select("id, name").in("id", planIds) : { data: [] },
        licenseTypeIds.length > 0
          ? supabase.from("software_license_types").select("id, name").in("id", licenseTypeIds)
          : { data: [] },
        platformIds.length > 0 ? supabase.from("platforms").select("id, name").in("id", platformIds) : { data: [] },
      ])

      const productsMap = new Map((productsRes.data || []).map((p) => [p.id, p]))
      const editionsMap = new Map((editionsRes.data || []).map((e) => [e.id, e]))
      const denominationsMap = new Map((denominationsRes.data || []).map((d) => [d.id, d]))
      const plansMap = new Map((plansRes.data || []).map((p) => [p.id, p]))
      const licenseTypesMap = new Map((licenseTypesRes.data || []).map((l) => [l.id, l]))
      const platformsMap = new Map((platformsRes.data || []).map((p) => [p.id, p]))

      const enrichedOrders: Order[] = ordersData.map((order) => ({
        ...order,
        product: productsMap.get(order.product_id) || null,
        edition_name: editionsMap.get(order.edition_id)?.name || null,
        denomination_value: denominationsMap.get(order.denomination_id)?.value || null,
        denomination_currency: denominationsMap.get(order.denomination_id)?.currency || null,
        plan_name: plansMap.get(order.plan_id)?.name || null,
        license_type_name: licenseTypesMap.get(order.license_type_id)?.name || null,
        platform_name: platformsMap.get(order.platform_id)?.name || null,
      }))

      setOrders(enrichedOrders)
    } catch (err: any) {
      console.error("Error fetching orders:", err)
      setError(err.message || "Failed to load orders")
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "pending":
        return { icon: Clock, color: "bg-amber-500/10 text-amber-500 border-amber-500/20", label: "Pending" }
      case "processing":
        return { icon: Package, color: "bg-blue-500/10 text-blue-500 border-blue-500/20", label: "Processing" }
      case "completed":
        return {
          icon: CheckCircle2,
          color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
          label: "Completed",
        }
      case "cancelled":
        return { icon: XCircle, color: "bg-red-500/10 text-red-500 border-red-500/20", label: "Cancelled" }
      case "refunded":
        return { icon: RefreshCw, color: "bg-purple-500/10 text-purple-500 border-purple-500/20", label: "Refunded" }
      default:
        return { icon: AlertCircle, color: "bg-zinc-500/10 text-zinc-500 border-zinc-500/20", label: status }
    }
  }

  const getPaymentProofStatus = (status: string | null) => {
    switch (status) {
      case "verified":
        return { icon: ShieldCheck, color: "text-emerald-500 bg-emerald-500/10", label: "Verified" }
      case "rejected":
        return { icon: ShieldX, color: "text-red-500 bg-red-500/10", label: "Rejected" }
      default:
        return { icon: ShieldQuestion, color: "text-amber-500 bg-amber-500/10", label: "Pending Verification" }
    }
  }

  const getProductTypeIcon = (type: string | undefined) => {
    switch (type) {
      case "game":
        return Gamepad2
      case "gift_card":
        return CreditCard
      case "subscription":
        return RefreshCw
      case "software":
        return Monitor
      default:
        return Package
    }
  }

  const copyOrderId = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(id)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  // Loading skeleton
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 w-40 bg-zinc-800 rounded animate-pulse" />
            <div className="h-4 w-64 bg-zinc-800 rounded mt-2 animate-pulse" />
          </div>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-zinc-900/50 border border-zinc-800/50 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">My Orders</h1>
          <p className="text-zinc-400 text-sm mt-1">Track your purchases</p>
        </div>
        <Card className="bg-zinc-900/50 border-zinc-800/50 rounded-xl p-8">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <p className="text-white font-medium mb-2">Failed to load orders</p>
            <p className="text-zinc-500 text-sm mb-4">{error}</p>
            <Button onClick={fetchOrders} className="bg-amber-500 hover:bg-amber-600 text-black cursor-pointer">
              Try Again
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with order count */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">My Orders</h1>
          <p className="text-zinc-400 text-sm mt-1">
            {orders.length === 0 ? "No orders yet" : `${orders.length} order${orders.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <Button
          onClick={fetchOrders}
          variant="ghost"
          size="sm"
          className="text-zinc-400 hover:text-white cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      {orders.length === 0 ? (
        <Card className="bg-zinc-900/50 border-zinc-800/50 rounded-xl p-12">
          <div className="text-center">
            <Package className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
            <h3 className="text-white text-lg font-medium mb-2">No orders yet</h3>
            <p className="text-zinc-500 text-sm mb-6">Your purchases will appear here</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2 bg-amber-500 hover:bg-amber-400 text-black font-medium rounded-lg transition-colors cursor-pointer"
            >
              Browse Products
            </Link>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const statusConfig = getStatusConfig(order.status)
            const StatusIcon = statusConfig.icon
            const paymentStatus = getPaymentProofStatus(order.payment_proof_status)
            const PaymentIcon = paymentStatus.icon
            const ProductTypeIcon = getProductTypeIcon(order.product?.product_type)
            const isExpanded = expandedOrder === order.id

            return (
              <Card
                key={order.id}
                className="bg-zinc-900/50 border-zinc-800/50 hover:border-zinc-700/80 rounded-xl overflow-hidden transition-all"
              >
                {/* Main Row - Clickable to expand */}
                <div className="p-4 cursor-pointer" onClick={() => setExpandedOrder(isExpanded ? null : order.id)}>
                  <div className="flex items-start gap-4">
                    {/* Product Image */}
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-zinc-800 flex-shrink-0">
                      <Image
                        src={order.product?.image_url || "/placeholder.svg?height=96&width=96&query=product"}
                        alt={order.product?.title || "Product"}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute bottom-1 right-1 p-1 bg-black/60 rounded">
                        <ProductTypeIcon className="w-3 h-3 text-amber-500" />
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="text-white font-medium truncate text-base">
                            {order.product?.title || "Unknown Product"}
                          </h3>
                          <div className="flex items-center gap-2 mt-0.5">
                            <button
                              onClick={(e) => copyOrderId(order.id, e)}
                              className="text-amber-500 text-xs font-mono bg-amber-500/10 px-1.5 py-0.5 rounded flex items-center gap-1 hover:bg-amber-500/20 transition-colors cursor-pointer"
                              title="Click to copy Order ID"
                            >
                              #{order.id.slice(0, 8).toUpperCase()}
                              {copiedId === order.id ? (
                                <Check className="w-3 h-3 text-green-500" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                            <span className="text-zinc-600">•</span>
                            <p className="text-zinc-500 text-xs flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(order.created_at).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-white font-bold text-lg">NPR {order.amount.toLocaleString()}</p>
                          <p className="text-zinc-500 text-xs">Qty: {order.quantity}</p>
                        </div>
                      </div>

                      {/* Status Badges */}
                      <div className="flex flex-wrap items-center gap-2 mt-3">
                        <Badge className={`${statusConfig.color} text-xs px-2.5 py-1 border`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusConfig.label}
                        </Badge>
                        {order.payment_proof_url && (
                          <Badge className={`${paymentStatus.color} text-xs px-2.5 py-1`}>
                            <PaymentIcon className="w-3 h-3 mr-1" />
                            {paymentStatus.label}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Expand/Collapse */}
                    <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer flex-shrink-0">
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-zinc-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-zinc-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-zinc-800/50 pt-4 space-y-4">
                    {/* Product Selection Details */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {order.edition_name && (
                        <div className="p-3 bg-zinc-800/50 rounded-lg">
                          <p className="text-zinc-500 text-xs mb-1">Edition</p>
                          <p className="text-white text-sm font-medium flex items-center gap-1.5">
                            <Tag className="w-3.5 h-3.5 text-amber-500" />
                            {order.edition_name}
                          </p>
                        </div>
                      )}
                      {order.plan_name && (
                        <div className="p-3 bg-zinc-800/50 rounded-lg">
                          <p className="text-zinc-500 text-xs mb-1">Plan</p>
                          <p className="text-white text-sm font-medium flex items-center gap-1.5">
                            <Package className="w-3.5 h-3.5 text-amber-500" />
                            {order.plan_name}
                          </p>
                        </div>
                      )}
                      {order.duration_months && (
                        <div className="p-3 bg-zinc-800/50 rounded-lg">
                          <p className="text-zinc-500 text-xs mb-1">Duration</p>
                          <p className="text-white text-sm font-medium flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-amber-500" />
                            {order.duration_months} month{order.duration_months > 1 ? "s" : ""}
                          </p>
                        </div>
                      )}
                      {order.denomination_value && order.denomination_currency && (
                        <div className="p-3 bg-zinc-800/50 rounded-lg">
                          <p className="text-zinc-500 text-xs mb-1">Denomination</p>
                          <p className="text-white text-sm font-medium flex items-center gap-1.5">
                            <CreditCard className="w-3.5 h-3.5 text-amber-500" />
                            {order.denomination_currency} {order.denomination_value}
                          </p>
                        </div>
                      )}
                      {order.license_type_name && (
                        <div className="p-3 bg-zinc-800/50 rounded-lg">
                          <p className="text-zinc-500 text-xs mb-1">License Type</p>
                          <p className="text-white text-sm font-medium flex items-center gap-1.5">
                            <Monitor className="w-3.5 h-3.5 text-amber-500" />
                            {order.license_type_name}
                          </p>
                        </div>
                      )}
                      {order.license_duration && (
                        <div className="p-3 bg-zinc-800/50 rounded-lg">
                          <p className="text-zinc-500 text-xs mb-1">License Duration</p>
                          <p className="text-white text-sm font-medium flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-amber-500" />
                            {order.license_duration}
                          </p>
                        </div>
                      )}
                      {order.platform_name && (
                        <div className="p-3 bg-zinc-800/50 rounded-lg">
                          <p className="text-zinc-500 text-xs mb-1">Platform</p>
                          <p className="text-white text-sm font-medium flex items-center gap-1.5">
                            <Gamepad2 className="w-3.5 h-3.5 text-amber-500" />
                            {order.platform_name}
                          </p>
                        </div>
                      )}
                      <div className="p-3 bg-zinc-800/50 rounded-lg">
                        <p className="text-zinc-400">Payment Method</p>
                        <p className="text-white text-sm font-medium flex items-center gap-1.5 capitalize">
                          <CreditCard className="w-3.5 h-3.5 text-amber-500" />
                          {order.payment_method || "N/A"}
                        </p>
                      </div>
                    </div>

                    {/* Price Breakdown */}
                    <div className="p-3 bg-zinc-800/50 rounded-lg">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-zinc-400">Unit Price</span>
                        <span className="text-white">NPR {order.unit_price.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-zinc-400">Quantity</span>
                        <span className="text-white">{order.quantity}</span>
                      </div>
                      <div className="flex justify-between text-sm pt-2 border-t border-zinc-700">
                        <span className="text-zinc-300 font-medium">Total</span>
                        <span className="text-amber-500 font-bold">NPR {order.amount.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* View Product Link */}
                    {order.product?.slug && (
                      <Link
                        href={`/product/${order.product.slug}`}
                        className="inline-flex items-center gap-2 text-amber-500 hover:text-amber-400 text-sm font-medium cursor-pointer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        View Product Details →
                      </Link>
                    )}

                    {/* Copy Order ID */}
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-400">Order ID:</span>
                      <span className="text-white font-mono">{order.id}</span>
                      <button
                        onClick={(e) => copyOrderId(order.id, e)}
                        className="p-2 hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                      >
                        {copiedId === order.id ? (
                          <Check className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Copy className="w-4 h-4 text-zinc-400" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
