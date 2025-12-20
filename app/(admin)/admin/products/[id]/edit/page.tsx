"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import {
  ArrowLeft,
  Save,
  Loader2,
  Package,
  DollarSign,
  ImageIcon,
  Tag,
  Settings,
  Globe,
  Gamepad2,
  Gift,
  CreditCard,
  MonitorPlay,
  Monitor,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Upload,
  X,
  HelpCircle,
  Search,
} from "lucide-react"
import { RichTextEditor } from "@/components/admin/rich-text-editor"

interface Category {
  id: string
  name: string
  slug: string
}

interface Platform {
  id: string
  name: string
  slug: string
  icon?: string
}

interface Edition {
  id?: string
  name: string
  slug: string
  price: string
  original_price: string
  description: string
  includes: string[]
  image_url: string
  is_default: boolean
  is_available: boolean
}

interface Denomination {
  id?: string
  value: string
  price: string
  currency: "NPR" | "USD" | "EUR"
  bonus_value: string
  is_popular: boolean
  is_available: boolean
  stock: string
}

interface Duration {
  id?: string
  months: string
  label: string
  price: string
  discount_percent: string
  is_popular: boolean
  is_available: boolean
}

interface Plan {
  id?: string
  name: string
  slug: string
  description: string
  features: string[]
  max_devices: string
  max_users: string
  quality: string
  is_popular: boolean
  is_available: boolean
  color: string
  durations: Duration[]
}

interface LicenseType {
  id?: string
  name: string
  slug: string
  description: string
  price: string
  features: string[]
  max_users: string
  max_devices: string
  is_popular: boolean
  is_available: boolean
}

interface LicenseDuration {
  id?: string
  duration_type: string
  label: string
  price_multiplier: string
  discount_percent: string
  is_popular: boolean
  is_available: boolean
}

interface FAQ {
  id?: string
  question: string
  answer: string
  is_active: boolean
}

const suggestedTags = [
  "Action",
  "Adventure",
  "RPG",
  "FPS",
  "Strategy",
  "Sports",
  "Racing",
  "Simulation",
  "Puzzle",
  "Horror",
  "Multiplayer",
  "Singleplayer",
  "Open World",
  "Indie",
  "AAA",
  "Early Access",
  "VR",
  "Co-op",
]

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params?.id as string
  const { toast } = useToast()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [allPlatforms, setAllPlatforms] = useState<Platform[]>([])

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    basic: true,
    pricing: true,
    media: true,
    inventory: false,
    seo: false,
    status: false,
    region: false,
    additional: false,
    platforms: false,
    typeSpecific: true,
    tags: true,
    faqs: true,
  })

  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    short_description: "",
    product_type: "game",
    category_id: "",
    base_price: "",
    original_price: "",
    currency: "NPR",
    discount_percent: "0",
    cashback_percent: "0",
    image_url: "",
    thumbnail_url: "",
    gallery_images: [] as string[],
    video_url: "",
    stock: "0",
    is_digital: true,
    is_preorder: false,
    release_date: "",
    meta_title: "",
    meta_description: "",
    tags: [] as string[],
    is_active: true,
    is_featured: false,
    is_bestseller: false,
    is_new: false,
    region: "Global",
    regions_available: ["Global"],
    publisher: "",
    developer: "",
  })

  const [selectedPlatforms, setSelectedPlatforms] = useState<
    { platform_id: string; price_modifier: string; is_available: boolean }[]
  >([])
  const [editions, setEditions] = useState<Edition[]>([])
  const [denominations, setDenominations] = useState<Denomination[]>([])
  const [plans, setPlans] = useState<Plan[]>([])
  const [licenseTypes, setLicenseTypes] = useState<LicenseType[]>([])
  const [licenseDurations, setLicenseDurations] = useState<LicenseDuration[]>([])
  const [faqs, setFaqs] = useState<FAQ[]>([])

  const [tagInput, setTagInput] = useState("")
  const [regionInput, setRegionInput] = useState("")
  const [galleryInput, setGalleryInput] = useState("")

  const [isUploadingMain, setIsUploadingMain] = useState(false)
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false)
  const [isUploadingGallery, setIsUploadingGallery] = useState(false)
  const mainImageRef = useRef<HTMLInputElement>(null)
  const thumbnailRef = useRef<HTMLInputElement>(null)
  const galleryRef = useRef<HTMLInputElement>(null)

  const supabase = createClient()

  useEffect(() => {
    const checkAdminAndLoadData = async () => {
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

      // Load categories and platforms
      const [catRes, platRes] = await Promise.all([fetch("/api/admin/categories"), fetch("/api/admin/platforms")])

      if (catRes.ok) {
        const catData = await catRes.json()
        setCategories(catData.categories || [])
      }

      if (platRes.ok) {
        const platData = await platRes.json()
        setAllPlatforms(platData.platforms || [])
      }

      // Load product data
      const productRes = await fetch(`/api/admin/products/${productId}`)
      if (productRes.ok) {
        const { product } = await productRes.json()

        setForm({
          title: product.title || "",
          slug: product.slug || "",
          description: product.description || "",
          short_description: product.short_description || "",
          product_type: product.product_type || "game",
          category_id: product.category_id || "",
          base_price: product.base_price?.toString() || "",
          original_price: product.original_price?.toString() || "",
          currency: product.currency || "NPR",
          discount_percent: product.discount_percent?.toString() || "0",
          cashback_percent: product.cashback_percent?.toString() || "0",
          image_url: product.image_url || "",
          thumbnail_url: product.thumbnail_url || "",
          gallery_images: product.gallery_images || [],
          video_url: product.video_url || "",
          stock: product.stock?.toString() || "0",
          is_digital: product.is_digital ?? true,
          is_preorder: product.is_preorder ?? false,
          release_date: product.release_date || "",
          meta_title: product.meta_title || "",
          meta_description: product.meta_description || "",
          tags: product.tags || [],
          is_active: product.is_active ?? true,
          is_featured: product.is_featured ?? false,
          is_bestseller: product.is_bestseller ?? false,
          is_new: product.is_new ?? false,
          region: product.region || "Global",
          regions_available: product.regions_available || ["Global"],
          publisher: product.publisher || "",
          developer: product.developer || "",
        })

        // Load platforms
        if (product.platforms?.length > 0) {
          setSelectedPlatforms(
            product.platforms.map((p: any) => ({
              platform_id: p.platform_id || p.platform?.id,
              price_modifier: p.price_modifier?.toString() || "0",
              is_available: p.is_available ?? true,
            })),
          )
        }

        // Load editions
        if (product.editions?.length > 0) {
          setEditions(
            product.editions.map((e: any) => ({
              id: e.id,
              name: e.name || "",
              slug: e.slug || "",
              price: e.price?.toString() || "",
              original_price: e.original_price?.toString() || "",
              description: e.description || "",
              includes: e.includes || [],
              image_url: e.image_url || "",
              is_default: e.is_default ?? false,
              is_available: e.is_available ?? true,
            })),
          )
        }

        // Load denominations
        if (product.denominations?.length > 0) {
          setDenominations(
            product.denominations.map((d: any) => ({
              id: d.id,
              value: d.value?.toString() || "",
              price: d.price?.toString() || "",
              currency: d.currency || "NPR",
              bonus_value: d.bonus_value?.toString() || "0",
              is_popular: d.is_popular ?? false,
              is_available: d.is_available ?? true,
              stock: d.stock?.toString() || "0",
            })),
          )
        }

        // Load plans with durations
        if (product.plans?.length > 0) {
          setPlans(
            product.plans.map((p: any) => ({
              id: p.id,
              name: p.name || "",
              slug: p.slug || "",
              description: p.description || "",
              features: p.features || [],
              max_devices: p.max_devices?.toString() || "1",
              max_users: p.max_users?.toString() || "1",
              quality: p.quality || "",
              is_popular: p.is_popular ?? false,
              is_available: p.is_available ?? true,
              color: p.color || "",
              durations: (p.durations || []).map((d: any) => ({
                id: d.id,
                months: d.months?.toString() || "1",
                label: d.label || "",
                price: d.price?.toString() || "",
                discount_percent: d.discount_percent?.toString() || "0",
                is_popular: d.is_popular ?? false,
                is_available: d.is_available ?? true,
              })),
            })),
          )
        }

        // Load license types
        if (product.license_types?.length > 0) {
          setLicenseTypes(
            product.license_types.map((l: any) => ({
              id: l.id,
              name: l.name || "",
              slug: l.slug || "",
              description: l.description || "",
              price: l.price?.toString() || "",
              features: l.features || [],
              max_users: l.max_users?.toString() || "1",
              max_devices: l.max_devices?.toString() || "1",
              is_popular: l.is_popular ?? false,
              is_available: l.is_available ?? true,
            })),
          )
        }

        // Load license durations
        if (product.license_durations?.length > 0) {
          setLicenseDurations(
            product.license_durations.map((d: any) => ({
              id: d.id,
              duration_type: d.duration_type || "1year",
              label: d.label || "",
              price_multiplier: d.price_multiplier?.toString() || "1",
              discount_percent: d.discount_percent?.toString() || "0",
              is_popular: d.is_popular ?? false,
              is_available: d.is_available ?? true,
            })),
          )
        }

        // Load FAQs
        if (product.faqs?.length > 0) {
          setFaqs(
            product.faqs.map((f: any) => ({
              id: f.id,
              question: f.question || "",
              answer: f.answer || "",
              is_active: f.is_active ?? true,
            })),
          )
        }
      }

      setLoading(false)
    }

    if (productId) {
      checkAdminAndLoadData()
    }
  }, [productId, router, supabase])

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const handleTitleChange = (title: string) => {
    setForm((prev) => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }))
  }

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  // Tag handlers
  const addTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      setForm((prev) => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }))
      setTagInput("")
    }
  }

  const removeTag = (tag: string) => {
    setForm((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }))
  }

  // Region handlers
  const addRegion = () => {
    if (regionInput.trim() && !form.regions_available.includes(regionInput.trim())) {
      setForm((prev) => ({
        ...prev,
        regions_available: [...prev.regions_available, regionInput.trim()],
      }))
      setRegionInput("")
    }
  }

  const removeRegion = (region: string) => {
    setForm((prev) => ({
      ...prev,
      regions_available: prev.regions_available.filter((r) => r !== region),
    }))
  }

  // Gallery handlers
  const addGalleryImage = () => {
    if (galleryInput.trim() && !form.gallery_images.includes(galleryInput.trim())) {
      setForm((prev) => ({
        ...prev,
        gallery_images: [...prev.gallery_images, galleryInput.trim()],
      }))
      setGalleryInput("")
    }
  }

  const removeGalleryImage = (url: string) => {
    setForm((prev) => ({
      ...prev,
      gallery_images: prev.gallery_images.filter((u) => u !== url),
    }))
  }

  // Platform management
  const addPlatform = (platformId: string) => {
    if (!selectedPlatforms.find((p) => p.platform_id === platformId)) {
      setSelectedPlatforms((prev) => [...prev, { platform_id: platformId, price_modifier: "0", is_available: true }])
    }
  }

  const removePlatform = (platformId: string) => {
    setSelectedPlatforms((prev) => prev.filter((p) => p.platform_id !== platformId))
  }

  // Edition management
  const addEdition = () => {
    setEditions((prev) => [
      ...prev,
      {
        name: "",
        slug: "",
        price: "",
        original_price: "",
        description: "",
        includes: [],
        image_url: "",
        is_default: prev.length === 0,
        is_available: true,
      },
    ])
  }

  const updateEdition = (index: number, field: keyof Edition, value: any) => {
    setEditions((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      if (field === "name") {
        updated[index].slug = generateSlug(value)
      }
      return updated
    })
  }

  const removeEdition = (index: number) => {
    setEditions((prev) => prev.filter((_, i) => i !== index))
  }

  // Denomination management
  const addDenomination = () => {
    setDenominations((prev) => [
      ...prev,
      {
        value: "",
        price: "",
        currency: "NPR",
        bonus_value: "0",
        is_popular: false,
        is_available: true,
        stock: "0",
      },
    ])
  }

  const updateDenomination = (index: number, field: keyof Denomination, value: any) => {
    setDenominations((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
  }

  const removeDenomination = (index: number) => {
    setDenominations((prev) => prev.filter((_, i) => i !== index))
  }

  // Plan management
  const addPlan = () => {
    setPlans((prev) => [
      ...prev,
      {
        name: "",
        slug: "",
        description: "",
        features: [],
        max_devices: "1",
        max_users: "1",
        quality: "",
        is_popular: false,
        is_available: true,
        color: "",
        durations: [],
      },
    ])
  }

  const updatePlan = (index: number, field: keyof Plan, value: any) => {
    setPlans((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      if (field === "name") {
        updated[index].slug = generateSlug(value)
      }
      return updated
    })
  }

  const removePlan = (index: number) => {
    setPlans((prev) => prev.filter((_, i) => i !== index))
  }

  // Duration management for plans
  const addDuration = (planIndex: number) => {
    setPlans((prev) => {
      const updated = [...prev]
      updated[planIndex].durations.push({
        months: "",
        label: "",
        price: "",
        discount_percent: "0",
        is_popular: false,
        is_available: true,
      })
      return updated
    })
  }

  const updateDuration = (planIndex: number, durationIndex: number, field: keyof Duration, value: any) => {
    setPlans((prev) => {
      const updated = [...prev]
      updated[planIndex].durations[durationIndex] = {
        ...updated[planIndex].durations[durationIndex],
        [field]: value,
      }
      return updated
    })
  }

  const removeDuration = (planIndex: number, durationIndex: number) => {
    setPlans((prev) => {
      const updated = [...prev]
      updated[planIndex].durations = updated[planIndex].durations.filter((_, i) => i !== durationIndex)
      return updated
    })
  }

  // License Type management
  const addLicenseType = () => {
    setLicenseTypes((prev) => [
      ...prev,
      {
        name: "",
        slug: "",
        description: "",
        price: "",
        features: [],
        max_users: "1",
        max_devices: "1",
        is_popular: false,
        is_available: true,
      },
    ])
  }

  const updateLicenseType = (index: number, field: keyof LicenseType, value: any) => {
    setLicenseTypes((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      if (field === "name") {
        updated[index].slug = generateSlug(value)
      }
      return updated
    })
  }

  const removeLicenseType = (index: number) => {
    setLicenseTypes((prev) => prev.filter((_, i) => i !== index))
  }

  // License Duration management
  const addLicenseDuration = () => {
    setLicenseDurations((prev) => [
      ...prev,
      {
        duration_type: "1year",
        label: "",
        price_multiplier: "1",
        discount_percent: "0",
        is_popular: false,
        is_available: true,
      },
    ])
  }

  const updateLicenseDuration = (index: number, field: keyof LicenseDuration, value: any) => {
    setLicenseDurations((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
  }

  const removeLicenseDuration = (index: number) => {
    setLicenseDurations((prev) => prev.filter((_, i) => i !== index))
  }

  // FAQ handlers
  const addFaq = () => {
    setFaqs([...faqs, { question: "", answer: "", is_active: true }])
  }

  const updateFaq = (index: number, field: keyof FAQ, value: any) => {
    const updated = [...faqs]
    updated[index] = { ...updated[index], [field]: value }
    setFaqs(updated)
  }

  const removeFaq = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index))
  }

  // File upload
  const uploadImage = async (file: File, type: "main" | "thumbnail" | "gallery") => {
    if (type === "main") setIsUploadingMain(true)
    else if (type === "thumbnail") setIsUploadingThumbnail(true)
    else setIsUploadingGallery(true)

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session?.access_token) {
        throw new Error("Not authenticated")
      }

      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Upload failed")
      }

      const { url } = await response.json()

      if (type === "main") {
        setForm((prev) => ({ ...prev, image_url: url }))
      } else if (type === "thumbnail") {
        setForm((prev) => ({ ...prev, thumbnail_url: url }))
      } else {
        setForm((prev) => ({ ...prev, gallery_images: [...prev.gallery_images, url] }))
      }
    } catch (error) {
      console.error("Upload error:", error)
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Upload failed",
        variant: "destructive",
      })
    } finally {
      if (type === "main") setIsUploadingMain(false)
      else if (type === "thumbnail") setIsUploadingThumbnail(false)
      else setIsUploadingGallery(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "main" | "thumbnail" | "gallery") => {
    const file = e.target.files?.[0]
    if (file) {
      uploadImage(file, type)
    }
    e.target.value = ""
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.title || !form.slug || !form.base_price) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setSaving(true)

    try {
      const payload = {
        ...form,
        platforms: selectedPlatforms,
        editions: form.product_type === "game" ? editions : [],
        denominations: form.product_type === "giftcard" ? denominations : [],
        plans: form.product_type === "subscription" ? plans : [],
        license_types: form.product_type === "software" ? licenseTypes : [],
        license_durations: form.product_type === "software" ? licenseDurations : [],
        faqs,
      }

      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (res.ok) {
        toast({
          title: "Success",
          description: "Product updated successfully",
        })
        router.push("/admin/products")
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to update product",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const getProductTypeConfig = (type: string) => {
    switch (type) {
      case "game":
        return { icon: Gamepad2, color: "text-blue-400", bgColor: "bg-blue-500/10", borderColor: "border-blue-500/30" }
      case "giftcard":
        return { icon: Gift, color: "text-green-400", bgColor: "bg-green-500/10", borderColor: "border-green-500/30" }
      case "subscription":
        return {
          icon: MonitorPlay,
          color: "text-purple-400",
          bgColor: "bg-purple-500/10",
          borderColor: "border-purple-500/30",
        }
      case "software":
        return {
          icon: Settings,
          color: "text-orange-400",
          bgColor: "bg-orange-500/10",
          borderColor: "border-orange-500/30",
        }
      default:
        return { icon: Package, color: "text-zinc-400", bgColor: "bg-zinc-500/10", borderColor: "border-zinc-500/30" }
    }
  }

  if (loading || !isAdmin) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    )
  }

  const SectionHeader = ({
    title,
    section,
    icon: Icon,
  }: {
    title: string
    section: string
    icon: any
  }) => (
    <button
      type="button"
      onClick={() => toggleSection(section)}
      className="w-full flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-amber-500" />
        <span className="text-white font-medium">{title}</span>
      </div>
      {expandedSections[section] ? (
        <ChevronUp className="w-5 h-5 text-zinc-400" />
      ) : (
        <ChevronDown className="w-5 h-5 text-zinc-400" />
      )}
    </button>
  )

  const typeConfig = getProductTypeConfig(form.product_type)

  return (
    <div className="min-h-screen bg-zinc-950 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/products" className="p-2 hover:bg-zinc-900 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-zinc-400 hover:text-white" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Edit Product</h1>
            <p className="text-zinc-400 text-sm">{form.title || "Update product details"}</p>
          </div>
        </div>
        <Button
          type="submit"
          form="edit-product-form"
          disabled={saving}
          className="bg-amber-500 hover:bg-amber-400 text-black cursor-pointer"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <form id="edit-product-form" onSubmit={handleSubmit} className="space-y-6">
        {/* Product Type */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <Label className="text-zinc-300 text-base font-medium mb-4 block">Product Type *</Label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { value: "game", label: "Game", icon: Gamepad2, color: "blue" },
              { value: "giftcard", label: "Gift Card", icon: Gift, color: "green" },
              { value: "subscription", label: "Subscription", icon: MonitorPlay, color: "purple" },
              { value: "software", label: "Software", icon: Settings, color: "orange" },
            ].map(({ value, label, icon: Icon, color }) => (
              <button
                key={value}
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, product_type: value }))}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col items-center gap-2`}
                style={{
                  backgroundColor:
                    form.product_type === value
                      ? color === "blue"
                        ? "rgba(59, 130, 246, 0.1)"
                        : color === "green"
                          ? "rgba(34, 197, 94, 0.1)"
                          : color === "purple"
                            ? "rgba(168, 85, 247, 0.1)"
                            : "rgba(249, 115, 22, 0.1)"
                      : undefined,
                  borderColor:
                    form.product_type === value
                      ? color === "blue"
                        ? "rgba(59, 130, 246, 0.5)"
                        : color === "green"
                          ? "rgba(34, 197, 94, 0.5)"
                          : color === "purple"
                            ? "rgba(168, 85, 247, 0.5)"
                            : "rgba(249, 115, 22, 0.5)"
                      : "rgb(63, 63, 70)",
                }}
              >
                <Icon
                  className={`w-6 h-6 ${
                    form.product_type === value
                      ? color === "blue"
                        ? "text-blue-400"
                        : color === "green"
                          ? "text-green-400"
                          : color === "purple"
                            ? "text-purple-400"
                            : "text-orange-400"
                      : "text-zinc-400"
                  }`}
                />
                <span
                  className={`text-sm font-medium ${
                    form.product_type === value
                      ? color === "blue"
                        ? "text-blue-400"
                        : color === "green"
                          ? "text-green-400"
                          : color === "purple"
                            ? "text-purple-400"
                            : "text-orange-400"
                      : "text-zinc-400"
                  }`}
                >
                  {label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Basic Information */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <SectionHeader title="Basic Information" section="basic" icon={Package} />
          {expandedSections.basic && (
            <div className="p-6 space-y-4 border-t border-zinc-800">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Label htmlFor="title" className="text-zinc-300">
                    Product Title *
                  </Label>
                  <Input
                    id="title"
                    value={form.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Enter product title"
                    className="mt-1.5 bg-zinc-800 border-zinc-700 text-white"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="slug" className="text-zinc-300">
                    URL Slug *
                  </Label>
                  <Input
                    id="slug"
                    value={form.slug}
                    onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
                    placeholder="product-url-slug"
                    className="mt-1.5 bg-zinc-800 border-zinc-700 text-white"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category" className="text-zinc-300">
                    Category
                  </Label>
                  <Select
                    value={form.category_id || "none"}
                    onValueChange={(value) =>
                      setForm((prev) => ({ ...prev, category_id: value === "none" ? "" : value }))
                    }
                  >
                    <SelectTrigger className="mt-1.5 bg-zinc-800 border-zinc-700 text-white cursor-pointer">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700">
                      <SelectItem value="none" className="text-white cursor-pointer">
                        No Category
                      </SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id} className="text-white cursor-pointer">
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="short_description" className="text-zinc-300">
                    Short Description
                  </Label>
                  <Input
                    id="short_description"
                    value={form.short_description}
                    onChange={(e) => setForm((prev) => ({ ...prev, short_description: e.target.value }))}
                    placeholder="Brief product description"
                    className="mt-1.5 bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="description" className="text-zinc-300">
                    Full Description (Rich Text)
                  </Label>
                  <div className="mt-1.5">
                    <RichTextEditor
                      value={form.description}
                      onChange={(value) => setForm((prev) => ({ ...prev, description: value }))}
                      placeholder="Write your detailed product description here. Use the toolbar to add headings, lists, and price tables."
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="publisher" className="text-zinc-300">
                    Publisher
                  </Label>
                  <Input
                    id="publisher"
                    value={form.publisher}
                    onChange={(e) => setForm((prev) => ({ ...prev, publisher: e.target.value }))}
                    placeholder="Publisher name"
                    className="mt-1.5 bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="developer" className="text-zinc-300">
                    Developer
                  </Label>
                  <Input
                    id="developer"
                    value={form.developer}
                    onChange={(e) => setForm((prev) => ({ ...prev, developer: e.target.value }))}
                    placeholder="Developer name"
                    className="mt-1.5 bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Pricing */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <SectionHeader title="Pricing" section="pricing" icon={DollarSign} />
          {expandedSections.pricing && (
            <div className="p-6 space-y-4 border-t border-zinc-800">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="base_price" className="text-zinc-300">
                    Base Price (NPR) *
                  </Label>
                  <Input
                    id="base_price"
                    type="number"
                    step="0.01"
                    value={form.base_price}
                    onChange={(e) => setForm((prev) => ({ ...prev, base_price: e.target.value }))}
                    placeholder="0.00"
                    className="mt-1.5 bg-zinc-800 border-zinc-700 text-white"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="original_price" className="text-zinc-300">
                    Original Price (for discount display)
                  </Label>
                  <Input
                    id="original_price"
                    type="number"
                    step="0.01"
                    value={form.original_price}
                    onChange={(e) => setForm((prev) => ({ ...prev, original_price: e.target.value }))}
                    placeholder="0.00"
                    className="mt-1.5 bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="currency" className="text-zinc-300">
                    Currency
                  </Label>
                  <Select
                    value={form.currency}
                    onValueChange={(value) => setForm((prev) => ({ ...prev, currency: value }))}
                  >
                    <SelectTrigger className="mt-1.5 bg-zinc-800 border-zinc-700 text-white cursor-pointer">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700">
                      <SelectItem value="NPR" className="text-white cursor-pointer">
                        NPR
                      </SelectItem>
                      <SelectItem value="USD" className="text-white cursor-pointer">
                        USD
                      </SelectItem>
                      <SelectItem value="EUR" className="text-white cursor-pointer">
                        EUR
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="discount_percent" className="text-zinc-300">
                    Discount %
                  </Label>
                  <Input
                    id="discount_percent"
                    type="number"
                    min="0"
                    max="100"
                    value={form.discount_percent}
                    onChange={(e) => setForm((prev) => ({ ...prev, discount_percent: e.target.value }))}
                    className="mt-1.5 bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="cashback_percent" className="text-zinc-300">
                    Cashback %
                  </Label>
                  <Input
                    id="cashback_percent"
                    type="number"
                    min="0"
                    max="100"
                    value={form.cashback_percent}
                    onChange={(e) => setForm((prev) => ({ ...prev, cashback_percent: e.target.value }))}
                    className="mt-1.5 bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Media */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <SectionHeader title="Media" section="media" icon={ImageIcon} />
          {expandedSections.media && (
            <div className="p-6 space-y-6 border-t border-zinc-800">
              {/* Main Image */}
              <div>
                <Label className="text-zinc-300 mb-2 block">Main Image</Label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="flex gap-2">
                      <Input
                        value={form.image_url}
                        onChange={(e) => setForm((prev) => ({ ...prev, image_url: e.target.value }))}
                        placeholder="https://... or upload image"
                        className="bg-zinc-800 border-zinc-700 text-white"
                      />
                      <input
                        ref={mainImageRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        onChange={(e) => handleFileChange(e, "main")}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        onClick={() => mainImageRef.current?.click()}
                        disabled={isUploadingMain}
                        variant="outline"
                        className="border-zinc-700 text-zinc-300 cursor-pointer bg-transparent hover:bg-zinc-800"
                      >
                        {isUploadingMain ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Upload className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  {form.image_url && (
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-zinc-700 group">
                      <Image
                        src={form.image_url || "/placeholder.svg"}
                        alt="Main image preview"
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, image_url: "" }))}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                      >
                        <Trash2 className="w-5 h-5 text-red-400" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Thumbnail */}
              <div>
                <Label className="text-zinc-300 mb-2 block">Thumbnail Image</Label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="flex gap-2">
                      <Input
                        value={form.thumbnail_url}
                        onChange={(e) => setForm((prev) => ({ ...prev, thumbnail_url: e.target.value }))}
                        placeholder="https://... or upload image"
                        className="bg-zinc-800 border-zinc-700 text-white"
                      />
                      <input
                        ref={thumbnailRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        onChange={(e) => handleFileChange(e, "thumbnail")}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        onClick={() => thumbnailRef.current?.click()}
                        disabled={isUploadingThumbnail}
                        variant="outline"
                        className="border-zinc-700 text-zinc-300 cursor-pointer bg-transparent hover:bg-zinc-800"
                      >
                        {isUploadingThumbnail ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Upload className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  {form.thumbnail_url && (
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-zinc-700 group">
                      <Image
                        src={form.thumbnail_url || "/placeholder.svg"}
                        alt="Thumbnail preview"
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, thumbnail_url: "" }))}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                      >
                        <Trash2 className="w-5 h-5 text-red-400" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Video URL */}
              <div>
                <Label htmlFor="video_url" className="text-zinc-300">
                  Video URL
                </Label>
                <Input
                  id="video_url"
                  value={form.video_url}
                  onChange={(e) => setForm((prev) => ({ ...prev, video_url: e.target.value }))}
                  placeholder="https://youtube.com/..."
                  className="mt-1.5 bg-zinc-800 border-zinc-700 text-white"
                />
              </div>

              {/* Gallery Images */}
              <div>
                <Label className="text-zinc-300 mb-2 block">Gallery Images</Label>
                <div className="flex gap-2">
                  <Input
                    value={galleryInput}
                    onChange={(e) => setGalleryInput(e.target.value)}
                    placeholder="https://... or upload images"
                    className="bg-zinc-800 border-zinc-700 text-white"
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addGalleryImage())}
                  />
                  <Button
                    type="button"
                    onClick={addGalleryImage}
                    variant="outline"
                    className="border-zinc-700 text-zinc-300 cursor-pointer bg-transparent hover:bg-zinc-800"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                  <input
                    ref={galleryRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={(e) => handleFileChange(e, "gallery")}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    onClick={() => galleryRef.current?.click()}
                    disabled={isUploadingGallery}
                    variant="outline"
                    className="border-zinc-700 text-zinc-300 cursor-pointer bg-transparent hover:bg-zinc-800"
                  >
                    {isUploadingGallery ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  </Button>
                </div>
                {form.gallery_images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 mt-4">
                    {form.gallery_images.map((url, i) => (
                      <div
                        key={i}
                        className="relative aspect-square rounded-lg overflow-hidden border border-zinc-700 group"
                      >
                        <Image
                          src={url || "/placeholder.svg"}
                          alt={`Gallery image ${i + 1}`}
                          fill
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(url)}
                          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                        >
                          <Trash2 className="w-5 h-5 text-red-400" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <SectionHeader title="Tags" section="tags" icon={Tag} />
          {expandedSections.tags && (
            <div className="p-6 space-y-4 border-t border-zinc-800">
              <div>
                <Label className="text-zinc-300 mb-2 block">Product Tags</Label>
                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add a tag..."
                    className="bg-zinc-800 border-zinc-700 text-white"
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  />
                  <Button
                    type="button"
                    onClick={addTag}
                    variant="outline"
                    className="border-zinc-700 text-zinc-300 cursor-pointer bg-transparent hover:bg-zinc-800"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {form.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {form.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm flex items-center gap-2"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="hover:text-red-400 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <Label className="text-zinc-400 text-sm mb-2 block">Suggested Tags</Label>
                <div className="flex flex-wrap gap-2">
                  {suggestedTags
                    .filter((t) => !form.tags.includes(t))
                    .slice(0, 12)
                    .map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, tags: [...prev.tags, tag] }))}
                        className="px-3 py-1 bg-zinc-800 text-zinc-400 rounded-full text-sm hover:bg-zinc-700 hover:text-white transition-colors cursor-pointer"
                      >
                        + {tag}
                      </button>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Inventory */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <SectionHeader title="Inventory & Status" section="inventory" icon={Package} />
          {expandedSections.inventory && (
            <div className="p-6 space-y-4 border-t border-zinc-800">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="stock" className="text-zinc-300">
                    Stock
                  </Label>
                  <Input
                    id="stock"
                    type="number"
                    value={form.stock}
                    onChange={(e) => setForm((prev) => ({ ...prev, stock: e.target.value }))}
                    className="mt-1.5 bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="release_date" className="text-zinc-300">
                    Release Date
                  </Label>
                  <Input
                    id="release_date"
                    type="date"
                    value={form.release_date}
                    onChange={(e) => setForm((prev) => ({ ...prev, release_date: e.target.value }))}
                    className="mt-1.5 bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={form.is_digital}
                    onCheckedChange={(checked) => setForm((prev) => ({ ...prev, is_digital: checked }))}
                    className="cursor-pointer"
                  />
                  <span className="text-zinc-300 text-sm">Digital Product</span>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={form.is_preorder}
                    onCheckedChange={(checked) => setForm((prev) => ({ ...prev, is_preorder: checked }))}
                    className="cursor-pointer"
                  />
                  <span className="text-zinc-300 text-sm">Pre-order</span>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={form.is_active}
                    onCheckedChange={(checked) => setForm((prev) => ({ ...prev, is_active: checked }))}
                    className="cursor-pointer"
                  />
                  <span className="text-zinc-300 text-sm">Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={form.is_featured}
                    onCheckedChange={(checked) => setForm((prev) => ({ ...prev, is_featured: checked }))}
                    className="cursor-pointer"
                  />
                  <span className="text-zinc-300 text-sm">Featured</span>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={form.is_bestseller}
                    onCheckedChange={(checked) => setForm((prev) => ({ ...prev, is_bestseller: checked }))}
                    className="cursor-pointer"
                  />
                  <span className="text-zinc-300 text-sm">Bestseller</span>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={form.is_new}
                    onCheckedChange={(checked) => setForm((prev) => ({ ...prev, is_new: checked }))}
                    className="cursor-pointer"
                  />
                  <span className="text-zinc-300 text-sm">New</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SEO */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <SectionHeader title="SEO" section="seo" icon={Search} />
          {expandedSections.seo && (
            <div className="p-6 space-y-4 border-t border-zinc-800">
              <div>
                <Label htmlFor="meta_title" className="text-zinc-300">
                  Meta Title
                </Label>
                <Input
                  id="meta_title"
                  value={form.meta_title}
                  onChange={(e) => setForm((prev) => ({ ...prev, meta_title: e.target.value }))}
                  placeholder="SEO title (defaults to product title)"
                  className="mt-1.5 bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
              <div>
                <Label htmlFor="meta_description" className="text-zinc-300">
                  Meta Description
                </Label>
                <Textarea
                  id="meta_description"
                  value={form.meta_description}
                  onChange={(e) => setForm((prev) => ({ ...prev, meta_description: e.target.value }))}
                  placeholder="SEO description"
                  className="mt-1.5 bg-zinc-800 border-zinc-700 text-white"
                  rows={3}
                />
              </div>
            </div>
          )}
        </div>

        {/* Region */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <SectionHeader title="Region" section="region" icon={Globe} />
          {expandedSections.region && (
            <div className="p-6 space-y-4 border-t border-zinc-800">
              <div>
                <Label htmlFor="region" className="text-zinc-300">
                  Primary Region
                </Label>
                <Select value={form.region} onValueChange={(value) => setForm((prev) => ({ ...prev, region: value }))}>
                  <SelectTrigger className="mt-1.5 bg-zinc-800 border-zinc-700 text-white cursor-pointer">
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700">
                    <SelectItem value="Global" className="text-white cursor-pointer">
                      Global
                    </SelectItem>
                    <SelectItem value="Nepal" className="text-white cursor-pointer">
                      Nepal
                    </SelectItem>
                    <SelectItem value="USA" className="text-white cursor-pointer">
                      USA
                    </SelectItem>
                    <SelectItem value="Europe" className="text-white cursor-pointer">
                      Europe
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-zinc-300 mb-2 block">Available Regions</Label>
                <div className="flex gap-2">
                  <Input
                    value={regionInput}
                    onChange={(e) => setRegionInput(e.target.value)}
                    placeholder="Add region..."
                    className="bg-zinc-800 border-zinc-700 text-white"
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addRegion())}
                  />
                  <Button
                    type="button"
                    onClick={addRegion}
                    variant="outline"
                    className="border-zinc-700 text-zinc-300 cursor-pointer bg-transparent hover:bg-zinc-800"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {form.regions_available.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {form.regions_available.map((region, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-zinc-800 text-zinc-300 rounded-full text-sm flex items-center gap-2"
                      >
                        {region}
                        <button
                          type="button"
                          onClick={() => removeRegion(region)}
                          className="hover:text-red-400 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Platforms */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <SectionHeader title="Platforms" section="platforms" icon={Monitor} />
          {expandedSections.platforms && (
            <div className="p-6 space-y-4 border-t border-zinc-800">
              <div>
                <Label className="text-zinc-300 mb-3 block">Available Platforms</Label>
                <div className="flex flex-wrap gap-2 mb-4">
                  {allPlatforms.map((platform) => {
                    const isSelected = selectedPlatforms.some((p) => p.platform_id === platform.id)
                    return (
                      <button
                        key={platform.id}
                        type="button"
                        onClick={() => (isSelected ? removePlatform(platform.id) : addPlatform(platform.id))}
                        className={`px-4 py-2 rounded-lg border transition-colors cursor-pointer ${
                          isSelected
                            ? "bg-amber-500/20 border-amber-500/50 text-amber-400"
                            : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600"
                        }`}
                      >
                        {platform.name}
                      </button>
                    )
                  })}
                </div>
                {selectedPlatforms.length > 0 && (
                  <div className="space-y-3">
                    <Label className="text-zinc-400 text-sm">Platform Price Modifiers</Label>
                    {selectedPlatforms.map((sp) => {
                      const platform = allPlatforms.find((p) => p.id === sp.platform_id)
                      return (
                        <div key={sp.platform_id} className="flex items-center gap-4 p-3 bg-zinc-800/50 rounded-lg">
                          <span className="text-white flex-1">{platform?.name}</span>
                          <Input
                            type="number"
                            step="0.01"
                            value={sp.price_modifier}
                            onChange={(e) =>
                              setSelectedPlatforms((prev) =>
                                prev.map((p) =>
                                  p.platform_id === sp.platform_id ? { ...p, price_modifier: e.target.value } : p,
                                ),
                              )
                            }
                            placeholder="Price modifier"
                            className="w-32 bg-zinc-800 border-zinc-700 text-white"
                          />
                          <Switch
                            checked={sp.is_available}
                            onCheckedChange={(checked) =>
                              setSelectedPlatforms((prev) =>
                                prev.map((p) =>
                                  p.platform_id === sp.platform_id ? { ...p, is_available: checked } : p,
                                ),
                              )
                            }
                            className="cursor-pointer"
                          />
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Game Editions - Only show when product type is game */}
        {form.product_type === "game" && (
          <div className="bg-zinc-900 border border-blue-500/30 rounded-xl overflow-hidden">
            <div className="bg-blue-500/10 px-6 py-4 border-b border-blue-500/20">
              <div className="flex items-center gap-3">
                <Gamepad2 className="w-5 h-5 text-blue-400" />
                <h3 className="text-white font-semibold">Game Editions</h3>
                <span className="text-xs text-blue-400 bg-blue-500/20 px-2 py-0.5 rounded">Game Only</span>
              </div>
              <p className="text-zinc-400 text-sm mt-1">Add different editions like Standard, Deluxe, Ultimate</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-end">
                <Button
                  type="button"
                  onClick={addEdition}
                  variant="outline"
                  size="sm"
                  className="border-blue-500/30 text-blue-400 cursor-pointer bg-blue-500/10 hover:bg-blue-500/20"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Edition
                </Button>
              </div>
              {editions.length === 0 ? (
                <div className="text-center py-8 text-zinc-500">
                  <Gamepad2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No editions added yet</p>
                  <p className="text-sm">Click &quot;Add Edition&quot; to create game editions</p>
                </div>
              ) : (
                editions.map((edition, index) => (
                  <div key={index} className="p-4 bg-zinc-800/50 rounded-lg space-y-4 border border-zinc-700">
                    <div className="flex items-start justify-between">
                      <span className="text-white font-medium">Edition {index + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeEdition(index)}
                        className="text-zinc-500 hover:text-red-400 cursor-pointer p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-zinc-400 text-sm">Name *</Label>
                        <Input
                          value={edition.name}
                          onChange={(e) => updateEdition(index, "name", e.target.value)}
                          placeholder="Standard, Deluxe, Ultimate..."
                          className="mt-1 bg-zinc-800 border-zinc-700 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-zinc-400 text-sm">Price (NPR) *</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={edition.price}
                          onChange={(e) => updateEdition(index, "price", e.target.value)}
                          placeholder="0.00"
                          className="mt-1 bg-zinc-800 border-zinc-700 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-zinc-400 text-sm">Original Price</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={edition.original_price}
                          onChange={(e) => updateEdition(index, "original_price", e.target.value)}
                          placeholder="0.00"
                          className="mt-1 bg-zinc-800 border-zinc-700 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-zinc-400 text-sm">Image URL</Label>
                        <Input
                          value={edition.image_url}
                          onChange={(e) => updateEdition(index, "image_url", e.target.value)}
                          placeholder="https://..."
                          className="mt-1 bg-zinc-800 border-zinc-700 text-white"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <Label className="text-zinc-400 text-sm">Description</Label>
                        <Input
                          value={edition.description}
                          onChange={(e) => updateEdition(index, "description", e.target.value)}
                          placeholder="What's included in this edition"
                          className="mt-1 bg-zinc-800 border-zinc-700 text-white"
                        />
                      </div>
                      <div className="sm:col-span-2 flex flex-wrap items-center gap-6">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={edition.is_default}
                            onCheckedChange={(checked) => updateEdition(index, "is_default", checked)}
                            className="cursor-pointer"
                          />
                          <span className="text-zinc-400 text-sm">Default Edition</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={edition.is_available}
                            onCheckedChange={(checked) => updateEdition(index, "is_available", checked)}
                            className="cursor-pointer"
                          />
                          <span className="text-zinc-400 text-sm">Available</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Gift Card Denominations - Only show when product type is giftcard */}
        {form.product_type === "giftcard" && (
          <div className="bg-zinc-900 border border-green-500/30 rounded-xl overflow-hidden">
            <div className="bg-green-500/10 px-6 py-4 border-b border-green-500/20">
              <div className="flex items-center gap-3">
                <Gift className="w-5 h-5 text-green-400" />
                <h3 className="text-white font-semibold">Gift Card Denominations</h3>
                <span className="text-xs text-green-400 bg-green-500/20 px-2 py-0.5 rounded">Gift Card Only</span>
              </div>
              <p className="text-zinc-400 text-sm mt-1">Add different values like $10, $25, $50, $100</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-end">
                <Button
                  type="button"
                  onClick={addDenomination}
                  variant="outline"
                  size="sm"
                  className="border-green-500/30 text-green-400 cursor-pointer bg-green-500/10 hover:bg-green-500/20"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Denomination
                </Button>
              </div>
              {denominations.length === 0 ? (
                <div className="text-center py-8 text-zinc-500">
                  <Gift className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No denominations added yet</p>
                  <p className="text-sm">Click &quot;Add Denomination&quot; to create gift card values</p>
                </div>
              ) : (
                denominations.map((denom, index) => (
                  <div key={index} className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
                    <div className="flex items-start justify-between mb-4">
                      <span className="text-white font-medium">Denomination {index + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeDenomination(index)}
                        className="text-zinc-500 hover:text-red-400 cursor-pointer p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div>
                        <Label className="text-zinc-400 text-sm">Face Value *</Label>
                        <Input
                          type="number"
                          value={denom.value}
                          onChange={(e) => updateDenomination(index, "value", e.target.value)}
                          placeholder="100"
                          className="mt-1 bg-zinc-800 border-zinc-700 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-zinc-400 text-sm">Selling Price *</Label>
                        <Input
                          type="number"
                          value={denom.price}
                          onChange={(e) => updateDenomination(index, "price", e.target.value)}
                          placeholder="95"
                          className="mt-1 bg-zinc-800 border-zinc-700 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-zinc-400 text-sm">Stock</Label>
                        <Input
                          type="number"
                          value={denom.stock}
                          onChange={(e) => updateDenomination(index, "stock", e.target.value)}
                          placeholder="0"
                          className="mt-1 bg-zinc-800 border-zinc-700 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-zinc-400 text-sm">Bonus Value</Label>
                        <Input
                          type="number"
                          value={denom.bonus_value}
                          onChange={(e) => updateDenomination(index, "bonus_value", e.target.value)}
                          placeholder="0"
                          className="mt-1 bg-zinc-800 border-zinc-700 text-white"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={denom.is_popular}
                          onCheckedChange={(checked) => updateDenomination(index, "is_popular", checked)}
                          className="cursor-pointer"
                        />
                        <span className="text-zinc-400 text-sm">Popular</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={denom.is_available}
                          onCheckedChange={(checked) => updateDenomination(index, "is_available", checked)}
                          className="cursor-pointer"
                        />
                        <span className="text-zinc-400 text-sm">Available</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Subscription Plans - Only show when product type is subscription */}
        {form.product_type === "subscription" && (
          <div className="bg-zinc-900 border border-purple-500/30 rounded-xl overflow-hidden">
            <div className="bg-purple-500/10 px-6 py-4 border-b border-purple-500/20">
              <div className="flex items-center gap-3">
                <MonitorPlay className="w-5 h-5 text-purple-400" />
                <h3 className="text-white font-semibold">Subscription Plans & Durations</h3>
                <span className="text-xs text-purple-400 bg-purple-500/20 px-2 py-0.5 rounded">Subscription Only</span>
              </div>
              <p className="text-zinc-400 text-sm mt-1">
                Add plans (Basic, Standard, Premium) and their durations with pricing
              </p>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-end">
                <Button
                  type="button"
                  onClick={addPlan}
                  variant="outline"
                  size="sm"
                  className="border-purple-500/30 text-purple-400 cursor-pointer bg-purple-500/10 hover:bg-purple-500/20"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Plan
                </Button>
              </div>
              {plans.length === 0 ? (
                <div className="text-center py-8 text-zinc-500">
                  <MonitorPlay className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No plans added yet</p>
                  <p className="text-sm">Click &quot;Add Plan&quot; to create subscription plans</p>
                </div>
              ) : (
                plans.map((plan, planIndex) => (
                  <div key={planIndex} className="p-4 bg-zinc-800/50 rounded-lg space-y-4 border border-zinc-700">
                    <div className="flex items-start justify-between">
                      <span className="text-white font-medium">Plan {planIndex + 1}</span>
                      <button
                        type="button"
                        onClick={() => removePlan(planIndex)}
                        className="text-zinc-500 hover:text-red-400 cursor-pointer p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-zinc-400 text-sm">Name *</Label>
                        <Input
                          value={plan.name}
                          onChange={(e) => updatePlan(planIndex, "name", e.target.value)}
                          placeholder="Basic, Standard, Premium..."
                          className="mt-1 bg-zinc-800 border-zinc-700 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-zinc-400 text-sm">Quality</Label>
                        <Input
                          value={plan.quality}
                          onChange={(e) => updatePlan(planIndex, "quality", e.target.value)}
                          placeholder="HD, Full HD, 4K..."
                          className="mt-1 bg-zinc-800 border-zinc-700 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-zinc-400 text-sm">Color (for UI)</Label>
                        <Input
                          value={plan.color}
                          onChange={(e) => updatePlan(planIndex, "color", e.target.value)}
                          placeholder="#8B5CF6"
                          className="mt-1 bg-zinc-800 border-zinc-700 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-zinc-400 text-sm">Max Devices</Label>
                        <Input
                          type="number"
                          value={plan.max_devices}
                          onChange={(e) => updatePlan(planIndex, "max_devices", e.target.value)}
                          placeholder="1"
                          className="mt-1 bg-zinc-800 border-zinc-700 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-zinc-400 text-sm">Max Users</Label>
                        <Input
                          type="number"
                          value={plan.max_users}
                          onChange={(e) => updatePlan(planIndex, "max_users", e.target.value)}
                          placeholder="1"
                          className="mt-1 bg-zinc-800 border-zinc-700 text-white"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <Label className="text-zinc-400 text-sm">Description</Label>
                        <Input
                          value={plan.description}
                          onChange={(e) => updatePlan(planIndex, "description", e.target.value)}
                          placeholder="Plan description"
                          className="mt-1 bg-zinc-800 border-zinc-700 text-white"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={plan.is_popular}
                          onCheckedChange={(checked) => updatePlan(planIndex, "is_popular", checked)}
                          className="cursor-pointer"
                        />
                        <span className="text-zinc-400 text-sm">Popular</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={plan.is_available}
                          onCheckedChange={(checked) => updatePlan(planIndex, "is_available", checked)}
                          className="cursor-pointer"
                        />
                        <span className="text-zinc-400 text-sm">Available</span>
                      </div>
                    </div>

                    {/* Durations for this plan */}
                    <div className="mt-4 p-4 bg-zinc-900/50 rounded-lg border border-purple-500/20">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-purple-400" />
                          <span className="text-white text-sm font-medium">Durations & Pricing</span>
                        </div>
                        <Button
                          type="button"
                          onClick={() => addDuration(planIndex)}
                          variant="ghost"
                          size="sm"
                          className="text-purple-400 hover:text-purple-300 cursor-pointer"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add Duration
                        </Button>
                      </div>
                      {plan.durations.length === 0 ? (
                        <p className="text-zinc-500 text-sm text-center py-4">
                          No durations added. Click &quot;Add Duration&quot; to add pricing.
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {plan.durations.map((duration, durIndex) => (
                            <div
                              key={durIndex}
                              className="flex flex-wrap items-center gap-3 p-3 bg-zinc-800/50 rounded-lg"
                            >
                              <Input
                                type="number"
                                value={duration.months}
                                onChange={(e) => updateDuration(planIndex, durIndex, "months", e.target.value)}
                                placeholder="Months"
                                className="w-20 bg-zinc-800 border-zinc-700 text-white"
                              />
                              <Input
                                value={duration.label}
                                onChange={(e) => updateDuration(planIndex, durIndex, "label", e.target.value)}
                                placeholder="Label (e.g., 1 Month)"
                                className="flex-1 min-w-[120px] bg-zinc-800 border-zinc-700 text-white"
                              />
                              <Input
                                type="number"
                                step="0.01"
                                value={duration.price}
                                onChange={(e) => updateDuration(planIndex, durIndex, "price", e.target.value)}
                                placeholder="Price"
                                className="w-28 bg-zinc-800 border-zinc-700 text-white"
                              />
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={duration.is_popular}
                                  onCheckedChange={(checked) =>
                                    updateDuration(planIndex, durIndex, "is_popular", checked)
                                  }
                                  className="cursor-pointer"
                                />
                                <span className="text-zinc-400 text-xs">Popular</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeDuration(planIndex, durIndex)}
                                className="text-zinc-500 hover:text-red-400 cursor-pointer p-1"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Software License Types - Only show when product type is software */}
        {form.product_type === "software" && (
          <>
            <div className="bg-zinc-900 border border-orange-500/30 rounded-xl overflow-hidden">
              <div className="bg-orange-500/10 px-6 py-4 border-b border-orange-500/20">
                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5 text-orange-400" />
                  <h3 className="text-white font-semibold">License Types</h3>
                  <span className="text-xs text-orange-400 bg-orange-500/20 px-2 py-0.5 rounded">Software Only</span>
                </div>
                <p className="text-zinc-400 text-sm mt-1">Add license types like Personal, Business, Enterprise</p>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-end">
                  <Button
                    type="button"
                    onClick={addLicenseType}
                    variant="outline"
                    size="sm"
                    className="border-orange-500/30 text-orange-400 cursor-pointer bg-orange-500/10 hover:bg-orange-500/20"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add License Type
                  </Button>
                </div>
                {licenseTypes.length === 0 ? (
                  <div className="text-center py-8 text-zinc-500">
                    <Settings className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No license types added yet</p>
                    <p className="text-sm">Click &quot;Add License Type&quot; to create license options</p>
                  </div>
                ) : (
                  licenseTypes.map((license, index) => (
                    <div key={index} className="p-4 bg-zinc-800/50 rounded-lg space-y-4 border border-zinc-700">
                      <div className="flex items-start justify-between">
                        <span className="text-white font-medium">License Type {index + 1}</span>
                        <button
                          type="button"
                          onClick={() => removeLicenseType(index)}
                          className="text-zinc-500 hover:text-red-400 cursor-pointer p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <Label className="text-zinc-400 text-sm">Name *</Label>
                          <Input
                            value={license.name}
                            onChange={(e) => updateLicenseType(index, "name", e.target.value)}
                            placeholder="Personal, Business..."
                            className="mt-1 bg-zinc-800 border-zinc-700 text-white"
                          />
                        </div>
                        <div>
                          <Label className="text-zinc-400 text-sm">Price *</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={license.price}
                            onChange={(e) => updateLicenseType(index, "price", e.target.value)}
                            placeholder="0.00"
                            className="mt-1 bg-zinc-800 border-zinc-700 text-white"
                          />
                        </div>
                        <div>
                          <Label className="text-zinc-400 text-sm">Max Users</Label>
                          <Input
                            type="number"
                            value={license.max_users}
                            onChange={(e) => updateLicenseType(index, "max_users", e.target.value)}
                            placeholder="1"
                            className="mt-1 bg-zinc-800 border-zinc-700 text-white"
                          />
                        </div>
                        <div>
                          <Label className="text-zinc-400 text-sm">Max Devices</Label>
                          <Input
                            type="number"
                            value={license.max_devices}
                            onChange={(e) => updateLicenseType(index, "max_devices", e.target.value)}
                            placeholder="1"
                            className="mt-1 bg-zinc-800 border-zinc-700 text-white"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <Label className="text-zinc-400 text-sm">Description</Label>
                          <Input
                            value={license.description}
                            onChange={(e) => updateLicenseType(index, "description", e.target.value)}
                            placeholder="License description"
                            className="mt-1 bg-zinc-800 border-zinc-700 text-white"
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={license.is_popular}
                            onCheckedChange={(checked) => updateLicenseType(index, "is_popular", checked)}
                            className="cursor-pointer"
                          />
                          <span className="text-zinc-400 text-sm">Popular</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={license.is_available}
                            onCheckedChange={(checked) => updateLicenseType(index, "is_available", checked)}
                            className="cursor-pointer"
                          />
                          <span className="text-zinc-400 text-sm">Available</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* License Durations */}
            <div className="bg-zinc-900 border border-orange-500/30 rounded-xl overflow-hidden">
              <div className="bg-orange-500/10 px-6 py-4 border-b border-orange-500/20">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-orange-400" />
                  <h3 className="text-white font-semibold">License Durations</h3>
                  <span className="text-xs text-orange-400 bg-orange-500/20 px-2 py-0.5 rounded">Software Only</span>
                </div>
                <p className="text-zinc-400 text-sm mt-1">Add duration options like 1 Year, 2 Years, Lifetime</p>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-end">
                  <Button
                    type="button"
                    onClick={addLicenseDuration}
                    variant="outline"
                    size="sm"
                    className="border-orange-500/30 text-orange-400 cursor-pointer bg-orange-500/10 hover:bg-orange-500/20"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Duration
                  </Button>
                </div>
                {licenseDurations.length === 0 ? (
                  <div className="text-center py-8 text-zinc-500">
                    <CreditCard className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No durations added yet</p>
                    <p className="text-sm">Click &quot;Add Duration&quot; to create license duration options</p>
                  </div>
                ) : (
                  licenseDurations.map((duration, index) => (
                    <div key={index} className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
                      <div className="flex items-start justify-between mb-4">
                        <span className="text-white font-medium">Duration {index + 1}</span>
                        <button
                          type="button"
                          onClick={() => removeLicenseDuration(index)}
                          className="text-zinc-500 hover:text-red-400 cursor-pointer p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div>
                          <Label className="text-zinc-400 text-sm">Duration Type</Label>
                          <Select
                            value={duration.duration_type}
                            onValueChange={(value) => updateLicenseDuration(index, "duration_type", value)}
                          >
                            <SelectTrigger className="mt-1 bg-zinc-800 border-zinc-700 text-white cursor-pointer">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-800 border-zinc-700">
                              <SelectItem value="1month" className="text-white cursor-pointer">
                                1 Month
                              </SelectItem>
                              <SelectItem value="3months" className="text-white cursor-pointer">
                                3 Months
                              </SelectItem>
                              <SelectItem value="6months" className="text-white cursor-pointer">
                                6 Months
                              </SelectItem>
                              <SelectItem value="1year" className="text-white cursor-pointer">
                                1 Year
                              </SelectItem>
                              <SelectItem value="2years" className="text-white cursor-pointer">
                                2 Years
                              </SelectItem>
                              <SelectItem value="lifetime" className="text-white cursor-pointer">
                                Lifetime
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-zinc-400 text-sm">Label</Label>
                          <Input
                            value={duration.label}
                            onChange={(e) => updateLicenseDuration(index, "label", e.target.value)}
                            placeholder="1 Year License"
                            className="mt-1 bg-zinc-800 border-zinc-700 text-white"
                          />
                        </div>
                        <div>
                          <Label className="text-zinc-400 text-sm">Price Multiplier</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={duration.price_multiplier}
                            onChange={(e) => updateLicenseDuration(index, "price_multiplier", e.target.value)}
                            placeholder="1.0"
                            className="mt-1 bg-zinc-800 border-zinc-700 text-white"
                          />
                        </div>
                        <div>
                          <Label className="text-zinc-400 text-sm">Discount %</Label>
                          <Input
                            type="number"
                            value={duration.discount_percent}
                            onChange={(e) => updateLicenseDuration(index, "discount_percent", e.target.value)}
                            placeholder="0"
                            className="mt-1 bg-zinc-800 border-zinc-700 text-white"
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-4">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={duration.is_popular}
                            onCheckedChange={(checked) => updateLicenseDuration(index, "is_popular", checked)}
                            className="cursor-pointer"
                          />
                          <span className="text-zinc-400 text-sm">Popular</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={duration.is_available}
                            onCheckedChange={(checked) => updateLicenseDuration(index, "is_available", checked)}
                            className="cursor-pointer"
                          />
                          <span className="text-zinc-400 text-sm">Available</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}

        {/* FAQs */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <SectionHeader title="FAQs" section="faqs" icon={HelpCircle} />
          {expandedSections.faqs && (
            <div className="p-6 space-y-4 border-t border-zinc-800">
              <div className="flex justify-end">
                <Button
                  type="button"
                  onClick={addFaq}
                  variant="outline"
                  size="sm"
                  className="border-zinc-700 text-zinc-300 cursor-pointer bg-transparent hover:bg-zinc-800"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add FAQ
                </Button>
              </div>
              {faqs.length === 0 ? (
                <div className="text-center py-8 text-zinc-500">
                  <HelpCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No FAQs added yet</p>
                  <p className="text-sm">Click &quot;Add FAQ&quot; to create product FAQs</p>
                </div>
              ) : (
                faqs.map((faq, index) => (
                  <div key={index} className="p-4 bg-zinc-800/50 rounded-lg space-y-4 border border-zinc-700">
                    <div className="flex items-start justify-between">
                      <span className="text-white font-medium">FAQ {index + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeFaq(index)}
                        className="text-zinc-500 hover:text-red-400 cursor-pointer p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div>
                      <Label className="text-zinc-400 text-sm">Question</Label>
                      <Input
                        value={faq.question}
                        onChange={(e) => updateFaq(index, "question", e.target.value)}
                        placeholder="Enter question"
                        className="mt-1 bg-zinc-800 border-zinc-700 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-zinc-400 text-sm">Answer</Label>
                      <Textarea
                        value={faq.answer}
                        onChange={(e) => updateFaq(index, "answer", e.target.value)}
                        placeholder="Enter answer"
                        className="mt-1 bg-zinc-800 border-zinc-700 text-white"
                        rows={3}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={faq.is_active}
                        onCheckedChange={(checked) => updateFaq(index, "is_active", checked)}
                        className="cursor-pointer"
                      />
                      <span className="text-zinc-400 text-sm">Active</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Submit Button (Mobile) */}
        <div className="sm:hidden">
          <Button
            type="submit"
            disabled={saving}
            className="w-full bg-amber-500 hover:bg-amber-400 text-black cursor-pointer"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
