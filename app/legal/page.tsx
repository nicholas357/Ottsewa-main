import type { Metadata } from "next"
import { Scale, Building, Mail, Globe, Shield, FileText, HelpCircle, Cookie, MessageSquare, Phone } from "lucide-react"
import { PageHeader } from "@/components/info-pages/page-header"
import { InfoSection } from "@/components/info-pages/info-section"
import { TableOfContents } from "@/components/info-pages/table-of-contents"
import { QuickLinks } from "@/components/info-pages/quick-links"

export const metadata: Metadata = {
  title: "Legal Notice | OTTSewa - Company Information",
  description:
    "Legal Notice for OTTSewa digital subscription marketplace. Official company information and legal details.",
  keywords: "OTTSewa legal, company information, legal notice, business registration Nepal",
}

const tocItems = [
  { id: "company-info", title: "Company Information" },
  { id: "business-scope", title: "Business Scope" },
  { id: "intellectual-property", title: "Intellectual Property" },
  { id: "disclaimer", title: "Disclaimer" },
  { id: "governing-law", title: "Governing Law" },
  { id: "contact", title: "Contact Information" },
]

const quickLinks = [
  { title: "Terms of Service", description: "Read our terms", href: "/terms", icon: FileText },
  { title: "Privacy Policy", description: "How we protect you", href: "/privacy", icon: Shield },
  { title: "Cookie Policy", description: "How we use cookies", href: "/cookies", icon: Cookie },
  { title: "FAQ", description: "Common questions", href: "/faq", icon: HelpCircle },
]

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-black">
      <PageHeader
        icon={Scale}
        title="Legal Notice"
        description="Official legal information and company details for OTTSewa digital subscription marketplace."
        badge="Legal Information"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {/* Table of Contents - Sticky Sidebar */}
          <div className="hidden lg:block">
            <TableOfContents items={tocItems} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-12">
            <InfoSection title="Company Information" id="company-info">
              <p className="mb-6">
                OTTSewa is a digital subscription marketplace operating in Nepal, providing digital products including
                streaming subscriptions, gift cards, and gaming services.
              </p>
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
                <div className="p-6 border-b border-zinc-800">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center">
                      <span className="text-black font-bold text-xl">O</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">OTTSewa</h3>
                      <p className="text-zinc-400 text-sm">Digital Subscription Marketplace</p>
                    </div>
                  </div>
                </div>
                <div className="divide-y divide-zinc-800">
                  {[
                    { icon: Building, label: "Business Name", value: "OTTSewa" },
                    { icon: Globe, label: "Website", value: "www.ottsewa.store" },
                    { icon: Mail, label: "Email", value: "legal@ottsewa.store" },
                    { icon: Phone, label: "Phone", value: "+977 9869671451" },
                    { icon: Scale, label: "Location", value: "Kathmandu, Nepal" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-4">
                      <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center">
                        <item.icon className="w-5 h-5 text-amber-500" />
                      </div>
                      <div>
                        <p className="text-zinc-500 text-xs uppercase tracking-wider">{item.label}</p>
                        <p className="text-white font-medium">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </InfoSection>

            <InfoSection title="Business Scope" id="business-scope">
              <p>OTTSewa operates as a digital subscription reseller, providing:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Streaming service subscriptions (Netflix, HBO Max, Disney+, Spotify, etc.)</li>
                <li>Digital gift cards and vouchers</li>
                <li>Gaming subscriptions and credits</li>
                <li>Software licenses and digital products</li>
              </ul>
              <p className="mt-4">
                We are an authorized reseller of digital products and operate independently from the brands whose
                products we sell. All products are sourced through legitimate distribution channels.
              </p>
            </InfoSection>

            <InfoSection title="Intellectual Property" id="intellectual-property">
              <p>
                All content on this website, including but not limited to text, graphics, logos, images, software, and
                the compilation thereof, is the property of OTTSewa or its content suppliers and is protected by
                intellectual property laws.
              </p>
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 mt-4">
                <h4 className="text-white font-medium mb-4">Trademark Notice</h4>
                <p className="text-zinc-400 text-sm">
                  Product names, logos, and brands mentioned on this website are trademarks of their respective owners.
                  Their use is for identification purposes only and does not imply endorsement or affiliation. Netflix,
                  HBO Max, Disney+, Spotify, and other mentioned services are trademarks of their respective companies.
                </p>
              </div>
            </InfoSection>

            <InfoSection title="Disclaimer" id="disclaimer">
              <div className="space-y-4">
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                  <h4 className="text-white font-medium mb-3">Third-Party Products</h4>
                  <p className="text-zinc-400">
                    The products sold on our platform are digital codes and subscriptions from third-party providers. We
                    are an authorized reseller and are not affiliated with the brands whose products we sell unless
                    otherwise stated. We do not have control over the services provided by these third parties.
                  </p>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                  <h4 className="text-white font-medium mb-3">Service Availability</h4>
                  <p className="text-zinc-400">
                    We make no guarantees about the continuous availability of our website or services. We reserve the
                    right to modify, suspend, or discontinue any part of our services at any time without prior notice.
                  </p>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                  <h4 className="text-white font-medium mb-3">Accuracy of Information</h4>
                  <p className="text-zinc-400">
                    While we strive to provide accurate information, we do not warrant that product descriptions or
                    other content is accurate, complete, reliable, current, or error-free. Prices and availability are
                    subject to change without notice.
                  </p>
                </div>
              </div>
            </InfoSection>

            <InfoSection title="Governing Law" id="governing-law">
              <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-6 flex items-start gap-4">
                <Scale className="w-8 h-8 text-amber-500 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-medium mb-2">Jurisdiction</h4>
                  <p className="text-zinc-300">
                    These terms and any disputes relating to these terms or your use of our services shall be governed
                    by and construed in accordance with the laws of Nepal. Any legal action or proceeding relating to
                    these terms shall be brought exclusively in the courts located in Kathmandu, Nepal.
                  </p>
                </div>
              </div>
            </InfoSection>

            <InfoSection title="Contact Information" id="contact">
              <p className="mb-6">
                For legal inquiries or official correspondence, please contact us through the following channels:
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                  <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center mb-4">
                    <Mail className="w-6 h-6 text-amber-500" />
                  </div>
                  <h4 className="text-white font-medium mb-2">Legal Department</h4>
                  <p className="text-zinc-400 text-sm mb-3">For legal matters and official inquiries</p>
                  <a href="mailto:legal@ottsewa.store" className="text-amber-400 hover:text-amber-300 font-medium">
                    legal@ottsewa.store
                  </a>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                  <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center mb-4">
                    <MessageSquare className="w-6 h-6 text-amber-500" />
                  </div>
                  <h4 className="text-white font-medium mb-2">General Support</h4>
                  <p className="text-zinc-400 text-sm mb-3">For customer service and general questions</p>
                  <a href="mailto:support@ottsewa.store" className="text-amber-400 hover:text-amber-300 font-medium">
                    support@ottsewa.store
                  </a>
                </div>
              </div>
            </InfoSection>
          </div>
        </div>
      </div>

      <QuickLinks title="Related Pages" links={quickLinks} />
    </div>
  )
}
