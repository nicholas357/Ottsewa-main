import { Skeleton } from "@/components/ui/skeleton"
import { ChevronRight } from "lucide-react"

export default function BlogLoading() {
  return (
    <main className="min-h-screen bg-zinc-950 py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-zinc-500 mb-6">
          <span className="text-zinc-500">Home</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-white">Blog</span>
        </nav>

        {/* Header Section */}
        <div className="relative rounded-2xl border border-white/[0.08] p-3 mb-6">
          <div className="relative rounded-xl bg-[#0f0f0f] overflow-hidden">
            <div className="relative p-6 sm:p-8 text-center">
              <Skeleton className="w-14 h-14 rounded-2xl mx-auto mb-4 bg-zinc-800" />
              <Skeleton className="h-10 w-48 mx-auto mb-4 bg-zinc-800" />
              <Skeleton className="h-5 w-96 max-w-full mx-auto bg-zinc-800" />
            </div>
          </div>
        </div>

        {/* Featured Post Skeleton */}
        <div className="relative rounded-2xl border border-white/[0.08] p-3 mb-6">
          <div className="relative rounded-xl bg-[#0f0f0f] overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-0">
              <Skeleton className="aspect-video lg:min-h-[400px] bg-zinc-800" />
              <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                  <Skeleton className="h-4 w-32 bg-zinc-800" />
                  <Skeleton className="h-4 w-24 bg-zinc-800" />
                </div>
                <Skeleton className="h-10 w-full mb-2 bg-zinc-800" />
                <Skeleton className="h-10 w-3/4 mb-4 bg-zinc-800" />
                <Skeleton className="h-5 w-full mb-2 bg-zinc-800" />
                <Skeleton className="h-5 w-full mb-2 bg-zinc-800" />
                <Skeleton className="h-5 w-2/3 mb-6 bg-zinc-800" />
                <Skeleton className="h-5 w-32 bg-zinc-800" />
              </div>
            </div>
          </div>
        </div>

        {/* Other Posts Grid Skeleton */}
        <div className="relative rounded-2xl border border-white/[0.08] p-3">
          <div className="relative rounded-xl bg-[#0f0f0f] overflow-hidden">
            <div className="p-4 sm:p-6">
              <Skeleton className="h-6 w-36 mb-6 bg-zinc-800" />
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="rounded-xl overflow-hidden bg-[#1a1a1a] border border-white/[0.04]">
                    <Skeleton className="aspect-[16/10] bg-zinc-800" />
                    <div className="p-4 sm:p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <Skeleton className="h-3 w-24 bg-zinc-800" />
                        <Skeleton className="h-3 w-16 bg-zinc-800" />
                      </div>
                      <Skeleton className="h-6 w-full mb-2 bg-zinc-800" />
                      <Skeleton className="h-4 w-full mb-1 bg-zinc-800" />
                      <Skeleton className="h-4 w-3/4 mb-4 bg-zinc-800" />
                      <Skeleton className="h-4 w-24 bg-zinc-800" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
