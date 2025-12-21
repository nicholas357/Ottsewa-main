"use client"

import { useEffect, useState, useCallback } from "react"
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
  Calendar,
  CreditCard,
  FileText,
  Filter,
  RefreshCw,
  ChevronDown,
  Info,
  AlertTriangle,
  Sparkles,
  ExternalLink,
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

type StatusFilter = "all" | "pending" | "processing" | "completed" | "cancelled"
type PaymentFilter = "all" | "approved" | "pending" | "rejected"

export default function AdminCredentialsPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [credentials, setCredentials] = useState("")
  const [additionalNotes, setAdditionalNotes] = useState("")
  const [sending, setSending] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [paymentFilter, setPaymentFilter] = useState<PaymentFilter>("all")
  const [showFilters, setShowFilters] = useState(false)
  const [lastSentOrder, setLastSentOrder] = useState<string | null>(null)

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

  const filteredOrders = orders.filter((order) => {
    if (statusFilter !== "all" && order.status !== statusFilter) {
      return false
    }

    if (paymentFilter !== "all" && order.payment_proof_status !== paymentFilter) {
      return false
    }

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

  const handleSendCredentials = async () => {
    if (!selectedOrder || !credentials.trim()) {
      toast.error("Please enter credentials")
      return
    }

    if (selectedOrder.payment_proof_status !== "approved") {
      toast.warning("Warning: This order's payment is not approved yet", {
        description: "Are you sure you want to send credentials?",
        duration: 5000,
      })
    }

    setSending(true)
    try {
      const response = await fetch("/api/admin/send-credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: selectedOrder.id,
          customerEmail: selectedOrder.user?.email,
          customerName: selectedOrder.user?.full_name,
          productName: selectedOrder.product?.title,
          planName: selectedOrder.plan_name,
          durationMonths: selectedOrder.duration_months,
          credentials: credentials.trim(),
          additionalNotes: additionalNotes.trim() || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to send credentials")
      }

      setLastSentOrder(selectedOrder.id)
      toast.success("Credentials sent successfully!", {
        description: `Email sent to ${selectedOrder.user?.email}`,
        duration: 5000,
      })
      setSelectedOrder(null)
      setCredentials("")
      setAdditionalNotes("")
      setShowPreview(false)
      fetchOrders()

      // Clear last sent indicator after 10 seconds
      setTimeout(() => setLastSentOrder(null), 10000)
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

      <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 mb-6 flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-amber-500 font-medium text-sm">How to Send Credentials</p>
          <p className="text-zinc-400 text-sm mt-1">
            1. Select an order from the list on the left. 2. Enter the login credentials for the product. 3. Add any
            additional notes if needed. 4. Preview the email and send it to the customer.
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
                <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                  {filteredOrders.length} orders
                </Badge>
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

            {/* Orders */}
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-amber-500 animate-spin mb-3" />
                  <p className="text-zinc-400 text-sm">Loading orders...</p>
                </div>
              ) : filteredOrders.length === 0 ? (
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
                  const isSelected = selectedOrder?.id === order.id
                  const wasRecentlySent = lastSentOrder === order.id

                  return (
                    <div
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
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
            </h2>

            {selectedOrder ? (
              <div className="space-y-5">
                {selectedOrder.payment_proof_status !== "approved" && (
                  <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-amber-500 font-medium text-sm">Payment Not Approved</p>
                      <p className="text-zinc-400 text-xs mt-1">
                        This order&apos;s payment is {selectedOrder.payment_proof_status || "not verified"}. Make sure
                        to verify payment before sending credentials.
                      </p>
                    </div>
                  </div>
                )}

                {/* Selected Order Info */}
                <div className="p-4 rounded-xl bg-[#1a1a1a] border border-white/[0.05]">
                  <div className="flex items-start gap-4">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-[#222222] shrink-0">
                      <Image
                        src={selectedOrder.product?.image_url || "/placeholder.svg?height=64&width=64&query=product"}
                        alt={selectedOrder.product?.title || "Product"}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold">{selectedOrder.product?.title}</p>
                      <p className="text-zinc-400 text-sm mt-1">
                        {selectedOrder.product?.product_type?.replace(/_/g, " ")}
                      </p>
                      {selectedOrder.plan_name && (
                        <p className="text-amber-500 text-sm mt-1">Plan: {selectedOrder.plan_name}</p>
                      )}
                      {selectedOrder.duration_months && (
                        <p className="text-zinc-500 text-sm">Duration: {selectedOrder.duration_months} months</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Order Details Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-[#1a1a1a] border border-white/[0.05]">
                    <div className="flex items-center gap-2 text-zinc-500 text-xs mb-1">
                      <FileText className="w-3.5 h-3.5" />
                      Order ID
                    </div>
                    <p className="text-white text-sm font-mono truncate">{selectedOrder.id}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-[#1a1a1a] border border-white/[0.05]">
                    <div className="flex items-center gap-2 text-zinc-500 text-xs mb-1">
                      <CreditCard className="w-3.5 h-3.5" />
                      Amount
                    </div>
                    <p className="text-amber-500 text-sm font-semibold">NPR {selectedOrder.amount.toLocaleString()}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-[#1a1a1a] border border-white/[0.05]">
                    <div className="flex items-center gap-2 text-zinc-500 text-xs mb-1">
                      <Calendar className="w-3.5 h-3.5" />
                      Order Date
                    </div>
                    <p className="text-white text-sm">{formatDate(selectedOrder.created_at)}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-[#1a1a1a] border border-white/[0.05]">
                    <div className="flex items-center gap-2 text-zinc-500 text-xs mb-1">
                      <CreditCard className="w-3.5 h-3.5" />
                      Payment
                    </div>
                    <p className="text-white text-sm capitalize">{selectedOrder.payment_method?.replace(/_/g, " ")}</p>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="p-4 rounded-xl bg-[#1a1a1a] border border-white/[0.05]">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-amber-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium">{selectedOrder.user?.full_name || "Customer"}</p>
                      <p className="text-zinc-400 text-sm truncate">{selectedOrder.user?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => copyToClipboard(selectedOrder.user?.email || "")}
                      className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-amber-500 transition-colors px-3 py-1.5 rounded-lg bg-[#222222] border border-white/[0.05]"
                    >
                      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      Copy Email
                    </button>
                    <a
                      href={`mailto:${selectedOrder.user?.email}`}
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
                    placeholder="Enter login credentials...&#10;&#10;Email: example@email.com&#10;Password: xxxxxxxx"
                    value={credentials}
                    onChange={(e) => setCredentials(e.target.value)}
                    rows={5}
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

      {showPreview && selectedOrder && (
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
                  <p className="text-zinc-500 text-sm">Review before sending to {selectedOrder.user?.email}</p>
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
                <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 p-8 text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiLz48cGF0aCBkPSJNMjAgMjBjMC0xMS4wNDYgOC45NTQtMjAgMjAtMjB2NDBoLTQwYzExLjA0NiAwIDIwLTguOTU0IDIwLTIweiIgZmlsbD0icmdiYSgwLDAsMCwwLjA1KSIvPjwvZz48L3N2Zz4=')] opacity-30"></div>
                  <div className="relative">
                    <h1 className="text-3xl font-bold text-black tracking-tight">OTTSewa</h1>
                    <p className="text-black/60 text-sm mt-1 font-medium">Your Premium Subscription Partner</p>
                  </div>
                </div>

                {/* Email Body */}
                <div className="bg-[#0f0f0f] p-8">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-white mb-3">
                      Hello {selectedOrder.user?.full_name || "Valued Customer"}!
                    </h2>
                    <p className="text-zinc-400 leading-relaxed">
                      Thank you for your purchase. Your order credentials for{" "}
                      <span className="text-amber-500 font-semibold">{selectedOrder.product?.title}</span> are ready.
                    </p>
                  </div>

                  {/* Credentials Box */}
                  <div className="rounded-xl border border-amber-500/30 bg-gradient-to-b from-amber-500/10 to-transparent p-6 mb-6">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
                        <FileText className="w-4 h-4 text-black" />
                      </div>
                      <h3 className="text-amber-500 font-semibold uppercase tracking-wide text-sm">Your Credentials</h3>
                    </div>
                    <div className="bg-[#0a0a0a] rounded-lg p-4 border border-white/[0.05]">
                      <pre className="text-white text-sm whitespace-pre-wrap font-mono leading-relaxed">
                        {credentials || "No credentials entered"}
                      </pre>
                    </div>
                  </div>

                  {/* Additional Notes */}
                  {additionalNotes && (
                    <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-5 mb-6">
                      <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-blue-400 font-semibold text-sm mb-2">Important Notes</h4>
                          <p className="text-zinc-300 text-sm leading-relaxed">{additionalNotes}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Order Summary */}
                  <div className="rounded-xl bg-[#1a1a1a] p-5 border border-white/[0.05]">
                    <h4 className="text-zinc-400 text-xs font-semibold uppercase tracking-wide mb-3">Order Summary</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-zinc-500">Order ID</p>
                        <p className="text-white font-mono">{selectedOrder.id.slice(0, 8)}...</p>
                      </div>
                      <div>
                        <p className="text-zinc-500">Amount Paid</p>
                        <p className="text-amber-500 font-semibold">NPR {selectedOrder.amount.toLocaleString()}</p>
                      </div>
                      {selectedOrder.plan_name && (
                        <div>
                          <p className="text-zinc-500">Plan</p>
                          <p className="text-white">{selectedOrder.plan_name}</p>
                        </div>
                      )}
                      {selectedOrder.duration_months && (
                        <div>
                          <p className="text-zinc-500">Duration</p>
                          <p className="text-white">{selectedOrder.duration_months} months</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Email Footer */}
                <div className="bg-[#080808] px-8 py-6 border-t border-white/[0.05]">
                  <div className="text-center">
                    <p className="text-zinc-500 text-sm mb-2">Need help? Contact us on WhatsApp</p>
                    <p className="text-amber-500 font-bold text-lg">+977 9869671451</p>
                    <div className="mt-4 pt-4 border-t border-white/[0.05]">
                      <p className="text-zinc-600 text-xs">
                        © {new Date().getFullYear()} OTTSewa. All rights reserved.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-[#0f0f0f] px-6 py-4 border-t border-white/[0.08] flex gap-3">
              <Button
                onClick={() => setShowPreview(false)}
                variant="outline"
                className="flex-1 border-white/[0.08] bg-[#1a1a1a] hover:bg-[#222222] text-white h-12"
              >
                <X className="w-4 h-4 mr-2" />
                Close & Edit
              </Button>
              <Button
                onClick={() => {
                  setShowPreview(false)
                  handleSendCredentials()
                }}
                disabled={sending}
                className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-semibold h-12"
              >
                {sending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Confirm & Send
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
