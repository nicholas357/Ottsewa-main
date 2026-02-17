export interface NetflixPlan {
  id: string
  name: string
  price: string
  duration: string
  features: string[]
  best: boolean
  buyLink?: string
  description?: string
}

export interface NetflixPageConfig {
  plans: NetflixPlan[]
  actionButtons: Array<{
    id: string
    label: string
    href: string
    variant?: "primary" | "secondary"
    icon?: string
  }>
  heroTitle: string
  heroDescription: string
  seoKeywords: string[]
}

export const DEFAULT_NETFLIX_CONFIG: NetflixPageConfig = {
  heroTitle: "Netflix in Nepal 2026 - Complete Guide to Plans, Pricing & Subscription Starting Rs. 350",
  heroDescription:
    "Netflix subscription in Nepal 2026 - Complete guide to Netflix subscription plans, pricing from Rs. 350, features, 4K quality, and how to buy Netflix online. Compare Netflix subscription options: Mobile, Basic, Standard, Premium Netflix plans with instant delivery.",
  plans: [
    {
      id: "mobile",
      name: "Mobile",
      price: "Rs. 350",
      duration: "1 Month",
      description: "Netflix subscription mobile plan",
      features: [
        "Watch Netflix on mobile phones only",
        "Netflix resolution: 480p SD Quality",
        "Single Netflix screen at a time",
        "Download Netflix content to watch offline",
        "Full Netflix library access",
        "Netflix ad-supported streaming",
      ],
      best: false,
      buyLink: "/category?search=netflix",
    },
    {
      id: "basic",
      name: "Basic",
      price: "Rs. 350",
      duration: "1 Month",
      description: "Netflix subscription basic plan for HD",
      features: [
        "Watch Netflix on TV, computer, mobile",
        "Netflix resolution: 720p (HD Quality)",
        "Netflix single screen at a time",
        "Download Netflix content for offline viewing",
        "Full Netflix library and original series access",
        "Netflix no ads included",
      ],
      best: false,
      buyLink: "/category?search=netflix",
    },
    {
      id: "standard",
      name: "Standard",
      price: "Rs. 499",
      duration: "1 Month",
      description: "Netflix subscription standard plan with two screens",
      features: [
        "Watch Netflix on TV, computer, mobile devices",
        "Netflix resolution: 1080p (Full HD Quality)",
        "Netflix two screens at the same time simultaneously",
        "Download unlimited Netflix content for offline",
        "Full Netflix library and originals access",
        "Netflix group watch & screen sharing feature",
      ],
      best: true,
      buyLink: "/category?search=netflix",
    },
    {
      id: "premium",
      name: "Premium",
      price: "Rs. 999",
      duration: "1 Month",
      description: "Netflix subscription premium plan with 4K ultra HD",
      features: [
        "Watch Netflix on TV, computer, mobile, all devices",
        "Netflix resolution: 4K Ultra HD Quality with HDR",
        "Netflix four screens simultaneously at same time",
        "Download unlimited Netflix content for offline view",
        "Full Netflix library, originals, exclusive content",
        "Netflix group watch & advanced screen sharing",
        "Netflix spatial audio & Dolby Atmos support",
        "Netflix HDR & HDR10+ 4K content access",
      ],
      best: false,
      buyLink: "/category?search=netflix",
    },
  ],
  actionButtons: [
    {
      id: "buy-netflix",
      label: "Buy Netflix Now - From Rs. 350",
      href: "/category?search=netflix",
      variant: "primary",
      icon: "shopping-cart",
    },
    {
      id: "view-plans",
      label: "View All Netflix Plans",
      href: "#plans",
      variant: "secondary",
      icon: "list",
    },
  ],
  seoKeywords: [
    "Netflix subscription Nepal 2026",
    "Netflix subscription in Nepal",
    "Netflix subscription cost Nepal",
    "Netflix subscription price Nepal Rs. 350",
    "Netflix subscription plans Nepal",
    "Netflix subscription mobile Nepal",
    "Netflix subscription basic Nepal",
    "Netflix subscription standard Nepal",
    "Netflix subscription premium Nepal 4K",
    "Netflix subscription family Nepal",
    "Netflix subscription how to buy Nepal",
    "Netflix subscription instant delivery Nepal",
    "Netflix subscription eSewa Khalti Nepal",
    "Netflix subscription download offline Nepal",
    "Netflix subscription sharing Nepal",
    "Netflix subscription 4K ultra HD Nepal",
    "Netflix subscription two screens Nepal",
    "Netflix subscription four screens Nepal",
    "Netflix subscription HD quality Nepal",
    "Netflix subscription original series Nepal",
    "Netflix subscription movies Nepal",
    "Netflix subscription best price Nepal",
    "Netflix subscription payment methods Nepal",
    "Netflix subscription guide Nepal",
    "buy Netflix subscription Nepal",
    "Netflix subscription comparison Nepal",
    "Netflix subscription features Nepal",
    "Netflix subscription free trial Nepal",
    "Netflix subscription cancel Nepal",
    "Netflix subscription account Nepal",
  ],
}

export function getNetflixConfig(): NetflixPageConfig {
  if (typeof window === "undefined") {
    return DEFAULT_NETFLIX_CONFIG
  }

  try {
    const stored = localStorage.getItem("netflix-config")
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error("[v0] Error loading Netflix config from localStorage:", error)
  }

  return DEFAULT_NETFLIX_CONFIG
}

export function saveNetflixConfig(config: NetflixPageConfig): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem("netflix-config", JSON.stringify(config))
  } catch (error) {
    console.error("[v0] Error saving Netflix config to localStorage:", error)
  }
}
