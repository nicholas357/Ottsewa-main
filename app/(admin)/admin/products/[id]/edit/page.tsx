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
  CreditCard,
  Tv,
  Monitor,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Upload,
  X,
  HelpCircle,
  MonitorPlay,
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
  currency: string
  bonus_value: string
  is_popular: boolean
  is_available: boolean
  stock: string
}

interface PlanDuration {
  id?: string
  months: string
  label: string
  price: string
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
  durations: PlanDuration[]
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

const productTypes = [
  { value: "game", label: "Game", icon: Gamepad2, color: "blue" },
  { value: "giftcard", label: "Gift Card", icon: CreditCard, color: "green" },
  { value: "subscription", label: "Subscription", icon: Tv, color: "purple" },
  { value: "software", label: "Software", icon: Monitor, color: "orange" },
]

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
    licenseDurations: false, // Added for license durations section
  })

  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "", // This will now be HTML content
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

  const [isUploadingMain, setIsUploadingMain] = useState(false)
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false)
  const [isUploadingGallery, setIsUploadingGallery] = useState(false)
  const mainImageRef = useRef<HTMLInputElement>(null)
  const thumbnailRef = useRef<HTMLInputElement>(null)
  const galleryRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const checkAdminAndLoadData = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/login")
        return
      }

      const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

      if (profile?.role !== "admin") {
        router.push("/")
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
          description: product.description || "", // HTML content will be loaded here
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
  }, [productId, router])

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const handleTitleChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      title: value,
      slug: value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, ""),
    }))
  }

  // File upload handler
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: "main" | "thumbnail" | "gallery") => {
    const file = e.target.files?.[0]
    if (!file) return

    const setUploading =
      type === "main" ? setIsUploadingMain : type === "thumbnail" ? setIsUploadingThumbnail : setIsUploadingGallery

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      })

      if (res.ok) {
        const { url } = await res.json()
        if (type === "main") {
          setForm((prev) => ({ ...prev, image_url: url }))
        } else if (type === "thumbnail") {
          setForm((prev) => ({ ...prev, thumbnail_url: url }))
        } else {
          setForm((prev) => ({ ...prev, gallery_images: [...prev.gallery_images, url] }))
        }
      }
    } catch (error) {
      console.error("Upload failed:", error)
    } finally {
      setUploading(false)
    }
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
      setForm((prev) => ({ ...prev, regions_available: [...prev.regions_available, regionInput.trim()] }))
      setRegionInput("")
    }
  }

  const removeRegion = (region: string) => {
    setForm((prev) => ({ ...prev, regions_available: prev.regions_available.filter((r) => r !== region) }))
  }

  // Edition handlers
  const addEdition = () => {
    setEditions([
      ...editions,
      {
        name: "",
        slug: "",
        price: "",
        original_price: "",
        description: "",
        includes: [],
        image_url: "",
        is_default: editions.length === 0,
        is_available: true,
      },
    ])
  }

  const updateEdition = (index: number, field: keyof Edition, value: any) => {
    const updated = [...editions]
    updated[index] = { ...updated[index], [field]: value }
    setEditions(updated)
  }

  const removeEdition = (index: number) => {
    setEditions(editions.filter((_, i) => i !== index))
  }

  // Denomination handlers
  const addDenomination = () => {
    setDenominations([
      ...denominations,
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
    const updated = [...denominations]
    updated[index] = { ...updated[index], [field]: value }
    setDenominations(updated)
  }

  const removeDenomination = (index: number) => {
    setDenominations(denominations.filter((_, i) => i !== index))
  }

  // Plan handlers
  const addPlan = () => {
    setPlans([
      ...plans,
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
    const updated = [...plans]
    updated[index] = { ...updated[index], [field]: value }
    setPlans(updated)
  }

  const removePlan = (index: number) => {
    setPlans(plans.filter((_, i) => i !== index))
  }

  const addPlanDuration = (planIndex: number) => {
    const updated = [...plans]
    updated[planIndex].durations.push({
      months: "1",
      label: "",
      price: "",
      is_popular: false,
      is_available: true,
    })
    setPlans(updated)
  }

  const updatePlanDuration = (planIndex: number, durIndex: number, field: keyof PlanDuration, value: any) => {
    const updated = [...plans]
    updated[planIndex].durations[durIndex] = { ...updated[planIndex].durations[durIndex], [field]: value }
    setPlans(updated)
  }

  const removePlanDuration = (planIndex: number, durIndex: number) => {
    const updated = [...plans]
    updated[planIndex].durations = updated[planIndex].durations.filter((_, i) => i !== durIndex)
    setPlans(updated)
  }

  // License type handlers
  const addLicenseType = () => {
    setLicenseTypes([
      ...licenseTypes,
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
    const updated = [...licenseTypes]
    updated[index] = { ...updated[index], [field]: value }
    setLicenseTypes(updated)
  }

  const removeLicenseType = (index: number) => {
    setLicenseTypes(licenseTypes.filter((_, i) => i !== index))
  }

  // License duration handlers
  const addLicenseDuration = () => {
    setLicenseDurations([
      ...licenseDurations,
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
    const updated = [...licenseDurations]
    updated[index] = { ...updated[index], [field]: value }
    setLicenseDurations(updated)
  }

  const removeLicenseDuration = (index: number) => {
    setLicenseDurations(licenseDurations.filter((_, i) => i !== index))
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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

      if (res.ok) {
        router.push("/admin/products")
      } else {
        const error = await res.json()
        alert(error.error || "Failed to update product")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Failed to update product")
    } finally {
      setSaving(false)
    }
  }

  const SectionHeader = ({ title, section, icon: Icon }: { title: string; section: string; icon: any }) => (
    <button
      type="button"
      onClick={() => toggleSection(section)}
      className="w-full flex items-center justify-between p-4 hover:bg-zinc-800/50 transition cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-amber-500" />
        <span className="font-semibold text-white">{title}</span>
      </div>
      {expandedSections[section] ? (
        <ChevronUp className="w-5 h-5 text-zinc-400" />
      ) : (
        <ChevronDown className="w-5 h-5 text-zinc-400" />
      )}
    </button>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    )
  }

  if (!isAdmin) return null

  return (
    <div className="min-h-screen bg-zinc-950 p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin/products">
              <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white cursor-pointer">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Edit Product</h1>
              <p className="text-zinc-400 text-sm mt-1">{form.title || "Untitled Product"}</p>
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
          {/* Product Type Selector */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <Label className="text-sm font-medium text-zinc-400 mb-4 block">Product Type</Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {productTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, product_type: type.value }))}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    form.product_type === type.value
                      ? type.color === "blue"
                        ? "border-blue-500 bg-blue-500/10 text-blue-400"
                        : type.color === "green"
                          ? "border-green-500 bg-green-500/10 text-green-400"
                          : type.color === "purple"
                            ? "border-purple-500 bg-purple-500/10 text-purple-400"
                            : "border-orange-500 bg-orange-500/10 text-orange-400"
                      : "border-zinc-700 bg-zinc-800/50 hover:border-zinc-600 text-zinc-400"
                  }`}
                >
                  <type.icon className="w-6 h-6 mx-auto mb-2" />
                  <span className="text-sm font-medium block">{type.label}</span>
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
                  <div>
                    <Label htmlFor="title" className="text-zinc-300">
                      Title *
                    </Label>
                    <Input
                      id="title"
                      value={form.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="Product title"
                      className="mt-1.5 bg-zinc-800 border-zinc-700 text-white"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="slug" className="text-zinc-300">
                      Slug *
                    </Label>
                    <Input
                      id="slug"
                      value={form.slug}
                      onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
                      placeholder="product-slug"
                      className="mt-1.5 bg-zinc-800 border-zinc-700 text-white"
                      required
                    />
                  </div>
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
                <div>
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
                {/* Use RichTextEditor for description */}
                <div className="sm:col-span-2">
                  <Label htmlFor="description" className="text-zinc-300">
                    Full Description (Rich Text)
                  </Label>
                  <div className="mt-1.5">
                    <RichTextEditor
                      value={form.description}
                      onChange={(content) => setForm((prev) => ({ ...prev, description: content }))}
                      placeholder="Write your detailed product description here. Use the toolbar to add headings, lists, and price tables."
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      Base Price *
                    </Label>
                    <Input
                      id="base_price"
                      type="number"
                      step="0.01"
                      value={form.base_price}
                      onChange={(e) => setForm((prev) => ({ ...prev, base_price: e.target.value }))}
                      placeholder="Base price"
                      className="mt-1.5 bg-zinc-800 border-zinc-700 text-white"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="original_price" className="text-zinc-300">
                      Original Price
                    </Label>
                    <Input
                      id="original_price"
                      type="number"
                      step="0.01"
                      value={form.original_price}
                      onChange={(e) => setForm((prev) => ({ ...prev, original_price: e.target.value }))}
                      placeholder="Original price"
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
                        <SelectValue placeholder="Select currency" />
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
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="discount_percent" className="text-zinc-300">
                      Discount Percent
                    </Label>
                    <Input
                      id="discount_percent"
                      type="number"
                      step="0.01"
                      value={form.discount_percent}
                      onChange={(e) => setForm((prev) => ({ ...prev, discount_percent: e.target.value }))}
                      placeholder="Discount percent"
                      className="mt-1.5 bg-zinc-800 border-zinc-700 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cashback_percent" className="text-zinc-300">
                      Cashback Percent
                    </Label>
                    <Input
                      id="cashback_percent"
                      type="number"
                      step="0.01"
                      value={form.cashback_percent}
                      onChange={(e) => setForm((prev) => ({ ...prev, cashback_percent: e.target.value }))}
                      placeholder="Cashback percent"
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
              <div className="p-6 space-y-4 border-t border-zinc-800">
                <div>
                  <Label htmlFor="image_url" className="text-zinc-300">
                    Main Image
                  </Label>
                  <Input
                    id="image_url"
                    value={form.image_url}
                    onChange={(e) => setForm((prev) => ({ ...prev, image_url: e.target.value }))}
                    placeholder="Main image URL"
                    className="mt-1.5 bg-zinc-800 border-zinc-700 text-white"
                  />
                  <Button
                    type="button"
                    onClick={() => mainImageRef.current?.click()}
                    disabled={isUploadingMain}
                    className="mt-2 bg-amber-500 hover:bg-amber-400 text-black cursor-pointer"
                  >
                    {isUploadingMain ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Main Image
                      </>
                    )}
                  </Button>
                  <input
                    type="file"
                    ref={mainImageRef}
                    onChange={(e) => handleFileChange(e, "main")}
                    className="hidden"
                  />
                </div>
                <div>
                  <Label htmlFor="thumbnail_url" className="text-zinc-300">
                    Thumbnail Image
                  </Label>
                  <Input
                    id="thumbnail_url"
                    value={form.thumbnail_url}
                    onChange={(e) => setForm((prev) => ({ ...prev, thumbnail_url: e.target.value }))}
                    placeholder="Thumbnail image URL"
                    className="mt-1.5 bg-zinc-800 border-zinc-700 text-white"
                  />
                  <Button
                    type="button"
                    onClick={() => thumbnailRef.current?.click()}
                    disabled={isUploadingThumbnail}
                    className="mt-2 bg-amber-500 hover:bg-amber-400 text-black cursor-pointer"
                  >
                    {isUploadingThumbnail ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Thumbnail Image
                      </>
                    )}
                  </Button>
                  <input
                    type="file"
                    ref={thumbnailRef}
                    onChange={(e) => handleFileChange(e, "thumbnail")}
                    className="hidden"
                  />
                </div>
                <div>
                  <Label htmlFor="gallery_images" className="text-zinc-300">
                    Gallery Images
                  </Label>
                  <div className="flex flex-wrap gap-4">
                    {form.gallery_images.map((image, index) => (
                      <div key={index} className="relative">
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`Gallery Image ${index + 1}`}
                          width={100}
                          height={100}
                          className="rounded"
                        />
                        <Button
                          type="button"
                          onClick={() =>
                            setForm((prev) => ({
                              ...prev,
                              gallery_images: prev.gallery_images.filter((_, i) => i !== index),
                            }))
                          }
                          className="absolute top-0 right-0 bg-red-500 hover:bg-red-400 text-white cursor-pointer rounded"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button
                    type="button"
                    onClick={() => galleryRef.current?.click()}
                    disabled={isUploadingGallery}
                    className="mt-2 bg-amber-500 hover:bg-amber-400 text-black cursor-pointer"
                  >
                    {isUploadingGallery ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Gallery Images
                      </>
                    )}
                  </Button>
                  <input
                    type="file"
                    multiple
                    ref={galleryRef}
                    onChange={(e) => handleFileChange(e, "gallery")}
                    className="hidden"
                  />
                </div>
                <div>
                  <Label htmlFor="video_url" className="text-zinc-300">
                    Video URL
                  </Label>
                  <Input
                    id="video_url"
                    value={form.video_url}
                    onChange={(e) => setForm((prev) => ({ ...prev, video_url: e.target.value }))}
                    placeholder="Video URL"
                    className="mt-1.5 bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Inventory */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
            <SectionHeader title="Inventory" section="inventory" icon={MonitorPlay} />
            {expandedSections.inventory && (
              <div className="p-6 space-y-4 border-t border-zinc-800">
                <div>
                  <Label htmlFor="stock" className="text-zinc-300">
                    Stock
                  </Label>
                  <Input
                    id="stock"
                    type="number"
                    value={form.stock}
                    onChange={(e) => setForm((prev) => ({ ...prev, stock: e.target.value }))}
                    placeholder="Stock"
                    className="mt-1.5 bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <Label htmlFor="is_digital" className="text-zinc-300">
                    Digital
                  </Label>
                  <Switch
                    id="is_digital"
                    checked={form.is_digital}
                    onCheckedChange={(checked) => setForm((prev) => ({ ...prev, is_digital: checked }))}
                    className="bg-zinc-800"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <Label htmlFor="is_preorder" className="text-zinc-300">
                    Preorder
                  </Label>
                  <Switch
                    id="is_preorder"
                    checked={form.is_preorder}
                    onCheckedChange={(checked) => setForm((prev) => ({ ...prev, is_preorder: checked }))}
                    className="bg-zinc-800"
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
                    placeholder="Release date"
                    className="mt-1.5 bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
              </div>
            )}
          </div>

          {/* SEO */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
            <SectionHeader title="SEO" section="seo" icon={Globe} />
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
                    placeholder="Meta title"
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
                    placeholder="Meta description"
                    className="mt-1.5 bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Status */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
            <SectionHeader title="Status" section="status" icon={Settings} />
            {expandedSections.status && (
              <div className="p-6 space-y-4 border-t border-zinc-800">
                <div className="flex items-center gap-4">
                  <Label htmlFor="is_active" className="text-zinc-300">
                    Active
                  </Label>
                  <Switch
                    id="is_active"
                    checked={form.is_active}
                    onCheckedChange={(checked) => setForm((prev) => ({ ...prev, is_active: checked }))}
                    className="bg-zinc-800"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <Label htmlFor="is_featured" className="text-zinc-300">
                    Featured
                  </Label>
                  <Switch
                    id="is_featured"
                    checked={form.is_featured}
                    onCheckedChange={(checked) => setForm((prev) => ({ ...prev, is_featured: checked }))}
                    className="bg-zinc-800"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <Label htmlFor="is_bestseller" className="text-zinc-300">
                    Bestseller
                  </Label>
                  <Switch
                    id="is_bestseller"
                    checked={form.is_bestseller}
                    onCheckedChange={(checked) => setForm((prev) => ({ ...prev, is_bestseller: checked }))}
                    className="bg-zinc-800"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <Label htmlFor="is_new" className="text-zinc-300">
                    New
                  </Label>
                  <Switch
                    id="is_new"
                    checked={form.is_new}
                    onCheckedChange={(checked) => setForm((prev) => ({ ...prev, is_new: checked }))}
                    className="bg-zinc-800"
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
                    Region
                  </Label>
                  <Select
                    value={form.region}
                    onValueChange={(value) => setForm((prev) => ({ ...prev, region: value }))}
                  >
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
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="regions_available" className="text-zinc-300">
                    Regions Available
                  </Label>
                  <div className="flex flex-wrap gap-4">
                    {form.regions_available.map((region, index) => (
                      <div key={index} className="relative">
                        <span className="bg-zinc-800 text-white px-2 py-1 rounded">{region}</span>
                        <Button
                          type="button"
                          onClick={() => removeRegion(region)}
                          className="absolute top-0 right-0 bg-red-500 hover:bg-red-400 text-white cursor-pointer rounded"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Input
                    id="region_input"
                    value={regionInput}
                    onChange={(e) => setRegionInput(e.target.value)}
                    placeholder="Add region"
                    className="mt-1.5 bg-zinc-800 border-zinc-700 text-white"
                  />
                  <Button
                    type="button"
                    onClick={addRegion}
                    className="mt-2 bg-amber-500 hover:bg-amber-400 text-black cursor-pointer"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Region
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Additional */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
            <SectionHeader title="Additional" section="additional" icon={HelpCircle} />
            {expandedSections.additional && (
              <div className="p-6 space-y-4 border-t border-zinc-800">{/* Additional fields can be added here */}</div>
            )}
          </div>

          {/* Platforms */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
            <SectionHeader title="Platforms" section="platforms" icon={Monitor} />
            {expandedSections.platforms && (
              <div className="p-6 space-y-4 border-t border-zinc-800">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {allPlatforms.map((platform) => (
                    <div key={platform.id} className="flex items-center gap-4">
                      <Label htmlFor={`platform-${platform.id}`} className="text-zinc-300">
                        {platform.name}
                      </Label>
                      <Input
                        id={`platform-${platform.id}`}
                        type="number"
                        step="0.01"
                        value={selectedPlatforms.find((sp) => sp.platform_id === platform.id)?.price_modifier || "0"}
                        onChange={(e) => {
                          const priceModifier = e.target.value
                          setSelectedPlatforms((prev) => {
                            const updated = [...prev]
                            const index = updated.findIndex((sp) => sp.platform_id === platform.id)
                            if (index !== -1) {
                              updated[index].price_modifier = priceModifier
                            } else {
                              updated.push({
                                platform_id: platform.id,
                                price_modifier: priceModifier,
                                is_available: true,
                              })
                            }
                            return updated
                          })
                        }}
                        placeholder="Price modifier"
                        className="mt-1.5 bg-zinc-800 border-zinc-700 text-white"
                      />
                      <Switch
                        id={`is_available-${platform.id}`}
                        checked={selectedPlatforms.find((sp) => sp.platform_id === platform.id)?.is_available || true}
                        onCheckedChange={(checked) => {
                          setSelectedPlatforms((prev) => {
                            const updated = [...prev]
                            const index = updated.findIndex((sp) => sp.platform_id === platform.id)
                            if (index !== -1) {
                              updated[index].is_available = checked
                            } else {
                              updated.push({ platform_id: platform.id, price_modifier: "0", is_available: checked })
                            }
                            return updated
                          })
                        }}
                        className="bg-zinc-800"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Type Specific */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
            <SectionHeader title="Type Specific" section="typeSpecific" icon={Tag} />
            {expandedSections.typeSpecific && (
              <div className="p-6 space-y-4 border-t border-zinc-800">
                {form.product_type === "game" && (
                  <div>
                    <Label htmlFor="editions" className="text-zinc-300">
                      Editions
                    </Label>
                    <div className="space-y-4">
                      {editions.map((edition, index) => (
                        <div key={index} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor={`edition-name-${index}`} className="text-zinc-300">
                              Name
                            </Label>
                            <Input
                              id={`edition-name-${index}`}
                              value={edition.name}
                              onChange={(e) => updateEdition(index, "name", e.target.value)}
                              placeholder="Edition name"
                              className="mt-1.5 bg-zinc-800 border-zinc-700 text-white"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`edition-price-${index}`} className="text-zinc-300">
                              Price
                            </Label>
                            <Input
                              id={`edition-price-${index}`}
                              type="number"
                              step="0.01"
                              value={edition.price}
                              onChange={(e) => updateEdition(index, "price", e.target.value)}
                              placeholder="Edition price"
                              className="mt-1.5 bg-zinc-800 border-zinc-700 text-white"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`edition-is_default-${index}`} className="text-zinc-300">
                              Default
                            </Label>
                            <Switch
                              id={`edition-is_default-${index}`}
                              checked={edition.is_default}
                              onCheckedChange={(checked) => {
                                const updated = [...editions]
                                updated[index].is_default = checked
                                setEditions(updated)
                              }}
                              className="bg-zinc-800"
                            />
                          </div>
                          <div className="col-span-full">
                            <Label htmlFor={`edition-description-${index}`} className="text-zinc-300">
                              Description
                            </Label>
                            <Textarea
                              id={`edition-description-${index}`}
                              value={edition.description}
                              onChange={(e) => updateEdition(index, "description", e.target.value)}
                              placeholder="Edition description"
                              className="mt-1.5 bg-zinc-800 border-zinc-700 text-white"
                            />
                          </div>
                          <div className="col-span-full">
                            <Label htmlFor={`edition-includes-${index}`} className="text-zinc-300">
                              Includes
                            </Label>
                            <Textarea
                              id={`edition-includes-${index}`}
                              value={edition.includes.join(", ")}
                              onChange={(e) =>
                                updateEdition(index, "includes", e.target.value.split(", ").filter(Boolean))
                              }
                              placeholder="Includes"
                              className="mt-1.5 bg-zinc-800 border-zinc-700 text-white"
                            />
                          </div>
                          <div className="col-span-full">
                            <Label htmlFor={`edition-image_url-${index}`} className="text-zinc-300">
                              Image URL
                            </Label>
                            <Input
                              id={`edition-image_url-${index}`}
                              value={edition.image_url}
                              onChange={(e) => updateEdition(index, "image_url", e.target.value)}
                              placeholder="Image URL"
                              className="mt-1.5 bg-zinc-800 border-zinc-700 text-white"
                            />
                          </div>
                          <div className="col-span-full flex justify-end">
                            <Button
                              type="button"
                              onClick={() => removeEdition(index)}
                              className="bg-red-500 hover:bg-red-400 text-white cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Remove Edition
                            </Button>
                          </div>
                        </div>
                      ))}
                      <Button
                        type="button"
                        onClick={addEdition}
                        className="bg-amber-500 hover:bg-amber-400 text-black cursor-pointer"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Edition
                      </Button>
                    </div>
                  </div>
                )}
                {form.product_type === "giftcard" && (
                  <div>
                    <Label htmlFor="denominations" className="text-zinc-300">
                      Denominations
                    </Label>
                    <div className="space-y-4">
                      {denominations.map((denomination, index) => (
                        <div key={index} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                          <div>
                            <Label htmlFor={`denomination-value-${index}`} className="text-zinc-300">
                              Value
                            </Label>
                            <Input
                              id={`denomination-value-${index}`}
                              type="number"
                              step="0.01"
                              value={denomination.value}
                              onChange={(e) => updateDenomination(index, "value", e.target.value)}
                              placeholder="Denomination value"
                              className="mt-1.5 bg-zinc-800 border-zinc-700 text-white"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`denomination-price-${index}`} className="text-zinc-300">
                              Price
                            </Label>
                            <Input
                              id={`denomination-price-${index}`}
                              type="number"
                              step="0.01"
                              value={denomination.price}
                              onChange={(e) => updateDenomination(index, "price", e.target.value)}
                              placeholder="Denomination price"
                              className="mt-1.5 bg-zinc-800 border-zinc-700 text-white"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`denomination-currency-${index}`} className="text-zinc-300">
                              Currency
                            </Label>
                            <Select
                              value={denomination.currency}
                              onValueChange={(value) => updateDenomination(index, "currency", value)}
                            >
                              <SelectTrigger className="mt-1.5 bg-zinc-800 border-zinc-700 text-white cursor-pointer">
                                <SelectValue placeholder="Select currency" />
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
                            <Label htmlFor={`denomination-bonus_value-${index}`} className="text-zinc-300">
                              Bonus Value
                            </Label>
                            <Input
                              id={`denomination-bonus_value-${index}`}
                              type="number"
                              step="0.01"
                              value={denomination.bonus_value}
                              onChange={(e) => updateDenomination(index, "bonus_value", e.target.value)}
                              placeholder="Bonus value"
                              className="mt-1.5 bg-zinc-800 border-zinc-700 text-white"
                            />
                          </div>
                          <div className="col-span-full">
                            <Label htmlFor={`denomination-stock-${index}`} className="text-zinc-300">
                              Stock
                            </Label>
                            <Input
                              id={`denomination-stock-${index}`}
                              type="number"
                              value={denomination.stock}
                              onChange={(e) => updateDenomination(index, "stock", e.target.value)}
                              placeholder="Stock"
                              className="mt-1.5 bg-zinc-800 border-zinc-700 text-white"
                            />
                          </div>
                          <div className="col-span-full flex justify-end">
                            <Button
                              type="button"
                              onClick={() => removeDenomination(index)}
                              className="bg-red-500 hover:bg-red-400 text-white cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Remove Denomination
                            </Button>
                          </div>
                        </div>
                      ))}
                      <Button
                        type="button"
                        onClick={addDenomination}
                        className="bg-amber-500 hover:bg-amber-400 text-black cursor-pointer"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Denomination
                      </Button>
                    </div>
                  </div>
                )}
                {form.product_type === "subscription" && (
                  <div>
                    <Label htmlFor="plans" className="text-zinc-300">
                      Plans
                    </Label>
                    <div className="space-y-4">
                      {plans.map((plan, planIndex) => (
                        <div key={planIndex} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor={`plan-name-${planIndex}`} className="text-zinc-300">
                              Name
                            </Label>
                            <Input
                              id={`plan-name-${planIndex}`}
                              value={plan.name}
                              onChange={(e) => updatePlan(planIndex, "name", e.target.value)}
                              placeholder="Plan name"
                              className="mt-1.5 bg-zinc-800 border-zinc-700 text-white"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`plan-max_devices-${planIndex}`} className="text-zinc-300">
                              Max Devices
                            </Label>
                            <Input
                              id={`plan-max_devices-${planIndex}`}
                              type="number"
                              value={plan.max_devices}
                              onChange={(e) => updatePlan(planIndex, "max_devices", e.target.value)}
                              placeholder="Max devices"
                              className="mt-1.5 bg-zinc-800 border-zinc-700 text-white"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`plan-max_users-${planIndex}`} className="text-zinc-300">
                              Max Users
                            </Label>
                            <Input
                              id={`plan-max_users-${planIndex}`}
                              type="number"
                              value={plan.max_users}
                              onChange={(e) => updatePlan(planIndex, "max_users", e.target.value)}
                              placeholder="Max users"
                              className="mt-1.5 bg-zinc-800 border-zinc-700 text-white"
                            />
                          </div>
                          <div className="col-span-full">
                            <Label htmlFor={`plan-description-${planIndex}`} className="text-zinc-300">
                              Description
                            </Label>
                            <Textarea
                              id={`plan-description-${planIndex}`}
                              value={plan.description}
                              onChange={(e) => updatePlan(planIndex, "description", e.target.value)}
                              placeholder="Plan description"
                              className="mt-1.5 bg-zinc-800 border-zinc-700 text-white"
                            />
                          </div>
                          <div className="col-span-full">
                            <Label htmlFor={`plan-features-${planIndex}`} className="text-zinc-300">
                              Features
                            </Label>
                            <Textarea
                              id={`plan-features-${planIndex}`}
                              value={plan.features.join(", ")}
                              onChange={(e) =>
                                updatePlan(planIndex, "features", e.target.value.split(", ").filter(Boolean))
                              }
                              placeholder="Features"
                              className="mt-1.5 bg-zinc-800 border-zinc-700 text-white"
                            />
                          </div>
                          <div className="col-span-full">
                            <Label htmlFor={`plan-quality-${planIndex}`} className="text-zinc-300">
                              Quality
                            </Label>
                            <Input
                              id={`plan-quality-${planIndex}`}
                              value={plan.quality}
                              onChange={(e) => updatePlan(planIndex, "quality", e.target.value)}
                              placeholder="Quality"
                              className="mt-1.5 bg-zinc-800 border-zinc-700 text-white"
                            />
                          </div>
                          <div className="col-span-full">
                            <Label htmlFor={`plan-color-${planIndex}`} className="text-zinc-300">
                              Color
                            </Label>
                            <Input
                              id={`plan-color-${planIndex}`}
                              value={plan.color}
                              onChange={(e) => updatePlan(planIndex, "color", e.target.value)}
                              placeholder="Color"
                              className="mt-1.5 bg-zinc-800 border-zinc-700 text-white"
                            />
                          </div>
                          <div className="col-span-full">
                            <Label htmlFor={`plan-durations-${planIndex}`} className="text-zinc-300">
                              Durations
                            </Label>
                            <div className="space-y-4">
                              {plan.durations.map((duration, durIndex) => (
                                <div key={durIndex} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                  <div>
                                    <Label
                                      htmlFor={`duration-months-${planIndex}-${durIndex}`}
                                      className="text-zinc-300"
                                    >
                                      Months
                                    </Label>
                                    <Input
                                      id={`duration-months-${planIndex}-${durIndex}`}
                                      type="number"
                                      value={duration.months}
                                      onChange={(e) =>
                                        updatePlanDuration(planIndex, durIndex, "months", e.target.value)
                                      }
                                      placeholder="Months"
                                      className="mt-1.5 bg-zinc-800 border-zinc-700 text-white"
                                    />
                                  </div>
                                  <div>
                                    <Label
                                      htmlFor={`duration-label-${planIndex}-${durIndex}`}
                                      className="text-zinc-300"
                                    >
                                      Label
                                    </Label>
                                    <Input
                                      id={`duration-label-${planIndex}-${durIndex}`}
                                      value={duration.label}
                                      onChange={(e) => updatePlanDuration(planIndex, durIndex, "label", e.target.value)}
                                      placeholder="Label"
                                      className="mt-1.5 bg-zinc-800 border-zinc-700 text-white"
                                    />
                                  </div>
                                  <div>
                                    <Label
                                      htmlFor={`duration-price-${planIndex}-${durIndex}`}
                                      className="text-zinc-300"
                                    >
                                      Price
                                    </Label>
                                    <Input
                                      id={`duration-price-${planIndex}-${durIndex}`}
                                      type="number"
                                      step="0.01"
                                      value={duration.price}
                                      onChange={(e) => updatePlanDuration(planIndex, durIndex, "price", e.target.value)}
                                      placeholder="Price"
                                      className="mt-1.5 bg-zinc-800 border-zinc-700 text-white"
                                    />
                                  </div>
                                  <div className="col-span-full flex justify-end">
                                    <Button
                                      type="button"
                                      onClick={() => removePlanDuration(planIndex, durIndex)}
                                      className="bg-red-500 hover:bg-red-400 text-white cursor-pointer"
                                    >
                                      <Trash2 className="w-4 h-4 mr-2" />
                                      Remove Duration
                                    </Button>
                                  </div>
                                </div>
                              ))}
                              <Button
                                type="button"
                                onClick={() => addPlanDuration(planIndex)}
                                className="bg-amber-500 hover:bg-amber-400 text-black cursor-pointer"
                              >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Duration
                              </Button>
                            </div>
                          </div>
                          <div className="col-span-full flex justify-end">
                            <Button
                              type="button"
                              onClick={() => removePlan(planIndex)}
                              className="bg-red-500 hover:bg-red-400 text-white cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Remove Plan
                            </Button>
                          </div>
                        </div>
                      ))}
                      <Button
                        type="button"
                        onClick={addPlan}
                        className="bg-amber-500 hover:bg-amber-400 text-black cursor-pointer"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Plan
                      </Button>
                    </div>
                  </div>
                )}
                {form.product_type === "software" && (
                  <div>
                    <Label htmlFor="license_types" className="text-zinc-300">
                      License Types
                    </Label>
                    <div className="space-y-4">
                      {licenseTypes.map((licenseType, index) => (
                        <div key={index} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor={`license-type-name-${index}`} className="text-zinc-300">
                              Name
                            </Label>
                            <Input
                              id={`license-type-name-${index}`}
                              value={licenseType.name}
                              onChange={(e) => updateLicenseType(index, "name", e.target.value)}
                              placeholder="License type name"
                              className="mt-1.5 bg-zinc-800 border-zinc-700 text-white"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`license-type-max_users-${index}`} className="text-zinc-300">
                              Max Users
                            </Label>
                            <Input
                              id={`license-type-max_users-${index}`}
                              type="number"
                              value={licenseType.max_users}
                              onChange={(e) => updateLicenseType(index, "max_users", e.target.value)}
                              placeholder="Max users"
                              className="mt-1.5 bg-zinc-800 border-zinc-700 text-white"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`license-type-max_devices-${index}`} className="text-zinc-300">
                              Max Devices
                            </Label>
                            <Input
                              id={`license-type-max_devices-${index}`}
                              type="number"
                              value={licenseType.max_devices}
                              onChange={(e) => updateLicenseType(index, "max_devices", e.target.value)}
                              placeholder="Max devices"
                              className="mt-1.5 bg-zinc-800 border-zinc-700 text-white"
                            />
                          </div>
                          <div className="col-span-full">
                            <Label htmlFor={`license-type-description-${index}`} className="text-zinc-300">
                              Description
                            </Label>
                            <Textarea
                              id={`license-type-description-${index}`}
                              value={licenseType.description}
                              onChange={(e) => updateLicenseType(index, "description", e.target.value)}
                              placeholder="License type description"
                              className="mt-1.5 bg-zinc-800 border-zinc-700 text-white"
                            />
                          </div>
                          <div className="col-span-full">
                            <Label htmlFor={`license-type-features-${index}`} className="text-zinc-300">
                              Features
                            </Label>
                            <Textarea
                              id={`license-type-features-${index}`}
                              value={licenseType.features.join(", ")}
                              onChange={(e) =>
                                updateLicenseType(index, "features", e.target.value.split(", ").filter(Boolean))
                              }
                              placeholder="Features"
                              className="mt-1.5 bg-zinc-800 border-zinc-700 text-white"
                            />
                          </div>
                          <div className="col-span-full flex justify-end">
                            <Button
                              type="button"
                              onClick={() => removeLicenseType(index)}
                              className="bg-red-500 hover:bg-red-400 text-white cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Remove License Type
                            </Button>
                          </div>
                        </div>
                      ))}
                      <Button
                        type="button"
                        onClick={addLicenseType}
                        className="bg-amber-500 hover:bg-amber-400 text-black cursor-pointer"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add License Type
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
            <SectionHeader title="Tags" section="tags" icon={Tag} />
            {expandedSections.tags && (
              <div className="p-6 space-y-4 border-t border-zinc-800">
                <div>
                  <Label htmlFor="tags" className="text-zinc-300">
                    Tags
                  </Label>
                  <div className="flex flex-wrap gap-4">
                    {form.tags.map((tag, index) => (
                      <div key={index} className="relative">
                        <span className="bg-zinc-800 text-white px-2 py-1 rounded">{tag}</span>
                        <Button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="absolute top-0 right-0 bg-red-500 hover:bg-red-400 text-white cursor-pointer rounded"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Input
                    id="tag_input"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add tag"
                    className="mt-1.5 bg-zinc-800 border-zinc-700 text-white"
                  />
                  <Button
                    type="button"
                    onClick={addTag}
                    className="mt-2 bg-amber-500 hover:bg-amber-400 text-black cursor-pointer"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Tag
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* FAQs */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
            <SectionHeader title="FAQs" section="faqs" icon={HelpCircle} />
            {expandedSections.faqs && (
              <div className="p-6 space-y-4 border-t border-zinc-800">
                <div>
                  <Label htmlFor="faqs" className="text-zinc-300">
                    FAQs
                  </Label>
                  <div className="space-y-4">
                    {faqs.map((faq, index) => (
                      <div key={index} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`faq-question-${index}`} className="text-zinc-300">
                            Question
                          </Label>
                          <Input
                            id={`faq-question-${index}`}
                            value={faq.question}
                            onChange={(e) => updateFaq(index, "question", e.target.value)}
                            placeholder="FAQ question"
                            className="mt-1.5 bg-zinc-800 border-zinc-700 text-white"
                          />
                        </div>
                        <div className="col-span-full">
                          <Label htmlFor={`faq-answer-${index}`} className="text-zinc-300">
                            Answer
                          </Label>
                          <Textarea
                            id={`faq-answer-${index}`}
                            value={faq.answer}
                            onChange={(e) => updateFaq(index, "answer", e.target.value)}
                            placeholder="FAQ answer"
                            className="mt-1.5 bg-zinc-800 border-zinc-700 text-white"
                          />
                        </div>
                        <div className="col-span-full flex justify-end">
                          <Button
                            type="button"
                            onClick={() => removeFaq(index)}
                            className="bg-red-500 hover:bg-red-400 text-white cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Remove FAQ
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button
                      type="button"
                      onClick={addFaq}
                      className="bg-amber-500 hover:bg-amber-400 text-black cursor-pointer"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add FAQ
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* License Durations */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
            <SectionHeader title="License Durations" section="licenseDurations" icon={HelpCircle} />
            {expandedSections.licenseDurations && (
              <div className="p-6 space-y-4 border-t border-zinc-800">
                <div>
                  <Label htmlFor="license_durations" className="text-zinc-300">
                    License Durations
                  </Label>
                  <div className="space-y-4">
                    {licenseDurations.map((duration, index) => (
                      <div key={index} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor={`duration-duration_type-${index}`} className="text-zinc-300">
                            Duration Type
                          </Label>
                          <Select
                            value={duration.duration_type}
                            onValueChange={(value) => updateLicenseDuration(index, "duration_type", value)}
                          >
                            <SelectTrigger className="mt-1.5 bg-zinc-800 border-zinc-700 text-white cursor-pointer">
                              <SelectValue placeholder="Select duration type" />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-800 border-zinc-700">
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
                          <Label htmlFor={`duration-label-${index}`} className="text-zinc-300">
                            Label
                          </Label>
                          <Input
                            id={`duration-label-${index}`}
                            value={duration.label}
                            onChange={(e) => updateLicenseDuration(index, "label", e.target.value)}
                            placeholder="Label"
                            className="mt-1.5 bg-zinc-800 border-zinc-700 text-white"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`duration-price_multiplier-${index}`} className="text-zinc-300">
                            Price Multiplier
                          </Label>
                          <Input
                            id={`duration-price_multiplier-${index}`}
                            type="number"
                            step="0.01"
                            value={duration.price_multiplier}
                            onChange={(e) => updateLicenseDuration(index, "price_multiplier", e.target.value)}
                            placeholder="Price multiplier"
                            className="mt-1.5 bg-zinc-800 border-zinc-700 text-white"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`duration-discount_percent-${index}`} className="text-zinc-300">
                            Discount Percent
                          </Label>
                          <Input
                            id={`duration-discount_percent-${index}`}
                            type="number"
                            step="0.01"
                            value={duration.discount_percent}
                            onChange={(e) => updateLicenseDuration(index, "discount_percent", e.target.value)}
                            placeholder="Discount percent"
                            className="mt-1.5 bg-zinc-800 border-zinc-700 text-white"
                          />
                        </div>
                        <div className="col-span-full flex justify-end">
                          <Button
                            type="button"
                            onClick={() => removeLicenseDuration(index)}
                            className="bg-red-500 hover:bg-red-400 text-white cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Remove Duration
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button
                      type="button"
                      onClick={addLicenseDuration}
                      className="bg-amber-500 hover:bg-amber-400 text-black cursor-pointer"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Duration
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
