"use client"

import type React from "react"

import { useEffect, useState, useCallback } from "react"
import { usePathname, useRouter } from "next/navigation"

// Prefetch manager to track what's been prefetched
const prefetchedRoutes = new Set<string>()

export function useSmartPrefetch() {
  const router = useRouter()

  const prefetch = useCallback(
    (href: string) => {
      if (!prefetchedRoutes.has(href)) {
        router.prefetch(href)
        prefetchedRoutes.add(href)
      }
    },
    [router],
  )

  const prefetchOnHover = useCallback(
    (href: string) => {
      return {
        onMouseEnter: () => prefetch(href),
        onTouchStart: () => prefetch(href),
      }
    },
    [prefetch],
  )

  return { prefetch, prefetchOnHover }
}

export function RouteTransitionBar() {
  const pathname = usePathname()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Start transition
    setIsTransitioning(true)
    setVisible(true)
    setProgress(0)

    // Animate progress
    const timer0 = setTimeout(() => setProgress(30), 50)
    const timer1 = setTimeout(() => setProgress(60), 150)
    const timer2 = setTimeout(() => setProgress(80), 300)
    const timer3 = setTimeout(() => setProgress(100), 400)

    // Hide after completion
    const timer4 = setTimeout(() => {
      setIsTransitioning(false)
      setTimeout(() => {
        setVisible(false)
        setProgress(0)
      }, 300)
    }, 500)

    return () => {
      clearTimeout(timer0)
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
      clearTimeout(timer4)
    }
  }, [pathname])

  if (!visible) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-1 bg-black/20 pointer-events-none">
      <div
        className={`h-full bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 shadow-lg shadow-amber-500/50 transition-all ease-out ${
          isTransitioning ? "duration-200" : "duration-300"
        }`}
        style={{
          width: `${progress}%`,
          opacity: isTransitioning ? 1 : 0,
        }}
      />
    </div>
  )
}

// Smart link component with prefetch
export function SmartLink({
  href,
  children,
  className,
  onClick,
  ...props
}: {
  href: string
  children: React.ReactNode
  className?: string
  onClick?: (e: React.MouseEvent) => void
} & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const router = useRouter()
  const { prefetchOnHover } = useSmartPrefetch()

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    if (onClick) onClick(e)
    router.push(href)
  }

  return (
    <a href={href} className={className} onClick={handleClick} {...prefetchOnHover(href)} {...props}>
      {children}
    </a>
  )
}
