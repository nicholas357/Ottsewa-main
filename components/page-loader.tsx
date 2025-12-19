"use client"

import { Spinner } from "@/components/ui/spinner"

export function PageLoader() {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-purple-900 border border-purple-700 rounded-lg p-8 flex flex-col items-center gap-4">
        <Spinner className="w-12 h-12 text-yellow-400" />
        <p className="text-white font-semibold">Loading...</p>
      </div>
    </div>
  )
}
