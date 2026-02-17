"use client"

import Link from "next/link"
import { Settings, FileText, Lock } from "lucide-react"

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 sm:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Manage your website content and configurations</p>
        </div>

        {/* Admin Sections Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Netflix Admin */}
          <Link
            href="/admin/netflix"
            className="group bg-slate-800 border border-slate-700 hover:border-amber-500/50 rounded-lg p-8 transition-all hover:shadow-lg hover:shadow-amber-500/10"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Netflix Configuration</h3>
                <p className="text-gray-400">
                  Manage Netflix subscription plans, pricing, features, action buttons, and SEO keywords
                </p>
              </div>
              <Settings className="w-8 h-8 text-amber-500 group-hover:text-amber-400 flex-shrink-0" />
            </div>

            <div className="bg-slate-700/50 border border-slate-600/50 rounded p-4 mb-4">
              <p className="text-sm text-gray-300">
                Edit Netflix subscription plan names, prices, features, and links. Update action buttons and SEO keywords for better search rankings.
              </p>
            </div>

            <div className="text-amber-400 font-semibold inline-flex items-center gap-2 group-hover:gap-3 transition-all">
              Manage Netflix Plans
              <span>→</span>
            </div>
          </Link>

          {/* Documentation */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 opacity-50">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">More Features Coming</h3>
                <p className="text-gray-400">Additional admin tools and configurations</p>
              </div>
              <FileText className="w-8 h-8 text-gray-600 flex-shrink-0" />
            </div>

            <div className="bg-slate-700/50 border border-slate-600/50 rounded p-4 mb-4">
              <p className="text-sm text-gray-400">
                Coming soon: More admin features for managing other sections of your website
              </p>
            </div>

            <div className="text-gray-600 font-semibold inline-flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Coming Soon
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-12 bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
          <h3 className="text-white font-semibold mb-2">How It Works</h3>
          <ul className="text-gray-400 space-y-2 text-sm">
            <li>• All changes are saved to your browser's local storage (localStorage)</li>
            <li>• Configuration changes appear on your website in real-time</li>
            <li>• Your data persists across browser sessions</li>
            <li>• You can preview changes before they go live</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
