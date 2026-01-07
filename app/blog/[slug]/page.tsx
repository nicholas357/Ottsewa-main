import { createClient } from "@supabase/supabase-js"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  Calendar,
  ArrowLeft,
  User,
  ShoppingCart,
  ChevronRight,
  Clock,
  Tag,
  Home,
  HelpCircle,
  ChevronDown,
} from "lucide-react"
import type { Metadata } from "next"

interface FAQ {
  question: string
  answer: string
}

interface BlogProduct {
  display_order: number
  product: {
    id: string
    title: string
    slug: string
    image_url: string | null
    base_price: number
    original_price: number | null
    discount_percent: number
  }
}

interface Blog {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  cover_image: string | null
  meta_title: string | null
  meta_description: string | null
  published_at: string
  created_at: string
  updated_at: string
  author: { full_name: string; email: string } | null
  blog_products: BlogProduct[]
  faqs: FAQ[] | null
}

export const revalidate = 60

function calculateReadingTime(content: string | null): number {
  if (!content) return 1
  const wordsPerMinute = 200
  const textContent = content.replace(/<[^>]*>/g, "")
  const wordCount = textContent.split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute))
}

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseKey) return null
  return createClient(supabaseUrl, supabaseKey)
}

export async function generateStaticParams() {
  try {
    const supabase = getSupabaseClient()
    if (!supabase) return []

    const { data: blogs, error } = await supabase.from("blogs").select("slug").eq("is_published", true).limit(50)

    if (error) {
      console.error("Error generating static params for blogs:", error)
      return []
    }
    return blogs?.map((blog) => ({ slug: blog.slug })) || []
  } catch (error) {
    console.error("Error in generateStaticParams:", error)
    return []
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  try {
    const { slug } = await params
    const supabase = getSupabaseClient()
    if (!supabase) return { title: "Blog - OTTSewa" }

    const { data: blog, error } = await supabase
      .from("blogs")
      .select("title, excerpt, meta_title, meta_description, cover_image")
      .eq("slug", slug)
      .eq("is_published", true)
      .single()

    if (error || !blog) {
      return { title: "Blog Not Found - OTTSewa" }
    }

    const title = blog.meta_title || `${blog.title} - OTTSewa Blog`
    const description = blog.meta_description || blog.excerpt || ""

    return {
      title,
      description,
      openGraph: {
        title: blog.title,
        description,
        type: "article",
        images: blog.cover_image ? [blog.cover_image] : [],
        siteName: "OTTSewa",
        url: `https://www.ottsewa.store/blog/${slug}`,
      },
      twitter: {
        card: "summary_large_image",
        title: blog.title,
        description,
        images: blog.cover_image ? [blog.cover_image] : [],
      },
      alternates: {
        canonical: `https://www.ottsewa.store/blog/${slug}`,
      },
    }
  } catch (error) {
    console.error("Error generating metadata:", error)
    return { title: "Blog - OTTSewa" }
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  let blog: Blog | null = null

  try {
    const supabase = getSupabaseClient()
    if (!supabase) {
      notFound()
    }

    const { data, error } = await supabase
      .from("blogs")
      .select(
        `
        id,
        title,
        slug,
        excerpt,
        content,
        cover_image,
        meta_title,
        meta_description,
        published_at,
        created_at,
        updated_at,
        faqs,
        author:profiles(full_name, email),
        blog_products(
          display_order,
          product:products(id, title, slug, image_url, base_price, original_price, discount_percent)
        )
      `,
      )
      .eq("slug", slug)
      .eq("is_published", true)
      .single()

    if (error) {
      console.error("Error fetching blog:", error.message)
    }
    blog = data as Blog | null
  } catch (error) {
    console.error("Error in BlogPostPage:", error)
  }

  if (!blog) {
    notFound()
  }

  const formatDate = (date: string | null) => {
    if (!date) return ""
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatPrice = (price: number) => {
    return `NPR ${price.toLocaleString()}`
  }

  const relatedProducts =
    blog.blog_products
      ?.sort((a, b) => a.display_order - b.display_order)
      .map((bp) => bp.product)
      .filter(Boolean) || []

  const readingTime = calculateReadingTime(blog.content)
  const validFaqs = blog.faqs?.filter((f) => f.question && f.answer) || []

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: blog.excerpt || blog.meta_description,
    image: blog.cover_image,
    datePublished: blog.published_at || blog.created_at,
    dateModified: blog.updated_at,
    author: {
      "@type": "Person",
      name: blog.author?.full_name || "OTTSewa Team",
    },
    publisher: {
      "@type": "Organization",
      name: "OTTSewa",
      url: "https://www.ottsewa.store",
      logo: {
        "@type": "ImageObject",
        url: "https://www.ottsewa.store/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://www.ottsewa.store/blog/${blog.slug}`,
    },
    wordCount: blog.content?.split(/\s+/).length || 0,
    articleBody: blog.content?.replace(/<[^>]*>/g, "").substring(0, 500),
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.ottsewa.store",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: "https://www.ottsewa.store/blog",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: blog.title,
        item: `https://www.ottsewa.store/blog/${blog.slug}`,
      },
    ],
  }

  const faqJsonLd =
    validFaqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: validFaqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        }
      : null

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        suppressHydrationWarning
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        suppressHydrationWarning
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
          suppressHydrationWarning
        />
      )}

      <div className="min-h-screen bg-transparent">
        {/* Breadcrumb */}
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
                <Link href="/blog" className="text-zinc-500 hover:text-amber-400 transition-colors cursor-pointer">
                  Blog
                </Link>
              </li>
              <li className="flex items-center">
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-zinc-700 mx-1" />
              </li>
              <li className="flex items-center">
                <span className="text-amber-400 font-medium truncate max-w-[150px] sm:max-w-[250px]">{blog.title}</span>
              </li>
            </ol>
          </div>
        </nav>

        <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8">
          <div className="max-w-4xl mx-auto">
            {/* Double-box design wrapper */}
            <article className="relative rounded-2xl border border-white/[0.08] p-3">
              <div className="relative rounded-xl bg-[#0f0f0f] overflow-hidden">
                {/* Cover Image */}
                {blog.cover_image && (
                  <div className="relative aspect-video bg-zinc-800">
                    <Image
                      src={blog.cover_image || "/placeholder.svg"}
                      alt={blog.title}
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 896px) 100vw, 896px"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="p-4 sm:p-6 lg:p-8">
                  {/* Meta */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500 mb-4">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      {formatDate(blog.published_at || blog.created_at)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      {readingTime} min read
                    </span>
                    {blog.author && (
                      <span className="flex items-center gap-1.5">
                        <User className="w-4 h-4" />
                        {blog.author.full_name || "OTTSewa Team"}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 text-balance">
                    {blog.title}
                  </h1>

                  {/* Excerpt */}
                  {blog.excerpt && (
                    <p className="text-base sm:text-lg text-zinc-400 mb-6 pb-6 border-b border-white/[0.08]">
                      {blog.excerpt}
                    </p>
                  )}

                  {/* Content */}
                  <div
                    className="prose prose-invert prose-zinc max-w-none
                      prose-headings:text-white prose-h1:text-2xl prose-h1:font-bold prose-h1:mb-4 prose-h1:mt-8
                      prose-h2:text-xl prose-h2:font-semibold prose-h2:mb-3 prose-h2:mt-6
                      prose-h3:text-lg prose-h3:font-semibold prose-h3:mb-2 prose-h3:mt-4
                      prose-p:text-zinc-300 prose-p:leading-relaxed prose-p:mb-4
                      prose-strong:text-white prose-em:text-zinc-300
                      prose-ul:text-zinc-300 prose-ol:text-zinc-300
                      prose-li:marker:text-amber-500
                      prose-blockquote:border-l-amber-500 prose-blockquote:text-zinc-400 prose-blockquote:bg-zinc-800/30 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg
                      prose-code:text-amber-400 prose-code:bg-zinc-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
                      prose-pre:bg-zinc-800 prose-pre:border prose-pre:border-zinc-700
                      prose-hr:border-zinc-700
                      prose-a:text-amber-400 prose-a:no-underline hover:prose-a:underline
                      prose-img:rounded-xl prose-img:border prose-img:border-white/[0.08]
                      [&_.price-table]:my-6 [&_.price-table_table]:w-full [&_.price-table_table]:border-collapse
                      [&_.price-table_th]:bg-zinc-800 [&_.price-table_th]:text-white [&_.price-table_th]:font-semibold
                      [&_.price-table_th]:px-4 [&_.price-table_th]:py-3 [&_.price-table_th]:text-left [&_.price-table_th]:border-b [&_.price-table_th]:border-zinc-700
                      [&_.price-table_td]:px-4 [&_.price-table_td]:py-3 [&_.price-table_td]:text-zinc-300 [&_.price-table_td]:border-b [&_.price-table_td]:border-zinc-800
                      [&_.price-table_tr:hover_td]:bg-zinc-800/50"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                  />

                  {validFaqs.length > 0 && (
                    <div className="mt-10 pt-8 border-t border-white/[0.08]">
                      <div className="flex items-center gap-2 mb-6">
                        <HelpCircle className="w-5 h-5 text-amber-400" />
                        <h2 className="text-xl font-bold text-white">Frequently Asked Questions</h2>
                      </div>
                      <div className="space-y-4">
                        {validFaqs.map((faq, index) => (
                          <details
                            key={index}
                            className="group bg-[#1a1a1a] rounded-xl border border-white/[0.04] overflow-hidden"
                          >
                            <summary className="flex items-center justify-between p-4 cursor-pointer list-none hover:bg-white/[0.02] transition-colors">
                              <span className="font-medium text-white pr-4">{faq.question}</span>
                              <ChevronDown className="w-5 h-5 text-zinc-500 transition-transform group-open:rotate-180 shrink-0" />
                            </summary>
                            <div className="px-4 pb-4 pt-0">
                              <p className="text-zinc-400 leading-relaxed">{faq.answer}</p>
                            </div>
                          </details>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Related Products */}
                  {relatedProducts.length > 0 && (
                    <div className="mt-10 pt-8 border-t border-white/[0.08]">
                      <div className="flex items-center gap-2 mb-6">
                        <Tag className="w-5 h-5 text-amber-400" />
                        <h2 className="text-xl font-bold text-white">Related Products</h2>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {relatedProducts.map((product) => (
                          <Link
                            key={product.id}
                            href={`/product/${product.slug}`}
                            className="group flex items-center gap-4 p-4 bg-[#1a1a1a] rounded-xl border border-white/[0.04] hover:border-amber-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/5"
                          >
                            <div className="relative w-16 h-16 bg-zinc-800 rounded-lg overflow-hidden shrink-0">
                              {product.image_url && (
                                <Image
                                  src={product.image_url || "/placeholder.svg"}
                                  alt={product.title}
                                  fill
                                  className="object-cover"
                                  loading="lazy"
                                />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-white truncate group-hover:text-amber-400 transition-colors">
                                {product.title}
                              </h3>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-amber-500 font-semibold">{formatPrice(product.base_price)}</span>
                                {product.original_price && product.original_price > product.base_price && (
                                  <span className="text-xs text-zinc-500 line-through">
                                    {formatPrice(product.original_price)}
                                  </span>
                                )}
                              </div>
                            </div>
                            <ShoppingCart className="w-5 h-5 text-zinc-500 group-hover:text-amber-500 transition-colors shrink-0" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Back to Blog */}
                  <div className="mt-10 pt-6 border-t border-white/[0.08]">
                    <Link
                      href="/blog"
                      className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-amber-400 transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back to Blog
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </>
  )
}
