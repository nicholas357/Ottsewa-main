"use client"

import { Home, Heart, ShoppingCart, User, Gamepad2 } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function MobileNav() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-amber-500/[0.08] md:hidden z-40 shadow-[inset_0_1px_0_0_rgba(245,158,11,0.05)]">
      <div className="flex items-center justify-around h-14 px-2">
        <Link
          href="/"
          className={`flex flex-col items-center justify-center gap-0.5 p-2 rounded-lg transition-all ${
            isActive("/") ? "text-amber-400 bg-amber-500/[0.08]" : "text-zinc-500 hover:text-amber-400"
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px]">Home</span>
          {isActive("/") && (
            <span className="absolute bottom-1 w-4 h-0.5 bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
          )}
        </Link>

        <Link
          href="/categories"
          className={`flex flex-col items-center justify-center gap-0.5 p-2 rounded-lg transition-all relative ${
            isActive("/categories") ? "text-amber-400 bg-amber-500/[0.08]" : "text-zinc-500 hover:text-amber-400"
          }`}
        >
          <Gamepad2 className="w-5 h-5" />
          <span className="text-[10px]">Games</span>
          {isActive("/categories") && (
            <span className="absolute bottom-1 w-4 h-0.5 bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
          )}
        </Link>

        <Link
          href="/cart"
          className={`flex flex-col items-center justify-center gap-0.5 p-2 rounded-lg transition-all relative ${
            isActive("/cart") ? "text-amber-400 bg-amber-500/[0.08]" : "text-zinc-500 hover:text-amber-400"
          }`}
        >
          <ShoppingCart className="w-5 h-5" />
          <span className="text-[10px]">Cart</span>
          <span className="absolute top-0.5 right-1 w-4 h-4 bg-amber-500 text-black rounded-full text-[9px] flex items-center justify-center font-medium shadow-[0_0_8px_rgba(245,158,11,0.4)]">
            2
          </span>
          {isActive("/cart") && (
            <span className="absolute bottom-1 w-4 h-0.5 bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
          )}
        </Link>

        <Link
          href="/wishlist"
          className={`flex flex-col items-center justify-center gap-0.5 p-2 rounded-lg transition-all relative ${
            isActive("/wishlist") ? "text-amber-400 bg-amber-500/[0.08]" : "text-zinc-500 hover:text-amber-400"
          }`}
        >
          <Heart className="w-5 h-5" />
          <span className="text-[10px]">Wishlist</span>
          <span className="absolute top-0.5 right-1 w-4 h-4 bg-amber-500 text-black rounded-full text-[9px] flex items-center justify-center font-medium shadow-[0_0_8px_rgba(245,158,11,0.4)]">
            3
          </span>
          {isActive("/wishlist") && (
            <span className="absolute bottom-1 w-4 h-0.5 bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
          )}
        </Link>

        <Link
          href="/profile"
          className={`flex flex-col items-center justify-center gap-0.5 p-2 rounded-lg transition-all relative ${
            isActive("/profile") ? "text-amber-400 bg-amber-500/[0.08]" : "text-zinc-500 hover:text-amber-400"
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px]">Account</span>
          {isActive("/profile") && (
            <span className="absolute bottom-1 w-4 h-0.5 bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
          )}
        </Link>
      </div>
    </nav>
  )
}
