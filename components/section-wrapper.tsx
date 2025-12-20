"use client"

import type React from "react"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface SectionWrapperProps {
  children: React.ReactNode
  className?: string
  title?: string
  subtitle?: string
  icon?: React.ReactNode
  action?: React.ReactNode
}

export function SectionWrapper({ children, className = "", title, subtitle, icon, action }: SectionWrapperProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <section className={`relative px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12 ${className}`}>
      <div className="max-w-7xl mx-auto">
        {/* Outer box */}
        <motion.div
          className="relative rounded-3xl p-[1px] bg-gradient-to-b from-amber-500/20 via-amber-500/5 to-transparent"
          initial={false}
          animate={isMounted ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.5 }}
        >
          {/* Inner box */}
          <div className="relative rounded-3xl bg-gradient-to-b from-[#121212]/90 to-[#0a0a0a]/80 backdrop-blur-sm overflow-hidden">
            {/* Top shine line */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />

            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-amber-500/10 to-transparent rounded-tl-3xl" />
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-tr-3xl" />

            {/* Content area */}
            <div className="relative p-4 sm:p-6 lg:p-8">
              {/* Header */}
              {(title || action) && (
                <div className="flex items-center justify-between mb-6 sm:mb-8">
                  {title && (
                    <div className="flex items-center gap-2 sm:gap-3">
                      {icon && (
                        <div className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30 shadow-lg shadow-amber-500/20">
                          {icon}
                          <div className="absolute inset-0 rounded-xl bg-amber-500/20 blur-xl -z-10" />
                        </div>
                      )}
                      <div>
                        <h2 className="text-lg sm:text-xl font-semibold text-white">{title}</h2>
                        {subtitle && <p className="text-xs sm:text-sm text-zinc-500 hidden sm:block">{subtitle}</p>}
                      </div>
                    </div>
                  )}
                  {action}
                </div>
              )}

              {/* Main content */}
              {children}
            </div>

            {/* Bottom shine line */}
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
