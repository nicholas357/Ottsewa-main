export default function ProductLoading() {
  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Breadcrumb skeleton */}
      <nav className="bg-zinc-900/50 border-b border-zinc-800 sticky top-0 z-40 backdrop-blur-sm">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex items-center gap-2 py-3 sm:py-4">
            <div className="h-4 w-12 bg-zinc-800 rounded animate-pulse" />
            <div className="h-4 w-4 bg-zinc-800 rounded animate-pulse" />
            <div className="h-4 w-20 bg-zinc-800 rounded animate-pulse" />
            <div className="h-4 w-4 bg-zinc-800 rounded animate-pulse" />
            <div className="h-4 w-32 bg-zinc-800 rounded animate-pulse" />
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 xl:gap-12">
          {/* Image skeleton */}
          <div className="space-y-3 sm:space-y-4">
            <div className="aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] rounded-xl sm:rounded-2xl bg-zinc-900 border border-zinc-800 animate-pulse" />
            <div className="flex gap-1.5 sm:gap-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-md sm:rounded-lg bg-zinc-800 animate-pulse"
                />
              ))}
            </div>
          </div>

          {/* Info skeleton */}
          <div className="space-y-4 sm:space-y-6">
            <div>
              <div className="flex gap-2 mb-2">
                <div className="h-5 w-12 bg-zinc-800 rounded animate-pulse" />
                <div className="h-5 w-20 bg-zinc-800 rounded animate-pulse" />
              </div>
              <div className="h-8 sm:h-10 w-3/4 bg-zinc-800 rounded animate-pulse mb-3" />
              <div className="h-4 w-full bg-zinc-800 rounded animate-pulse mb-2" />
              <div className="h-4 w-2/3 bg-zinc-800 rounded animate-pulse mb-4" />
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-4 h-4 bg-zinc-800 rounded animate-pulse" />
                ))}
              </div>
            </div>

            <div className="flex gap-4 py-2 border-y border-zinc-800/50">
              <div className="h-4 w-32 bg-zinc-800 rounded animate-pulse" />
              <div className="h-4 w-32 bg-zinc-800 rounded animate-pulse" />
            </div>

            {/* Price skeleton */}
            <div className="space-y-3">
              <div className="h-10 w-40 bg-zinc-800 rounded animate-pulse" />
              <div className="flex gap-3">
                <div className="h-12 flex-1 bg-zinc-800 rounded-lg animate-pulse" />
                <div className="h-12 w-12 bg-zinc-800 rounded-lg animate-pulse" />
              </div>
            </div>

            {/* Features skeleton */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-4 border-t border-zinc-800">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex flex-col items-center p-2 sm:p-3 bg-zinc-900/50 rounded-lg">
                  <div className="w-5 h-5 bg-zinc-800 rounded animate-pulse mb-1" />
                  <div className="h-3 w-16 bg-zinc-800 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
