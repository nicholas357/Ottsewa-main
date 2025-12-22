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

// Route transition loading bar
export function RouteTransitionBar() {
  const pathname = usePathname()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    setIsTransitioning(true)
    setProgress(30)

    const timer1 = setTimeout(() => setProgress(60), 100)
    const timer2 = setTimeout(() => setProgress(80), 200)
    const timer3 = setTimeout(() => {
      setProgress(100)
      setTimeout(() => {
        setIsTransitioning(false)
        setProgress(0)
      }, 200)
    }, 300)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [pathname])

  if (!isTransitioning) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-1">
      <div
        className="h-full bg-gradient-to-r from-red-500 to-red-400 transition-all duration-200 ease-out shadow-lg shadow-red-500/50"
        style={{ width: `${progress}%` }}
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
