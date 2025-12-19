"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { v4 as uuidv4 } from "uuid"

export interface CartItem {
  cartItemId: string
  // Product info
  productId: string
  productTitle: string
  productImage: string
  productSlug: string
  productType: "game" | "giftcard" | "subscription" | "software"
  price: number
  quantity: number
  // Game specific
  editionId?: string
  editionName?: string
  platformId?: string
  platformName?: string
  // Subscription specific
  planId?: string
  planName?: string
  durationId?: string
  durationLabel?: string
  durationMonths?: number
  // Software specific
  licenseTypeId?: string
  licenseTypeName?: string
  licenseDurationId?: string
  licenseDurationLabel?: string
  // Gift card specific
  denominationId?: string
  denominationValue?: number
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "cartItemId">) => void
  removeItem: (cartItemId: string) => void
  updateQuantity: (cartItemId: string, quantity: number) => void
  clearCart: () => void
  getCartTotal: () => number
  getCartCount: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("ottsewa-cart")
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (e) {
        console.error("Failed to parse cart from localStorage")
      }
    }
    setIsLoaded(true)
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("ottsewa-cart", JSON.stringify(items))
    }
  }, [items, isLoaded])

  const addItem = (newItem: Omit<CartItem, "cartItemId">) => {
    setItems((currentItems) => {
      // Check if item already exists with same configuration
      const existingIndex = currentItems.findIndex(
        (item) =>
          item.productId === newItem.productId &&
          item.editionId === newItem.editionId &&
          item.planId === newItem.planId &&
          item.durationId === newItem.durationId &&
          item.licenseTypeId === newItem.licenseTypeId &&
          item.licenseDurationId === newItem.licenseDurationId &&
          item.denominationId === newItem.denominationId &&
          item.platformId === newItem.platformId,
      )

      if (existingIndex > -1) {
        // Update quantity of existing item
        const updatedItems = [...currentItems]
        updatedItems[existingIndex].quantity += newItem.quantity
        return updatedItems
      }

      // Add new item with unique cartItemId
      return [...currentItems, { ...newItem, cartItemId: uuidv4() }]
    })
  }

  const removeItem = (cartItemId: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.cartItemId !== cartItemId))
  }

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(cartItemId)
      return
    }
    setItems((currentItems) =>
      currentItems.map((item) => (item.cartItemId === cartItemId ? { ...item, quantity } : item)),
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const getCartTotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getCartCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0)
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
