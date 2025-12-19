export default function Loading() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header Skeleton */}
        <div className="mb-6">
          <div className="h-8 w-48 bg-zinc-800 rounded-lg animate-pulse mb-4 sm:mb-6" />

          {/* Search Bar Skeleton */}
          <div className="flex gap-2 sm:gap-3 mb-4">
            <div className="flex-1 h-12 sm:h-14 bg-zinc-900 border border-zinc-800 rounded-xl animate-pulse" />
            <div className="w-12 sm:w-24 h-12 sm:h-14 bg-zinc-900 border border-zinc-800 rounded-xl animate-pulse" />
          </div>

          {/* Results Count Skeleton */}
          <div className="h-4 w-24 bg-zinc-800 rounded animate-pulse" />
        </div>

        {/* Results Grid Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
              <div className="aspect-[3/4] bg-zinc-800 animate-pulse" />
              <div className="p-2.5 sm:p-3 space-y-2">
                <div className="h-4 bg-zinc-800 rounded animate-pulse" />
                <div className="h-3 w-16 bg-zinc-800 rounded animate-pulse" />
                <div className="h-5 w-24 bg-zinc-800 rounded animate-pulse" />
                <div className="h-8 bg-zinc-800 rounded-lg animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
