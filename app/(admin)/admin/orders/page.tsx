"use client"

import { useEffect, useState, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import Image from "next/image"
import {
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
  Calendar,
  User,
  RefreshCw,
  DollarSign,
  ShieldCheck,
  ShieldX,
  ShieldQuestion,
  Eye,
  CheckCircle,
  Hash,
  Trash2,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"

interface Order {
  id: string
  user_id: string
  product_id: string
  quantity: number
  unit_price: number
  amount: number
  status: string
  payment_method: string
  payment_proof_url: string | null
  payment_proof_status: string | null
  notes: string | null
  created_at: string
  updated_at: string
  edition_id: string | null
  denomination_id: string | null
  plan_id: string | null
  duration_months: number | null
  license_type_id: string | null
  license_duration: string | null
  platform_id: string | null
  product?: { id: string; title: string; slug: string; image_url: string; product_type: string } | null
  user?: { id: string; email: string; full_name: string } | null
  edition_name?: string | null
  denomination_value?: number | null
  denomination_currency?: string | null
  plan_name?: string | null
  license_type_name?: string | null
  platform_name?: string | null
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [paymentFilter, setPaymentFilter] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)
  const [updatingPayment, setUpdatingPayment] = useState<string | null>(null)
  const [deleteOrderId, setDeleteOrderId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const supabase = createClient()

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true)
      const { data: ordersData, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      if (!ordersData || ordersData.length === 0) {
        setOrders([])
        return
      }

      const productIds = [...new Set(ordersData.map((o) => o.product_id).filter(Boolean))]
      const userIds = [...new Set(ordersData.map((o) => o.user_id).filter(Boolean))]
      const editionIds = [...new Set(ordersData.map((o) => o.edition_id).filter(Boolean))]
      const denominationIds = [...new Set(ordersData.map((o) => o.denomination_id).filter(Boolean))]
      const planIds = [...new Set(ordersData.map((o) => o.plan_id).filter(Boolean))]
      const licenseTypeIds = [...new Set(ordersData.map((o) => o.license_type_id).filter(Boolean))]
      const platformIds = [...new Set(ordersData.map((o) => o.platform_id).filter(Boolean))]

      const [productsRes, usersRes, editionsRes, denominationsRes, plansRes, licenseTypesRes, platformsRes] =
        await Promise.all([
          productIds.length > 0
            ? supabase.from("products").select("id, title, slug, image_url, product_type").in("id", productIds)
            : { data: [] },
          userIds.length > 0
            ? supabase.from("profiles").select("id, email, full_name").in("id", userIds)
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
      const usersMap = new Map((usersRes.data || []).map((u) => [u.id, u]))
      const editionsMap = new Map((editionsRes.data || []).map((e) => [e.id, e]))
      const denominationsMap = new Map((denominationsRes.data || []).map((d) => [d.id, d]))
      const plansMap = new Map((plansRes.data || []).map((p) => [p.id, p]))
      const licenseTypesMap = new Map((licenseTypesRes.data || []).map((l) => [l.id, l]))
      const platformsMap = new Map((platformsRes.data || []).map((p) => [p.id, p]))

      const enrichedOrders: Order[] = ordersData.map((order) => ({
        ...order,
        product: productsMap.get(order.product_id) || null,
        user: usersMap.get(order.user_id) || null,
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
      toast.error("Failed to load orders")
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingStatus(orderId)
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", orderId)

      if (error) throw error
      setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null))
      }
      toast.success(`Order status updated to ${newStatus}`)
    } catch (err: any) {
      toast.error(err.message || "Failed to update status")
    } finally {
      setUpdatingStatus(null)
    }
  }

  const updatePaymentProofStatus = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingPayment(orderId)
      const { error } = await supabase
        .from("orders")
        .update({ payment_proof_status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", orderId)

      if (error) throw error
      setOrders((prev) =>
        prev.map((order) => (order.id === orderId ? { ...order, payment_proof_status: newStatus } : order)),
      )
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, payment_proof_status: newStatus } : null))
      }
      toast.success(`Payment ${newStatus === "verified" ? "verified" : "rejected"}`)
    } catch (err: any) {
      toast.error(err.message || "Failed to update payment status")
    } finally {
      setUpdatingPayment(null)
    }
  }

  const deleteOrder = async (orderId: string) => {
    try {
      setDeleting(true)
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to delete order")
      }

      toast.success("Order deleted successfully")
      setOrders((prev) => prev.filter((o) => o.id !== orderId))
      setDeleteOrderId(null)
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(null)
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to delete order")
    } finally {
      setDeleting(false)
    }
  }

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

  const getPaymentProofConfig = (status: string | null) => {
    switch (status) {
      case "verified":
        return { icon: ShieldCheck, color: "text-emerald-500 bg-emerald-500/10", label: "Verified" }
      case "rejected":
        return { icon: ShieldX, color: "text-red-500 bg-red-500/10", label: "Rejected" }
      default:
        return { icon: ShieldQuestion, color: "text-amber-500 bg-amber-500/10", label: "Pending" }
    }
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      searchQuery === "" ||
      order.product?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user?.full_name?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    const matchesPayment =
      paymentFilter === "all" ||
      (paymentFilter === "pending" && (!order.payment_proof_status || order.payment_proof_status === "pending")) ||
      order.payment_proof_status === paymentFilter

    return matchesSearch && matchesStatus && matchesPayment
  })

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    processing: orders.filter((o) => o.status === "processing").length,
    completed: orders.filter((o) => o.status === "completed").length,
    revenue: orders.filter((o) => o.status === "completed").reduce((sum, o) => sum + o.amount, 0),
    awaitingVerification: orders.filter(
      (o) => o.payment_proof_url && (!o.payment_proof_status || o.payment_proof_status === "pending"),
    ).length,
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-zinc-800 rounded animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-zinc-900/50 border border-zinc-800/50 rounded-xl animate-pulse" />
          ))}
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-zinc-900/50 border border-zinc-800/50 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Orders Management</h1>
          <p className="text-zinc-400 text-sm mt-1">{stats.total} total orders</p>
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

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <Card className="bg-zinc-900/50 border-zinc-800/50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-zinc-800 rounded-lg">
              <Package className="w-4 h-4 text-zinc-400" />
            </div>
            <div>
              <p className="text-zinc-500 text-xs">Total</p>
              <p className="text-white font-semibold">{stats.total}</p>
            </div>
          </div>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800/50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 rounded-lg">
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <div>
              <p className="text-zinc-500 text-xs">Pending</p>
              <p className="text-white font-semibold">{stats.pending}</p>
            </div>
          </div>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800/50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Package className="w-4 h-4 text-blue-500" />
            </div>
            <div>
              <p className="text-zinc-500 text-xs">Processing</p>
              <p className="text-white font-semibold">{stats.processing}</p>
            </div>
          </div>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800/50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <div>
              <p className="text-zinc-500 text-xs">Completed</p>
              <p className="text-white font-semibold">{stats.completed}</p>
            </div>
          </div>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800/50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 rounded-lg">
              <ShieldQuestion className="w-4 h-4 text-amber-500" />
            </div>
            <div>
              <p className="text-zinc-500 text-xs">Awaiting Verify</p>
              <p className="text-white font-semibold">{stats.awaitingVerification}</p>
            </div>
          </div>
        </Card>
        <Card className="bg-zinc-900/50 border-zinc-800/50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <DollarSign className="w-4 h-4 text-emerald-500" />
            </div>
            <div>
              <p className="text-zinc-500 text-xs">Revenue</p>
              <p className="text-white font-semibold text-sm">NPR {stats.revenue.toLocaleString()}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <Input
            placeholder="Search by product, customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-zinc-900/50 border-zinc-800 text-white"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40 bg-zinc-900/50 border-zinc-800 text-white cursor-pointer">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-800">
            <SelectItem value="all" className="cursor-pointer">
              All Status
            </SelectItem>
            <SelectItem value="pending" className="cursor-pointer">
              Pending
            </SelectItem>
            <SelectItem value="processing" className="cursor-pointer">
              Processing
            </SelectItem>
            <SelectItem value="completed" className="cursor-pointer">
              Completed
            </SelectItem>
            <SelectItem value="cancelled" className="cursor-pointer">
              Cancelled
            </SelectItem>
          </SelectContent>
        </Select>
        <Select value={paymentFilter} onValueChange={setPaymentFilter}>
          <SelectTrigger className="w-full sm:w-40 bg-zinc-900/50 border-zinc-800 text-white cursor-pointer">
            <SelectValue placeholder="Payment" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-800">
            <SelectItem value="all" className="cursor-pointer">
              All Payments
            </SelectItem>
            <SelectItem value="pending" className="cursor-pointer">
              Pending
            </SelectItem>
            <SelectItem value="verified" className="cursor-pointer">
              Verified
            </SelectItem>
            <SelectItem value="rejected" className="cursor-pointer">
              Rejected
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="bg-zinc-900/50 border-zinc-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/50">
                <th className="text-left p-3 sm:p-4 text-xs sm:text-sm font-medium text-zinc-400">Order</th>
                <th className="text-left p-3 sm:p-4 text-xs sm:text-sm font-medium text-zinc-400 hidden md:table-cell">
                  Customer
                </th>
                <th className="text-left p-3 sm:p-4 text-xs sm:text-sm font-medium text-zinc-400 hidden lg:table-cell">
                  Product
                </th>
                <th className="text-left p-3 sm:p-4 text-xs sm:text-sm font-medium text-zinc-400">Amount</th>
                <th className="text-left p-3 sm:p-4 text-xs sm:text-sm font-medium text-zinc-400">Status</th>
                <th className="text-left p-3 sm:p-4 text-xs sm:text-sm font-medium text-zinc-400 hidden sm:table-cell">
                  Payment
                </th>
                <th className="text-left p-3 sm:p-4 text-xs sm:text-sm font-medium text-zinc-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                const statusConfig = getStatusConfig(order.status)
                const StatusIcon = statusConfig.icon
                const paymentConfig = getPaymentProofConfig(order.payment_proof_status)
                const PaymentIcon = paymentConfig.icon

                return (
                  <tr key={order.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                    <td className="p-3 sm:p-4">
                      <div className="flex items-center gap-2">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-zinc-800">
                          <Image
                            src={order.product?.image_url || "/placeholder.svg?height=40&width=40&query=product"}
                            alt={order.product?.title || "Product"}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-white font-medium truncate">{order.product?.title || "Unknown Product"}</p>
                          <p className="text-zinc-500 text-xs capitalize">
                            {order.product?.product_type?.replace(/_/g, " ") || "Product"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 sm:p-4 hidden md:table-cell">
                      <p className="text-white font-medium truncate">
                        {order.user?.full_name || order.user?.email || "Unknown User"}
                      </p>
                      <p className="text-zinc-500 text-xs">{order.user?.email || "No Email"}</p>
                    </td>
                    <td className="p-3 sm:p-4 hidden lg:table-cell">
                      <p className="text-white font-medium truncate">{order.product?.title || "Unknown Product"}</p>
                      <p className="text-zinc-500 text-xs capitalize">
                        {order.product?.product_type?.replace(/_/g, " ") || "Product"}
                      </p>
                    </td>
                    <td className="p-3 sm:p-4 text-right">
                      <p className="text-white font-semibold text-sm">NPR {order.amount.toLocaleString()}</p>
                    </td>
                    <td className="p-3 sm:p-4">
                      <Badge className={`${statusConfig.color} text-xs px-2 py-0.5 border`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusConfig.label}
                      </Badge>
                    </td>
                    <td className="p-3 sm:p-4 hidden sm:table-cell">
                      {order.payment_proof_url && (
                        <Badge className={`${paymentConfig.color} text-xs px-2 py-0.5`}>
                          <PaymentIcon className="w-3 h-3 mr-1" />
                          {paymentConfig.label}
                        </Badge>
                      )}
                    </td>
                    <td className="p-3 sm:p-4">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedOrder(order)}
                          className="h-8 w-8 p-0 text-zinc-400 hover:text-white"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteOrderId(order.id)}
                          className="h-8 w-8 p-0 text-zinc-400 hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Hash className="w-4 h-4 text-amber-500" />
              Order {selectedOrder?.id.slice(0, 8).toUpperCase()}
            </DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <Tabs defaultValue="details" className="mt-4">
              <TabsList className="bg-zinc-800">
                <TabsTrigger value="details" className="cursor-pointer">
                  Details
                </TabsTrigger>
                <TabsTrigger value="customer" className="cursor-pointer">
                  Customer
                </TabsTrigger>
                {selectedOrder.payment_proof_url && (
                  <TabsTrigger value="payment" className="cursor-pointer">
                    Payment Proof
                  </TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="details" className="space-y-4 mt-4">
                <div className="flex items-center gap-4 p-4 bg-zinc-800/50 rounded-xl">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-zinc-800">
                    <Image
                      src={selectedOrder.product?.image_url || "/placeholder.svg?height=64&width=64&query=product"}
                      alt={selectedOrder.product?.title || "Product"}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium truncate">
                      {selectedOrder.product?.title || "Unknown Product"}
                    </h3>
                    <p className="text-zinc-500 text-sm capitalize">
                      {selectedOrder.product?.product_type?.replace(/_/g, " ") || "Product"}
                    </p>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
                      {selectedOrder.edition_name && (
                        <p className="text-amber-500 text-xs">Edition: {selectedOrder.edition_name}</p>
                      )}
                      {selectedOrder.plan_name && (
                        <p className="text-amber-500 text-xs">Plan: {selectedOrder.plan_name}</p>
                      )}
                      {selectedOrder.license_type_name && (
                        <p className="text-amber-500 text-xs">License: {selectedOrder.license_type_name}</p>
                      )}
                      {selectedOrder.license_duration && (
                        <p className="text-zinc-400 text-xs">Duration: {selectedOrder.license_duration}</p>
                      )}
                      {selectedOrder.denomination_value && (
                        <p className="text-amber-500 text-xs">
                          Value: {selectedOrder.denomination_currency || "USD"} {selectedOrder.denomination_value}
                        </p>
                      )}
                      {selectedOrder.duration_months && (
                        <p className="text-zinc-400 text-xs">Duration: {selectedOrder.duration_months} months</p>
                      )}
                      {selectedOrder.platform_name && (
                        <p className="text-zinc-400 text-xs">Platform: {selectedOrder.platform_name}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-zinc-800/30 rounded-lg">
                    <p className="text-zinc-500 text-xs">Quantity</p>
                    <p className="text-white font-medium">{selectedOrder.quantity}</p>
                  </div>
                  <div className="p-3 bg-zinc-800/30 rounded-lg">
                    <p className="text-zinc-500 text-xs">Unit Price</p>
                    <p className="text-white font-medium">NPR {selectedOrder.unit_price?.toLocaleString() || 0}</p>
                  </div>
                  <div className="p-3 bg-zinc-800/30 rounded-lg">
                    <p className="text-zinc-500 text-xs">Total Amount</p>
                    <p className="text-emerald-500 font-semibold">NPR {selectedOrder.amount?.toLocaleString() || 0}</p>
                  </div>
                  <div className="p-3 bg-zinc-800/30 rounded-lg">
                    <p className="text-zinc-500 text-xs">Payment Method</p>
                    <p className="text-white font-medium capitalize">{selectedOrder.payment_method || "N/A"}</p>
                  </div>
                </div>

                <div className="p-4 bg-zinc-800/30 rounded-xl space-y-3">
                  <p className="text-zinc-400 text-sm font-medium">Update Order Status</p>
                  <div className="flex flex-wrap gap-2">
                    {["pending", "processing", "completed", "cancelled", "refunded"].map((status) => {
                      const config = getStatusConfig(status)
                      const Icon = config.icon
                      const isActive = selectedOrder.status === status
                      return (
                        <Button
                          key={status}
                          size="sm"
                          variant={isActive ? "default" : "outline"}
                          className={isActive ? "bg-amber-500 hover:bg-amber-600" : "border-zinc-700"}
                          disabled={updatingStatus === selectedOrder.id}
                          onClick={() => updateOrderStatus(selectedOrder.id, status)}
                        >
                          <Icon className="w-3 h-3 mr-1" />
                          {config.label}
                        </Button>
                      )
                    })}
                  </div>
                </div>

                {selectedOrder.notes && (
                  <div className="p-3 bg-zinc-800/50 rounded-lg">
                    <p className="text-zinc-500 text-xs mb-1">Customer Notes</p>
                    <p className="text-white text-sm">{selectedOrder.notes}</p>
                  </div>
                )}

                <div className="flex items-center gap-4 text-xs text-zinc-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Created: {new Date(selectedOrder.created_at).toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <RefreshCw className="w-3 h-3" />
                    Updated: {new Date(selectedOrder.updated_at).toLocaleString()}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="customer" className="space-y-4 mt-4">
                <div className="p-4 bg-zinc-800/30 rounded-xl space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                      <User className="w-6 h-6 text-amber-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-white font-medium truncate">
                        {selectedOrder.user?.full_name || "No Name Provided"}
                      </h3>
                      <p className="text-zinc-500 text-sm truncate">{selectedOrder.user?.email || "No Email"}</p>
                    </div>
                  </div>

                  <div className="border-t border-zinc-800 pt-4 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3 bg-zinc-800/50 rounded-lg">
                        <p className="text-zinc-500 text-xs mb-1">Email Address</p>
                        <p className="text-white text-sm break-all">{selectedOrder.user?.email || "Not provided"}</p>
                      </div>
                      <div className="p-3 bg-zinc-800/50 rounded-lg">
                        <p className="text-zinc-500 text-xs mb-1">Customer ID</p>
                        <p className="text-amber-500/80 text-xs font-mono break-all">
                          {selectedOrder.user_id || "Unknown"}
                        </p>
                      </div>
                      <div className="p-3 bg-zinc-800/50 rounded-lg">
                        <p className="text-zinc-500 text-xs mb-1">Full Name</p>
                        <p className="text-white text-sm">{selectedOrder.user?.full_name || "Not provided"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {selectedOrder.payment_proof_url && (
                <TabsContent value="payment" className="space-y-4 mt-4">
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-zinc-800">
                    <Image
                      src={selectedOrder.payment_proof_url || "/placeholder.svg"}
                      alt="Payment Proof"
                      fill
                      className="object-contain"
                    />
                  </div>

                  <div className="p-4 bg-zinc-800/30 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-zinc-400 text-sm font-medium">Payment Verification</p>
                      <Badge className={getPaymentProofConfig(selectedOrder.payment_proof_status).color}>
                        {getPaymentProofConfig(selectedOrder.payment_proof_status).label}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-700"
                        disabled={
                          updatingPayment === selectedOrder.id || selectedOrder.payment_proof_status === "verified"
                        }
                        onClick={() => updatePaymentProofStatus(selectedOrder.id, "verified")}
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verify
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={
                          updatingPayment === selectedOrder.id || selectedOrder.payment_proof_status === "rejected"
                        }
                        onClick={() => updatePaymentProofStatus(selectedOrder.id, "rejected")}
                      >
                        <XCircle className="w-3 h-3 mr-1" />
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-zinc-700 bg-transparent"
                        onClick={() => window.open(selectedOrder.payment_proof_url!, "_blank")}
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        View Full
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              )}
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteOrderId} onOpenChange={() => setDeleteOrderId(null)}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Order</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              Are you sure you want to delete this order? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteOrderId && deleteOrder(deleteOrderId)}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
