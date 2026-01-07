import { Skeleton } from "@/components/ui/skeleton"
import { ChevronRight } from "lucide-react"

export default function BlogPostLoading() {
  return (
    <main className="min-h-screen bg-zinc-950 py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-zinc-500 mb-6">
          <span className="text-zinc-500">Home</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-zinc-500">Blog</span>
          <ChevronRight className="w-4 h-4" />
          <Skeleton className="h-4 w-32 bg-zinc-800" />
        </nav>

        {/* Article */}
        <article className="relative rounded-2xl border border-white/[0.08] p-3">
          <div className="relative rounded-xl bg-[#0f0f0f] overflow-hidden">
            {/* Cover Image */}
            <Skeleton className="aspect-video bg-zinc-800" />

            {/* Content */}
            <div className="p-4 sm:p-6 lg:p-8">
              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <Skeleton className="h-4 w-32 bg-zinc-800" />
                <Skeleton className="h-4 w-24 bg-zinc-800" />
              </div>

              {/* Title */}
              <Skeleton className="h-10 w-full mb-2 bg-zinc-800" />
              <Skeleton className="h-10 w-3/4 mb-4 bg-zinc-800" />

              {/* Excerpt */}
              <Skeleton className="h-5 w-full mb-2 bg-zinc-800" />
              <Skeleton className="h-5 w-4/5 mb-6 bg-zinc-800" />

              <div className="border-t border-white/[0.08] pt-6">
                {/* Content paragraphs */}
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full bg-zinc-800" />
                  <Skeleton className="h-4 w-full bg-zinc-800" />
                  <Skeleton className="h-4 w-5/6 bg-zinc-800" />
                  <Skeleton className="h-4 w-full bg-zinc-800" />
                  <Skeleton className="h-4 w-4/5 bg-zinc-800" />
                </div>

                <Skeleton className="h-6 w-48 mt-8 mb-4 bg-zinc-800" />

                <div className="space-y-4">
                  <Skeleton className="h-4 w-full bg-zinc-800" />
                  <Skeleton className="h-4 w-full bg-zinc-800" />
                  <Skeleton className="h-4 w-3/4 bg-zinc-800" />
                </div>
              </div>

              {/* Related Products */}
              <div className="mt-10 pt-8 border-t border-white/[0.08]">
                <Skeleton className="h-6 w-40 mb-6 bg-zinc-800" />
                <div className="grid sm:grid-cols-2 gap-4">
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 p-4 bg-[#1a1a1a] rounded-xl border border-white/[0.04]"
                    >
                      <Skeleton className="w-16 h-16 rounded-lg bg-zinc-800 shrink-0" />
                      <div className="flex-1">
                        <Skeleton className="h-5 w-full mb-2 bg-zinc-800" />
                        <Skeleton className="h-4 w-24 bg-zinc-800" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Back to Blog */}
              <div className="mt-10 pt-6 border-t border-white/[0.08]">
                <Skeleton className="h-4 w-28 bg-zinc-800" />
              </div>
            </div>
          </div>
        </article>
      </div>
    </main>
  )
}
