import type { Metadata } from "next"
import {
  Shield,
  Eye,
  Database,
  Lock,
  Users,
  Mail,
  Settings,
  FileText,
  HelpCircle,
  Cookie,
  MessageSquare,
} from "lucide-react"
import { PageHeader } from "@/components/info-pages/page-header"
import { InfoSection } from "@/components/info-pages/info-section"
import { TableOfContents } from "@/components/info-pages/table-of-contents"
import { QuickLinks } from "@/components/info-pages/quick-links"

export const metadata: Metadata = {
  title: "Privacy Policy | OTTSewa - Data Protection",
  description:
    "Privacy Policy for OTTSewa. Learn how we collect, use, and protect your personal information. Your privacy matters to us.",
  keywords: "OTTSewa privacy, data protection, personal information, privacy policy Nepal",
}

const tocItems = [
  { id: "overview", title: "Overview" },
  { id: "information-collected", title: "Information We Collect" },
  { id: "how-we-use", title: "How We Use Information" },
  { id: "information-sharing", title: "Information Sharing" },
  { id: "data-security", title: "Data Security" },
  { id: "your-rights", title: "Your Rights" },
  { id: "cookies", title: "Cookies & Tracking" },
  { id: "data-retention", title: "Data Retention" },
  { id: "children", title: "Children's Privacy" },
  { id: "updates", title: "Policy Updates" },
  { id: "contact", title: "Contact Us" },
]

const dataTypes = [
  {
    category: "Account Information",
    items: ["Full name", "Email address", "Phone number", "Password (encrypted)"],
    icon: Users,
  },
  {
    category: "Transaction Data",
    items: ["Order history", "Payment records", "Billing information", "Delivery details"],
    icon: Database,
  },
  {
    category: "Usage Data",
    items: ["Pages visited", "Features used", "Session duration", "Device information"],
    icon: Eye,
  },
  {
    category: "Communication Data",
    items: ["Support tickets", "Email correspondence", "Feedback and reviews"],
    icon: Mail,
  },
]

const quickLinks = [
  { title: "Terms of Service", description: "Read our terms", href: "/terms", icon: FileText },
  { title: "Cookie Policy", description: "How we use cookies", href: "/cookies", icon: Cookie },
  { title: "FAQ", description: "Common questions", href: "/faq", icon: HelpCircle },
  { title: "Contact Us", description: "Get in touch", href: "/contact", icon: MessageSquare },
]

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black">
      <PageHeader
        icon={Shield}
        title="Privacy Policy"
        description="Your privacy is important to us. This policy explains how we collect, use, and protect your personal information when you use OTTSewa."
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
            <InfoSection title="Overview" id="overview">
              <p>
                At OTTSewa, we take your privacy seriously. This Privacy Policy describes how we collect, use, disclose,
                and safeguard your information when you visit our website and use our services.
              </p>
              <p>
                By using our Services, you consent to the data practices described in this policy. We encourage you to
                read this policy carefully and contact us if you have any questions.
              </p>
              <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-4 mt-4 flex items-start gap-3">
                <Lock className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-amber-400 text-sm">
                  <strong>Our Commitment:</strong> We never sell your personal information to third parties for
                  marketing purposes.
                </p>
              </div>
            </InfoSection>

            <InfoSection title="Information We Collect" id="information-collected">
              <p className="mb-6">
                We collect different types of information depending on how you interact with our Services:
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {dataTypes.map((type) => (
                  <div
                    key={type.category}
                    className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 hover:border-amber-500/20 transition-all"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center">
                        <type.icon className="w-5 h-5 text-amber-500" />
                      </div>
                      <h4 className="text-white font-medium">{type.category}</h4>
                    </div>
                    <ul className="space-y-2">
                      {type.items.map((item, index) => (
                        <li key={index} className="text-zinc-400 text-sm flex items-center gap-2">
                          <span className="w-1 h-1 bg-amber-500/50 rounded-full" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </InfoSection>

            <InfoSection title="How We Use Your Information" id="how-we-use">
              <p>We use the information we collect for various purposes:</p>
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 mt-4">
                <ul className="space-y-3">
                  {[
                    { title: "Process Orders", desc: "To fulfill your purchases and deliver digital products" },
                    { title: "Send Communications", desc: "Order confirmations, updates, and important notifications" },
                    { title: "Provide Support", desc: "To respond to your inquiries and resolve issues" },
                    { title: "Improve Services", desc: "To analyze usage and enhance user experience" },
                    { title: "Marketing", desc: "With your consent, to send promotional offers and updates" },
                    { title: "Security", desc: "To protect against fraud and unauthorized transactions" },
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-amber-500/10 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-amber-500 text-xs font-medium">{index + 1}</span>
                      </div>
                      <div>
                        <span className="text-white font-medium">{item.title}:</span>{" "}
                        <span className="text-zinc-400">{item.desc}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </InfoSection>

            <InfoSection title="Information Sharing" id="information-sharing">
              <p>
                We do not sell, trade, or rent your personal information to third parties. We may share your information
                only in the following circumstances:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>
                  <strong className="text-white">Service Providers:</strong> With trusted partners who help us operate
                  our platform (payment processors, email services)
                </li>
                <li>
                  <strong className="text-white">Legal Requirements:</strong> When required by law or to protect our
                  rights and safety
                </li>
                <li>
                  <strong className="text-white">Business Transfers:</strong> In connection with a merger, acquisition,
                  or sale of assets
                </li>
                <li>
                  <strong className="text-white">With Consent:</strong> When you explicitly agree to share your
                  information
                </li>
              </ul>
            </InfoSection>

            <InfoSection title="Data Security" id="data-security">
              <p>We implement robust security measures to protect your personal information:</p>
              <div className="grid sm:grid-cols-2 gap-4 mt-6">
                {[
                  { icon: Lock, title: "SSL Encryption", desc: "All data transmitted is encrypted using SSL/TLS" },
                  {
                    icon: Shield,
                    title: "Secure Storage",
                    desc: "Data is stored on secure, protected servers",
                  },
                  { icon: Settings, title: "Access Controls", desc: "Strict access controls limit who can view data" },
                  {
                    icon: Eye,
                    title: "Regular Audits",
                    desc: "We conduct regular security assessments",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 flex items-start gap-3"
                  >
                    <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium text-sm">{item.title}</h4>
                      <p className="text-zinc-500 text-xs mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </InfoSection>

            <InfoSection title="Your Rights" id="your-rights">
              <p>You have the following rights regarding your personal information:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>
                  <strong className="text-white">Access:</strong> Request a copy of the personal data we hold about you
                </li>
                <li>
                  <strong className="text-white">Correction:</strong> Request correction of inaccurate information
                </li>
                <li>
                  <strong className="text-white">Deletion:</strong> Request deletion of your personal data
                </li>
                <li>
                  <strong className="text-white">Portability:</strong> Request transfer of your data to another service
                </li>
                <li>
                  <strong className="text-white">Opt-out:</strong> Unsubscribe from marketing communications at any time
                </li>
              </ul>
              <p className="mt-4 text-zinc-400">
                To exercise any of these rights, please contact us at privacy@ottsewa.store.
              </p>
            </InfoSection>

            <InfoSection title="Cookies & Tracking" id="cookies">
              <p>
                We use cookies and similar tracking technologies to enhance your experience. For detailed information
                about our cookie practices, please see our{" "}
                <a href="/cookies" className="text-amber-400 hover:text-amber-300">
                  Cookie Policy
                </a>
                .
              </p>
            </InfoSection>

            <InfoSection title="Data Retention" id="data-retention">
              <p>We retain your personal information for as long as necessary to:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Provide our Services to you</li>
                <li>Comply with legal obligations</li>
                <li>Resolve disputes and enforce agreements</li>
                <li>Improve our Services and maintain records</li>
              </ul>
              <p className="mt-4">When your data is no longer needed, we securely delete or anonymize it.</p>
            </InfoSection>

            <InfoSection title="Children's Privacy" id="children">
              <p>
                Our Services are not intended for individuals under 18 years of age. We do not knowingly collect
                personal information from children. If you are a parent or guardian and believe your child has provided
                us with personal information, please contact us immediately.
              </p>
            </InfoSection>

            <InfoSection title="Policy Updates" id="updates">
              <p>We may update this Privacy Policy from time to time. We will notify you of significant changes by:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Posting the updated policy on our website</li>
                <li>Sending an email to registered users</li>
                <li>Updating the "Last Updated" date at the top of this page</li>
              </ul>
            </InfoSection>

            <InfoSection title="Contact Us" id="contact">
              <p className="mb-6">
                If you have questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-amber-500" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-2">Privacy Inquiries</h4>
                    <p className="text-zinc-400 mb-3">For questions about data protection and privacy matters.</p>
                    <a href="mailto:privacy@ottsewa.store" className="text-amber-400 hover:text-amber-300 font-medium">
                      privacy@ottsewa.store
                    </a>
                  </div>
                </div>
              </div>
            </InfoSection>
          </div>
        </div>
      </div>

      <QuickLinks title="Related Policies" links={quickLinks} />
    </div>
  )
}
