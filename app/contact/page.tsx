"use client"

import type React from "react"

import { useState } from "react"
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  Clock,
  ArrowRight,
  CheckCircle,
  Loader2,
  Facebook,
  Instagram,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { PageHeader } from "@/components/info-pages/page-header"

const contactMethods = [
  {
    title: "Email Support",
    description: "Get help via email within 24 hours",
    icon: Mail,
    value: "support@ottsewa.store",
    href: "mailto:support@ottsewa.store",
    action: "Send Email",
  },
  {
    title: "Phone Support",
    description: "Mon-Sat, 9AM-6PM NPT",
    icon: Phone,
    value: "+977 9869671451",
    href: "tel:+9779869671451",
    action: "Call Now",
  },
  {
    title: "Live Chat",
    description: "Get instant help from our team",
    icon: MessageSquare,
    value: "Available 24/7",
    href: "#",
    action: "Start Chat",
  },
  {
    title: "Location",
    description: "Our headquarters",
    icon: MapPin,
    value: "Kathmandu, Nepal",
    href: "#",
    action: "View Map",
  },
]

const quickTopics = [
  { label: "Order Issue", value: "order" },
  { label: "Payment Problem", value: "payment" },
  { label: "Product Question", value: "product" },
  { label: "Account Help", value: "account" },
  { label: "Refund Request", value: "refund" },
  { label: "Other", value: "other" },
]

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedTopic, setSelectedTopic] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast({
      title: "Message Sent!",
      description: "We'll get back to you within 24 hours.",
    })

    setFormData({ name: "", email: "", subject: "", message: "" })
    setSelectedTopic("")
    setIsSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-black">
      <PageHeader
        icon={MessageSquare}
        title="Contact Us"
        description="Have questions? We're here to help. Reach out to us through any of the channels below and we'll respond as quickly as possible."
        badge="Get in Touch"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Contact Methods Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {contactMethods.map((method) => (
            <a
              key={method.title}
              href={method.href}
              className="group relative bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-amber-500/30 transition-all"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-amber-500/20 transition-colors">
                <method.icon className="w-6 h-6 text-amber-500" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">{method.title}</h3>
              <p className="text-zinc-500 text-sm mb-2">{method.description}</p>
              <p className="text-amber-400 font-medium text-sm">{method.value}</p>
            </a>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Sidebar */}
          <div className="space-y-6">
            {/* Response Time Card */}
            <div className="relative bg-amber-500/5 border border-amber-500/20 rounded-xl p-6">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
              <Clock className="w-8 h-8 text-amber-500 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Quick Response Time</h3>
              <p className="text-zinc-400 text-sm mb-4">
                We aim to respond to all inquiries within 24 hours during business days.
              </p>
              <div className="flex items-center gap-2 text-amber-400 text-sm">
                <CheckCircle className="w-4 h-4" />
                <span>Average response: 2-4 hours</span>
              </div>
            </div>

            {/* FAQ Prompt */}
            <div className="relative bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 group hover:border-amber-500/30 transition-all">
              <h3 className="text-lg font-semibold text-white mb-2">Check our FAQ</h3>
              <p className="text-zinc-400 text-sm mb-4">
                Find instant answers to common questions about orders, payments, and more.
              </p>
              <Link
                href="/faq"
                className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 text-sm font-medium transition-colors"
              >
                Browse FAQ
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Social Links */}
            <div className="relative bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Follow Us</h3>
              <div className="flex gap-3">
                {[
                  { Icon: Facebook, href: "#", label: "Facebook" },
                  { Icon: Instagram, href: "#", label: "Instagram" },
                ].map(({ Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    className="w-10 h-10 bg-zinc-800 hover:bg-amber-500/10 border border-zinc-700 hover:border-amber-500/30 rounded-lg flex items-center justify-center transition-all group"
                    aria-label={label}
                  >
                    <Icon className="w-5 h-5 text-zinc-400 group-hover:text-amber-400 transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="relative bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 sm:p-8">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
              <h2 className="text-2xl font-bold text-white mb-2">Send us a Message</h2>
              <p className="text-zinc-400 mb-6">Fill out the form below and we'll get back to you soon.</p>

              {/* Quick Topic Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-zinc-300 mb-3">What can we help you with?</label>
                <div className="flex flex-wrap gap-2">
                  {quickTopics.map((topic) => (
                    <button
                      key={topic.value}
                      type="button"
                      onClick={() => setSelectedTopic(topic.value)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedTopic === topic.value
                          ? "bg-amber-500 text-black"
                          : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700"
                      }`}
                    >
                      {topic.label}
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">Your Name</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Doe"
                      required
                      className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-amber-500 h-12"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">Your Email</label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@example.com"
                      required
                      className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-amber-500 h-12"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Subject</label>
                  <Input
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="How can we help?"
                    required
                    className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-amber-500 h-12"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Message</label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us more about your inquiry..."
                    required
                    rows={6}
                    className="bg-zinc-800/50 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-amber-500 resize-none"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold h-12 text-base"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
