"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, CreditCard, X } from "lucide-react"

const subscriptions = [
  {
    id: "1",
    name: "Premium Plus",
    price: "$9.99/month",
    status: "Active",
    renewalDate: "2024-11-15",
    features: ["Unlimited downloads", "Priority support", "Early access"],
  },
  {
    id: "2",
    name: "Game Pass Ultimate",
    price: "$16.99/month",
    status: "Active",
    renewalDate: "2024-11-20",
    features: ["100+ games", "Cloud gaming", "Xbox Play Anywhere"],
  },
]

export default function SubscriptionsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Active Subscriptions</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {subscriptions.map((sub) => (
          <Card key={sub.id} className="bg-purple-900/50 border-purple-700 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-white">{sub.name}</h3>
                <p className="text-yellow-400 font-bold text-lg mt-2">{sub.price}</p>
              </div>
              <Badge className="bg-green-600">{sub.status}</Badge>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-gray-300">
                <Calendar className="w-4 h-4" />
                <span>Renews on {sub.renewalDate}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <CreditCard className="w-4 h-4" />
                <span>Auto-renewal enabled</span>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-gray-400 text-sm mb-3">Includes:</p>
              <ul className="space-y-2">
                {sub.features.map((feature) => (
                  <li key={feature} className="text-gray-300 text-sm flex items-center gap-2">
                    <span className="text-cyan-400">✓</span> {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-3">
              <Button className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white">Manage</Button>
              <Button variant="outline" className="border-red-600 text-red-400 hover:bg-red-600/10 bg-transparent">
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
