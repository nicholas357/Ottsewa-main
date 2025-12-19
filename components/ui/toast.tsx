"use client"

import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { cva, type VariantProps } from "class-variance-authority"
import { X, Check, AlertCircle, Loader2, Info } from "lucide-react"

import { cn } from "@/lib/utils"

const ToastProvider = ToastPrimitives.Provider

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed bottom-0 left-0 right-0 z-[100] flex flex-col items-center gap-1.5 p-3 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:max-w-[360px]",
      className,
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center gap-2 overflow-hidden rounded-lg border px-3 py-2 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-bottom-full data-[state=open]:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border-zinc-700/50 bg-zinc-900 text-zinc-100",
        destructive: "border-red-900/50 bg-zinc-900 text-zinc-100",
        success: "border-green-900/50 bg-zinc-900 text-zinc-100",
        warning: "border-amber-900/50 bg-zinc-900 text-zinc-100",
        info: "border-blue-900/50 bg-zinc-900 text-zinc-100",
        loading: "border-zinc-700/50 bg-zinc-900 text-zinc-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

const ToastIcon = ({ variant }: { variant?: string }) => {
  const iconClass = "h-4 w-4 flex-shrink-0"

  switch (variant) {
    case "success":
      return (
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500/20">
          <Check className="h-3 w-3 text-green-500" />
        </div>
      )
    case "destructive":
      return (
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500/20">
          <X className="h-3 w-3 text-red-500" />
        </div>
      )
    case "warning":
      return (
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/20">
          <AlertCircle className="h-3 w-3 text-amber-500" />
        </div>
      )
    case "info":
      return (
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/20">
          <Info className="h-3 w-3 text-blue-500" />
        </div>
      )
    case "loading":
      return <Loader2 className={cn(iconClass, "text-zinc-400 animate-spin")} />
    default:
      return (
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-700/50">
          <Check className="h-3 w-3 text-zinc-400" />
        </div>
      )
  }
}

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> & VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root ref={ref} className={cn(toastVariants({ variant }), className)} duration={4000} {...props}>
      {props.children}
    </ToastPrimitives.Root>
  )
})
Toast.displayName = ToastPrimitives.Root.displayName

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-6 shrink-0 items-center justify-center rounded-md bg-zinc-800 px-2 text-[11px] font-medium text-zinc-300 transition-colors hover:bg-zinc-700 hover:text-white focus:outline-none focus:ring-1 focus:ring-zinc-600 disabled:pointer-events-none disabled:opacity-50",
      className,
    )}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "rounded p-0.5 text-zinc-500 transition-colors hover:text-zinc-300 hover:bg-zinc-800 focus:outline-none",
      className,
    )}
    toast-close=""
    {...props}
  >
    <X className="h-3.5 w-3.5" />
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title ref={ref} className={cn("text-xs font-medium leading-tight", className)} {...props} />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-[11px] text-zinc-400 leading-tight", className)}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>

type ToastActionElement = React.ReactElement<typeof ToastAction>

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
  ToastIcon,
}
