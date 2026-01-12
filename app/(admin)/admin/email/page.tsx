"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Mail, Send, Eye, Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function AdminEmailPage() {
  const { toast } = useToast()
  const [loading, setSending] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [sent, setSent] = useState(false)

  const [formData, setFormData] = useState({
    to: "",
    subject: "",
    message: "",
  })

  const handleSend = async () => {
    if (!formData.to || !formData.subject || !formData.message) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.to)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      })
      return
    }

    setSending(true)
    try {
      const res = await fetch("/api/admin/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to send email")
      }

      setSent(true)
      toast({
        title: "Email sent",
        description: `Successfully sent to ${formData.to}`,
      })

      // Reset form after 2 seconds
      setTimeout(() => {
        setFormData({ to: "", subject: "", message: "" })
        setSent(false)
      }, 2000)
    } catch (error) {
      toast({
        title: "Failed to send",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="p-4 lg:p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Mail className="w-6 h-6 text-amber-500" />
          Send Email
        </h1>
        <p className="text-zinc-400 mt-1">Send custom emails to customers from support@ottsewa.store</p>
      </div>

      {/* Info Banner */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 mb-6">
        <div className="flex gap-3">
          <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="text-sm text-zinc-400">
            <p className="font-medium text-zinc-300 mb-1">Email Best Practices</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Keep subject lines clear and relevant</li>
              <li>Avoid spam words like "FREE", "URGENT", "ACT NOW"</li>
              <li>Use plain, professional language</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white">Compose Email</CardTitle>
          <CardDescription>Fill in the details below. The email will be sent as plain text.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* To */}
          <div className="space-y-2">
            <Label htmlFor="to" className="text-zinc-300">
              Recipient Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="to"
              type="email"
              placeholder="customer@example.com"
              value={formData.to}
              onChange={(e) => setFormData({ ...formData, to: e.target.value })}
              className="bg-zinc-950 border-zinc-700 text-white placeholder:text-zinc-500"
            />
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="subject" className="text-zinc-300">
              Subject <span className="text-red-500">*</span>
            </Label>
            <Input
              id="subject"
              type="text"
              placeholder="Your order update from OTTSewa"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="bg-zinc-950 border-zinc-700 text-white placeholder:text-zinc-500"
            />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message" className="text-zinc-300">
              Message <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="message"
              placeholder="Write your message here..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={8}
              className="bg-zinc-950 border-zinc-700 text-white placeholder:text-zinc-500 resize-none"
            />
            <p className="text-xs text-zinc-500">{formData.message.length} characters</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 bg-transparent"
                  disabled={!formData.subject || !formData.message}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-zinc-900 border-zinc-800 max-w-lg">
                <DialogHeader>
                  <DialogTitle className="text-white">Email Preview</DialogTitle>
                  <DialogDescription>This is how your email will appear to the recipient.</DialogDescription>
                </DialogHeader>
                <div className="mt-4 space-y-4">
                  <div className="text-sm">
                    <span className="text-zinc-500">From:</span>
                    <span className="text-zinc-300 ml-2">OTTSewa Support &lt;support@ottsewa.store&gt;</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-zinc-500">To:</span>
                    <span className="text-zinc-300 ml-2">{formData.to || "—"}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-zinc-500">Subject:</span>
                    <span className="text-white ml-2 font-medium">{formData.subject || "—"}</span>
                  </div>
                  <div className="border-t border-zinc-800 pt-4">
                    <div className="bg-zinc-950 rounded-lg p-4 text-sm text-zinc-300 whitespace-pre-wrap">
                      {formData.message || "No message content"}
                      <div className="mt-6 pt-4 border-t border-zinc-800 text-zinc-500 text-xs">
                        —<br />
                        OTTSewa Support
                        <br />
                        www.ottsewa.store
                        <br />
                        WhatsApp: +977 9869671451
                      </div>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button
              onClick={handleSend}
              disabled={loading || sent || !formData.to || !formData.subject || !formData.message}
              className={sent ? "bg-green-600 hover:bg-green-600" : "bg-amber-500 hover:bg-amber-600 text-black"}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : sent ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Sent!
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Email
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
