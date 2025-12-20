"use client"

import { Home, Heart, ShoppingCart, User, Gamepad2 } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function MobileNav() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <nav className="fixed bottom-0 left-0 right-0 md:hidden z-40 px-2 pb-2">
      <div className="rounded-2xl border border-white/[0.08] p-[3px]">
        <div className="relative bg-[#0f0f0f] rounded-xl overflow-hidden">
          <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

          <div className="flex items-center justify-around h-14 px-2">
            <Link
              href="/"
              className={`flex flex-col items-center justify-center gap-0.5 p-2 rounded-lg transition-all relative ${
                isActive("/") ? "text-amber-400 bg-amber-500/10" : "text-zinc-500 hover:text-amber-400"
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="text-[10px]">Home</span>
              {isActive("/") && (
                <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-amber-500 rounded-full" />
              )}
            </Link>

            <Link
              href="/categories"
              className={`flex flex-col items-center justify-center gap-0.5 p-2 rounded-lg transition-all relative ${
                isActive("/categories") ? "text-amber-400 bg-amber-500/10" : "text-zinc-500 hover:text-amber-400"
              }`}
            >
              <Gamepad2 className="w-5 h-5" />
              <span className="text-[10px]">Games</span>
              {isActive("/categories") && (
                <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-amber-500 rounded-full" />
              )}
            </Link>

            <Link
              href="/cart"
              className={`flex flex-col items-center justify-center gap-0.5 p-2 rounded-lg transition-all relative ${
                isActive("/cart") ? "text-amber-400 bg-amber-500/10" : "text-zinc-500 hover:text-amber-400"
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="text-[10px]">Cart</span>
              <span className="absolute top-0.5 right-1 w-4 h-4 bg-amber-500 text-black rounded-full text-[9px] flex items-center justify-center font-medium">
                2
              </span>
              {isActive("/cart") && (
                <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-amber-500 rounded-full" />
              )}
            </Link>

            <Link
              href="/wishlist"
              className={`flex flex-col items-center justify-center gap-0.5 p-2 rounded-lg transition-all relative ${
                isActive("/wishlist") ? "text-amber-400 bg-amber-500/10" : "text-zinc-500 hover:text-amber-400"
              }`}
            >
              <Heart className="w-5 h-5" />
              <span className="text-[10px]">Wishlist</span>
              <span className="absolute top-0.5 right-1 w-4 h-4 bg-amber-500 text-black rounded-full text-[9px] flex items-center justify-center font-medium">
                3
              </span>
              {isActive("/wishlist") && (
                <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-amber-500 rounded-full" />
              )}
            </Link>

            <Link
              href="/profile"
              className={`flex flex-col items-center justify-center gap-0.5 p-2 rounded-lg transition-all relative ${
                isActive("/profile") ? "text-amber-400 bg-amber-500/10" : "text-zinc-500 hover:text-amber-400"
              }`}
            >
              <User className="w-5 h-5" />
              <span className="text-[10px]">Account</span>
              {isActive("/profile") && (
                <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-amber-500 rounded-full" />
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
