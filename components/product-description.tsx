"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface ProductDescriptionProps {
  content: string
  className?: string
}

export function ProductDescription({ content, className }: ProductDescriptionProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const tables = containerRef.current.querySelectorAll("table")
    tables.forEach((table) => {
      // Skip if already wrapped
      if (table.parentElement?.classList.contains("table-scroll-wrapper")) return

      const wrapper = document.createElement("div")
      wrapper.className = "table-scroll-wrapper"
      table.parentNode?.insertBefore(wrapper, table)
      wrapper.appendChild(table)
    })
  }, [content])

  if (!content) return null

  return (
    <div
      ref={containerRef}
      className={cn(
        "product-description",
        "prose prose-invert prose-zinc max-w-none",
        "break-words overflow-hidden",
        // Responsive text sizing
        "prose-sm sm:prose-base",
        // Headings - responsive sizes
        "prose-headings:text-white prose-headings:break-words",
        "prose-h1:text-lg sm:prose-h1:text-xl md:prose-h1:text-2xl prose-h1:font-bold prose-h1:mb-3 sm:prose-h1:mb-4 prose-h1:mt-4 sm:prose-h1:mt-6 prose-h1:first:mt-0",
        "prose-h2:text-base sm:prose-h2:text-lg md:prose-h2:text-xl prose-h2:font-semibold prose-h2:mb-2 sm:prose-h2:mb-3 prose-h2:mt-3 sm:prose-h2:mt-5",
        "prose-h3:text-sm sm:prose-h3:text-base md:prose-h3:text-lg prose-h3:font-medium prose-h3:mb-2 prose-h3:mt-3 sm:prose-h3:mt-4",
        // Paragraphs
        "prose-p:text-zinc-300 prose-p:leading-relaxed prose-p:mb-3 sm:prose-p:mb-4 prose-p:text-sm sm:prose-p:text-base",
        // Text formatting
        "prose-strong:text-white prose-strong:font-semibold",
        "prose-em:text-zinc-300",
        // Lists - responsive
        "prose-ul:text-zinc-300 prose-ul:my-3 sm:prose-ul:my-4 prose-ul:pl-4 sm:prose-ul:pl-6",
        "prose-ol:text-zinc-300 prose-ol:my-3 sm:prose-ol:my-4 prose-ol:pl-4 sm:prose-ol:pl-6",
        "prose-li:text-zinc-300 prose-li:mb-1 prose-li:text-sm sm:prose-li:text-base",
        "prose-li:marker:text-orange-500",
        // Blockquotes
        "prose-blockquote:border-l-2 sm:prose-blockquote:border-l-4 prose-blockquote:border-orange-500 prose-blockquote:pl-3 sm:prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-zinc-400 prose-blockquote:my-3 sm:prose-blockquote:my-4 prose-blockquote:text-sm sm:prose-blockquote:text-base",
        // Code
        "prose-code:text-orange-400 prose-code:bg-zinc-800 prose-code:px-1 sm:prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs sm:prose-code:text-sm prose-code:break-all",
        // Horizontal rule
        "prose-hr:border-zinc-700 prose-hr:my-4 sm:prose-hr:my-6",
        // Links
        "prose-a:text-amber-500 prose-a:no-underline hover:prose-a:underline prose-a:break-all",
        // Images - responsive
        "[&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg",
        // Pre/code blocks
        "[&_pre]:overflow-x-auto [&_pre]:text-xs sm:[&_pre]:text-sm [&_pre]:p-3 sm:[&_pre]:p-4 [&_pre]:bg-zinc-900 [&_pre]:rounded-lg [&_pre]:my-3 sm:[&_pre]:my-4",
        // Embedded content
        "[&_iframe]:max-w-full [&_iframe]:rounded-lg",
        "[&_video]:max-w-full [&_video]:rounded-lg",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}

export function ResponsiveTableWrapper({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("overflow-x-auto -mx-3 sm:mx-0 px-3 sm:px-0 scrollbar-hide", className)}>{children}</div>
}
