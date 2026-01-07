import Link from "next/link"
import Image from "next/image"
import { FileText, Calendar, ChevronRight, Newspaper, Clock, User } from "lucide-react"

interface Blog {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content?: string | null
  cover_image: string | null
  published_at: string | null
  created_at?: string
}

const AUTHOR_NAME = "OTTSewa"

function calculateReadingTime(content: string | null | undefined): number {
  if (!content) return 1
  const wordsPerMinute = 200
  const textContent = content.replace(/<[^>]*>/g, "")
  const wordCount = textContent.split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute))
}

export function BlogSection({ blogs }: { blogs: Blog[] }) {
  if (!blogs || blogs.length === 0) {
    return null
  }

  const formatDate = (blog: Blog) => {
    const date = blog.published_at || blog.created_at || new Date().toISOString()
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-8 sm:py-10" aria-labelledby="blog-heading">
      <div className="max-w-7xl mx-auto">
        <div className="relative rounded-2xl border border-white/[0.08] p-3">
          <div className="relative rounded-xl bg-[#0f0f0f] overflow-hidden">
            <div className="relative p-4 sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <Newspaper className="w-4 h-4 text-amber-400" />
                  </div>
                  <h2 id="blog-heading" className="text-lg sm:text-xl font-semibold text-white">
                    Latest from Blog
                  </h2>
                </div>
                <Link
                  href="/blog"
                  className="hidden sm:flex items-center gap-1 text-amber-400 hover:text-amber-300 text-sm transition"
                >
                  View all
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {blogs.map((blog: Blog, index: number) => {
                  const readingTime = calculateReadingTime(blog.content)
                  return (
                    <Link key={blog.id} href={`/blog/${blog.slug}`}>
                      <article className="group h-full">
                        <div className="relative h-full rounded-xl overflow-hidden bg-[#1a1a1a] border border-white/[0.04] hover:border-amber-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/5">
                          <div className="relative aspect-[16/10] bg-zinc-900 overflow-hidden">
                            {blog.cover_image ? (
                              <Image
                                src={blog.cover_image || "/placeholder.svg"}
                                alt={blog.title}
                                fill
                                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                                loading={index === 0 ? "eager" : "lazy"}
                                sizes="(max-width: 768px) 100vw, 33vw"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900">
                                <FileText className="w-10 h-10 text-zinc-600" />
                              </div>
                            )}
                          </div>

                          <div className="p-4">
                            <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 mb-2">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDate(blog)}
                              </span>
                              <span className="text-zinc-600">•</span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {readingTime} min
                              </span>
                              <span className="text-zinc-600">•</span>
                              <span className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                {AUTHOR_NAME}
                              </span>
                            </div>

                            <h3 className="font-semibold text-white line-clamp-2 group-hover:text-amber-400 transition-colors mb-2">
                              {blog.title}
                            </h3>

                            {blog.excerpt && <p className="text-sm text-zinc-400 line-clamp-2">{blog.excerpt}</p>}
                          </div>
                        </div>
                      </article>
                    </Link>
                  )
                })}
              </div>

              <div className="flex justify-center mt-6 sm:hidden">
                <Link
                  href="/blog"
                  className="px-6 py-2.5 bg-amber-500 text-black font-medium rounded-lg hover:bg-amber-400 transition-all text-sm"
                >
                  View all posts
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
