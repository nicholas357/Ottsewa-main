"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
  Lock,
  ChevronRight,
  ChevronLeft,
  Upload,
  Mail,
  Phone,
  CreditCard,
  QrCode,
  AlertCircle,
  Shield,
  Zap,
  Clock,
  Copy,
  Check,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  Loader2,
  ImageIcon,
  User,
  Building,
  FileText,
  Package,
  MapPin,
  Receipt,
  CheckCircle2,
  Info,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAuth, getCachedUser } from "@/hooks/use-auth"
import { useCart } from "@/contexts/cart-context"
import { useToast } from "@/hooks/use-toast"

const paymentMethods = [
  {
    id: "esewa",
    name: "eSewa",
    description: "Pay with eSewa mobile wallet",
    icon: "/esewa-logo.png",
    qrCode: "/esewa-qr.png",
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500",
    accountName: "OTTSewa Nepal",
    accountNumber: "9869671451",
    bankName: "eSewa ID",
  },
  {
    id: "khalti",
    name: "Khalti",
    description: "Pay with Khalti digital wallet",
    icon: "/khalti-logo.png",
    qrCode: "/khalti-qr.png",
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500",
    accountName: "OTTSewa Nepal",
    accountNumber: "9869671451",
    bankName: "Khalti ID",
  },
  {
    id: "internetbanking",
    name: "Internet Banking",
    description: "Direct bank transfer via internet banking",
    icon: "/internet-banking-logo.png",
    qrCode: "/internet-banking-qr.png",
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500",
    accountName: "OTTSewa Nepal Pvt. Ltd.",
    accountNumber: "01234567890123",
    bankName: "Nepal Investment Bank Ltd.",
  },
  {
    id: "connectips",
    name: "ConnectIPS",
    description: "Pay securely via ConnectIPS",
    icon: "/connectips-logo.png",
    qrCode: "/connectips-qr.png",
    color: "from-red-500 to-red-600",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500",
    accountName: "OTTSewa Nepal Pvt. Ltd.",
    accountNumber: "01234567890123",
    bankName: "Nepal Investment Bank Ltd.",
  },
]

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getCartTotal, clearCart } = useCart()
  const { toast } = useToast()

  const { user, loading: authLoading } = useAuth()

  const [step, setStep] = useState(1)
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null)
  const [paymentProof, setPaymentProof] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [orderError, setOrderError] = useState<string | null>(null)
  const [completedOrder, setCompletedOrder] = useState<{
    items: typeof items
    subtotal: number
    total: number
    orderId: string
  } | null>(null)

  const [loading, setLoading] = useState(() => {
    // Check cache immediately - if user exists, no loading needed
    const cachedUser = getCachedUser()
    return !cachedUser
  })
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const [contactInfo, setContactInfo] = useState({
    fullName: "",
    email: "",
    phone: "+977 ",
    address: "",
    city: "",
    specialNote: "",
  })

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const total = subtotal

  const selectedPaymentMethod = paymentMethods.find((m) => m.id === selectedPayment)

  useEffect(() => {
    // If auth is done loading and no user, redirect to login
    if (!authLoading && !user) {
      router.push("/auth/login?redirect=/checkout")
      return
    }

    // When user is available, update contact info and stop loading
    if (user) {
      setContactInfo((prev) => ({
        ...prev,
        email: user.email || "",
        fullName: user.profile?.full_name || "",
      }))
      setLoading(false)
    }
  }, [user, authLoading, router])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setPaymentProof(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to place your order.",
        variant: "destructive",
      })
      router.push("/login?redirect=/checkout")
      return
    }

    console.log("[v0] Starting order submission for user:", user.id)
    setSubmitting(true)
    setOrderError(null)

    const orderItems = [...items]
    const orderSubtotal = subtotal
    const orderTotal = total

    try {
      const formDataToSend = new FormData()
      formDataToSend.append("userId", user.id)
      formDataToSend.append("items", JSON.stringify(items))
      formDataToSend.append("paymentMethod", selectedPayment || "esewa")
      formDataToSend.append("specialNote", contactInfo.specialNote)
      formDataToSend.append(
        "contactInfo",
        JSON.stringify({
          fullName: contactInfo.fullName,
          email: contactInfo.email,
          phone: contactInfo.phone,
          address: contactInfo.address,
          city: contactInfo.city,
        }),
      )

      if (paymentProof) {
        formDataToSend.append("paymentProof", paymentProof)
      }

      console.log("[v0] Sending order to API...")
      const response = await fetch("/api/orders", {
        method: "POST",
        body: formDataToSend,
      })

      console.log("[v0] Response status:", response.status)

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to place order")
      }

      setCompletedOrder({
        items: orderItems,
        subtotal: orderSubtotal,
        total: orderTotal,
        orderId: result.orderId,
      })

      clearCart()

      toast({
        title: "Order Placed Successfully!",
        description: "Thank you for your purchase. Your order is being processed.",
        className: "bg-gradient-to-r from-amber-500 to-amber-600 text-black border-none",
        duration: 5000,
        actionLink: "/orders",
        actionLabel: "View My Orders",
        actionIcon: Package,
      })

      setStep(4)
      window.scrollTo({ top: 0, behavior: "instant" })
    } catch (error: any) {
      setOrderError(error.message || "Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleNextStep = async (nextStep: number) => {
    setSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 400))
    setStep(nextStep)
    setSubmitting(false)
    window.scrollTo({ top: 0, behavior: "instant" })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Progress stepper skeleton */}
          <div className="flex items-center justify-center gap-2 mb-10">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-zinc-800/50 animate-pulse" />
                <div className="hidden sm:block w-20 h-4 rounded bg-zinc-800/50 animate-pulse" />
                {i < 3 && <div className="w-8 sm:w-16 h-0.5 bg-zinc-800/50" />}
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main form skeleton */}
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/30 p-6">
                <div className="w-40 h-6 rounded bg-zinc-800/50 mb-6 animate-pulse" />
                <div className="space-y-4">
                  <div className="w-full h-12 rounded-lg bg-zinc-800/50 animate-pulse" />
                  <div className="w-full h-12 rounded-lg bg-zinc-800/50 animate-pulse" />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-12 rounded-lg bg-zinc-800/50 animate-pulse" />
                    <div className="h-12 rounded-lg bg-zinc-800/50 animate-pulse" />
                  </div>
                  <div className="w-full h-12 rounded-lg bg-zinc-800/50 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Order summary skeleton */}
            <div className="lg:col-span-1">
              <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/30 p-6 sticky top-24">
                <div className="w-32 h-6 rounded bg-zinc-800/50 mb-6 animate-pulse" />
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-16 h-16 rounded-lg bg-zinc-800/50 animate-pulse" />
                      <div className="flex-1 space-y-2">
                        <div className="w-3/4 h-4 rounded bg-zinc-800/50 animate-pulse" />
                        <div className="w-1/2 h-3 rounded bg-zinc-800/50 animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (items.length === 0 && step !== 4) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Your cart is empty</h2>
          <p className="text-zinc-400 mb-6">Add some items to your cart to checkout</p>
          <Button
            onClick={() => router.push("/")}
            className="bg-amber-500 hover:bg-amber-600 text-black font-semibold cursor-pointer"
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Progress Stepper */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {[
            { num: 1, label: "Details" },
            { num: 2, label: "Payment" },
            { num: 3, label: "Confirm" },
          ].map((s, i) => (
            <div key={s.num} className="flex items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                  step >= s.num
                    ? "bg-gradient-to-r from-amber-500 to-amber-600 text-black"
                    : "bg-zinc-800 text-zinc-500"
                }`}
              >
                {step > s.num ? <Check className="w-5 h-5" /> : s.num}
              </div>
              <span className={`hidden sm:block text-sm font-medium ${step >= s.num ? "text-white" : "text-zinc-500"}`}>
                {s.label}
              </span>
              {i < 2 && <div className={`w-8 sm:w-16 h-0.5 ${step > s.num ? "bg-amber-500" : "bg-zinc-700"}`} />}
            </div>
          ))}
        </div>

        {step === 4 ? (
          /* Professional order success page */
          <div className="max-w-2xl mx-auto">
            {/* Success Header */}
            <div className="text-center mb-8">
              <div className="relative inline-flex items-center justify-center mb-6">
                <div className="absolute w-24 h-24 bg-emerald-500/20 rounded-full animate-ping" />
                <div className="relative w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <CheckCircle2 className="w-10 h-10 text-white" /> {/* Changed from CheckCircle */}
                </div>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Order Placed Successfully</h1>
              <p className="text-zinc-400">
                Thank you for your purchase. Your order has been received and is being processed.
              </p>
            </div>

            {/* Order Details Card */}
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl overflow-hidden mb-6">
              {/* Order Header */}
              <div className="bg-zinc-800/50 px-6 py-4 border-b border-zinc-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-zinc-400 text-sm">Order Reference</p>
                    <div className="flex items-center gap-2">
                      <p className="text-white font-mono font-semibold text-amber-500">
                        #{completedOrder?.orderId ? completedOrder.orderId.slice(0, 8).toUpperCase() : "---"}
                      </p>
                      <button
                        onClick={() => {
                          if (completedOrder?.orderId) {
                            navigator.clipboard.writeText(completedOrder.orderId)
                            toast({ title: "Order ID copied to clipboard" })
                          }
                        }}
                        className="p-1 hover:bg-zinc-700 rounded transition-colors cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5 text-zinc-500" />
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-zinc-400 text-sm">Date</p>
                    <p className="text-white font-medium">
                      {new Date().toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Items - Use completedOrder.items instead of items */}
              <div className="px-6 py-4 border-b border-zinc-800">
                <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                  <Package className="w-4 h-4 text-amber-500" />
                  Order Items ({completedOrder?.items.length || 0})
                </h3>
                <div className="space-y-3">
                  {completedOrder?.items.map((item) => (
                    <div key={item.cartItemId} className="flex items-center gap-4">
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-zinc-800 flex-shrink-0">
                        <Image
                          src={item.productImage || "/placeholder.svg?height=56&width=56&query=game"}
                          alt={item.productTitle}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium text-sm truncate">{item.productTitle}</p>
                        <p className="text-zinc-500 text-xs">
                          {item.editionName ||
                            item.planName ||
                            item.denominationValue ||
                            item.licenseTypeName ||
                            "Standard"}
                          {item.platformName && ` • ${item.platformName}`}
                          {item.durationLabel && ` • ${item.durationLabel}`}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-medium text-sm">
                          NPR {(item.price * item.quantity).toLocaleString()}
                        </p>
                        <p className="text-zinc-500 text-xs">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary - Use completedOrder totals */}
              <div className="px-6 py-4 border-b border-zinc-800">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Subtotal</span>
                  <span className="text-white">NPR {(completedOrder?.subtotal || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center mt-2 pt-2 border-t border-zinc-800">
                  <span className="text-white font-semibold">Total Paid</span>
                  <span className="text-amber-500 font-bold text-lg">
                    NPR {(completedOrder?.total || 0).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="px-6 py-4 bg-zinc-800/30">
                <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                  <User className="w-4 h-4 text-amber-500" />
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-zinc-400">
                    <User className="w-3.5 h-3.5" />
                    <span>{contactInfo.fullName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-400">
                    <Mail className="w-3.5 h-3.5" />
                    <span>{contactInfo.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-400">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{contactInfo.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-400">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{contactInfo.city}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Timeline */}
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 mb-6">
              <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500" />
                Order Status
              </h3>
              <div className="relative">
                <div className="absolute left-[11px] top-6 bottom-6 w-0.5 bg-zinc-800" />
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 z-10">
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" /> {/* Changed from CheckCircle */}
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">Order Received</p>
                      <p className="text-zinc-500 text-xs">Your order has been placed successfully</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0 z-10 animate-pulse">
                      <Clock className="w-3.5 h-3.5 text-black" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">Payment Verification</p>
                      <p className="text-zinc-500 text-xs">We're verifying your payment proof</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center flex-shrink-0 z-10">
                      <Package className="w-3.5 h-3.5 text-zinc-600" />
                    </div>
                    <div>
                      <p className="text-zinc-500 font-medium text-sm">Processing</p>
                      <p className="text-zinc-600 text-xs">Preparing your digital keys</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center flex-shrink-0 z-10">
                      <Mail className="w-3.5 h-3.5 text-zinc-600" />
                    </div>
                    <div>
                      <p className="text-zinc-500 font-medium text-sm">Delivery</p>
                      <p className="text-zinc-600 text-xs">Keys sent to your email</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-zinc-800 flex items-center gap-2 text-amber-500">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">Estimated: 15-30 minutes after verification</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => router.push("/orders")}
                variant="outline"
                className="flex-1 border-zinc-700 text-white hover:bg-zinc-800 font-medium h-12 cursor-pointer"
              >
                <Receipt className="w-4 h-4 mr-2" />
                View My Orders
              </Button>
              <Button
                onClick={() => {
                  clearCart()
                  router.push("/")
                }}
                className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-semibold h-12 cursor-pointer"
              >
                Continue Shopping
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            {/* Support Note */}
            <p className="text-center text-zinc-500 text-xs mt-6">
              Need help? Contact our support team at{" "}
              <a href="mailto:support@ottsewa.store" className="text-amber-500 hover:underline cursor-pointer">
                support@ottsewa.store
              </a>
            </p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              {/* Step 1: Contact Information */}
              {step === 1 && (
                <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/30 backdrop-blur-sm overflow-hidden">
                  <div className="p-6 border-b border-zinc-800 bg-gradient-to-r from-amber-500/5 to-transparent">
                    <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
                      <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center">
                        <User className="w-5 h-5 text-amber-500" />
                      </div>
                      Contact Information
                    </h2>
                    <p className="text-zinc-400 text-sm mt-1 ml-13">We'll use this to send your order confirmation</p>
                  </div>

                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <Label className="text-zinc-300 mb-2 flex items-center gap-2 text-sm">
                          <User className="w-4 h-4 text-zinc-500" />
                          Full Name
                        </Label>
                        <Input
                          type="text"
                          placeholder="John Doe"
                          value={contactInfo.fullName}
                          onChange={(e) => setContactInfo({ ...contactInfo, fullName: e.target.value })}
                          className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 h-12 focus:border-amber-500 focus:ring-amber-500/20"
                          required
                        />
                      </div>

                      <div>
                        <Label className="text-zinc-300 mb-2 flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4 text-zinc-500" />
                          Email Address
                        </Label>
                        <Input
                          type="email"
                          placeholder="you@example.com"
                          value={contactInfo.email}
                          onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                          className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 h-12 focus:border-amber-500 focus:ring-amber-500/20"
                          required
                        />
                      </div>

                      <div>
                        <Label className="text-zinc-300 mb-2 flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-zinc-500" />
                          Phone Number
                        </Label>
                        <Input
                          type="tel"
                          placeholder="+977 98XXXXXXXX"
                          value={contactInfo.phone}
                          onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                          className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 h-12 focus:border-amber-500 focus:ring-amber-500/20"
                          required
                        />
                      </div>
                    </div>

                    <div className="border-t border-zinc-800 pt-6">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Building className="w-5 h-5 text-zinc-400" />
                        Billing Address
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <Label className="text-zinc-300 mb-2 text-sm">Street Address</Label>
                          <Input
                            placeholder="123 Main Street"
                            value={contactInfo.address}
                            onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })}
                            className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 h-12 focus:border-amber-500 focus:ring-amber-500/20"
                            required
                          />
                        </div>
                        <div>
                          <Label className="text-zinc-300 mb-2 text-sm">City</Label>
                          <Input
                            placeholder="Kathmandu"
                            value={contactInfo.city}
                            onChange={(e) => setContactInfo({ ...contactInfo, city: e.target.value })}
                            className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 h-12 focus:border-amber-500 focus:ring-amber-500/20"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-zinc-800 pt-6">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-zinc-400" />
                        Special Note (Optional)
                      </h3>
                      <Textarea
                        placeholder="Any special instructions or notes for your order..."
                        value={contactInfo.specialNote}
                        onChange={(e) => setContactInfo({ ...contactInfo, specialNote: e.target.value })}
                        className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 min-h-[100px] focus:border-amber-500 focus:ring-amber-500/20 resize-none"
                      />
                    </div>

                    <Button
                      onClick={() => handleNextStep(2)}
                      disabled={
                        !contactInfo.email ||
                        !contactInfo.phone ||
                        !contactInfo.address ||
                        !contactInfo.fullName ||
                        !contactInfo.city ||
                        submitting
                      }
                      className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-semibold h-14 text-lg shadow-lg shadow-amber-500/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          Continue to Payment
                          <ChevronRight className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/30 backdrop-blur-sm overflow-hidden">
                  <div className="p-6 border-b border-zinc-800 bg-gradient-to-r from-amber-500/5 to-transparent">
                    <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
                      <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-amber-500" />
                      </div>
                      Select Payment Method
                    </h2>
                    <p className="text-zinc-400 text-sm mt-1 ml-13">Choose your preferred payment option</p>
                  </div>

                  <div className="p-6 space-y-4">
                    {/* Payment Options Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {paymentMethods.map((method) => (
                        <div
                          key={method.id}
                          onClick={() => setSelectedPayment(method.id)}
                          className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                            selectedPayment === method.id
                              ? `${method.borderColor} ${method.bgColor}`
                              : "border-zinc-700 hover:border-zinc-600 bg-zinc-800/30"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden ${
                                selectedPayment === method.id ? method.bgColor : "bg-zinc-700/50"
                              }`}
                            >
                              <Image
                                src={method.icon || "/placeholder.svg"}
                                alt={method.name}
                                width={32}
                                height={32}
                                className="object-contain"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-white font-semibold">{method.name}</h3>
                              <p className="text-zinc-400 text-xs truncate">{method.description}</p>
                            </div>
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                selectedPayment === method.id
                                  ? `${method.borderColor} bg-gradient-to-r ${method.color}`
                                  : "border-zinc-600"
                              }`}
                            >
                              {selectedPayment === method.id && <Check className="w-3 h-3 text-white" />}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Trust Badges */}
                    <div className="flex items-center justify-center gap-6 pt-4 border-t border-zinc-800 mt-6">
                      <div className="flex items-center gap-2 text-zinc-400 text-sm">
                        <Shield className="w-4 h-4 text-green-500" />
                        <span>Secure Payment</span>
                      </div>
                      <div className="flex items-center gap-2 text-zinc-400 text-sm">
                        <Zap className="w-4 h-4 text-amber-500" />
                        <span>Instant Verification</span>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <Button
                        onClick={() => setStep(1)}
                        variant="outline"
                        className="flex-1 border-zinc-700 text-white hover:bg-zinc-800 h-12 cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        Back
                      </Button>
                      <Button
                        onClick={() => handleNextStep(3)}
                        disabled={!selectedPayment || submitting}
                        className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-semibold h-12 shadow-lg shadow-amber-500/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            Continue
                            <ChevronRight className="w-4 h-4 ml-2" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/30 backdrop-blur-sm overflow-hidden">
                  <div className="p-6 border-b border-zinc-800 bg-gradient-to-r from-amber-500/5 to-transparent">
                    <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
                      <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center">
                        <QrCode className="w-5 h-5 text-amber-500" />
                      </div>
                      Complete Payment
                    </h2>
                    <p className="text-zinc-400 text-sm mt-1 ml-13">
                      Pay via {selectedPaymentMethod?.name} and upload your proof
                    </p>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Selected Payment Method Badge */}
                    {selectedPaymentMethod && (
                      <div
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${selectedPaymentMethod.bgColor} border ${selectedPaymentMethod.borderColor}`}
                      >
                        <Image
                          src={selectedPaymentMethod.icon || "/placeholder.svg"}
                          alt={selectedPaymentMethod.name}
                          width={20}
                          height={20}
                          className="object-contain"
                        />
                        <span className="text-white font-medium text-sm">Paying with {selectedPaymentMethod.name}</span>
                      </div>
                    )}

                    {/* QR Code Display */}
                    <div className="bg-gradient-to-br from-zinc-800/80 to-zinc-800/30 border border-zinc-700 rounded-2xl p-6 md:p-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        {/* QR Code */}
                        <div className="flex flex-col items-center">
                          <p className="text-zinc-400 text-sm mb-4">
                            Scan with {selectedPaymentMethod?.name || "your app"}
                          </p>
                          <div className="bg-white p-4 rounded-2xl shadow-xl">
                            <div className="w-40 h-40 md:w-48 md:h-48 relative rounded-lg overflow-hidden">
                              {selectedPaymentMethod?.qrCode ? (
                                <Image
                                  src={selectedPaymentMethod.qrCode || "/placeholder.svg"}
                                  alt={`${selectedPaymentMethod.name} QR Code`}
                                  fill
                                  className="object-contain"
                                />
                              ) : (
                                <div className="w-full h-full bg-zinc-100 flex items-center justify-center">
                                  <QrCode className="w-24 h-24 md:w-32 md:h-32 text-zinc-800" />
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="mt-4 text-center">
                            <p className="text-zinc-500 text-sm">Amount to Pay</p>
                            <p className="text-3xl md:text-4xl font-bold text-amber-500">
                              NPR {total.toLocaleString()}
                            </p>
                          </div>
                        </div>

                        {/* Account Details */}
                        <div className="flex flex-col justify-center space-y-4">
                          <h3 className="text-white font-semibold text-lg mb-2">Payment Instructions</h3>

                          <div className="bg-zinc-900/50 border border-zinc-700 rounded-xl p-5 space-y-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                                <QrCode className="w-5 h-5 text-amber-500" />
                              </div>
                              <div>
                                <p className="text-white font-medium">Scan the QR Code</p>
                                <p className="text-zinc-400 text-sm">
                                  Use your {selectedPaymentMethod?.name} app to scan
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                                <CreditCard className="w-5 h-5 text-green-500" />
                              </div>
                              <div>
                                <p className="text-white font-medium">Complete Payment</p>
                                <p className="text-zinc-400 text-sm">
                                  Pay NPR {total.toLocaleString()} to complete your order
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                <Upload className="w-5 h-5 text-blue-500" />
                              </div>
                              <div>
                                <p className="text-white font-medium">Upload Proof</p>
                                <p className="text-zinc-400 text-sm">Take a screenshot and upload below</p>
                              </div>
                            </div>
                          </div>

                          {/* Quick tip */}
                          <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
                            <p className="text-amber-400 text-sm flex items-start gap-2">
                              <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                              <span>
                                After payment, upload your payment screenshot as proof. Your order will be processed
                                within 5-15 minutes after verification.
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Upload Payment Proof */}
                    <div className="space-y-3">
                      <Label className="text-white flex items-center gap-2 text-base font-semibold">
                        <ImageIcon className="w-5 h-5 text-amber-500" />
                        Upload Payment Screenshot
                      </Label>
                      <div
                        className={`border-2 border-dashed rounded-2xl p-6 md:p-8 text-center transition-all cursor-pointer ${
                          paymentProof
                            ? "border-green-500/50 bg-green-500/5"
                            : "border-zinc-700 hover:border-zinc-500 bg-zinc-800/30"
                        }`}
                      >
                        <input
                          type="file"
                          id="payment-proof"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <label htmlFor="payment-proof" className="cursor-pointer flex flex-col items-center">
                          {previewUrl ? (
                            <div className="relative">
                              <Image
                                src={previewUrl || "/placeholder.svg"}
                                alt="Payment proof"
                                width={200}
                                height={200}
                                className="rounded-xl object-cover max-h-48"
                              />
                              <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                <Check className="w-4 h-4 text-white" />
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="w-16 h-16 bg-zinc-700/50 rounded-full flex items-center justify-center mb-4">
                                <Upload className="w-8 h-8 text-zinc-400" />
                              </div>
                              <p className="text-white font-medium mb-1">Click to upload screenshot</p>
                              <p className="text-zinc-500 text-sm">PNG, JPG up to 10MB</p>
                            </>
                          )}
                          {paymentProof && (
                            <div className="mt-4 text-center">
                              <p className="text-green-400 font-medium text-sm">{paymentProof.name}</p>
                              <p className="text-zinc-500 text-xs mt-1">
                                {(paymentProof.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          )}
                        </label>
                      </div>
                    </div>

                    {/* Important Note */}
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex gap-3">
                      <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-blue-300">
                        <p className="font-semibold mb-1">Important</p>
                        <p className="text-blue-400/80">
                          Ensure your screenshot clearly shows the transaction amount, date, and reference number.
                        </p>
                      </div>
                    </div>

                    {/* Error Display */}
                    {orderError && (
                      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex gap-3">
                        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-red-300">
                          <p className="font-semibold mb-1">Error</p>
                          <p className="text-red-400/80">{orderError}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-4 pt-2">
                      <Button
                        onClick={() => setStep(2)}
                        variant="outline"
                        className="flex-1 border-zinc-700 text-white hover:bg-zinc-800 h-12 cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        Back
                      </Button>
                      <Button
                        onClick={() => {
                          handleSubmit()
                        }}
                        disabled={!paymentProof || submitting}
                        className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-semibold h-12 shadow-lg shadow-amber-500/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Placing Order...
                          </>
                        ) : (
                          <>
                            <Lock className="w-4 h-4 mr-2" />
                            Place Order
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/30 backdrop-blur-sm p-6 sticky top-24">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-amber-500" />
                  Order Summary
                </h3>

                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.cartItemId} className="flex gap-3">
                      <div className="w-16 h-16 rounded-lg bg-zinc-800 overflow-hidden flex-shrink-0">
                        {item.productImage ? (
                          <Image
                            src={item.productImage || "/placeholder.svg"}
                            alt={item.productTitle}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag className="w-6 h-6 text-zinc-600" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white text-sm font-medium truncate">{item.productTitle}</h4>
                        <div className="text-zinc-500 text-xs space-y-0.5">
                          {item.editionName && <p>Edition: {item.editionName}</p>}
                          {item.platformName && <p>Platform: {item.platformName}</p>}
                          {item.planName && <p>Plan: {item.planName}</p>}
                          {item.durationLabel && <p>Duration: {item.durationLabel}</p>}
                          {item.licenseTypeName && <p>License: {item.licenseTypeName}</p>}
                          {item.licenseDurationLabel && <p>Duration: {item.licenseDurationLabel}</p>}
                          {item.denominationValue && <p>Value: NPR {item.denominationValue}</p>}
                          <p>Qty: {item.quantity}</p>
                        </div>
                        <p className="text-amber-500 font-semibold text-sm mt-1">
                          NPR {(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-zinc-800 pt-4 space-y-2">
                  <div className="flex justify-between text-zinc-400 text-sm">
                    <span>Subtotal</span>
                    <span>NPR {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-zinc-800">
                    <span>Total</span>
                    <span className="text-amber-500">NPR {total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="mt-6 pt-4 border-t border-zinc-800">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="flex flex-col items-center text-center p-2">
                      <Shield className="w-5 h-5 text-green-500 mb-1" />
                      <span className="text-zinc-400 text-xs">Secure</span>
                    </div>
                    <div className="flex flex-col items-center text-center p-2">
                      <Zap className="w-5 h-5 text-amber-500 mb-1" />
                      <span className="text-zinc-400 text-xs">Instant</span>
                    </div>
                    <div className="flex flex-col items-center text-center p-2">
                      <Sparkles className="w-5 h-5 text-purple-500 mb-1" />
                      <span className="text-zinc-400 text-xs">Verified</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
