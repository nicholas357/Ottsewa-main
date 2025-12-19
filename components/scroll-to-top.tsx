"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { useEffect, useRef, Suspense } from "react"

function ScrollToTopInner() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const prevPathname = useRef(pathname)
  const prevSearchParams = useRef(searchParams?.toString())

  useEffect(() => {
    const currentSearchParams = searchParams?.toString()

    if (prevPathname.current !== pathname || prevSearchParams.current !== currentSearchParams) {
      // Update refs
      prevPathname.current = pathname
      prevSearchParams.current = currentSearchParams

      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        // Try multiple methods to ensure scroll works across all browsers
        try {
          // Method 1: Standard scrollTo
          window.scrollTo({ top: 0, left: 0, behavior: "instant" })

          // Method 2: Scroll the document element
          document.documentElement.scrollTop = 0

          // Method 3: Scroll the body element
          document.body.scrollTop = 0
        } catch (e) {
          // Fallback for any errors
          window.scrollTo(0, 0)
        }
      })
    }
  }, [pathname, searchParams])

  return null
}

export function ScrollToTop() {
  return (
    <Suspense fallback={null}>
      <ScrollToTopInner />
    </Suspense>
  )
}
