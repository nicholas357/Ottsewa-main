import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Poppins } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import Header from "@/components/header"
import Footer from "@/components/footer"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { NotificationProvider } from "@/components/notification-provider"
import { CartProvider } from "@/contexts/cart-context"
import { WishlistProvider } from "@/contexts/wishlist-context"
import { ScrollToTop } from "@/components/scroll-to-top"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { PageTransition } from "@/components/page-transition"
import { RouteTransitionBar } from "@/components/route-transition"
import { ScrollToTopButton } from "@/components/scroll-to-top-button"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
})

export const metadata: Metadata = {
  title: {
    default: "OTTSewa - Nepal's Best Streaming Subscription Provider",
    template: "%s | OTTSewa",
  },
  description:
    "Buy Netflix, Spotify, Disney+, YouTube Premium, HBO Max and more streaming subscriptions at the best prices in Nepal. Instant delivery, genuine codes, and 24/7 support.",
  keywords: [
    "streaming subscriptions Nepal",
    "Netflix Nepal",
    "Spotify Premium Nepal",
    "Disney+ Nepal",
    "YouTube Premium Nepal",
    "gift cards Nepal",
    "digital products Nepal",
    "OTTSewa",
    "streaming service Nepal",
    "buy subscriptions online Nepal",
  ],
  authors: [{ name: "OTTSewa", url: "https://ottsewa.store" }],
  creator: "OTTSewa",
  publisher: "OTTSewa",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://ottsewa.store"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ottsewa.store",
    siteName: "OTTSewa",
    title: "OTTSewa - Nepal's Best Streaming Subscription Provider",
    description:
      "Buy Netflix, Spotify, Disney+, YouTube Premium and more streaming subscriptions at the best prices in Nepal.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "OTTSewa - Streaming Subscriptions Nepal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OTTSewa - Nepal's Best Streaming Subscription Provider",
    description: "Buy streaming subscriptions at the best prices in Nepal. Instant delivery & genuine codes.",
    images: ["/og-image.png"],
    creator: "@ottsewa",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-code",
  },
  generator: "v0.app",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#000000" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-black">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased bg-black`}>
        <WishlistProvider>
          <CartProvider>
            <RouteTransitionBar />
            <ScrollToTop />
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-amber-500 focus:text-black focus:rounded-lg"
            >
              Skip to main content
            </a>
            <div className="flex flex-col min-h-screen">
              <Header />
              <div id="main-content" className="flex-1 pb-20 lg:pb-0">
                <PageTransition>{children}</PageTransition>
              </div>
              <Footer />
            </div>
            <MobileBottomNav />
            <ScrollToTopButton />
            <NotificationProvider />
            <Toaster />
          </CartProvider>
        </WishlistProvider>
        <Analytics />
      </body>
    </html>
  )
}
