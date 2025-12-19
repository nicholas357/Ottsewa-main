"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Play } from "lucide-react"

const library = [
  {
    id: "1",
    name: "Overwatch 2",
    platform: "Battle.net",
    image: "/overwatch-2.jpg",
  },
  {
    id: "2",
    name: "Battlefield 6",
    platform: "EA App",
    image: "/battlefield-6.jpg",
  },
  {
    id: "3",
    name: "Fortnite",
    platform: "Epic Games",
    image: "/generic-battle-royale.png",
  },
]

export default function LibraryPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Download Library</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {library.map((game) => (
          <Card
            key={game.id}
            className="bg-purple-900/50 border-purple-700 overflow-hidden hover:border-cyan-400 transition-colors"
          >
            <img src={game.image || "/placeholder.svg"} alt={game.name} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="text-white font-bold mb-2">{game.name}</h3>
              <p className="text-gray-400 text-sm mb-4">{game.platform}</p>
              <div className="flex gap-2">
                <Button className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white flex items-center justify-center gap-2">
                  <Play className="w-4 h-4" />
                  Play
                </Button>
                <Button variant="outline" className="border-cyan-600 text-cyan-400 hover:bg-cyan-600/10 bg-transparent">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
