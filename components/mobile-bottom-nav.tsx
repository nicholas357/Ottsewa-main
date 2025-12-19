"use client"

import { Home, Search, ShoppingCart, LayoutGrid, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useCart } from "@/contexts/cart-context"
import { useState, useEffect, useRef } from "react"

export function MobileBottomNav() {
  const pathname = usePathname()
  const { getCartCount } = useCart()
  const cartCount = getCartCount()

  const [isVisible, setIsVisible] = useState(true)
  const lastScrollY = useRef(0)
  const ticking = useRef(false)

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY
          const scrollDiff = currentScrollY - lastScrollY.current

          if (Math.abs(scrollDiff) > 10) {
            if (scrollDiff > 0 && currentScrollY > 100) {
              setIsVisible(false)
            } else {
              setIsVisible(true)
            }
            lastScrollY.current = currentScrollY
          }

          ticking.current = false
        })
        ticking.current = true
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setIsVisible(true)
    lastScrollY.current = 0
  }, [pathname])

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Category", href: "/category", icon: LayoutGrid },
    { name: "Search", href: "/search", icon: Search },
    { name: "Cart", href: "/cart", icon: ShoppingCart, badge: cartCount },
    { name: "Account", href: "/dashboard", icon: User },
  ]

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  return (
    <nav
      className={`
        lg:hidden fixed bottom-0 left-0 right-0 z-50
        will-change-transform
        transition-transform duration-300 ease-out
        ${isVisible ? "translate-y-0" : "translate-y-full"}
      `}
    >
      <div className="absolute -top-6 left-0 right-0 h-6 bg-gradient-to-t from-zinc-950 to-transparent pointer-events-none" />

      <div className="relative bg-zinc-950 border-t border-zinc-800">
        <div className="absolute top-0 left-4 right-4 h-px bg-amber-500/20" />

        <div className="flex items-stretch justify-evenly w-full max-w-lg mx-auto">
          {navItems.map((item) => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.name}
                href={item.href}
                prefetch={true}
                className={`
                  relative flex-1 flex flex-col items-center justify-center
                  min-h-[60px] py-2 cursor-pointer
                  active:scale-95
                  transition-transform duration-150
                `}
              >
                {active && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-amber-500 rounded-full" />
                )}

                <div
                  className={`
                    relative flex items-center justify-center w-9 h-9 rounded-lg
                    transition-colors duration-150
                    ${active ? "bg-amber-500/10" : ""}
                  `}
                >
                  <item.icon
                    className={`
                      w-5 h-5 transition-colors duration-150
                      ${active ? "text-amber-500" : "text-zinc-500"}
                    `}
                    strokeWidth={active ? 2.5 : 2}
                  />

                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-amber-500 rounded-full flex items-center justify-center text-[10px] font-bold text-black leading-none">
                      {item.badge > 99 ? "99+" : item.badge}
                    </span>
                  )}
                </div>

                <span
                  className={`
                    mt-0.5 text-[10px] font-medium
                    transition-colors duration-150
                    ${active ? "text-amber-500" : "text-zinc-500"}
                  `}
                >
                  {item.name}
                </span>
              </Link>
            )
          })}
        </div>

        {/* Safe area spacer */}
        <div className="h-[env(safe-area-inset-bottom,0px)] bg-zinc-950" />
      </div>
    </nav>
  )
}
