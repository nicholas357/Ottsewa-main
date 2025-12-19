"use client"

import type React from "react"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { type ComponentProps, useCallback } from "react"

interface PrefetchLinkProps extends ComponentProps<typeof Link> {
  prefetchDelay?: number
}

export function PrefetchLink({ href, children, prefetchDelay = 100, onMouseEnter, ...props }: PrefetchLinkProps) {
  const router = useRouter()

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      // Prefetch the route on hover
      if (typeof href === "string") {
        const timer = setTimeout(() => {
          router.prefetch(href)
        }, prefetchDelay)

        // Clean up if mouse leaves quickly
        const cleanup = () => clearTimeout(timer)
        e.currentTarget.addEventListener("mouseleave", cleanup, { once: true })
      }

      // Call original onMouseEnter if provided
      if (onMouseEnter) {
        onMouseEnter(e)
      }
    },
    [href, prefetchDelay, router, onMouseEnter],
  )

  return (
    <Link href={href} onMouseEnter={handleMouseEnter} {...props}>
      {children}
    </Link>
  )
}
