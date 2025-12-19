"use client"

import { useState } from "react"
import { X, Check, Zap } from "lucide-react"

interface SubscriptionModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SubscriptionModal({ isOpen, onClose }: SubscriptionModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">("monthly")
  const [selectedDuration, setSelectedDuration] = useState<"1" | "3" | "6" | "12">("1")

  if (!isOpen) return null

  const plans = [
    {
      name: "Basic",
      monthlyPrice: 4.99,
      features: ["Access to basic games", "Standard support", "Monthly updates"],
      color: "from-blue-500 to-blue-600",
    },
    {
      name: "Premium",
      monthlyPrice: 9.99,
      features: ["All Basic features", "Early access to new games", "Priority support", "Exclusive discounts"],
      color: "from-purple-500 to-purple-600",
      popular: true,
    },
    {
      name: "Ultimate",
      monthlyPrice: 19.99,
      features: [
        "All Premium features",
        "Unlimited downloads",
        "VIP support",
        "Free game passes",
        "Ad-free experience",
      ],
      color: "from-yellow-500 to-orange-600",
    },
  ]

  const durations = [
    { value: "1", label: "1 Month", discount: 0 },
    { value: "3", label: "3 Months", discount: 5 },
    { value: "6", label: "6 Months", discount: 10 },
    { value: "12", label: "1 Year", discount: 20 },
  ]

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-purple-900/95 to-indigo-900/95 border border-purple-500/30 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-900 to-indigo-900 border-b border-purple-500/30 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-poppins font-bold text-white">Choose Your Plan</h2>
            <p className="text-purple-300 mt-1">Select a subscription tier and duration</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-purple-800 rounded-lg transition text-purple-300 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Duration Selection */}
          <div>
            <h3 className="text-xl font-poppins font-bold text-white mb-4">Select Duration</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {durations.map((duration) => (
                <button
                  key={duration.value}
                  onClick={() => setSelectedDuration(duration.value as any)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedDuration === duration.value
                      ? "border-yellow-400 bg-yellow-400/10"
                      : "border-purple-500/30 hover:border-purple-400/50"
                  }`}
                >
                  <div className="font-semibold text-white">{duration.label}</div>
                  {duration.discount > 0 && (
                    <div className="text-xs text-green-400 font-bold mt-1">Save {duration.discount}%</div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Plans Grid */}
          <div>
            <h3 className="text-xl font-poppins font-bold text-white mb-4">Subscription Plans</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`relative rounded-xl border-2 overflow-hidden transition-all ${
                    plan.popular
                      ? "border-yellow-400 bg-gradient-to-br from-purple-900/80 to-indigo-900/80 scale-105"
                      : "border-purple-500/30 bg-gradient-to-br from-purple-900/50 to-indigo-900/50 hover:border-purple-400/50"
                  }`}
                >
                  {/* Popular Badge */}
                  {plan.popular && (
                    <div className="absolute top-0 right-0 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-1 text-xs font-bold rounded-bl-lg">
                      MOST POPULAR
                    </div>
                  )}

                  <div className="p-6">
                    {/* Plan Name */}
                    <h4 className="text-2xl font-poppins font-bold text-white mb-2">{plan.name}</h4>

                    {/* Price */}
                    <div className="mb-6">
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold text-white">
                          NPR {(plan.monthlyPrice * Number.parseInt(selectedDuration)).toFixed(2)}
                        </span>
                        <span className="text-purple-300">
                          / {selectedDuration} month{Number.parseInt(selectedDuration) > 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="text-sm text-green-400 font-semibold mt-2">
                        NPR {(plan.monthlyPrice / Number.parseInt(selectedDuration)).toFixed(2)}/month
                      </div>
                    </div>

                    {/* Features */}
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                          <span className="text-purple-200 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Subscribe Button */}
                    <button
                      className={`w-full py-3 rounded-lg font-bold transition-all ${
                        plan.popular
                          ? "bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 hover:from-yellow-500 hover:via-yellow-600 hover:to-yellow-700 text-black shadow-lg hover:shadow-yellow-500/50"
                          : "bg-purple-600 hover:bg-purple-500 text-white"
                      }`}
                    >
                      Subscribe Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Games Selection */}
          <div>
            <h3 className="text-xl font-poppins font-bold text-white mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              Included Games & Software
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                "Overwatch 2",
                "Valorant",
                "CS:GO",
                "Fortnite",
                "Apex Legends",
                "Warzone",
                "Dota 2",
                "League of Legends",
              ].map((game) => (
                <div
                  key={game}
                  className="bg-purple-800/50 border border-purple-500/30 rounded-lg p-4 text-center hover:border-purple-400/50 transition cursor-pointer"
                >
                  <div className="text-white font-semibold text-sm">{game}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-purple-500/30 pt-6 flex flex-col sm:flex-row gap-4 justify-end">
            <button
              onClick={onClose}
              className="px-6 py-3 border-2 border-purple-400 text-purple-300 hover:bg-purple-400/20 rounded-lg font-semibold transition-all"
            >
              Cancel
            </button>
            <button className="px-8 py-3 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 hover:from-yellow-500 hover:via-yellow-600 hover:to-yellow-700 text-black font-bold rounded-lg transition-all shadow-lg hover:shadow-yellow-500/50">
              Continue to Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
