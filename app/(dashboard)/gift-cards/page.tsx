"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Gift, Copy, Plus } from "lucide-react"
import { useState } from "react"

export default function GiftCardsPage() {
  const [redeemCode, setRedeemCode] = useState("")

  const giftCards = [
    {
      id: "1",
      name: "Steam Gift Card",
      balance: "$50.00",
      lastUsed: "2024-10-10",
    },
    {
      id: "2",
      name: "PlayStation Network",
      balance: "$25.00",
      lastUsed: "2024-09-15",
    },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Gift Cards</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Gift Card Balance */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-purple-900/50 border-purple-700 p-6">
            <h2 className="text-xl font-bold text-white mb-6">Your Gift Cards</h2>
            <div className="space-y-4">
              {giftCards.map((card) => (
                <div
                  key={card.id}
                  className="flex items-center justify-between p-4 bg-purple-800/30 rounded-lg border border-purple-700"
                >
                  <div className="flex items-center gap-4">
                    <Gift className="w-8 h-8 text-yellow-400" />
                    <div>
                      <p className="text-white font-semibold">{card.name}</p>
                      <p className="text-gray-400 text-sm">Last used: {card.lastUsed}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-yellow-400 font-bold text-lg">{card.balance}</p>
                    <Button size="sm" variant="ghost" className="text-cyan-400 hover:text-cyan-300 mt-2">
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Redeem Code */}
          <Card className="bg-purple-900/50 border-purple-700 p-6">
            <h2 className="text-xl font-bold text-white mb-6">Redeem Gift Card</h2>
            <div className="space-y-4">
              <div>
                <Label className="text-white mb-2 block">Gift Card Code</Label>
                <Input
                  placeholder="Enter your gift card code"
                  value={redeemCode}
                  onChange={(e) => setRedeemCode(e.target.value)}
                  className="bg-purple-800 border-purple-700 text-white placeholder:text-gray-500"
                />
              </div>
              <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold">Redeem Code</Button>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <Card className="bg-purple-900/50 border-purple-700 p-6 sticky top-4">
            <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
            <div className="space-y-3">
              <Button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" />
                Buy Gift Card
              </Button>
              <Button
                variant="outline"
                className="w-full border-cyan-600 text-cyan-400 hover:bg-cyan-600/10 bg-transparent"
              >
                View History
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
