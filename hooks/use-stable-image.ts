"use client"

import { useEffect, useRef, useState, useCallback } from "react"

/**
 * Custom hook to prevent Chrome's image flickering on scroll-up.
 *
 * Root cause: Chrome's native loading="lazy" + resource eviction unloads
 * images when they exit the viewport, then re-decodes them when scrolling
 * back up, causing visible flicker.
 *
 * Solution: Use IntersectionObserver to detect when image enters viewport,
 * then load it once and keep it loaded forever by switching to loading="eager".
 */
export function useStableImage(initiallyVisible = false) {
  const [isLoaded, setIsLoaded] = useState(initiallyVisible)
  const [shouldLoad, setShouldLoad] = useState(initiallyVisible)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (shouldLoad) return // Already triggered loading

    const element = ref.current
    if (!element) return

    // Use IntersectionObserver to detect when element enters viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoad(true)
            observer.disconnect() // Only need to trigger once
          }
        })
      },
      {
        rootMargin: "200px", // Start loading 200px before entering viewport
        threshold: 0,
      },
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [shouldLoad])

  const onLoad = useCallback(() => {
    setIsLoaded(true)
  }, [])

  return {
    ref,
    shouldLoad,
    isLoaded,
    onLoad,
    // Once loaded, use eager to prevent Chrome from unloading
    loadingStrategy: shouldLoad ? ("eager" as const) : ("lazy" as const),
  }
}

/**
 * Global image cache to track which images have been loaded.
 * This persists across re-renders and prevents re-triggering loading.
 */
const loadedImages = new Set<string>()

export function useStableImageSrc(src: string, priority = false) {
  const [isLoaded, setIsLoaded] = useState(() => priority || loadedImages.has(src))
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isLoaded) return

    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            loadedImages.add(src)
            setIsLoaded(true)
            observer.disconnect()
          }
        })
      },
      {
        rootMargin: "300px",
        threshold: 0,
      },
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [src, isLoaded])

  const onLoad = useCallback(() => {
    loadedImages.add(src)
    setIsLoaded(true)
  }, [src])

  return {
    ref,
    isLoaded,
    onLoad,
    // Force eager loading once image has been seen to prevent Chrome unloading
    loading: isLoaded ? ("eager" as const) : ("lazy" as const),
  }
}
