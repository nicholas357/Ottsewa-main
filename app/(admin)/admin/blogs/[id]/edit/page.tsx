"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Home, Loader2, Save, ArrowLeft, ImageIcon, X, Search, Package, Plus, Trash2, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { RichTextEditor } from "@/components/admin/rich-text-editor"

interface Product {
  id: string
  title: string
  slug: string
  image_url: string | null
  base_price: number
}

interface FAQ {
  question: string
  answer: string
}

export default function EditBlogPage() {
  const params = useParams()
  const blogId = params.id as string

  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [uploading, setUploading] = useState(false)

  // Form state
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [content, setContent] = useState("")
  const [coverImage, setCoverImage] = useState("")
  const [metaTitle, setMetaTitle] = useState("")
  const [metaDescription, setMetaDescription] = useState("")
  const [isPublished, setIsPublished] = useState(false)

  // Product selection
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([])
  const [productSearch, setProductSearch] = useState("")
  const [showProductSearch, setShowProductSearch] = useState(false)

  const [faqs, setFaqs] = useState<FAQ[]>([])

  const router = useRouter()
  const supabase = createClient()
  const { toast } = useToast()

  useEffect(() => {
    const checkAdmin = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/login")
        return
      }

      const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

      if (profile?.role !== "admin") {
        router.push("/dashboard")
        return
      }

      setIsAdmin(true)
    }

    checkAdmin()
  }, [router, supabase])

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch blog
        const blogRes = await fetch(`/api/admin/blogs/${blogId}`)
        const blogData = await blogRes.json()

        if (blogRes.ok && blogData.blog) {
          const blog = blogData.blog
          setTitle(blog.title)
          setSlug(blog.slug)
          setExcerpt(blog.excerpt || "")
          setContent(blog.content || "")
          setCoverImage(blog.cover_image || "")
          setMetaTitle(blog.meta_title || "")
          setMetaDescription(blog.meta_description || "")
          setIsPublished(blog.is_published)
          setFaqs(blog.faqs || [])

          // Set selected products
          if (blog.blog_products?.length > 0) {
            const prods = blog.blog_products
              .sort((a: { display_order: number }, b: { display_order: number }) => a.display_order - b.display_order)
              .map((bp: { product: Product }) => bp.product)
              .filter(Boolean)
            setSelectedProducts(prods)
          }
        }

        // Fetch all products
        const { data: productsData } = await supabase
          .from("products")
          .select("id, title, slug, image_url, base_price")
          .eq("is_active", true)
          .order("title")

        if (productsData) setProducts(productsData)
      } catch {
        toast({ title: "Error", description: "Failed to fetch blog", variant: "destructive" })
      } finally {
        setFetching(false)
      }
    }

    if (isAdmin && blogId) fetchData()
  }, [isAdmin, blogId, supabase, toast])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("type", "blog")

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()
      if (res.ok && data.url) {
        setCoverImage(data.url)
        toast({ title: "Success", description: "Image uploaded successfully" })
      } else {
        throw new Error(data.error)
      }
    } catch {
      toast({ title: "Error", description: "Failed to upload image", variant: "destructive" })
    } finally {
      setUploading(false)
    }
  }

  const addFaq = () => {
    setFaqs([...faqs, { question: "", answer: "" }])
  }

  const updateFaq = (index: number, field: "question" | "answer", value: string) => {
    const updated = [...faqs]
    updated[index][field] = value
    setFaqs(updated)
  }

  const removeFaq = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !slug || !content) {
      toast({ title: "Error", description: "Title, slug, and content are required", variant: "destructive" })
      return
    }

    setLoading(true)
    try {
      const validFaqs = faqs.filter((f) => f.question.trim() && f.answer.trim())

      const res = await fetch(`/api/admin/blogs/${blogId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          excerpt,
          content,
          cover_image: coverImage,
          meta_title: metaTitle || title,
          meta_description: metaDescription || excerpt,
          is_published: isPublished,
          product_ids: selectedProducts.map((p) => p.id),
          faqs: validFaqs,
        }),
      })

      const data = await res.json()
      if (res.ok) {
        toast({ title: "Success", description: "Blog post updated successfully" })
        router.push("/admin/blogs")
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update blog",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(
    (p) =>
      p.title.toLowerCase().includes(productSearch.toLowerCase()) && !selectedProducts.find((sp) => sp.id === p.id),
  )

  if (!isAdmin || fetching) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 p-4 lg:p-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-zinc-500 mb-6">
        <Link href="/admin" className="hover:text-white transition-colors flex items-center gap-1">
          <Home className="w-4 h-4" />
          Admin
        </Link>
        <span>/</span>
        <Link href="/admin/blogs" className="hover:text-white transition-colors">
          Blogs
        </Link>
        <span>/</span>
        <span className="text-white">Edit</span>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Double Box Container */}
        <div className="relative">
          <div className="absolute inset-0 bg-amber-500/20 rounded-2xl translate-x-2 translate-y-2" />
          <div className="relative bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
            {/* Header */}
            <div className="p-4 lg:p-6 border-b border-zinc-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Link href="/admin/blogs">
                    <Button type="button" variant="ghost" size="icon">
                      <ArrowLeft className="w-5 h-5" />
                    </Button>
                  </Link>
                  <h1 className="text-xl lg:text-2xl font-bold text-white">Edit Blog Post</h1>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Switch checked={isPublished} onCheckedChange={setIsPublished} />
                    <Label className="text-sm text-zinc-400">{isPublished ? "Published" : "Draft"}</Label>
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-amber-500 hover:bg-amber-600 text-black font-semibold"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    Save
                  </Button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 lg:p-6 grid lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                <div className="space-y-2">
                  <Label className="text-white">Title *</Label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter blog title"
                    className="bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Slug *</Label>
                  <Input
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="blog-post-url"
                    className="bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Excerpt</Label>
                  <Textarea
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="Brief description of the post"
                    rows={3}
                    className="bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Content *</Label>
                  <RichTextEditor value={content} onChange={setContent} />
                </div>

                <div className="space-y-4 pt-4 border-t border-zinc-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <HelpCircle className="w-5 h-5 text-amber-500" />
                      <Label className="text-white text-lg font-semibold">FAQs</Label>
                    </div>
                    <Button
                      type="button"
                      onClick={addFaq}
                      variant="outline"
                      size="sm"
                      className="border-zinc-700 bg-transparent"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add FAQ
                    </Button>
                  </div>
                  <p className="text-sm text-zinc-500">
                    Add frequently asked questions related to this blog post for better SEO.
                  </p>

                  {faqs.length === 0 ? (
                    <div className="text-center py-8 bg-zinc-800/50 rounded-lg border border-zinc-700 border-dashed">
                      <HelpCircle className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                      <p className="text-zinc-500 text-sm">No FAQs added yet</p>
                      <Button
                        type="button"
                        onClick={addFaq}
                        variant="ghost"
                        size="sm"
                        className="mt-2 text-amber-500 hover:text-amber-400"
                      >
                        Add your first FAQ
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {faqs.map((faq, index) => (
                        <div key={index} className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700 space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-amber-500 font-medium text-sm">FAQ #{index + 1}</span>
                            <Button
                              type="button"
                              onClick={() => removeFaq(index)}
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-red-500 hover:text-red-400 hover:bg-red-500/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-zinc-400 text-sm">Question</Label>
                            <Input
                              value={faq.question}
                              onChange={(e) => updateFaq(index, "question", e.target.value)}
                              placeholder="Enter the question"
                              className="bg-zinc-900 border-zinc-700 text-white"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-zinc-400 text-sm">Answer</Label>
                            <Textarea
                              value={faq.answer}
                              onChange={(e) => updateFaq(index, "answer", e.target.value)}
                              placeholder="Enter the answer"
                              rows={3}
                              className="bg-zinc-900 border-zinc-700 text-white"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Cover Image */}
                <div className="space-y-2">
                  <Label className="text-white">Cover Image</Label>
                  <div className="relative aspect-video bg-zinc-800 rounded-lg overflow-hidden border border-zinc-700">
                    {coverImage ? (
                      <>
                        <Image src={coverImage || "/placeholder.svg"} alt="Cover" fill className="object-cover" />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => setCoverImage("")}
                          className="absolute top-2 right-2 bg-black/50 hover:bg-black/70"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer hover:bg-zinc-700/50 transition-colors">
                        {uploading ? (
                          <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
                        ) : (
                          <>
                            <ImageIcon className="w-8 h-8 text-zinc-500 mb-2" />
                            <span className="text-sm text-zinc-500">Upload Image</span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          disabled={uploading}
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Related Products */}
                <div className="space-y-2">
                  <Label className="text-white">Related Products</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <Input
                      value={productSearch}
                      onChange={(e) => {
                        setProductSearch(e.target.value)
                        setShowProductSearch(true)
                      }}
                      onFocus={() => setShowProductSearch(true)}
                      placeholder="Search products..."
                      className="pl-10 bg-zinc-800 border-zinc-700 text-white"
                    />
                    {showProductSearch && productSearch && filteredProducts.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg max-h-48 overflow-auto">
                        {filteredProducts.slice(0, 5).map((product) => (
                          <button
                            key={product.id}
                            type="button"
                            onClick={() => {
                              setSelectedProducts([...selectedProducts, product])
                              setProductSearch("")
                              setShowProductSearch(false)
                            }}
                            className="w-full flex items-center gap-3 p-2 hover:bg-zinc-700 transition-colors text-left"
                          >
                            <div className="w-10 h-10 bg-zinc-700 rounded overflow-hidden shrink-0">
                              {product.image_url && (
                                <Image
                                  src={product.image_url || "/placeholder.svg"}
                                  alt={product.title}
                                  width={40}
                                  height={40}
                                  className="object-cover w-full h-full"
                                />
                              )}
                            </div>
                            <span className="text-sm text-white truncate">{product.title}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Selected Products */}
                  {selectedProducts.length > 0 && (
                    <div className="space-y-2 mt-3">
                      {selectedProducts.map((product) => (
                        <div key={product.id} className="flex items-center gap-3 p-2 bg-zinc-800 rounded-lg">
                          <div className="w-10 h-10 bg-zinc-700 rounded overflow-hidden shrink-0">
                            {product.image_url ? (
                              <Image
                                src={product.image_url || "/placeholder.svg"}
                                alt={product.title}
                                width={40}
                                height={40}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <Package className="w-full h-full p-2 text-zinc-500" />
                            )}
                          </div>
                          <span className="text-sm text-white truncate flex-1">{product.title}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedProducts(selectedProducts.filter((p) => p.id !== product.id))}
                            className="shrink-0 h-8 w-8"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* SEO */}
                <div className="space-y-4 pt-4 border-t border-zinc-800">
                  <h3 className="font-semibold text-white">SEO Settings</h3>
                  <div className="space-y-2">
                    <Label className="text-zinc-400">Meta Title</Label>
                    <Input
                      value={metaTitle}
                      onChange={(e) => setMetaTitle(e.target.value)}
                      placeholder={title || "Meta title"}
                      className="bg-zinc-800 border-zinc-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-zinc-400">Meta Description</Label>
                    <Textarea
                      value={metaDescription}
                      onChange={(e) => setMetaDescription(e.target.value)}
                      placeholder={excerpt || "Meta description"}
                      rows={3}
                      className="bg-zinc-800 border-zinc-700 text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
