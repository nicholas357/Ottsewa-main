"use client"

import { useEffect, useState } from "react"
import { AlertCircle, CheckCircle, Info, X } from "lucide-react"

interface ToastProps {
  type: "success" | "error" | "info"
  message: string
  duration?: number
}

export function Toast({ type, message, duration = 3000 }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), duration)
    return () => clearTimeout(timer)
  }, [duration])

  if (!isVisible) return null

  const bgColor = {
    success: "bg-green-900/90 border-green-700",
    error: "bg-red-900/90 border-red-700",
    info: "bg-blue-900/90 border-blue-700",
  }[type]

  const Icon = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
  }[type]

  const textColor = {
    success: "text-green-400",
    error: "text-red-400",
    info: "text-blue-400",
  }[type]

  return (
    <div
      className={`fixed bottom-4 right-4 ${bgColor} border rounded-lg p-4 flex items-center gap-3 max-w-sm animate-in fade-in slide-in-from-bottom-4`}
    >
      <Icon className={`w-5 h-5 ${textColor}`} />
      <p className="text-white flex-1">{message}</p>
      <button onClick={() => setIsVisible(false)} className="text-gray-400 hover:text-white">
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
