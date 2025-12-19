"use client"

import { useState } from "react"
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  ShoppingBag,
  Shield,
  Truck,
  CreditCard,
  Tag,
  ChevronRight,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useCart } from "@/contexts/cart-context"

export default function CartPage() {
  const { items: cartItems, updateQuantity, removeItem, getCartTotal } = useCart()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const router = useRouter()

  const subtotal = getCartTotal()
  const discount = 0
  const total = subtotal - discount

  const handleCheckout = async () => {
    setIsCheckingOut(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    router.push("/checkout")
  }

  const getItemDetails = (item: (typeof cartItems)[0]) => {
    const details: string[] = []
    if (item.editionName) details.push(item.editionName)
    if (item.planName) details.push(item.planName)
    if (item.durationLabel) details.push(item.durationLabel)
    if (item.licenseTypeName) details.push(item.licenseTypeName)
    if (item.licenseDurationLabel) details.push(item.licenseDurationLabel)
    if (item.denominationValue) details.push(`NPR ${item.denominationValue}`)
    return details
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <div className="bg-zinc-900/50 border-b border-zinc-800/50">
        <div className="max-w-6xl mx-auto px-4 py-4 sm:py-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-amber-400 transition-colors mb-4 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Continue Shopping</span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-500 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">Your Cart</h1>
              <p className="text-zinc-500 text-xs sm:text-sm">
                {cartItems.length === 0
                  ? "No items yet"
                  : `${cartItems.length} ${cartItems.length === 1 ? "item" : "items"}`}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {cartItems.length === 0 ? (
          /* Empty Cart State */
          <div className="flex flex-col items-center justify-center py-12 sm:py-16">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-5">
              <ShoppingBag className="w-12 h-12 sm:w-14 sm:h-14 text-zinc-700" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Your cart is empty</h2>
            <p className="text-zinc-500 mb-6 text-center text-sm sm:text-base max-w-sm px-4">
              Start exploring our products and add items to your cart.
            </p>
            <Link href="/">
              <Button className="bg-amber-500 hover:bg-amber-400 text-black font-semibold px-6 py-5 rounded-xl cursor-pointer">
                Explore Products
              </Button>
            </Link>

            <div className="flex items-center gap-4 sm:gap-6 mt-8 text-zinc-600">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span className="text-xs">Secure Payment</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4" />
                <span className="text-xs">Instant Delivery</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Cart Items Section */}
            <div className="flex-1 space-y-3">
              {cartItems.map((item) => {
                const itemDetails = getItemDetails(item)
                return (
                  <div key={item.cartItemId} className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-3 sm:p-4">
                    <div className="flex gap-3 sm:gap-4">
                      {/* Product Image */}
                      <Link href={`/product/${item.productSlug}`} className="flex-shrink-0 cursor-pointer">
                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-zinc-800 border border-zinc-700/50">
                          {item.productImage ? (
                            <Image
                              src={item.productImage || "/placeholder.svg"}
                              alt={item.productTitle}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ShoppingBag className="w-6 h-6 text-zinc-600" />
                            </div>
                          )}
                        </div>
                      </Link>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <Link href={`/product/${item.productSlug}`}>
                              <h3 className="text-white font-medium text-sm sm:text-base line-clamp-1 hover:text-amber-400 transition-colors cursor-pointer">
                                {item.productTitle}
                              </h3>
                            </Link>

                            {/* Tags */}
                            <div className="flex flex-wrap items-center gap-1.5 mt-1">
                              {item.platformName && (
                                <span className="text-[10px] sm:text-xs px-1.5 py-0.5 bg-zinc-800 text-zinc-400 rounded">
                                  {item.platformName}
                                </span>
                              )}
                              {itemDetails.map((detail, idx) => (
                                <span
                                  key={idx}
                                  className="text-[10px] sm:text-xs px-1.5 py-0.5 bg-zinc-800/50 text-zinc-500 rounded"
                                >
                                  {detail}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Remove Button - Desktop */}
                          <button
                            onClick={() => removeItem(item.cartItemId)}
                            className="hidden sm:flex p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all cursor-pointer"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Price and Quantity Row */}
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2">
                            {/* Quantity Controls */}
                            <div className="inline-flex items-center bg-zinc-800/50 rounded-lg border border-zinc-700/50">
                              <button
                                onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                                className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center hover:bg-zinc-700 transition-colors rounded-l-lg cursor-pointer"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-3 h-3 text-zinc-400" />
                              </button>
                              <span className="w-7 sm:w-8 text-center text-white font-medium text-xs sm:text-sm">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                                className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center hover:bg-zinc-700 transition-colors rounded-r-lg cursor-pointer"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-3 h-3 text-zinc-400" />
                              </button>
                            </div>

                            {/* Remove Button - Mobile */}
                            <button
                              onClick={() => removeItem(item.cartItemId)}
                              className="sm:hidden p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all cursor-pointer"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Price */}
                          <p className="text-amber-400 font-bold text-sm sm:text-base">
                            NPR {(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:w-80 xl:w-96">
              <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl overflow-hidden lg:sticky lg:top-24">
                <div className="bg-zinc-800/30 px-4 py-3 border-b border-zinc-800/50">
                  <h2 className="font-semibold text-white">Order Summary</h2>
                </div>

                <div className="p-4">
                  {/* Promo Code */}
                  <div className="mb-4">
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <input
                          type="text"
                          placeholder="Promo code"
                          className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-lg pl-9 pr-3 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-amber-500/50 transition-all"
                        />
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="px-3 border-zinc-700 hover:bg-zinc-800 text-white cursor-pointer bg-transparent"
                      >
                        Apply
                      </Button>
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">
                        Subtotal ({cartItems.reduce((acc, item) => acc + item.quantity, 0)} items)
                      </span>
                      <span className="text-white">NPR {subtotal.toLocaleString()}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-green-400">Discount</span>
                        <span className="text-green-400">-NPR {discount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Processing Fee</span>
                      <span className="text-green-400">Free</span>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="border-t border-zinc-800/50 mt-4 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-medium">Total</span>
                      <p className="text-xl sm:text-2xl font-bold text-amber-400">NPR {total.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <Button
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                    className="w-full mt-4 bg-amber-500 hover:bg-amber-400 text-black font-semibold py-5 sm:py-6 rounded-xl cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isCheckingOut ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Checkout
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </>
                    )}
                  </Button>

                  {/* Trust Badges */}
                  <div className="mt-4 pt-4 border-t border-zinc-800/50">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-2 text-zinc-500">
                        <Shield className="w-3.5 h-3.5 text-green-500" />
                        <span className="text-[10px] sm:text-xs">Secure Checkout</span>
                      </div>
                      <div className="flex items-center gap-2 text-zinc-500">
                        <Truck className="w-3.5 h-3.5 text-blue-500" />
                        <span className="text-[10px] sm:text-xs">Instant Delivery</span>
                      </div>
                      <div className="flex items-center gap-2 text-zinc-500">
                        <CreditCard className="w-3.5 h-3.5 text-purple-500" />
                        <span className="text-[10px] sm:text-xs">Safe Payment</span>
                      </div>
                      <div className="flex items-center gap-2 text-zinc-500">
                        <Tag className="w-3.5 h-3.5 text-amber-500" />
                        <span className="text-[10px] sm:text-xs">Best Prices</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
