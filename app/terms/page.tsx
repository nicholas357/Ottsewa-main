import type { Metadata } from "next"
import { FileText, Shield, Package, AlertTriangle, Scale, Mail, Cookie, MessageSquare } from "lucide-react"
import { PageHeader } from "@/components/info-pages/page-header"
import { InfoSection } from "@/components/info-pages/info-section"
import { TableOfContents } from "@/components/info-pages/table-of-contents"
import { QuickLinks } from "@/components/info-pages/quick-links"

export const metadata: Metadata = {
  title: "Terms of Service | OTTSewa",
  description:
    "Terms of Service for OTTSewa digital subscription marketplace. Read our terms and conditions before using our services.",
  keywords: "OTTSewa terms, terms of service, user agreement, legal terms",
}

const tocItems = [
  { id: "acceptance", title: "Acceptance of Terms" },
  { id: "eligibility", title: "Eligibility" },
  { id: "services", title: "Use of Services" },
  { id: "accounts", title: "Account Responsibilities" },
  { id: "products", title: "Products & Delivery" },
  { id: "payments", title: "Payments & Pricing" },
  { id: "intellectual", title: "Intellectual Property" },
  { id: "liability", title: "Limitation of Liability" },
  { id: "termination", title: "Termination" },
  { id: "changes", title: "Changes to Terms" },
  { id: "contact", title: "Contact Information" },
]

const quickLinks = [
  { title: "Privacy Policy", description: "How we protect you", href: "/privacy", icon: Shield },
  { title: "Refund Policy", description: "Our refund guidelines", href: "/refund-policy", icon: Package },
  { title: "Cookie Policy", description: "How we use cookies", href: "/cookies", icon: Cookie },
  { title: "Contact Us", description: "Get in touch", href: "/contact", icon: MessageSquare },
]

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black">
      <PageHeader
        icon={FileText}
        title="Terms of Service"
        description="Please read these terms carefully before using OTTSewa's services. By accessing our platform, you agree to be bound by these terms."
        badge="Last Updated: January 2025"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {/* Table of Contents - Sticky Sidebar */}
          <div className="hidden lg:block">
            <TableOfContents items={tocItems} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-12">
            <InfoSection title="1. Acceptance of Terms" id="acceptance">
              <p>
                By accessing and using OTTSewa's website, mobile applications, and services (collectively, the
                "Services"), you accept and agree to be bound by these Terms of Service ("Terms"). If you do not agree
                to these Terms, please do not use our Services.
              </p>
              <p>
                These Terms constitute a legally binding agreement between you and OTTSewa. We reserve the right to
                modify these Terms at any time, and such modifications will be effective immediately upon posting.
              </p>
              <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-4 mt-4">
                <p className="text-amber-400 text-sm">
                  <strong>Important:</strong> Your continued use of our Services after any changes indicates your
                  acceptance of the modified Terms.
                </p>
              </div>
            </InfoSection>

            <InfoSection title="2. Eligibility" id="eligibility">
              <p>To use our Services, you must:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Be at least 18 years old or the age of majority in your jurisdiction</li>
                <li>Have the legal capacity to enter into a binding agreement</li>
                <li>Not be prohibited from using our Services under applicable laws</li>
                <li>Provide accurate and complete information during registration</li>
              </ul>
              <p className="mt-4">
                By using our Services, you represent and warrant that you meet all eligibility requirements.
              </p>
            </InfoSection>

            <InfoSection title="3. Use of Services" id="services">
              <p>
                You agree to use our Services only for lawful purposes and in accordance with these Terms. You agree:
              </p>
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 mt-4">
                <h4 className="text-white font-medium mb-4">Prohibited Activities</h4>
                <ul className="space-y-3">
                  {[
                    "Use our Services for any illegal or unauthorized purpose",
                    "Attempt to gain unauthorized access to our systems or other users' accounts",
                    "Resell products purchased from our platform without authorization",
                    "Provide false, misleading, or inaccurate information",
                    "Interfere with or disrupt our Services or servers",
                    "Use automated systems or bots to access our Services",
                    "Engage in any activity that could harm our reputation or business",
                    "Violate any applicable laws or regulations",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-zinc-400">
                      <AlertTriangle className="w-4 h-4 text-amber-500/70 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </InfoSection>

            <InfoSection title="4. Account Responsibilities" id="accounts">
              <p>When you create an account with us, you are responsible for:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized access or use</li>
                <li>Ensuring your account information is accurate and up-to-date</li>
              </ul>
              <p className="mt-4">
                We reserve the right to suspend or terminate accounts that violate these Terms or engage in suspicious
                activity.
              </p>
            </InfoSection>

            <InfoSection title="5. Products & Delivery" id="products">
              <p>
                OTTSewa sells digital products including subscription codes, gift cards, and digital services. Regarding
                our products:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>All products are delivered electronically to your registered email and account dashboard</li>
                <li>Most products are delivered instantly after payment confirmation</li>
                <li>Some products may take up to 24-48 hours during high-demand periods</li>
                <li>We are not responsible for delays caused by third-party payment processors</li>
                <li>Product availability and pricing are subject to change without notice</li>
                <li>We reserve the right to limit quantities or refuse orders</li>
              </ul>
            </InfoSection>

            <InfoSection title="6. Payments & Pricing" id="payments">
              <p>By making a purchase on OTTSewa:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>You agree to pay the price displayed at checkout plus any applicable fees</li>
                <li>All prices are in Nepali Rupees (NPR) unless otherwise stated</li>
                <li>Prices may change without prior notice</li>
                <li>Payment must be made through our approved payment methods</li>
                <li>All sales are final as per our Refund Policy</li>
              </ul>
              <p className="mt-4">
                We use secure, third-party payment processors to handle transactions. We never store your complete
                payment information on our servers.
              </p>
            </InfoSection>

            <InfoSection title="7. Intellectual Property" id="intellectual">
              <p>
                All content on OTTSewa, including but not limited to text, graphics, logos, images, software, and the
                compilation thereof, is the property of OTTSewa or its content suppliers and is protected by
                intellectual property laws.
              </p>
              <p className="mt-4">You may not:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Copy, modify, or distribute our content without permission</li>
                <li>Use our trademarks or branding without authorization</li>
                <li>Reverse engineer or attempt to extract source code</li>
                <li>Create derivative works based on our Services</li>
              </ul>
            </InfoSection>

            <InfoSection title="8. Limitation of Liability" id="liability">
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                <p className="text-zinc-300">
                  To the maximum extent permitted by law, OTTSewa shall not be liable for any indirect, incidental,
                  special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred
                  directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting
                  from:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-4 text-zinc-400">
                  <li>Your use or inability to use our Services</li>
                  <li>Any unauthorized access to or use of our servers</li>
                  <li>Any interruption or cessation of transmission to our Services</li>
                  <li>Any bugs, viruses, or similar harmful code</li>
                  <li>Any errors or omissions in any content</li>
                  <li>Issues with third-party platforms or services</li>
                </ul>
              </div>
            </InfoSection>

            <InfoSection title="9. Termination" id="termination">
              <p>
                We may terminate or suspend your account and access to our Services immediately, without prior notice or
                liability, for any reason, including but not limited to:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Breach of these Terms</li>
                <li>Fraudulent or illegal activity</li>
                <li>Request by law enforcement or government agencies</li>
                <li>Extended periods of inactivity</li>
                <li>Unexpected technical or security issues</li>
              </ul>
              <p className="mt-4">
                Upon termination, your right to use our Services will immediately cease. All provisions of these Terms
                that should reasonably survive termination shall survive.
              </p>
            </InfoSection>

            <InfoSection title="10. Changes to Terms" id="changes">
              <p>
                We reserve the right to modify these Terms at any time. We will notify users of significant changes
                through:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Email notification to registered users</li>
                <li>Prominent notice on our website</li>
                <li>Update to the "Last Updated" date at the top of this page</li>
              </ul>
              <p className="mt-4">
                Your continued use of our Services after any changes constitutes your acceptance of the new Terms. We
                encourage you to review these Terms periodically.
              </p>
            </InfoSection>

            <InfoSection title="11. Contact Information" id="contact">
              <p className="mb-6">For questions about these Terms or our Services, please contact us:</p>
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-amber-500" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-2">Legal Inquiries</h4>
                    <p className="text-zinc-400 mb-3">For legal matters and questions about our Terms of Service.</p>
                    <a href="mailto:legal@ottsewa.store" className="text-amber-400 hover:text-amber-300 font-medium">
                      legal@ottsewa.store
                    </a>
                  </div>
                </div>
              </div>
            </InfoSection>

            {/* Governing Law Notice */}
            <div className="border-t border-zinc-800 pt-8">
              <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-6 flex items-start gap-4">
                <Scale className="w-6 h-6 text-amber-500 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-medium mb-2">Governing Law</h4>
                  <p className="text-zinc-400 text-sm">
                    These Terms and any disputes arising from them shall be governed by and construed in accordance with
                    the laws of Nepal, without regard to conflict of law principles. Any legal action or proceeding
                    relating to these Terms shall be brought exclusively in the courts of Nepal.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <QuickLinks title="Related Policies" links={quickLinks} />
    </div>
  )
}
