import { Resend } from "resend"
import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

const resend = new Resend(process.env.RESEND_API_KEY || "re_Yfq7nnEB_H228tgtSSvDTFVJECH2iRcpL")

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // Verify admin user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { to, subject, message } = await request.json()

    if (!to || !subject || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(to)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
    }

    // Plain text email with simple signature - avoids spam filters
    const plainTextContent = `${message}

—
OTTSewa Support
www.ottsewa.store
WhatsApp: +977 9869671451`

    // Minimal HTML - plain text wrapped in basic HTML to ensure proper rendering
    // Avoiding complex styling reduces spam score
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 15px; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto;">
    ${message
      .split("\n")
      .map((line: string) => (line ? `<p style="margin: 0 0 16px 0;">${line}</p>` : "<br>"))
      .join("")}
    <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 24px 0;">
    <p style="margin: 0; color: #666; font-size: 13px;">
      OTTSewa Support<br>
      <a href="https://www.ottsewa.store" style="color: #666;">www.ottsewa.store</a><br>
      WhatsApp: +977 9869671451
    </p>
  </div>
</body>
</html>`

    const { data, error } = await resend.emails.send({
      from: "OTTSewa Support <support@ottsewa.store>",
      to: to,
      subject: subject,
      text: plainTextContent,
      html: htmlContent,
    })

    if (error) {
      console.error("Resend error:", error)
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
    }

    return NextResponse.json({ success: true, messageId: data?.id })
  } catch (error) {
    console.error("Send email error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
