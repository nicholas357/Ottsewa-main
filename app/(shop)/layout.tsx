import type React from "react"

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-black">
      <main className="flex-1">{children}</main>
    </div>
  )
}
