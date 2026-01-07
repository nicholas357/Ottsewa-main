"use client"

import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import Link from "next/link"
import Image from "next/image"
import { FileText, Calendar, ArrowRight, Newspaper, ChevronRight, Clock, User, Home } from "lucide-react"

interface Blog {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string | null
  cover_image: string | null
  published_at: string | null
  created_at: string
}

const AUTHOR_NAME = "OTTSewa"

function calculateReadingTime(content: string | null): number {
  if (!content) return 1
  const wordsPerMinute = 200
  const textContent = content.replace(/<[^>]*>/g, "")
  const wordCount = textContent.split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute))
}

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    window.scrollTo(0, 0)

    async function fetchBlogs() {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        if (!supabaseUrl || !supabaseKey) {
          console.warn("[Blog] Missing Supabase env vars")
          setLoading(false)
          return
        }

        const supabase = createClient(supabaseUrl, supabaseKey)

        const { data, error } = await supabase
          .from("blogs")
          .select(`
            id,
            title,
            slug,
            excerpt,
            content,
            cover_image,
            published_at,
            created_at
          `)
          .eq("is_published", true)
          .order("created_at", { ascending: false })

        if (error) {
          console.error("[Blog] Error fetching blogs:", error.message)
          setBlogs([])
        } else {
          setBlogs((data as Blog[]) || [])
        }
      } catch (error) {
        console.error("[Blog] Error in fetchBlogs:", error)
        setBlogs([])
      } finally {
        setLoading(false)
      }
    }

    fetchBlogs()
  }, [])

  const formatDate = (blog: Blog) => {
    const date = blog.published_at || blog.created_at
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const featuredPost = blogs[0]
  const otherPosts = blogs.slice(1)

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent">
        <nav className="bg-[#0f0f0f]/50 backdrop-blur-sm border-b border-white/[0.06] sticky top-0 z-40">
          <div className="container mx-auto px-3 sm:px-4 lg:px-6">
            <div className="flex items-center gap-2 py-3 sm:py-4">
              <div className="h-4 w-16 bg-zinc-800 rounded animate-pulse" />
              <div className="h-4 w-4 bg-zinc-800 rounded animate-pulse" />
              <div className="h-4 w-12 bg-zinc-800 rounded animate-pulse" />
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8">
          <div className="mb-6 sm:mb-8">
            <div className="h-10 w-48 bg-zinc-800 rounded animate-pulse mb-2" />
            <div className="h-5 w-96 bg-zinc-800 rounded animate-pulse" />
          </div>

          <div className="rounded-2xl border border-white/[0.08] p-3 mb-6">
            <div className="rounded-xl bg-[#0f0f0f] overflow-hidden">
              <div className="grid lg:grid-cols-2 gap-0">
                <div className="aspect-video lg:aspect-auto lg:min-h-[400px] bg-zinc-800 animate-pulse" />
                <div className="p-6 sm:p-8 lg:p-10 space-y-4">
                  <div className="h-4 w-48 bg-zinc-800 rounded animate-pulse" />
                  <div className="h-8 w-full bg-zinc-800 rounded animate-pulse" />
                  <div className="h-4 w-full bg-zinc-800 rounded animate-pulse" />
                  <div className="h-4 w-3/4 bg-zinc-800 rounded animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/[0.08] p-3">
            <div className="rounded-xl bg-[#0f0f0f] p-4 sm:p-5">
              <div className="h-6 w-32 bg-zinc-800 rounded animate-pulse mb-6" />
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="rounded-xl bg-[#1a1a1a] overflow-hidden">
                    <div className="aspect-[16/10] bg-zinc-800 animate-pulse" />
                    <div className="p-4 space-y-3">
                      <div className="h-3 w-24 bg-zinc-800 rounded animate-pulse" />
                      <div className="h-5 w-full bg-zinc-800 rounded animate-pulse" />
                      <div className="h-4 w-full bg-zinc-800 rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-transparent">
      <nav className="bg-[#0f0f0f]/50 backdrop-blur-sm border-b border-white/[0.06] sticky top-0 z-40">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6">
          <ol className="flex items-center gap-1 sm:gap-2 py-3 sm:py-4 text-xs sm:text-sm">
            <li className="flex items-center">
              <Link
                href="/"
                className="flex items-center gap-1 text-zinc-500 hover:text-amber-400 transition-colors cursor-pointer"
              >
                <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Home</span>
              </Link>
            </li>
            <li className="flex items-center">
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-zinc-700 mx-1" />
            </li>
            <li className="flex items-center">
              <span className="text-amber-400 font-medium">Blog</span>
            </li>
          </ol>
        </div>
      </nav>

      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <Newspaper className="w-5 h-5 text-amber-400" />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">Blog</h1>
          </div>
          <p className="text-zinc-500 text-sm sm:text-base max-w-3xl">
            Latest news, guides, and tips about streaming subscriptions, gift cards, and digital products in Nepal.
          </p>
          <p className="text-zinc-600 text-sm mt-2">
            {blogs.length} {blogs.length === 1 ? "article" : "articles"} published
          </p>
        </div>

        {blogs && blogs.length > 0 ? (
          <>
            {featuredPost && (
              <div className="rounded-2xl border border-white/[0.08] p-3 mb-6">
                <div className="rounded-xl bg-[#0f0f0f] overflow-hidden">
                  <Link href={`/blog/${featuredPost.slug}`} className="group block">
                    <div className="grid lg:grid-cols-2 gap-0">
                      <div className="relative aspect-video lg:aspect-auto lg:min-h-[400px] bg-zinc-900 overflow-hidden">
                        {featuredPost.cover_image ? (
                          <Image
                            src={featuredPost.cover_image || "/placeholder.svg"}
                            alt={featuredPost.title}
                            fill
                            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                            priority
                            sizes="(max-width: 1024px) 100vw, 50vw"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900">
                            <FileText className="w-16 h-16 text-zinc-600" />
                          </div>
                        )}
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 bg-amber-500 text-black text-xs font-bold rounded-full">
                            Featured
                          </span>
                        </div>
                      </div>

                      <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
                        <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-500 mb-4">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            {formatDate(featuredPost)}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            {calculateReadingTime(featuredPost.content)} min read
                          </span>
                          <span className="flex items-center gap-1.5">
                            <User className="w-4 h-4" />
                            {AUTHOR_NAME}
                          </span>
                        </div>

                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 group-hover:text-amber-400 transition-colors">
                          {featuredPost.title}
                        </h2>

                        {featuredPost.excerpt && (
                          <p className="text-zinc-400 text-base sm:text-lg mb-6 line-clamp-3">{featuredPost.excerpt}</p>
                        )}

                        <span className="inline-flex items-center gap-2 text-amber-500 font-semibold group-hover:gap-3 transition-all">
                          Read Article
                          <ArrowRight className="w-5 h-5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            )}

            {otherPosts.length > 0 && (
              <div className="rounded-2xl border border-white/[0.08] p-3">
                <div className="rounded-xl bg-[#0f0f0f] p-4 sm:p-5">
                  <h2 className="text-lg sm:text-xl font-bold text-white mb-6">More Articles</h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {otherPosts.map((blog: Blog) => (
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
                                  loading="lazy"
                                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900">
                                  <FileText className="w-12 h-12 text-zinc-600" />
                                </div>
                              )}
                            </div>

                            <div className="p-4 sm:p-5">
                              <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 mb-3">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3.5 h-3.5" />
                                  {formatDate(blog)}
                                </span>
                                <span className="text-zinc-600">•</span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5" />
                                  {calculateReadingTime(blog.content)} min
                                </span>
                                <span className="text-zinc-600">•</span>
                                <span className="flex items-center gap-1">
                                  <User className="w-3.5 h-3.5" />
                                  {AUTHOR_NAME}
                                </span>
                              </div>

                              <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 group-hover:text-amber-400 transition-colors">
                                {blog.title}
                              </h3>

                              {blog.excerpt && (
                                <p className="text-sm text-zinc-400 line-clamp-2 mb-4">{blog.excerpt}</p>
                              )}

                              <span className="inline-flex items-center gap-1 text-sm text-amber-500 font-medium group-hover:gap-2 transition-all">
                                Read More
                                <ArrowRight className="w-4 h-4" />
                              </span>
                            </div>
                          </div>
                        </article>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="rounded-2xl border border-white/[0.08] p-3">
            <div className="rounded-xl bg-[#0f0f0f] p-8 text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-[#1a1a1a] rounded-full flex items-center justify-center">
                <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-zinc-600" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">No blog posts yet</h2>
              <p className="text-zinc-500 text-sm sm:text-base mb-6 max-w-md mx-auto">
                We're working on some great content. Check back soon for the latest news, guides, and tips!
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Browse Products
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {blogs.length > 0 && (
          <div className="mt-8 sm:mt-12 rounded-2xl border border-white/[0.08] p-3">
            <div className="rounded-xl bg-[#0f0f0f] p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-white mb-3">
                OTTSewa Blog - Your Guide to Digital Entertainment
              </h2>
              <div className="prose prose-invert prose-sm max-w-none text-zinc-500">
                <p>
                  Welcome to the OTTSewa blog! Here you'll find the latest news, guides, and tips about streaming
                  subscriptions, gift cards, and digital products in Nepal. Stay updated with our {blogs.length}{" "}
                  articles covering everything from Netflix and Spotify to gaming subscriptions and more.
                </p>
                <p className="mt-3">
                  Our team regularly publishes helpful content to help you make the most of your digital entertainment.
                  Whether you're looking for setup guides, comparison articles, or the latest deals, we've got you
                  covered!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
