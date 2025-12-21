"use client"

import { useEffect, useState, useCallback, useMemo } from "react"
import Image from "next/image"
import {
  Mail,
  Search,
  Package,
  User,
  Send,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
  Copy,
  Check,
  Eye,
  X,
  CreditCard,
  Filter,
  RefreshCw,
  ChevronDown,
  Info,
  AlertTriangle,
  Sparkles,
  ExternalLink,
  Layers,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

interface Order {
  id: string
  user_id: string
  product_id: string
  quantity: number
  amount: number
  status: string
  payment_method: string
  payment_proof_status: string | null
  created_at: string
  product?: { id: string; title: string; slug: string; image_url: string; product_type: string } | null
  user?: { id: string; email: string; full_name: string } | null
  edition_name?: string | null
  plan_name?: string | null
  license_type_name?: string | null
  platform_name?: string | null
  duration_months?: number | null
  notes?: string | null
}

interface OrderGroup {
  key: string
  userId: string
  userEmail: string
  userName: string
  timestamp: string
  orders: Order[]
  totalAmount: number
}

type StatusFilter = "all" | "pending" | "processing" | "completed" | "cancelled"
type PaymentFilter = "all" | "approved" | "pending" | "rejected"

export default function AdminCredentialsPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedOrders, setSelectedOrders] = useState<Order[]>([])
  const [credentials, setCredentials] = useState("")
  const [additionalNotes, setAdditionalNotes] = useState("")
  const [sending, setSending] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [paymentFilter, setPaymentFilter] = useState<PaymentFilter>("all")
  const [showFilters, setShowFilters] = useState(false)
  const [lastSentOrders, setLastSentOrders] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<"individual" | "grouped">("grouped")

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/orders")
      if (!response.ok) {
        throw new Error("Failed to fetch orders")
      }
      const data = await response.json()
      setOrders(data.orders || [])
    } catch (error) {
      console.error("Error fetching orders:", error)
      toast.error("Failed to load orders")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const groupedOrders = useMemo(() => {
    const groups: OrderGroup[] = []
    const sortedOrders = [...orders].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    sortedOrders.forEach((order) => {
      const orderTime = new Date(order.created_at).getTime()

      // Find existing group for this user within 60 seconds
      const existingGroup = groups.find((g) => {
        if (g.userId !== order.user_id) return false
        const groupTime = new Date(g.timestamp).getTime()
        return Math.abs(orderTime - groupTime) < 60000 // 60 seconds
      })

      if (existingGroup) {
        existingGroup.orders.push(order)
        existingGroup.totalAmount += order.amount
      } else {
        groups.push({
          key: `${order.user_id}-${order.created_at}`,
          userId: order.user_id,
          userEmail: order.user?.email || "Unknown",
          userName: order.user?.full_name || "Unknown",
          timestamp: order.created_at,
          orders: [order],
          totalAmount: order.amount,
        })
      }
    })

    return groups
  }, [orders])

  const filteredOrders = orders.filter((order) => {
    if (statusFilter !== "all" && order.status !== statusFilter) return false
    if (paymentFilter !== "all" && order.payment_proof_status !== paymentFilter) return false
    const searchLower = searchQuery.toLowerCase()
    if (searchLower) {
      return (
        order.id.toLowerCase().includes(searchLower) ||
        order.product?.title?.toLowerCase().includes(searchLower) ||
        order.user?.email?.toLowerCase().includes(searchLower) ||
        order.user?.full_name?.toLowerCase().includes(searchLower)
      )
    }
    return true
  })

  const filteredGroups = groupedOrders.filter((group) => {
    // Check if any order in the group matches filters
    const hasMatchingOrder = group.orders.some((order) => {
      if (statusFilter !== "all" && order.status !== statusFilter) return false
      if (paymentFilter !== "all" && order.payment_proof_status !== paymentFilter) return false
      return true
    })
    if (!hasMatchingOrder) return false

    const searchLower = searchQuery.toLowerCase()
    if (searchLower) {
      return (
        group.orders.some((o) => o.id.toLowerCase().includes(searchLower)) ||
        group.orders.some((o) => o.product?.title?.toLowerCase().includes(searchLower)) ||
        group.userEmail.toLowerCase().includes(searchLower) ||
        group.userName.toLowerCase().includes(searchLower)
      )
    }
    return true
  })

  const handleSelectGroup = (group: OrderGroup) => {
    setSelectedOrders(group.orders)
    setCredentials("")
    setAdditionalNotes("")
  }

  const handleSelectOrder = (order: Order) => {
    setSelectedOrders([order])
    setCredentials("")
    setAdditionalNotes("")
  }

  const handleSendCredentials = async () => {
    if (selectedOrders.length === 0 || !credentials.trim()) {
      toast.error("Please enter credentials")
      return
    }

    const hasUnapproved = selectedOrders.some((o) => o.payment_proof_status !== "approved")
    if (hasUnapproved) {
      toast.warning("Warning: Some orders have unapproved payments", {
        description: "Make sure to verify payment before sending credentials.",
        duration: 5000,
      })
    }

    setSending(true)
    try {
      const response = await fetch("/api/admin/send-credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderIds: selectedOrders.map((o) => o.id),
          customerEmail: selectedOrders[0].user?.email,
          customerName: selectedOrders[0].user?.full_name,
          products: selectedOrders.map((o) => ({
            name: o.product?.title,
            planName: o.plan_name,
            durationMonths: o.duration_months,
            amount: o.amount,
          })),
          credentials: credentials.trim(),
          additionalNotes: additionalNotes.trim() || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to send credentials")
      }

      setLastSentOrders(selectedOrders.map((o) => o.id))
      toast.success("Credentials sent successfully!", {
        description: `Email sent to ${selectedOrders[0].user?.email} for ${selectedOrders.length} product(s)`,
        duration: 5000,
      })
      setSelectedOrders([])
      setCredentials("")
      setAdditionalNotes("")
      setShowPreview(false)
      fetchOrders()

      setTimeout(() => setLastSentOrders([]), 10000)
    } catch (error) {
      console.error("Error sending credentials:", error)
      toast.error(error instanceof Error ? error.message : "Failed to send credentials", {
        description: "Please try again or contact support",
      })
    } finally {
      setSending(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success("Copied to clipboard")
    setTimeout(() => setCopied(false), 2000)
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "completed":
        return { color: "bg-green-500/10 text-green-500 border-green-500/20", icon: CheckCircle2, label: "Completed" }
      case "processing":
        return { color: "bg-blue-500/10 text-blue-500 border-blue-500/20", icon: Clock, label: "Processing" }
      case "pending":
        return { color: "bg-amber-500/10 text-amber-500 border-amber-500/20", icon: AlertCircle, label: "Pending" }
      case "cancelled":
        return { color: "bg-red-500/10 text-red-500 border-red-500/20", icon: X, label: "Cancelled" }
      default:
        return { color: "bg-zinc-500/10 text-zinc-500 border-zinc-500/20", icon: Package, label: status }
    }
  }

  const getPaymentStatusConfig = (status: string | null) => {
    switch (status) {
      case "approved":
        return { color: "bg-green-500/10 text-green-500 border-green-500/20", label: "Approved" }
      case "pending":
        return { color: "bg-amber-500/10 text-amber-500 border-amber-500/20", label: "Pending" }
      case "rejected":
        return { color: "bg-red-500/10 text-red-500 border-red-500/20", label: "Rejected" }
      default:
        return { color: "bg-zinc-500/10 text-zinc-500 border-zinc-500/20", label: "N/A" }
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const approvedCount = orders.filter((o) => o.payment_proof_status === "approved" && o.status !== "completed").length
  const pendingCount = orders.filter((o) => o.status === "pending").length
  const completedToday = orders.filter((o) => {
    const today = new Date().toDateString()
    return o.status === "completed" && new Date(o.created_at).toDateString() === today
  }).length

  const selectedTotalAmount = selectedOrders.reduce((sum, o) => sum + o.amount, 0)

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-transparent min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Send Credentials</h1>
            <p className="text-zinc-400">Send order credentials to customers via email</p>
          </div>
          <Button
            onClick={fetchOrders}
            variant="outline"
            className="border-white/[0.08] bg-[#1a1a1a] hover:bg-[#222222] text-white"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="rounded-2xl border border-white/[0.08] p-3">
          <div className="bg-[#0f0f0f] rounded-xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-zinc-400 text-sm">Ready to Send</p>
              <p className="text-2xl font-bold text-white">{approvedCount}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-white/[0.08] p-3">
          <div className="bg-[#0f0f0f] rounded-xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <p className="text-zinc-400 text-sm">Pending Orders</p>
              <p className="text-2xl font-bold text-white">{pendingCount}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-white/[0.08] p-3">
          <div className="bg-[#0f0f0f] rounded-xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-zinc-400 text-sm">Completed Today</p>
              <p className="text-2xl font-bold text-white">{completedToday}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 mb-6 flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-amber-500 font-medium text-sm">How to Send Credentials</p>
          <p className="text-zinc-400 text-sm mt-1">
            Select orders from the list (grouped orders from same user are shown together). Enter credentials and
            preview before sending. Multiple products ordered together will be sent in one email.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Orders List */}
        <div className="rounded-2xl border border-white/[0.08] p-3">
          <div className="bg-[#0f0f0f] rounded-xl p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-amber-500" />
                Orders
              </h2>
              <div className="flex items-center gap-2">
                <div className="flex items-center rounded-lg border border-white/[0.08] overflow-hidden">
                  <button
                    onClick={() => setViewMode("grouped")}
                    className={`px-3 py-1.5 text-xs transition-colors ${
                      viewMode === "grouped"
                        ? "bg-amber-500/20 text-amber-500"
                        : "bg-[#1a1a1a] text-zinc-400 hover:text-white"
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5 inline mr-1" />
                    Grouped
                  </button>
                  <button
                    onClick={() => setViewMode("individual")}
                    className={`px-3 py-1.5 text-xs transition-colors ${
                      viewMode === "individual"
                        ? "bg-amber-500/20 text-amber-500"
                        : "bg-[#1a1a1a] text-zinc-400 hover:text-white"
                    }`}
                  >
                    <Package className="w-3.5 h-3.5 inline mr-1" />
                    Individual
                  </button>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="border-white/[0.08] bg-[#1a1a1a] hover:bg-[#222222] text-white h-8"
                >
                  <Filter className="w-3.5 h-3.5 mr-1.5" />
                  Filters
                  <ChevronDown className={`w-3.5 h-3.5 ml-1 transition-transform ${showFilters ? "rotate-180" : ""}`} />
                </Button>
              </div>
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="mb-4 p-3 rounded-lg bg-[#1a1a1a] border border-white/[0.05] space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-zinc-400 text-xs mb-1.5 block">Order Status</Label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                      className="w-full h-9 px-3 rounded-lg bg-[#222222] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-amber-500/50"
                    >
                      <option value="all">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div>
                    <Label className="text-zinc-400 text-xs mb-1.5 block">Payment Status</Label>
                    <select
                      value={paymentFilter}
                      onChange={(e) => setPaymentFilter(e.target.value as PaymentFilter)}
                      className="w-full h-9 px-3 rounded-lg bg-[#222222] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-amber-500/50"
                    >
                      <option value="all">All Payments</option>
                      <option value="approved">Approved</option>
                      <option value="pending">Pending</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-2 pt-2 border-t border-white/[0.05]">
                  <button
                    onClick={() => {
                      setStatusFilter("all")
                      setPaymentFilter("approved")
                    }}
                    className="px-3 py-1.5 text-xs rounded-lg bg-green-500/10 text-green-500 border border-green-500/20 hover:bg-green-500/20 transition-colors"
                  >
                    Ready to Send
                  </button>
                  <button
                    onClick={() => {
                      setStatusFilter("pending")
                      setPaymentFilter("all")
                    }}
                    className="px-3 py-1.5 text-xs rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20 hover:bg-amber-500/20 transition-colors"
                  >
                    Pending Orders
                  </button>
                  <button
                    onClick={() => {
                      setStatusFilter("all")
                      setPaymentFilter("all")
                    }}
                    className="px-3 py-1.5 text-xs rounded-lg bg-zinc-500/10 text-zinc-400 border border-zinc-500/20 hover:bg-zinc-500/20 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            )}

            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <Input
                placeholder="Search by order ID, product, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-[#1a1a1a] border-white/[0.08] text-white placeholder:text-zinc-500"
              />
            </div>

            {/* Orders List */}
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-amber-500 animate-spin mb-3" />
                  <p className="text-zinc-400 text-sm">Loading orders...</p>
                </div>
              ) : viewMode === "grouped" ? (
                filteredGroups.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                    <p className="text-zinc-400">No orders found</p>
                    <p className="text-zinc-500 text-sm mt-1">Try adjusting your filters</p>
                  </div>
                ) : (
                  filteredGroups.map((group) => {
                    const isSelected =
                      selectedOrders.length > 0 &&
                      selectedOrders[0].user_id === group.userId &&
                      Math.abs(new Date(selectedOrders[0].created_at).getTime() - new Date(group.timestamp).getTime()) <
                        60000
                    const wasRecentlySent = group.orders.some((o) => lastSentOrders.includes(o.id))
                    const allApproved = group.orders.every((o) => o.payment_proof_status === "approved")
                    const allCompleted = group.orders.every((o) => o.status === "completed")

                    return (
                      <div
                        key={group.key}
                        onClick={() => handleSelectGroup(group)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all ${
                          wasRecentlySent
                            ? "bg-green-500/10 border-green-500/30 ring-2 ring-green-500/20"
                            : isSelected
                              ? "bg-amber-500/10 border-amber-500/30"
                              : "bg-[#1a1a1a] border-white/[0.05] hover:border-white/[0.1]"
                        }`}
                      >
                        {wasRecentlySent && (
                          <div className="flex items-center gap-2 text-green-500 text-xs mb-3 pb-2 border-b border-green-500/20">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Credentials sent successfully!
                          </div>
                        )}

                        {/* User Info Header */}
                        <div className="flex items-center gap-3 mb-3 pb-3 border-b border-white/[0.05]">
                          <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                            <User className="w-5 h-5 text-amber-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-medium truncate">{group.userName}</p>
                            <p className="text-zinc-400 text-sm truncate">{group.userEmail}</p>
                          </div>
                          {group.orders.length > 1 && (
                            <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                              <Layers className="w-3 h-3 mr-1" />
                              {group.orders.length} items
                            </Badge>
                          )}
                        </div>

                        {/* Products */}
                        <div className="space-y-2">
                          {group.orders.map((order) => {
                            const statusConfig = getStatusConfig(order.status)
                            const StatusIcon = statusConfig.icon

                            return (
                              <div key={order.id} className="flex items-center gap-3 p-2 rounded-lg bg-[#222222]/50">
                                <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-[#222222] shrink-0">
                                  <Image
                                    src={
                                      order.product?.image_url || "/placeholder.svg?height=40&width=40&query=product"
                                    }
                                    alt={order.product?.title || "Product"}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-white text-sm truncate">{order.product?.title || "Unknown"}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge className={`${statusConfig.color} text-[10px] px-1.5 py-0 border`}>
                                      <StatusIcon className="w-2.5 h-2.5 mr-0.5" />
                                      {statusConfig.label}
                                    </Badge>
                                    <span className="text-amber-500 text-xs">NPR {order.amount.toLocaleString()}</span>
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.05]">
                          <div className="flex items-center gap-2">
                            {allApproved ? (
                              <Badge className="bg-green-500/10 text-green-500 border-green-500/20 text-[10px]">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Payment Approved
                              </Badge>
                            ) : (
                              <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[10px]">
                                <AlertCircle className="w-3 h-3 mr-1" />
                                Pending Verification
                              </Badge>
                            )}
                            {allCompleted && (
                              <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 text-[10px]">
                                Completed
                              </Badge>
                            )}
                          </div>
                          <p className="text-amber-500 font-semibold text-sm">
                            NPR {group.totalAmount.toLocaleString()}
                          </p>
                        </div>

                        <p className="text-zinc-500 text-xs mt-2">{formatDate(group.timestamp)}</p>
                      </div>
                    )
                  })
                )
              ) : // Individual view
              filteredOrders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                  <p className="text-zinc-400">No orders found</p>
                  <p className="text-zinc-500 text-sm mt-1">Try adjusting your filters</p>
                </div>
              ) : (
                filteredOrders.map((order) => {
                  const statusConfig = getStatusConfig(order.status)
                  const paymentConfig = getPaymentStatusConfig(order.payment_proof_status)
                  const StatusIcon = statusConfig.icon
                  const isSelected = selectedOrders.some((o) => o.id === order.id)
                  const wasRecentlySent = lastSentOrders.includes(order.id)

                  return (
                    <div
                      key={order.id}
                      onClick={() => handleSelectOrder(order)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        wasRecentlySent
                          ? "bg-green-500/10 border-green-500/30 ring-2 ring-green-500/20"
                          : isSelected
                            ? "bg-amber-500/10 border-amber-500/30"
                            : "bg-[#1a1a1a] border-white/[0.05] hover:border-white/[0.1]"
                      }`}
                    >
                      {wasRecentlySent && (
                        <div className="flex items-center gap-2 text-green-500 text-xs mb-2 pb-2 border-b border-green-500/20">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Credentials sent successfully!
                        </div>
                      )}
                      <div className="flex items-start gap-3">
                        <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-[#222222] shrink-0">
                          <Image
                            src={order.product?.image_url || "/placeholder.svg?height=56&width=56&query=product"}
                            alt={order.product?.title || "Product"}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium truncate">{order.product?.title || "Unknown Product"}</p>
                          <p className="text-zinc-400 text-sm truncate">{order.user?.email || "No email"}</p>
                          <p className="text-zinc-500 text-xs mt-1 truncate">ID: {order.id.slice(0, 8)}...</p>
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <Badge className={`${statusConfig.color} text-xs px-2 py-0.5 border`}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {statusConfig.label}
                            </Badge>
                            <Badge className={`${paymentConfig.color} text-xs px-2 py-0.5 border`}>
                              {paymentConfig.label}
                            </Badge>
                            <span className="text-amber-500 text-xs font-medium">
                              NPR {order.amount.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        {isSelected && <div className="w-2 h-2 rounded-full bg-amber-500 shrink-0 mt-2" />}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>

        {/* Send Credentials Form */}
        <div className="rounded-2xl border border-white/[0.08] p-3">
          <div className="bg-[#0f0f0f] rounded-xl p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-6">
              <Mail className="w-5 h-5 text-amber-500" />
              Send Credentials
              {selectedOrders.length > 1 && (
                <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 ml-2">
                  {selectedOrders.length} products
                </Badge>
              )}
            </h2>

            {selectedOrders.length > 0 ? (
              <div className="space-y-5">
                {selectedOrders.some((o) => o.payment_proof_status !== "approved") && (
                  <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-amber-500 font-medium text-sm">Payment Not Approved</p>
                      <p className="text-zinc-400 text-xs mt-1">
                        Some orders have unapproved payments. Make sure to verify payment before sending credentials.
                      </p>
                    </div>
                  </div>
                )}

                {/* Selected Orders Info */}
                <div className="space-y-3">
                  {selectedOrders.map((order) => (
                    <div key={order.id} className="p-4 rounded-xl bg-[#1a1a1a] border border-white/[0.05]">
                      <div className="flex items-start gap-4">
                        <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-[#222222] shrink-0">
                          <Image
                            src={order.product?.image_url || "/placeholder.svg?height=56&width=56&query=product"}
                            alt={order.product?.title || "Product"}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-semibold truncate">{order.product?.title}</p>
                          {order.plan_name && <p className="text-amber-500 text-sm mt-1">Plan: {order.plan_name}</p>}
                          {order.duration_months && (
                            <p className="text-zinc-500 text-sm">Duration: {order.duration_months} months</p>
                          )}
                          <p className="text-amber-500 font-medium mt-1">NPR {order.amount.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Customer Info */}
                <div className="p-4 rounded-xl bg-[#1a1a1a] border border-white/[0.05]">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-amber-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium">{selectedOrders[0].user?.full_name || "Customer"}</p>
                      <p className="text-zinc-400 text-sm truncate">{selectedOrders[0].user?.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-zinc-400 text-xs">Total Amount</p>
                      <p className="text-amber-500 font-bold">NPR {selectedTotalAmount.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => copyToClipboard(selectedOrders[0].user?.email || "")}
                      className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-amber-500 transition-colors px-3 py-1.5 rounded-lg bg-[#222222] border border-white/[0.05]"
                    >
                      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      Copy Email
                    </button>
                    <a
                      href={`mailto:${selectedOrders[0].user?.email}`}
                      className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-amber-500 transition-colors px-3 py-1.5 rounded-lg bg-[#222222] border border-white/[0.05]"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Open in Mail
                    </a>
                  </div>
                </div>

                {/* Credentials Input */}
                <div className="space-y-2">
                  <Label htmlFor="credentials" className="text-white flex items-center gap-2">
                    Credentials <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="credentials"
                    placeholder={`Enter login credentials for all ${selectedOrders.length} product(s)...

Example:
--- Product 1: Netflix ---
Email: example@email.com
Password: xxxxxxxx

--- Product 2: YouTube Premium ---
Family Link: https://...`}
                    value={credentials}
                    onChange={(e) => setCredentials(e.target.value)}
                    rows={8}
                    className="bg-[#1a1a1a] border-white/[0.08] text-white placeholder:text-zinc-500 font-mono text-sm resize-none focus:border-amber-500/50"
                  />
                  <p className="text-zinc-500 text-xs">Enter the login details that will be sent to the customer</p>
                </div>

                {/* Additional Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-white">
                    Additional Notes <span className="text-zinc-500">(optional)</span>
                  </Label>
                  <Textarea
                    id="notes"
                    placeholder="Any additional instructions or notes for the customer..."
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    rows={3}
                    className="bg-[#1a1a1a] border-white/[0.08] text-white placeholder:text-zinc-500 resize-none focus:border-amber-500/50"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <Button
                    onClick={() => setShowPreview(true)}
                    disabled={!credentials.trim()}
                    variant="outline"
                    className="flex-1 border-white/[0.08] bg-[#1a1a1a] hover:bg-[#222222] text-white h-11"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Preview Email
                  </Button>
                  <Button
                    onClick={handleSendCredentials}
                    disabled={sending || !credentials.trim()}
                    className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-semibold h-11"
                  >
                    {sending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Email
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-full bg-[#1a1a1a] flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-zinc-600" />
                </div>
                <p className="text-zinc-400 mb-2">Select an order from the list</p>
                <p className="text-zinc-500 text-sm">Choose an order to send credentials</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Email Preview Modal */}
      {showPreview && selectedOrders.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a0a0a]">
            {/* Modal Header */}
            <div className="bg-[#0f0f0f] px-6 py-4 border-b border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <Eye className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Email Preview</h3>
                  <p className="text-zinc-500 text-sm">
                    Review before sending to {selectedOrders[0].user?.email}
                    {selectedOrders.length > 1 && ` (${selectedOrders.length} products)`}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPreview(false)}
                className="w-10 h-10 rounded-xl bg-[#1a1a1a] flex items-center justify-center text-zinc-400 hover:text-white hover:bg-[#222222] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Email Preview */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              <div className="rounded-2xl border border-white/[0.08] overflow-hidden shadow-2xl">
                {/* Email Header */}
                <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 p-8 text-center">
                  <h1 className="text-3xl font-bold text-black tracking-tight">OTTSewa</h1>
                  <p className="text-black/60 text-sm mt-1 font-medium">Your Premium Subscription Partner</p>
                </div>

                {/* Email Body */}
                <div className="bg-[#0f0f0f] p-8">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-white mb-3">
                      Hello {selectedOrders[0].user?.full_name || "Valued Customer"}!
                    </h2>
                    <p className="text-zinc-400 leading-relaxed">
                      Thank you for your purchase. Your order credentials are ready. Below are the login details for
                      your {selectedOrders.length > 1 ? `${selectedOrders.length} products` : "product"}.
                    </p>
                  </div>

                  {/* Products Summary */}
                  <div className="mb-6 p-4 rounded-xl bg-[#1a1a1a] border border-white/[0.05]">
                    <h3 className="text-amber-500 font-semibold text-sm mb-3">Order Summary</h3>
                    <div className="space-y-2">
                      {selectedOrders.map((order) => (
                        <div key={order.id} className="flex items-center justify-between text-sm">
                          <span className="text-white">{order.product?.title}</span>
                          <span className="text-amber-500 font-medium">NPR {order.amount.toLocaleString()}</span>
                        </div>
                      ))}
                      {selectedOrders.length > 1 && (
                        <div className="flex items-center justify-between text-sm pt-2 mt-2 border-t border-white/[0.05]">
                          <span className="text-zinc-400 font-medium">Total</span>
                          <span className="text-amber-500 font-bold">NPR {selectedTotalAmount.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Credentials Box */}
                  <div className="rounded-xl bg-[#1a1a1a] border border-white/[0.05] p-6 mb-6">
                    <h3 className="text-amber-500 font-semibold text-sm mb-4 flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      YOUR CREDENTIALS
                    </h3>
                    <div className="bg-[#0a0a0a] rounded-lg p-4 font-mono text-sm text-white whitespace-pre-wrap border border-white/[0.05]">
                      {credentials}
                    </div>
                  </div>

                  {/* Additional Notes */}
                  {additionalNotes && (
                    <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-5 mb-6">
                      <h4 className="text-amber-500 font-semibold text-sm mb-2 flex items-center gap-2">
                        <Info className="w-4 h-4" />
                        Important Notes
                      </h4>
                      <p className="text-zinc-300 text-sm">{additionalNotes}</p>
                    </div>
                  )}

                  {/* Order IDs */}
                  <div className="pt-4 border-t border-white/[0.05]">
                    <p className="text-zinc-500 text-xs">
                      Order ID{selectedOrders.length > 1 ? "s" : ""}:{" "}
                      {selectedOrders.map((o) => o.id.slice(0, 8)).join(", ")}
                    </p>
                  </div>
                </div>

                {/* Email Footer */}
                <div className="bg-[#0a0a0a] p-6 border-t border-white/[0.05] text-center">
                  <p className="text-zinc-500 text-sm mb-2">Need help? Contact us on WhatsApp</p>
                  <p className="text-amber-500 font-semibold">+977 9869671451</p>
                  <p className="text-zinc-600 text-xs mt-4">
                    © {new Date().getFullYear()} OTTSewa. All rights reserved.
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-[#0f0f0f] px-6 py-4 border-t border-white/[0.08] flex items-center justify-end gap-3">
              <Button
                onClick={() => setShowPreview(false)}
                variant="outline"
                className="border-white/[0.08] bg-[#1a1a1a] hover:bg-[#222222] text-white"
              >
                Edit
              </Button>
              <Button
                onClick={() => {
                  setShowPreview(false)
                  handleSendCredentials()
                }}
                disabled={sending}
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-semibold"
              >
                {sending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Email Now
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
