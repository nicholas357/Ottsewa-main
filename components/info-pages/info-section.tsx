import type React from "react"
import { cn } from "@/lib/utils"

interface InfoSectionProps {
  title: string
  children: React.ReactNode
  className?: string
  id?: string
}

export function InfoSection({ title, children, className, id }: InfoSectionProps) {
  return (
    <section id={id} className={cn("scroll-mt-24", className)}>
      <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4 flex items-center gap-3">
        <span className="w-1 h-6 bg-amber-500 rounded-full" />
        {title}
      </h2>
      <div className="text-zinc-300 space-y-4 leading-relaxed">{children}</div>
    </section>
  )
}
