"use client"

import { useEffect, useState, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  FileText,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Home,
  Loader2,
  Calendar,
  User,
  Package,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"

interface Blog {
  id: string
  title: string
  slug: string
  excerpt: string | null
  cover_image: string | null
  is_published: boolean
  published_at: string | null
  created_at: string
  author: { id: string; full_name: string; email: string } | null
  blog_products: Array<{ product: { id: string; title: string; image_url: string | null } }>
}

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; blog: Blog | null }>({
    open: false,
    blog: null,
  })
  const [deleting, setDeleting] = useState(false)

  const limit = 10
  const router = useRouter()
  const supabase = createClient()
  const { toast } = useToast()

  const fetchBlogs = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      })
      if (search) params.set("search", search)
      if (statusFilter) params.set("status", statusFilter)

      const res = await fetch(`/api/admin/blogs?${params}`)
      const data = await res.json()

      if (res.ok) {
        setBlogs(data.blogs || [])
        setTotal(data.total || 0)
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to fetch blogs",
          variant: "destructive",
        })
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to fetch blogs",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [page, search, statusFilter, toast])

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
    if (isAdmin) {
      fetchBlogs()
    }
  }, [isAdmin, fetchBlogs])

  const handleDelete = async () => {
    if (!deleteModal.blog) return

    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/blogs/${deleteModal.blog.id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        toast({
          title: "Success",
          description: "Blog deleted successfully",
        })
        fetchBlogs()
      } else {
        const data = await res.json()
        toast({
          title: "Error",
          description: data.error || "Failed to delete blog",
          variant: "destructive",
        })
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete blog",
        variant: "destructive",
      })
    } finally {
      setDeleting(false)
      setDeleteModal({ open: false, blog: null })
    }
  }

  const totalPages = Math.ceil(total / limit)

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (!isAdmin) {
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
        <span className="text-white">Blogs</span>
      </div>

      {/* Double Box Container */}
      <div className="relative">
        <div className="absolute inset-0 bg-amber-500/20 rounded-2xl translate-x-2 translate-y-2" />
        <div className="relative bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
          {/* Header */}
          <div className="p-4 lg:p-6 border-b border-zinc-800">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/10 rounded-lg">
                  <FileText className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <h1 className="text-xl lg:text-2xl font-bold text-white">Blog Posts</h1>
                  <p className="text-sm text-zinc-400">{total} total posts</p>
                </div>
              </div>
              <Link href="/admin/blogs/new">
                <Button className="bg-amber-500 hover:bg-amber-600 text-black font-semibold">
                  <Plus className="w-4 h-4 mr-2" />
                  New Post
                </Button>
              </Link>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <Input
                  placeholder="Search posts..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value)
                    setPage(1)
                  }}
                  className="pl-10 bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
              <Select
                value={statusFilter}
                onValueChange={(v) => {
                  setStatusFilter(v)
                  setPage(1)
                }}
              >
                <SelectTrigger className="w-full sm:w-40 bg-zinc-800 border-zinc-700 text-white">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 lg:p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
              </div>
            ) : blogs.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 mx-auto text-zinc-700 mb-4" />
                <p className="text-zinc-400">No blog posts found</p>
                <Link href="/admin/blogs/new">
                  <Button className="mt-4 bg-amber-500 hover:bg-amber-600 text-black">
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Post
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {blogs.map((blog) => (
                  <div
                    key={blog.id}
                    className="flex flex-col sm:flex-row gap-4 p-4 bg-zinc-800/50 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-colors"
                  >
                    {/* Cover Image */}
                    <div className="relative w-full sm:w-40 h-24 bg-zinc-800 rounded-lg overflow-hidden shrink-0">
                      {blog.cover_image ? (
                        <Image
                          src={blog.cover_image || "/placeholder.svg"}
                          alt={blog.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FileText className="w-8 h-8 text-zinc-600" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-white truncate">{blog.title}</h3>
                          <p className="text-sm text-zinc-400 line-clamp-2 mt-1">{blog.excerpt || "No excerpt"}</p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="shrink-0">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/blog/${blog.slug}`} target="_blank">
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/blogs/${blog.id}/edit`}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-400"
                              onClick={() => setDeleteModal({ open: true, blog })}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Meta */}
                      <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-zinc-500">
                        <span
                          className={`px-2 py-0.5 rounded-full ${
                            blog.is_published ? "bg-green-500/10 text-green-400" : "bg-zinc-700 text-zinc-400"
                          }`}
                        >
                          {blog.is_published ? "Published" : "Draft"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(blog.published_at || blog.created_at)}
                        </span>
                        {blog.author && (
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {blog.author.full_name || blog.author.email}
                          </span>
                        )}
                        {blog.blog_products?.length > 0 && (
                          <span className="flex items-center gap-1">
                            <Package className="w-3 h-3" />
                            {blog.blog_products.length} product{blog.blog_products.length > 1 ? "s" : ""}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-zinc-800">
                <p className="text-sm text-zinc-500">
                  Page {page} of {totalPages}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="border-zinc-700"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="border-zinc-700"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Dialog */}
      <AlertDialog open={deleteModal.open} onOpenChange={(open) => setDeleteModal({ open, blog: null })}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Blog Post</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              Are you sure you want to delete &quot;{deleteModal.blog?.title}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
