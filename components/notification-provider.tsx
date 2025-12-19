"use client"

import { useEffect, useState } from "react"
import { CheckCircle, AlertCircle, Info, X } from "lucide-react"

interface Notification {
  id: string
  type: "success" | "error" | "info" | "warning"
  title: string
  message: string
  duration?: number
}

export function NotificationProvider() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    const handleNotification = (event: CustomEvent<Notification>) => {
      const notification = {
        ...event.detail,
        id: Math.random().toString(36).substr(2, 9),
      }
      setNotifications((prev) => [...prev, notification])

      if (notification.duration !== 0) {
        setTimeout(() => {
          removeNotification(notification.id)
        }, notification.duration || 4000)
      }
    }

    window.addEventListener("notification", handleNotification as EventListener)
    return () => window.removeEventListener("notification", handleNotification as EventListener)
  }, [])

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-emerald-400" />
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-400" />
      case "warning":
        return <AlertCircle className="w-4 h-4 text-amber-400" />
      default:
        return <Info className="w-4 h-4 text-amber-400" />
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 pointer-events-none">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="bg-zinc-900/95 backdrop-blur-xl border border-amber-500/[0.1] rounded-xl p-3 shadow-2xl shadow-black/50 animate-in slide-in-from-right-full duration-200 pointer-events-auto max-w-sm relative overflow-hidden"
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />

          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">{getIcon(notification.type)}</div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-white text-sm">{notification.title}</h3>
              <p className="text-zinc-400 text-xs mt-0.5">{notification.message}</p>
            </div>
            <button
              onClick={() => removeNotification(notification.id)}
              className="flex-shrink-0 text-zinc-500 hover:text-amber-400 transition p-1 hover:bg-amber-500/[0.08] rounded-lg"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export function showNotification(notification: Omit<Notification, "id">) {
  const event = new CustomEvent("notification", { detail: notification })
  window.dispatchEvent(event)
}
