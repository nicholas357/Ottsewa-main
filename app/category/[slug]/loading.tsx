export default function CategoryLoading() {
  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Breadcrumbs Skeleton */}
      <nav className="bg-zinc-900/50 border-b border-zinc-800">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex items-center gap-2 py-3 sm:py-4">
            <div className="h-4 w-16 bg-zinc-800 rounded animate-pulse" />
            <div className="h-4 w-4 bg-zinc-800 rounded animate-pulse" />
            <div className="h-4 w-24 bg-zinc-800 rounded animate-pulse" />
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8">
        {/* Header Skeleton */}
        <div className="mb-6 sm:mb-8">
          <div className="h-8 sm:h-10 w-48 bg-zinc-800 rounded animate-pulse mb-2" />
          <div className="h-4 w-96 max-w-full bg-zinc-800 rounded animate-pulse mb-2" />
          <div className="h-4 w-32 bg-zinc-800 rounded animate-pulse" />
        </div>

        {/* Products Grid Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
              <div className="aspect-[4/3] bg-zinc-800 animate-pulse" />
              <div className="p-3 sm:p-4 space-y-2">
                <div className="h-4 w-full bg-zinc-800 rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-zinc-800 rounded animate-pulse" />
                <div className="h-4 w-1/2 bg-zinc-800 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
