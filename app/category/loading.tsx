export default function CategoryLoading() {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-white/[0.01] rounded-full blur-3xl" />

      {/* Breadcrumb skeleton */}
      <div className="border-b border-white/[0.06] bg-zinc-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-zinc-800 rounded animate-pulse" />
            <div className="w-4 h-4 bg-zinc-800 rounded animate-pulse" />
            <div className="w-20 h-4 bg-zinc-800 rounded animate-pulse" />
          </div>
        </div>
      </div>

      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 relative z-10">
        <div className="text-center mb-12">
          <div className="h-10 w-72 bg-zinc-800 rounded-lg mx-auto mb-3 animate-pulse" />
          <div className="h-5 w-96 max-w-full bg-zinc-800 rounded mx-auto animate-pulse" />
        </div>

        {/* Categories Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="bg-zinc-900/80 border border-white/[0.06] rounded-xl p-5 h-40">
              <div className="w-12 h-12 bg-zinc-800 rounded-xl mb-4 animate-pulse" />
              <div className="h-5 w-28 bg-zinc-800 rounded mb-2 animate-pulse" />
              <div className="h-4 w-44 bg-zinc-800 rounded mb-3 animate-pulse" />
              <div className="flex items-center justify-between">
                <div className="h-4 w-20 bg-zinc-800 rounded animate-pulse" />
                <div className="w-4 h-4 bg-zinc-800 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
