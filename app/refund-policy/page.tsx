import type { Metadata } from "next"
import { AlertTriangle, CheckCircle, XCircle, HelpCircle, Mail, Clock, Shield, ArrowRight } from "lucide-react"
import { PageHeader } from "@/components/info-pages/page-header"
import { InfoSection } from "@/components/info-pages/info-section"
import { TableOfContents } from "@/components/info-pages/table-of-contents"
import { QuickLinks } from "@/components/info-pages/quick-links"
import { FileText, MessageSquare } from "lucide-react"

export const metadata: Metadata = {
  title: "Refund Policy | OTTSewa - Digital Products Policy",
  description:
    "OTTSewa's refund policy for digital subscriptions and products. Understand our policies before purchase.",
  keywords: "OTTSewa refund, return policy, digital products policy, streaming subscription refund",
}

const tocItems = [
  { id: "overview", title: "Policy Overview" },
  { id: "no-refund", title: "No Refund Policy" },
  { id: "before-purchase", title: "Before You Purchase" },
  { id: "exceptions", title: "Exceptions" },
  { id: "contact", title: "Contact Us" },
]

const eligibleCases = [
  { text: "Invalid or already redeemed codes upon delivery", icon: CheckCircle },
  { text: "Duplicate orders made within minutes by accident", icon: CheckCircle },
  { text: "Technical errors caused by our system during purchase", icon: CheckCircle },
  { text: "Product not delivered within 48 hours with no explanation", icon: CheckCircle },
]

const ineligibleCases = [
  { text: "Change of mind after purchase", icon: XCircle },
  { text: "Ordering wrong product or variant", icon: XCircle },
  { text: "Regional compatibility issues (check before buying)", icon: XCircle },
  { text: "Issues with third-party platforms (Netflix, Spotify, etc.)", icon: XCircle },
  { text: "Account suspension by streaming service", icon: XCircle },
]

const quickLinks = [
  { title: "Terms of Service", description: "Read our terms", href: "/terms", icon: FileText },
  { title: "Privacy Policy", description: "How we protect you", href: "/privacy", icon: Shield },
  { title: "Contact Us", description: "Get in touch", href: "/contact", icon: MessageSquare },
  { title: "FAQ", description: "Common questions", href: "/faq", icon: HelpCircle },
]

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-black">
      <PageHeader
        title="Refund Policy"
        description="Please read our refund policy carefully before making a purchase. We want you to understand our policies regarding digital products."
        badge="Last Updated: January 2025"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Important Notice */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="relative bg-amber-500/10 border border-amber-500/30 rounded-xl p-6 overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <h3 className="text-amber-400 font-semibold text-lg mb-2">Important Notice</h3>
                <p className="text-zinc-300">
                  All sales on OTTSewa are final. Due to the digital nature of our products, we do not offer refunds
                  once a purchase has been made and delivered. Please review all product details before completing your
                  purchase.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {/* Table of Contents - Sticky Sidebar */}
          <div className="hidden lg:block">
            <TableOfContents items={tocItems} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-12">
            <InfoSection title="Policy Overview" id="overview">
              <p>
                At OTTSewa, we strive to provide the best digital subscription experience in Nepal. This refund policy
                explains our guidelines for handling purchase-related concerns and the circumstances under which we may
                provide assistance.
              </p>
              <p>
                Because our products are digital in nature and delivered instantly, traditional refund policies don't
                apply. Once a digital code is delivered, it cannot be "returned" in the traditional sense. This policy
                exists to protect both our customers and our business while ensuring fair treatment for everyone.
              </p>
            </InfoSection>

            <InfoSection title="No Refund Policy" id="no-refund">
              <p>
                All purchases of digital products, subscriptions, gift cards, and services are final and non-refundable.
                This policy exists because:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Digital products are delivered instantly and cannot be "returned"</li>
                <li>Subscription codes and gift cards are activated immediately upon delivery</li>
                <li>We cannot verify if a digital product has been used or shared after delivery</li>
                <li>Our pricing model accounts for the finality of digital sales</li>
              </ul>
            </InfoSection>

            <InfoSection title="Before You Purchase" id="before-purchase">
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 mb-6">
                <h4 className="text-white font-medium mb-4">We strongly encourage all customers to:</h4>
                <ul className="space-y-3">
                  {[
                    "Carefully read the product description and requirements",
                    "Verify compatibility with your device, region, or platform",
                    "Ensure you are purchasing the correct product variant",
                    "Review the subscription duration and terms",
                    "Contact our support team if you have any questions",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <span className="text-zinc-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="text-zinc-400 text-sm">
                Taking these steps before purchasing will help ensure you receive exactly what you need and avoid any
                potential issues.
              </p>
            </InfoSection>

            <InfoSection title="Exceptions" id="exceptions">
              <p className="mb-6">
                In rare circumstances, we may consider assistance on a case-by-case basis. Please note that these
                exceptions are not guaranteed.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Eligible Cases */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
                  <h4 className="text-white font-medium mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    May Be Eligible
                  </h4>
                  <ul className="space-y-3">
                    {eligibleCases.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-zinc-400">
                        <item.icon className="w-4 h-4 text-green-500/70 flex-shrink-0 mt-0.5" />
                        <span>{item.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Ineligible Cases */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
                  <h4 className="text-white font-medium mb-4 flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-red-500" />
                    Not Eligible
                  </h4>
                  <ul className="space-y-3">
                    {ineligibleCases.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-zinc-400">
                        <item.icon className="w-4 h-4 text-red-500/70 flex-shrink-0 mt-0.5" />
                        <span>{item.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 flex items-start gap-3 p-4 bg-zinc-800/50 rounded-lg">
                <Clock className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-zinc-400 text-sm">
                  <strong className="text-white">Important:</strong> You must contact us within 24 hours of purchase
                  with proof of the issue to be considered for any exception.
                </p>
              </div>
            </InfoSection>

            <InfoSection title="Contact Us" id="contact">
              <p className="mb-6">
                If you experience any issues with your purchase that you believe falls under our exceptions policy,
                please contact our support team immediately.
              </p>

              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-amber-500" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-2">Email Support</h4>
                    <p className="text-zinc-400 mb-3">
                      Please include your order ID and a detailed description of the issue. Our team will respond within
                      24-48 hours.
                    </p>
                    <a
                      href="mailto:support@ottsewa.store"
                      className="text-amber-400 hover:text-amber-300 font-medium inline-flex items-center gap-2"
                    >
                      support@ottsewa.store
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </InfoSection>

            {/* Agreement Notice */}
            <div className="border-t border-zinc-800 pt-8">
              <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-6">
                <h4 className="text-white font-medium mb-3">Agreement</h4>
                <p className="text-zinc-400 text-sm">
                  By making a purchase on OTTSewa, you acknowledge and agree to this refund policy. If you do not agree
                  with these terms, please do not make a purchase. We recommend reviewing this policy before each
                  purchase.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <QuickLinks title="Related Policies" links={quickLinks} />
    </div>
  )
}
