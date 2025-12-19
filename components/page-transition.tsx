"use client"

import { usePathname } from "next/navigation"
import { useEffect, useState, type ReactNode } from "react"

interface PageTransitionProps {
  children: ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [displayChildren, setDisplayChildren] = useState(children)

  useEffect(() => {
    setIsTransitioning(true)

    const fadeOutTimer = setTimeout(() => {
      setDisplayChildren(children)

      const fadeInTimer = setTimeout(() => {
        setIsTransitioning(false)
      }, 30)

      return () => clearTimeout(fadeInTimer)
    }, 80)

    return () => clearTimeout(fadeOutTimer)
  }, [pathname, children])

  return (
    <div
      className={`transition-all duration-100 ease-out ${isTransitioning ? "opacity-0 translate-y-1" : "opacity-100 translate-y-0"}`}
    >
      {displayChildren}
    </div>
  )
}
