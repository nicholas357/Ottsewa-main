import type React from "react"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface SectionCardProps {
  title: string
  description?: string
  icon?: LucideIcon
  children?: React.ReactNode
  className?: string
  variant?: "default" | "highlight" | "warning"
}

export function SectionCard({
  title,
  description,
  icon: Icon,
  children,
  className,
  variant = "default",
}: SectionCardProps) {
  return (
    <div
      className={cn(
        "relative bg-zinc-900/50 border rounded-xl p-6 transition-all group",
        variant === "default" && "border-zinc-800 hover:border-amber-500/30",
        variant === "highlight" && "border-amber-500/30 bg-amber-500/5",
        variant === "warning" && "border-amber-500/30 bg-amber-500/10",
        className,
      )}
    >
      {/* Shine effect */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      {Icon && (
        <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-amber-500/20 transition-colors">
          <Icon className="w-6 h-6 text-amber-500" />
        </div>
      )}

      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>

      {description && <p className="text-zinc-400 text-sm">{description}</p>}

      {children}
    </div>
  )
}
