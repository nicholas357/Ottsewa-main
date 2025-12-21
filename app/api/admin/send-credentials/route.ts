import { Resend } from "resend"
import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

const resend = new Resend("re_Yfq7nnEB_H228tgtSSvDTFVJECH2iRcpL")

interface ProductInfo {
  name: string
  planName?: string
  durationMonths?: number
  amount: number
}

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

    const body = await request.json()
    const { orderId, orderIds, customerEmail, customerName, productName, products, credentials, additionalNotes } = body

    // Support backwards compatibility
    const allOrderIds: string[] = orderIds || (orderId ? [orderId] : [])
    const allProducts: ProductInfo[] = products || (productName ? [{ name: productName, amount: 0 }] : [])

    if (allOrderIds.length === 0 || !customerEmail || allProducts.length === 0 || !credentials) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const totalAmount = allProducts.reduce((sum, p) => sum + (p.amount || 0), 0)

    const productsHtml = allProducts
      .map(
        (p) => `
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
            <span style="color: #fff; font-weight: 500;">${p.name}</span>
            ${p.planName ? `<br><span style="color: #a1a1aa; font-size: 13px;">Plan: ${p.planName}</span>` : ""}
            ${p.durationMonths ? `<br><span style="color: #71717a; font-size: 12px;">${p.durationMonths} months</span>` : ""}
          </td>
          <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.05); text-align: right;">
            <span style="color: #f59e0b; font-weight: 600;">NPR ${p.amount?.toLocaleString() || "0"}</span>
          </td>
        </tr>
      `,
      )
      .join("")

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: "OTTSewa Support <support@ottsewa.store>",
      to: customerEmail,
      subject: `Your Order Credentials - ${allProducts.length > 1 ? `${allProducts.length} Products` : allProducts[0].name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #0f0f0f; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f0f0f; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #1a1a1a; border-radius: 16px; border: 1px solid rgba(255,255,255,0.08); overflow: hidden;">
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 32px; text-align: center;">
                      <h1 style="margin: 0; color: #000; font-size: 28px; font-weight: 700;">OTTSewa</h1>
                      <p style="margin: 8px 0 0; color: rgba(0,0,0,0.7); font-size: 14px;">Your Premium Subscription Partner</p>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px 32px;">
                      <h2 style="margin: 0 0 8px; color: #fff; font-size: 24px; font-weight: 600;">Hello ${customerName || "Valued Customer"}!</h2>
                      <p style="margin: 0 0 32px; color: #a1a1aa; font-size: 16px; line-height: 1.6;">
                        Thank you for your purchase. Your order credentials for <strong style="color: #f59e0b;">${allProducts.length > 1 ? `${allProducts.length} products` : allProducts[0].name}</strong> are ready.
                      </p>
                      
                      <!-- Order Summary -->
                      <div style="background-color: #0f0f0f; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                        <h3 style="margin: 0 0 16px; color: #f59e0b; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Order Summary</h3>
                        <table width="100%" cellpadding="0" cellspacing="0">
                          ${productsHtml}
                          ${
                            allProducts.length > 1
                              ? `
                          <tr>
                            <td style="padding: 16px 0 0;">
                              <span style="color: #a1a1aa; font-weight: 500;">Total</span>
                            </td>
                            <td style="padding: 16px 0 0; text-align: right;">
                              <span style="color: #f59e0b; font-weight: 700; font-size: 18px;">NPR ${totalAmount.toLocaleString()}</span>
                            </td>
                          </tr>
                          `
                              : ""
                          }
                        </table>
                      </div>
                      
                      <!-- Credentials Box -->
                      <div style="background-color: #0f0f0f; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 24px; margin-bottom: 24px;">
                        <h3 style="margin: 0 0 16px; color: #f59e0b; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Your Credentials</h3>
                        <pre style="margin: 0; color: #fff; font-size: 15px; line-height: 1.8; white-space: pre-wrap; word-break: break-all; font-family: 'SF Mono', Monaco, monospace; background: #161616; padding: 16px; border-radius: 8px;">${credentials}</pre>
                      </div>
                      
                      ${
                        additionalNotes
                          ? `
                      <!-- Additional Notes -->
                      <div style="background-color: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.2); border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                        <h4 style="margin: 0 0 8px; color: #f59e0b; font-size: 14px; font-weight: 600;">Important Notes</h4>
                        <p style="margin: 0; color: #d4d4d8; font-size: 14px; line-height: 1.6;">${additionalNotes}</p>
                      </div>
                      `
                          : ""
                      }
                      
                      <!-- Order Info -->
                      <div style="border-top: 1px solid rgba(255,255,255,0.08); padding-top: 24px; margin-top: 24px;">
                        <p style="margin: 0; color: #71717a; font-size: 13px;">
                          <strong style="color: #a1a1aa;">Order ID${allOrderIds.length > 1 ? "s" : ""}:</strong> ${allOrderIds.map((id) => id.slice(0, 8)).join(", ")}
                        </p>
                      </div>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #0a0a0a; padding: 24px 32px; border-top: 1px solid rgba(255,255,255,0.05);">
                      <p style="margin: 0 0 8px; color: #71717a; font-size: 13px; text-align: center;">
                        Need help? Contact us on WhatsApp
                      </p>
                      <p style="margin: 0; text-align: center;">
                        <a href="https://wa.me/9779869671451" style="color: #f59e0b; text-decoration: none; font-weight: 600;">+977 9869671451</a>
                      </p>
                      <p style="margin: 16px 0 0; color: #52525b; font-size: 12px; text-align: center;">
                        © ${new Date().getFullYear()} OTTSewa. All rights reserved.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    })

    if (error) {
      console.error("Resend error:", error)
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
    }

    await supabase
      .from("orders")
      .update({
        status: "completed",
        notes: `Credentials sent on ${new Date().toLocaleString()}`,
        updated_at: new Date().toISOString(),
      })
      .in("id", allOrderIds)

    return NextResponse.json({ success: true, messageId: data?.id, ordersUpdated: allOrderIds.length })
  } catch (error) {
    console.error("Send credentials error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
