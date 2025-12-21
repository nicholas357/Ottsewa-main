import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-transparent min-h-screen">
      <div className="mb-6">
        <div className="h-8 w-48 bg-zinc-800 rounded animate-pulse mb-2" />
        <div className="h-4 w-64 bg-zinc-800 rounded animate-pulse" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-white/[0.08] p-3">
          <div className="bg-[#0f0f0f] rounded-xl p-6">
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-white/[0.08] p-3">
          <div className="bg-[#0f0f0f] rounded-xl p-6">
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
