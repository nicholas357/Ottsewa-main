import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import { ArrowRight } from "lucide-react"

interface QuickLink {
  title: string
  description: string
  href: string
  icon: LucideIcon
}

interface QuickLinksProps {
  title?: string
  links: QuickLink[]
}

export function QuickLinks({ title = "Related Pages", links }: QuickLinksProps) {
  return (
    <div className="bg-zinc-900/30 border-t border-zinc-800 mt-16 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h3 className="text-lg font-semibold text-white mb-6">{title}</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 hover:border-amber-500/30 transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-amber-500/20 transition-colors">
                  <link.icon className="w-5 h-5 text-amber-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-medium text-sm group-hover:text-amber-400 transition-colors flex items-center gap-1">
                    {link.title}
                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </h4>
                  <p className="text-zinc-500 text-xs mt-0.5 truncate">{link.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
