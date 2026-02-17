"use client"

import { useEffect, useState } from "react"
import { Save, Plus, Trash2, Eye, EyeOff } from "lucide-react"
import { getNetflixConfig, saveNetflixConfig, type NetflixPageConfig, type NetflixPlan } from "@/lib/netflix-config"
import Link from "next/link"

export default function NetflixAdminPage() {
  const [config, setConfig] = useState<NetflixPageConfig | null>(null)
  const [saved, setSaved] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [newPlanPrice, setNewPlanPrice] = useState("")

  useEffect(() => {
    const loaded = getNetflixConfig()
    setConfig(loaded)
  }, [])

  if (!config) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 flex items-center justify-center">
        <div className="text-white text-xl">Loading configuration...</div>
      </div>
    )
  }

  const handleSave = () => {
    saveNetflixConfig(config)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handlePlanUpdate = (planId: string, updates: Partial<NetflixPlan>) => {
    setConfig({
      ...config,
      plans: config.plans.map((plan) => (plan.id === planId ? { ...plan, ...updates } : plan)),
    })
  }

  const handleFeatureUpdate = (planId: string, featureIndex: number, newFeature: string) => {
    setConfig({
      ...config,
      plans: config.plans.map((plan) => {
        if (plan.id === planId) {
          const newFeatures = [...plan.features]
          newFeatures[featureIndex] = newFeature
          return { ...plan, features: newFeatures }
        }
        return plan
      }),
    })
  }

  const handleAddFeature = (planId: string) => {
    setConfig({
      ...config,
      plans: config.plans.map((plan) => (plan.id === planId ? { ...plan, features: [...plan.features, "New feature"] } : plan)),
    })
  }

  const handleDeleteFeature = (planId: string, featureIndex: number) => {
    setConfig({
      ...config,
      plans: config.plans.map((plan) => {
        if (plan.id === planId) {
          return { ...plan, features: plan.features.filter((_, i) => i !== featureIndex) }
        }
        return plan
      }),
    })
  }

  const handleButtonUpdate = (buttonId: string, key: string, value: string) => {
    setConfig({
      ...config,
      actionButtons: config.actionButtons.map((btn) =>
        btn.id === buttonId ? { ...btn, [key]: value } : btn
      ),
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Netflix Admin Panel</h1>
            <p className="text-gray-400">Manage Netflix subscription plans, pricing, features, and links</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg transition-all"
            >
              {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showPreview ? "Hide" : "Preview"}
            </button>
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-black font-semibold px-6 py-2 rounded-lg transition-all"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </div>

        {/* Save Notification */}
        {saved && (
          <div className="mb-6 bg-green-500/20 border border-green-500 text-green-400 px-4 py-3 rounded-lg">
            Configuration saved successfully!
          </div>
        )}

        {/* Hero Section */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Hero Section</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Title</label>
              <input
                type="text"
                value={config.heroTitle}
                onChange={(e) => setConfig({ ...config, heroTitle: e.target.value })}
                className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg focus:border-amber-500 focus:outline-none"
              />
              <p className="text-xs text-gray-400 mt-1">Include "Netflix subscription" keywords naturally</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Description</label>
              <textarea
                value={config.heroDescription}
                onChange={(e) => setConfig({ ...config, heroDescription: e.target.value })}
                className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg focus:border-amber-500 focus:outline-none"
                rows={4}
              />
              <p className="text-xs text-gray-400 mt-1">Add "Netflix subscription" variations for better SEO</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Action Buttons</h2>
          <div className="space-y-4">
            {config.actionButtons.map((button) => (
              <div key={button.id} className="bg-slate-700 rounded-lg p-4 border border-slate-600">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Button Label</label>
                    <input
                      type="text"
                      value={button.label}
                      onChange={(e) => handleButtonUpdate(button.id, "label", e.target.value)}
                      className="w-full bg-slate-600 border border-slate-500 text-white px-3 py-2 rounded focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Link/URL</label>
                    <input
                      type="text"
                      value={button.href}
                      onChange={(e) => handleButtonUpdate(button.id, "href", e.target.value)}
                      className="w-full bg-slate-600 border border-slate-500 text-white px-3 py-2 rounded focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Variant</label>
                    <select
                      value={button.variant || "primary"}
                      onChange={(e) => handleButtonUpdate(button.id, "variant", e.target.value)}
                      className="w-full bg-slate-600 border border-slate-500 text-white px-3 py-2 rounded focus:border-amber-500 focus:outline-none"
                    >
                      <option value="primary">Primary (Amber)</option>
                      <option value="secondary">Secondary (Outlined)</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Netflix Plans */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Netflix Subscription Plans</h2>

          <div className="space-y-8">
            {config.plans.map((plan) => (
              <div key={plan.id} className="bg-slate-700 border border-slate-600 rounded-lg p-6">
                {/* Plan Header */}
                <div className="grid md:grid-cols-3 gap-4 mb-6 pb-6 border-b border-slate-600">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Plan Name</label>
                    <input
                      type="text"
                      value={plan.name}
                      onChange={(e) => handlePlanUpdate(plan.id, { name: e.target.value })}
                      className="w-full bg-slate-600 border border-slate-500 text-white px-3 py-2 rounded focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Price (e.g., Rs. 350)</label>
                    <input
                      type="text"
                      value={plan.price}
                      onChange={(e) => handlePlanUpdate(plan.id, { price: e.target.value })}
                      className="w-full bg-slate-600 border border-slate-500 text-white px-3 py-2 rounded focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Duration</label>
                    <input
                      type="text"
                      value={plan.duration}
                      onChange={(e) => handlePlanUpdate(plan.id, { duration: e.target.value })}
                      className="w-full bg-slate-600 border border-slate-500 text-white px-3 py-2 rounded focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Additional Info */}
                <div className="grid md:grid-cols-2 gap-4 mb-6 pb-6 border-b border-slate-600">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Description</label>
                    <input
                      type="text"
                      value={plan.description || ""}
                      onChange={(e) => handlePlanUpdate(plan.id, { description: e.target.value })}
                      className="w-full bg-slate-600 border border-slate-500 text-white px-3 py-2 rounded focus:border-amber-500 focus:outline-none"
                      placeholder="e.g., Netflix subscription premium plan with 4K"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Buy Link</label>
                    <input
                      type="text"
                      value={plan.buyLink || ""}
                      onChange={(e) => handlePlanUpdate(plan.id, { buyLink: e.target.value })}
                      className="w-full bg-slate-600 border border-slate-500 text-white px-3 py-2 rounded focus:border-amber-500 focus:outline-none"
                      placeholder="e.g., /category?search=netflix"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mt-4">
                      <input
                        type="checkbox"
                        checked={plan.best}
                        onChange={(e) => handlePlanUpdate(plan.id, { best: e.target.checked })}
                        className="w-4 h-4"
                      />
                      Mark as "Best Value"
                    </label>
                  </div>
                </div>

                {/* Features */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Netflix Subscription Features</h3>
                    <button
                      onClick={() => handleAddFeature(plan.id)}
                      className="inline-flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      Add Feature
                    </button>
                  </div>

                  <div className="space-y-2">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex gap-2">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => handleFeatureUpdate(plan.id, idx, e.target.value)}
                          className="flex-1 bg-slate-600 border border-slate-500 text-white px-3 py-2 rounded focus:border-amber-500 focus:outline-none"
                          placeholder="Feature description with Netflix subscription keywords"
                        />
                        <button
                          onClick={() => handleDeleteFeature(plan.id, idx)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Keywords Section */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">SEO Keywords ({config.seoKeywords.length})</h2>
          <div className="bg-slate-700 border border-slate-600 rounded-lg p-4">
            <div className="text-sm text-gray-300 space-y-2 max-h-64 overflow-y-auto">
              {config.seoKeywords.map((keyword, idx) => (
                <div key={idx} className="flex items-center gap-2 text-gray-400">
                  <span className="w-6 text-amber-400">{idx + 1}.</span>
                  <span>{keyword}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-4">
            These keywords are automatically included in the page metadata for better search engine rankings
          </p>
        </div>

        {/* Preview Link */}
        {showPreview && (
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Preview</h2>
            <Link
              href="/netflix-in-nepal"
              target="_blank"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-all"
            >
              View Netflix in Nepal Page →
            </Link>
          </div>
        )}

        {/* Save Button (Sticky) */}
        <div className="fixed bottom-6 right-6">
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-black font-semibold px-8 py-3 rounded-lg transition-all shadow-lg"
          >
            <Save className="w-5 h-5" />
            Save All Changes
          </button>
        </div>
      </div>
    </div>
  )
}
