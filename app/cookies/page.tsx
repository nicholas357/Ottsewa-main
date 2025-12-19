import type { Metadata } from "next"
import { Cookie, Settings, BarChart, Shield, Globe, Mail, FileText, HelpCircle, MessageSquare } from "lucide-react"
import { PageHeader } from "@/components/info-pages/page-header"
import { InfoSection } from "@/components/info-pages/info-section"
import { TableOfContents } from "@/components/info-pages/table-of-contents"
import { QuickLinks } from "@/components/info-pages/quick-links"

export const metadata: Metadata = {
  title: "Cookie Policy | OTTSewa",
  description:
    "Cookie Policy for OTTSewa. Learn about our use of cookies and similar technologies to enhance your experience.",
  keywords: "OTTSewa cookies, cookie policy, tracking, browser cookies",
}

const tocItems = [
  { id: "what-are-cookies", title: "What Are Cookies" },
  { id: "types-of-cookies", title: "Types of Cookies" },
  { id: "how-we-use", title: "How We Use Cookies" },
  { id: "third-party", title: "Third-Party Cookies" },
  { id: "managing-cookies", title: "Managing Cookies" },
  { id: "contact", title: "Contact Us" },
]

const cookieTypes = [
  {
    name: "Essential Cookies",
    description:
      "Required for the website to function properly. These cookies enable core functionality such as security, network management, and account access. They cannot be disabled.",
    icon: Shield,
    required: true,
    examples: ["Session management", "Authentication", "Security tokens", "Shopping cart"],
  },
  {
    name: "Functional Cookies",
    description:
      "Remember your preferences and choices to provide a personalized experience. These help us remember your settings and improve your experience.",
    icon: Settings,
    required: false,
    examples: ["Language preferences", "Region settings", "Display preferences", "Recently viewed items"],
  },
  {
    name: "Analytics Cookies",
    description:
      "Help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve our services.",
    icon: BarChart,
    required: false,
    examples: ["Page views", "Traffic sources", "User behavior", "Performance metrics"],
  },
  {
    name: "Marketing Cookies",
    description:
      "Used to track visitors across websites to display relevant advertisements. These cookies are set by advertising partners and help measure campaign effectiveness.",
    icon: Globe,
    required: false,
    examples: ["Ad targeting", "Campaign tracking", "Social media integration", "Retargeting"],
  },
]

const quickLinks = [
  { title: "Privacy Policy", description: "How we protect you", href: "/privacy", icon: Shield },
  { title: "Terms of Service", description: "Read our terms", href: "/terms", icon: FileText },
  { title: "FAQ", description: "Common questions", href: "/faq", icon: HelpCircle },
  { title: "Contact Us", description: "Get in touch", href: "/contact", icon: MessageSquare },
]

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-black">
      <PageHeader
        icon={Cookie}
        title="Cookie Policy"
        description="This policy explains how OTTSewa uses cookies and similar technologies to recognize you when you visit our website."
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
            <InfoSection title="What Are Cookies?" id="what-are-cookies">
              <p>
                Cookies are small text files that are stored on your device (computer, tablet, or mobile) when you visit
                a website. They help the website recognize your device and remember information about your visit, such
                as your preferences and settings.
              </p>
              <p>
                Cookies are widely used to make websites work more efficiently and provide a better user experience.
                They can also provide information to the website owners for analytical and marketing purposes.
              </p>
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 mt-4">
                <p className="text-zinc-400 text-sm">
                  <strong className="text-white">How they work:</strong> When you visit OTTSewa, our servers send
                  cookies to your browser. These cookies are stored locally and sent back to our servers each time you
                  return, allowing us to recognize you and remember your preferences.
                </p>
              </div>
            </InfoSection>

            <InfoSection title="Types of Cookies We Use" id="types-of-cookies">
              <p className="mb-6">We use different types of cookies for various purposes:</p>
              <div className="space-y-4">
                {cookieTypes.map((cookie) => (
                  <div
                    key={cookie.name}
                    className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-amber-500/20 transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <cookie.icon className="w-6 h-6 text-amber-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-white">{cookie.name}</h3>
                          {cookie.required && (
                            <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded text-amber-400 text-xs font-medium">
                              Required
                            </span>
                          )}
                        </div>
                        <p className="text-zinc-400 mb-4">{cookie.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {cookie.examples.map((example, index) => (
                            <span key={index} className="px-2.5 py-1 bg-zinc-800 rounded-lg text-zinc-400 text-xs">
                              {example}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </InfoSection>

            <InfoSection title="How We Use Cookies" id="how-we-use">
              <p>We use cookies to:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Keep you signed in to your account</li>
                <li>Remember items in your shopping cart</li>
                <li>Remember your preferences and settings</li>
                <li>Understand how you use our website</li>
                <li>Improve our website and services</li>
                <li>Show you relevant content and advertisements</li>
                <li>Protect against fraud and security threats</li>
              </ul>
            </InfoSection>

            <InfoSection title="Third-Party Cookies" id="third-party">
              <p>Some cookies on our website are set by third-party services. These include:</p>
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 mt-4">
                <ul className="space-y-4">
                  {[
                    {
                      name: "Google Analytics",
                      purpose: "To analyze website traffic and user behavior",
                    },
                    {
                      name: "Payment Processors",
                      purpose: "To process payments securely (eSewa, Khalti)",
                    },
                    {
                      name: "Social Media",
                      purpose: "To enable social sharing features",
                    },
                  ].map((service, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                      <div>
                        <span className="text-white font-medium">{service.name}:</span>{" "}
                        <span className="text-zinc-400">{service.purpose}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="mt-4 text-zinc-400 text-sm">
                These third parties have their own privacy and cookie policies. We recommend reviewing their policies to
                understand how they use cookies.
              </p>
            </InfoSection>

            <InfoSection title="Managing Cookies" id="managing-cookies">
              <p>
                You can control and manage cookies in various ways. Please note that removing or blocking cookies may
                impact your user experience and some features may not function properly.
              </p>
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 mt-4">
                <h4 className="text-white font-medium mb-4">Browser Settings</h4>
                <p className="text-zinc-400 mb-4">
                  Most browsers allow you to refuse cookies or delete existing cookies. Here's how to manage cookies in
                  popular browsers:
                </p>
                <ul className="space-y-2 text-sm">
                  {[
                    { browser: "Chrome", link: "chrome://settings/cookies" },
                    { browser: "Firefox", link: "about:preferences#privacy" },
                    { browser: "Safari", link: "Preferences > Privacy" },
                    { browser: "Edge", link: "edge://settings/privacy" },
                  ].map((item, index) => (
                    <li key={index} className="flex items-center justify-between text-zinc-400">
                      <span>{item.browser}</span>
                      <code className="text-amber-400 bg-zinc-800 px-2 py-0.5 rounded text-xs">{item.link}</code>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-4 mt-4">
                <p className="text-amber-400 text-sm">
                  <strong>Note:</strong> Disabling essential cookies may prevent you from using certain features of our
                  website, such as staying logged in or completing purchases.
                </p>
              </div>
            </InfoSection>

            <InfoSection title="Contact Us" id="contact">
              <p className="mb-6">If you have questions about our use of cookies, please contact us:</p>
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-amber-500" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-2">Privacy & Cookie Inquiries</h4>
                    <p className="text-zinc-400 mb-3">For questions about cookies and tracking technologies.</p>
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
