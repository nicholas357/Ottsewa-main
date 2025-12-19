import type React from "react"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface PageHeaderProps {
  title: string
  description?: string
  icon?: LucideIcon
  badge?: string
  centered?: boolean
  children?: React.ReactNode
}

export function PageHeader({ title, description, icon: Icon, badge, centered = true, children }: PageHeaderProps) {
  return (
    <section className="relative py-16 sm:py-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-transparent to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className={cn("relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", centered && "text-center")}>
        {badge && (
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium mb-4">
            {badge}
          </span>
        )}

        {Icon && (
          <div
            className={cn(
              "w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-6 border border-amber-500/20",
              centered && "mx-auto",
            )}
          >
            <Icon className="w-8 h-8 text-amber-500" />
          </div>
        )}

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 text-balance">{title}</h1>

        {description && <p className="text-lg text-zinc-400 max-w-3xl mx-auto leading-relaxed">{description}</p>}

        {children}
      </div>
    </section>
  )
}
