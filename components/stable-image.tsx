"use client"

import Image, { type ImageProps } from "next/image"
import { useStableImageSrc } from "@/hooks/use-stable-image"
import { forwardRef, memo } from "react"

interface StableImageProps extends Omit<ImageProps, "loading"> {
  priority?: boolean
  containerClassName?: string
}

/**
 * StableImage - A wrapper around Next.js Image that prevents Chrome flickering.
 *
 * This component uses IntersectionObserver to lazy load images, but once loaded,
 * switches to eager loading to prevent Chrome from unloading them from memory.
 */
export const StableImage = memo(
  forwardRef<HTMLDivElement, StableImageProps>(function StableImage(
    { src, priority = false, containerClassName, className, alt, ...props },
    forwardedRef,
  ) {
    const srcString = typeof src === "string" ? src : (src as any)?.src || ""
    const { ref, isLoaded, onLoad, loading } = useStableImageSrc(srcString, priority)

    return (
      <div
        ref={(node) => {
          // Handle both refs
          ;(ref as any).current = node
          if (typeof forwardedRef === "function") {
            forwardedRef(node)
          } else if (forwardedRef) {
            forwardedRef.current = node
          }
        }}
        className={containerClassName}
        style={{
          // Prevent layout shift
          position: "relative",
          // Force GPU layer to prevent compositor issues
          transform: "translateZ(0)",
          backfaceVisibility: "hidden",
        }}
      >
        <Image
          {...props}
          src={src || "/placeholder.svg"}
          alt={alt}
          className={className}
          loading={priority ? "eager" : loading}
          onLoad={onLoad}
          decoding="async"
          style={{
            ...props.style,
            // Keep image in GPU memory
            willChange: isLoaded ? "auto" : "transform",
          }}
        />
      </div>
    )
  }),
)
