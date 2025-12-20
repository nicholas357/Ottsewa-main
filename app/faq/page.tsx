"use client"

import { useState } from "react"
import {
  Search,
  Package,
  CreditCard,
  Shield,
  FileText,
  HelpCircle,
  ArrowRight,
  ChevronDown,
  MessageSquare,
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { PageHeader } from "@/components/info-pages/page-header"

const categories = [
  { id: "orders", title: "Orders & Delivery", icon: Package },
  { id: "payments", title: "Payments", icon: CreditCard },
  { id: "account", title: "Account", icon: Shield },
  { id: "products", title: "Products", icon: FileText },
]

const faqs = [
  {
    id: "orders",
    title: "Orders & Delivery",
    icon: Package,
    questions: [
      {
        q: "How long does delivery take?",
        a: "Most digital products are delivered instantly after payment confirmation. You'll receive your codes or credentials via email and in your account dashboard within minutes. Some products may take up to 24 hours during high-demand periods or when additional verification is needed.",
      },
      {
        q: "How do I track my order?",
        a: "You can track your order status in your account dashboard under 'My Orders'. You'll also receive email updates about your order status including confirmation, delivery, and any important updates. Each order has a unique tracking ID for easy reference.",
      },
      {
        q: "What if I don't receive my order?",
        a: "If you haven't received your order within 24 hours, please first check your spam/junk folder for the delivery email. If still not found, contact our support team with your order ID. We'll investigate and resolve the issue promptly, either by resending the product or providing a full refund.",
      },
      {
        q: "Can I cancel my order?",
        a: "Due to the instant delivery nature of digital products, orders cannot be cancelled once payment is confirmed. Please make sure to review your order carefully before completing the purchase. If you have any questions, contact us before ordering.",
      },
      {
        q: "What happens if I order the wrong product?",
        a: "Unfortunately, we cannot exchange digital products once delivered. We recommend carefully checking the product details, compatibility requirements, and region restrictions before purchasing. Our support team is always available to help you choose the right product.",
      },
    ],
  },
  {
    id: "payments",
    title: "Payments",
    icon: CreditCard,
    questions: [
      {
        q: "What payment methods do you accept?",
        a: "We accept various payment methods including eSewa, Khalti, bank transfers (Nepal Bank, NIC Asia, Global IME), and other local payment options. We're constantly adding new payment methods to make it easier for you to purchase.",
      },
      {
        q: "Is my payment information secure?",
        a: "Yes, absolutely! We use industry-standard SSL encryption to protect all transactions. We never store your complete payment details on our servers. All payments are processed through secure, trusted payment gateways.",
      },
      {
        q: "Can I get a refund?",
        a: "Due to the nature of digital products, all sales are final. However, we do offer assistance for defective codes, duplicate orders, or technical errors caused by our system. Please review our Refund Policy for complete details.",
      },
      {
        q: "What currency do you accept?",
        a: "All prices on our website are displayed in Nepali Rupees (NPR). Payment will be processed in NPR regardless of the payment method you choose.",
      },
      {
        q: "When will I be charged?",
        a: "You will be charged immediately when you complete the checkout process. The payment is processed in real-time, and your order will be fulfilled once the payment is confirmed by our payment processor.",
      },
    ],
  },
  {
    id: "account",
    title: "Account",
    icon: Shield,
    questions: [
      {
        q: "How do I create an account?",
        a: "Click on 'Sign Up' in the top navigation, enter your email and create a password. You'll receive a verification email - click the link to activate your account. You can also sign up using your Google account for faster registration.",
      },
      {
        q: "I forgot my password. What should I do?",
        a: "Click on 'Forgot Password' on the login page, enter your registered email address, and we'll send you a password reset link. The link is valid for 24 hours. If you don't receive the email, check your spam folder or contact support.",
      },
      {
        q: "How do I update my account information?",
        a: "Go to your Dashboard and click on 'Settings' to update your profile information, change your password, manage notification preferences, and update your email address.",
      },
      {
        q: "How do I delete my account?",
        a: "To delete your account, please contact our support team with your registered email address. We'll process your request within 48 hours. Note that account deletion is permanent and you'll lose access to your order history.",
      },
      {
        q: "Is my personal information safe?",
        a: "Yes, we take data privacy seriously. Your personal information is encrypted and stored securely. We never sell or share your data with third parties for marketing purposes. Read our Privacy Policy for more details.",
      },
    ],
  },
  {
    id: "products",
    title: "Products",
    icon: FileText,
    questions: [
      {
        q: "Are all products genuine?",
        a: "Yes, all our products are 100% authentic and sourced directly from official distributors. We guarantee the authenticity of every product we sell. If you ever receive a code that doesn't work, we'll provide a replacement or full refund.",
      },
      {
        q: "How do I redeem my digital code?",
        a: "After purchase, you'll receive detailed instructions specific to each product via email and in your dashboard. Generally, you'll need to go to the respective platform's redemption page (e.g., Netflix, Spotify) and enter your code. We also provide step-by-step guides for each product.",
      },
      {
        q: "Can I use the products outside Nepal?",
        a: "Most of our digital subscriptions and codes can be used globally. However, some products may have regional restrictions. Please check the product description for region-specific information before purchasing.",
      },
      {
        q: "What if my code doesn't work?",
        a: "If your code doesn't work, first make sure you're entering it correctly without any extra spaces. If it still doesn't work, contact our support team immediately with your order ID and a screenshot of the error. We'll investigate and provide a solution within 24 hours.",
      },
      {
        q: "Do you offer subscription sharing?",
        a: "Some of our products are shared subscriptions where you get access to a slot on a premium account. The product description clearly states whether it's a personal code or shared access. Shared subscriptions are a cost-effective way to enjoy premium services.",
      },
    ],
  },
]

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState("orders")
  const [openItems, setOpenItems] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  const toggleItem = (itemId: string) => {
    setOpenItems((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]))
  }

  const filteredFaqs = searchQuery
    ? faqs
        .map((section) => ({
          ...section,
          questions: section.questions.filter(
            (q) =>
              q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
              q.a.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
        }))
        .filter((section) => section.questions.length > 0)
    : faqs.filter((section) => section.id === activeCategory)

  return (
    <div className="min-h-screen bg-transparent">
      <PageHeader
        icon={HelpCircle}
        title="Frequently Asked Questions"
        description="Find answers to the most common questions about our services, products, and policies."
        badge="FAQ"
      >
        {/* Search Bar */}
        <div className="max-w-xl mx-auto mt-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for questions..."
              className="w-full bg-[#1a1a1a] border border-white/[0.08] rounded-xl pl-12 pr-4 py-4 text-white placeholder:text-zinc-500 focus:outline-none focus:border-amber-500/50 transition-colors"
            />
          </div>
        </div>
      </PageHeader>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Tabs - Only show when not searching */}
        {!searchQuery && (
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
                  activeCategory === category.id
                    ? "bg-amber-500 text-black"
                    : "bg-[#1a1a1a] text-zinc-400 hover:text-white border border-white/[0.08] hover:border-white/[0.15]",
                )}
              >
                <category.icon className="w-4 h-4" />
                {category.title}
              </button>
            ))}
          </div>
        )}

        {/* FAQ Sections */}
        <div className="rounded-2xl border border-white/[0.08] p-3">
          <div className="bg-[#0f0f0f] rounded-xl p-4 sm:p-6">
            <div className="space-y-6">
              {filteredFaqs.map((section) => (
                <div key={section.id} id={section.id} className="scroll-mt-24">
                  {searchQuery && (
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center">
                        <section.icon className="w-4 h-4 text-amber-500" />
                      </div>
                      <h2 className="text-lg font-semibold text-amber-400">{section.title}</h2>
                    </div>
                  )}

                  <div className="space-y-3">
                    {section.questions.map((faq, index) => {
                      const itemId = `${section.id}-${index}`
                      const isOpen = openItems.includes(itemId)

                      return (
                        <div
                          key={index}
                          className={cn(
                            "relative bg-[#1a1a1a] border rounded-xl overflow-hidden transition-all",
                            isOpen ? "border-amber-500/30" : "border-white/[0.05] hover:border-white/[0.1]",
                          )}
                        >
                          <button
                            onClick={() => toggleItem(itemId)}
                            className="w-full flex items-center justify-between p-5 text-left"
                          >
                            <span className={cn("font-medium pr-4", isOpen ? "text-amber-400" : "text-white")}>
                              {faq.q}
                            </span>
                            <ChevronDown
                              className={cn(
                                "w-5 h-5 flex-shrink-0 transition-transform",
                                isOpen ? "rotate-180 text-amber-500" : "text-zinc-500",
                              )}
                            />
                          </button>
                          {isOpen && (
                            <div className="px-5 pb-5 pt-0">
                              <p className="text-zinc-400 leading-relaxed">{faq.a}</p>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* No Results */}
            {searchQuery && filteredFaqs.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-[#1a1a1a] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-zinc-600" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">No results found</h3>
                <p className="text-zinc-500 mb-6">Try a different search term or browse by category</p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-amber-400 hover:text-amber-300 font-medium inline-flex items-center gap-2"
                >
                  Clear search
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="mt-16 rounded-2xl border border-white/[0.08] p-3">
          <div className="bg-[#0f0f0f] rounded-xl p-8 text-center">
            <MessageSquare className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Still have questions?</h2>
            <p className="text-zinc-400 mb-6 max-w-md mx-auto">
              Can't find the answer you're looking for? Our support team is ready to help.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold px-6 py-2.5 rounded-lg transition-all"
            >
              Contact Support
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
