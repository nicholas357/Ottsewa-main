"use client"

import { Heart, Trash2, ShoppingCart } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/cart-context"
import { useWishlist } from "@/contexts/wishlist-context"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import Link from "next/link"

export default function WishlistPage() {
  const { items, removeItem, itemCount } = useWishlist()
  const { addItem } = useCart()
  const { toast } = useToast()

  const addToCart = (item: (typeof items)[0]) => {
    addItem({
      productId: item.productId,
      productTitle: item.productTitle,
      productImage: item.productImage,
      productSlug: item.productSlug,
      productType: "game",
      price: item.price,
      quantity: 1,
    })

    toast({
      title: "Added to Cart",
      description: `${item.productTitle} has been added to your cart`,
      actionLink: "/cart",
      actionLabel: "Go to Cart",
      actionIcon: "cart",
    })
  }

  const handleRemove = (productId: string, productTitle: string) => {
    removeItem(productId)
    toast({
      title: "Removed from Wishlist",
      description: `${productTitle} has been removed from your wishlist`,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white">My Wishlist</h1>
          <p className="text-zinc-400 mt-2">
            {itemCount > 0
              ? `You have ${itemCount} item${itemCount > 1 ? "s" : ""} saved`
              : "View and manage your saved items"}
          </p>
        </div>
      </div>

      {items.length === 0 ? (
        <Card className="bg-zinc-900/50 border-zinc-800/50 backdrop-blur-sm rounded-xl p-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-amber-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-amber-500" />
            </div>
            <h3 className="text-white text-lg font-semibold mb-2">No items saved</h3>
            <p className="text-zinc-500 text-sm mb-6">Items you wishlist will appear here</p>
            <Link href="/">
              <Button className="bg-amber-500 hover:bg-amber-600 text-black font-medium cursor-pointer">
                Browse Products
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.map((item) => (
            <Card
              key={item.productId}
              className="bg-zinc-900/50 border-zinc-800/50 rounded-xl overflow-hidden group hover:border-amber-500/30 transition-all"
            >
              <Link href={`/product/${item.productSlug}`} className="block cursor-pointer">
                <div className="relative aspect-[4/3] bg-zinc-800">
                  <Image
                    src={item.productImage || "/placeholder.svg?height=200&width=300&query=game"}
                    alt={item.productTitle}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {item.originalPrice && item.originalPrice > item.price && (
                    <div className="absolute top-2 left-2 bg-amber-500 text-black text-xs font-bold px-2 py-1 rounded">
                      -{Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}%
                    </div>
                  )}
                </div>
              </Link>
              <div className="p-4">
                <Link href={`/product/${item.productSlug}`} className="cursor-pointer">
                  <h3 className="text-white font-medium text-sm mb-2 line-clamp-2 hover:text-amber-500 transition-colors">
                    {item.productTitle}
                  </h3>
                </Link>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-amber-500 font-bold">NPR {item.price?.toLocaleString()}</span>
                  {item.originalPrice && item.originalPrice > item.price && (
                    <span className="text-zinc-500 text-sm line-through">
                      NPR {item.originalPrice?.toLocaleString()}
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => addToCart(item)}
                    className="flex-1 bg-amber-500 hover:bg-amber-600 text-black text-xs font-medium h-9 cursor-pointer"
                  >
                    <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />
                    Add to Cart
                  </Button>
                  <Button
                    onClick={() => handleRemove(item.productId, item.productTitle)}
                    variant="outline"
                    className="h-9 w-9 p-0 border-zinc-700 hover:border-red-500 hover:bg-red-500/10 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4 text-zinc-400 hover:text-red-500" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
