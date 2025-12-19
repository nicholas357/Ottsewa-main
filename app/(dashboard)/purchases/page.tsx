"use client"

import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Download, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"

const purchases = [
  {
    id: "1",
    product: "Overwatch 2 - 1000 Coins",
    price: "$7.47",
    date: "2024-10-15",
    status: "Delivered",
    key: "XXXX-XXXX-XXXX-1234",
  },
  {
    id: "2",
    product: "Battlefield 6 EA App Key",
    price: "$67.42",
    date: "2024-10-10",
    status: "Delivered",
    key: "XXXX-XXXX-XXXX-5678",
  },
  {
    id: "3",
    product: "Razer Gold Gift Card 10 USD",
    price: "$10.00",
    date: "2024-10-05",
    status: "Pending",
    key: "XXXX-XXXX-XXXX-9012",
  },
]

export default function PurchasesPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Purchase History</h1>

      <Card className="bg-purple-900/50 border-purple-700 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-purple-800/50">
              <TableRow className="border-purple-700">
                <TableHead className="text-gray-300">Product</TableHead>
                <TableHead className="text-gray-300">Price</TableHead>
                <TableHead className="text-gray-300">Date</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300">Key</TableHead>
                <TableHead className="text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchases.map((purchase) => (
                <TableRow key={purchase.id} className="border-purple-700 hover:bg-purple-800/30">
                  <TableCell className="text-white font-semibold">{purchase.product}</TableCell>
                  <TableCell className="text-yellow-400 font-bold">{purchase.price}</TableCell>
                  <TableCell className="text-gray-300">{purchase.date}</TableCell>
                  <TableCell>
                    <Badge className={purchase.status === "Delivered" ? "bg-green-600" : "bg-yellow-600"}>
                      {purchase.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-400 font-mono text-sm">{purchase.key}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" className="text-cyan-400 hover:text-cyan-300">
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-cyan-400 hover:text-cyan-300">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}
