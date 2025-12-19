"use client"

import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, CreditCard } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function Footer() {
  return (
    <footer
      className="relative bg-black/50 border-t border-amber-500/[0.08]"
      itemScope
      itemType="https://schema.org/Organization"
      role="contentinfo"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="relative w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent h-1/2" />
                <span className="relative text-black font-bold text-sm">O</span>
              </div>
              <span className="text-white font-semibold text-lg" itemProp="name">
                OTTSewa
              </span>
            </div>
            <p className="text-zinc-500 text-sm mb-4 leading-relaxed" itemProp="description">
              Nepal's trusted reseller for Netflix, HBO Max, Disney+, Spotify, YouTube Premium & more streaming
              subscriptions. 100% genuine codes, instant delivery, best prices in Nepal.
            </p>
            <nav aria-label="Social media links">
              <ul className="flex gap-2 list-none">
                {[
                  { Icon: Facebook, href: "https://facebook.com/ottsewa", label: "Facebook" },
                  { Icon: Twitter, href: "https://twitter.com/ottsewa", label: "Twitter" },
                  { Icon: Instagram, href: "https://instagram.com/ottsewa", label: "Instagram" },
                  { Icon: Youtube, href: "https://youtube.com/ottsewa", label: "YouTube" },
                ].map(({ Icon, href, label }, i) => (
                  <li key={i}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative w-9 h-9 bg-zinc-900/80 hover:bg-amber-500/[0.08] border border-amber-500/[0.1] hover:border-amber-500/25 rounded-lg flex items-center justify-center transition-all overflow-hidden group cursor-pointer"
                      aria-label={`Visit OTTSewa on ${label}`}
                      itemProp="sameAs"
                    >
                      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <Icon
                        className="w-4 h-4 text-zinc-400 group-hover:text-amber-400 transition-colors"
                        aria-hidden="true"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Quick Links */}
          <nav aria-label="Quick links">
            <h3 className="text-white font-medium text-sm mb-4">Quick Links</h3>
            <ul className="space-y-2.5 list-none">
              {[
                { label: "About Us", href: "/about" },
                { label: "How It Works", href: "/how-it-works" },
                { label: "Contact Us", href: "/contact" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-zinc-500 hover:text-amber-400 transition text-sm cursor-pointer"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Support */}
          <nav aria-label="Support links">
            <h3 className="text-white font-medium text-sm mb-4">Support</h3>
            <ul className="space-y-2.5 list-none">
              {[
                { label: "Help Center", href: "/help" },
                { label: "FAQ", href: "/faq" },
                { label: "Refund Policy", href: "/refund-policy" },
                { label: "Terms of Service", href: "/terms" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-zinc-500 hover:text-amber-400 transition text-sm cursor-pointer"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div itemProp="contactPoint" itemScope itemType="https://schema.org/ContactPoint">
            <meta itemProp="contactType" content="customer service" />
            <meta itemProp="availableLanguage" content="English" />
            <h3 className="text-white font-medium text-sm mb-4">Contact Us</h3>
            <address className="not-italic">
              <ul className="space-y-3 list-none">
                <li>
                  <a
                    href="mailto:support@ottsewa.store"
                    className="flex items-center gap-2 text-zinc-500 hover:text-amber-400 transition text-sm cursor-pointer group"
                    itemProp="email"
                  >
                    <Mail
                      className="w-4 h-4 text-amber-500/70 group-hover:text-amber-400 transition-colors"
                      aria-hidden="true"
                    />
                    <span>support@ottsewa.store</span>
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+9779869671451"
                    className="flex items-center gap-2 text-zinc-500 hover:text-amber-400 transition text-sm cursor-pointer group"
                    itemProp="telephone"
                  >
                    <Phone
                      className="w-4 h-4 text-amber-500/70 group-hover:text-amber-400 transition-colors"
                      aria-hidden="true"
                    />
                    <span>+977 9869671451</span>
                  </a>
                </li>
                <li
                  className="flex items-center gap-2 text-zinc-500 text-sm"
                  itemProp="address"
                  itemScope
                  itemType="https://schema.org/PostalAddress"
                >
                  <MapPin className="w-4 h-4 text-amber-500/70" aria-hidden="true" />
                  <span itemProp="addressCountry">Nepal</span>
                </li>
              </ul>
            </address>
          </div>
        </div>

        <div className="border-t border-amber-500/[0.08] pt-8 mb-8">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 text-zinc-400 text-sm">
              <CreditCard className="w-4 h-4 text-amber-500" aria-hidden="true" />
              <span>Accepted Payment Methods</span>
            </div>
            <div className="flex items-center gap-4">
              {[
                { name: "eSewa", icon: "/esewa-logo.png" },
                { name: "Khalti", icon: "/khalti-logo.png" },
                { name: "Internet Banking", icon: "/internet-banking-logo.png" },
                { name: "ConnectIPS", icon: "/connectips-logo.png" },
              ].map((method) => (
                <div
                  key={method.name}
                  className="h-10 px-3 bg-white rounded-lg flex items-center justify-center hover:scale-105 transition-transform"
                  title={method.name}
                >
                  <Image
                    src={method.icon || "/placeholder.svg"}
                    alt={method.name}
                    width={60}
                    height={28}
                    className="object-contain h-6 w-auto"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="relative border-t border-amber-500/[0.08] pt-6">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/15 to-transparent" />
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-zinc-600 text-sm">
              <span itemProp="copyrightYear">2025</span> <span itemProp="copyrightHolder">OTTSewa</span>. All rights
              reserved.
            </p>
            <nav aria-label="Legal links">
              <ul className="flex flex-wrap gap-6 text-sm list-none">
                {[
                  { label: "Privacy Policy", href: "/privacy" },
                  { label: "Cookie Policy", href: "/cookies" },
                  { label: "Legal Notice", href: "/legal" },
                ].map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-zinc-500 hover:text-amber-400 transition cursor-pointer">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>

      <meta itemProp="url" content="https://ottsewa.store" />
      <link itemProp="logo" href="https://ottsewa.store/logo.png" />
    </footer>
  )
}
