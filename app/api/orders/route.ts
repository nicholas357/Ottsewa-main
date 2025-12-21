import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { put } from "@vercel/blob"

const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: Request) {
  try {
    const formData = await request.formData()

    const userId = formData.get("userId") as string
    const itemsJson = formData.get("items") as string
    const paymentMethod = formData.get("paymentMethod") as string
    const paymentProof = formData.get("paymentProof") as File | null
    const specialNote = formData.get("specialNote") as string
    const contactInfo = formData.get("contactInfo") as string

    if (!userId || !itemsJson) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const items = JSON.parse(itemsJson)
    const contact = contactInfo ? JSON.parse(contactInfo) : {}

    console.log(
      "[v0] Creating orders for items:",
      items.map((item: any) => ({
        productId: item.productId,
        productTitle: item.productTitle,
        quantity: item.quantity,
      })),
    )

    // Upload payment proof if provided
    let paymentProofUrl = null
    if (paymentProof && paymentProof.size > 0) {
      const blob = await put(`payment-proofs/${userId}/${Date.now()}-${paymentProof.name}`, paymentProof, {
        access: "public",
      })
      paymentProofUrl = blob.url
    }

    // Create orders for each cart item
    const orderPromises = items.map(async (item: any) => {
      console.log("[v0] Creating order for product:", item.productId, "Title:", item.productTitle)

      const orderData: any = {
        user_id: userId,
        product_id: item.productId,
        quantity: item.quantity,
        unit_price: item.price,
        amount: item.price * item.quantity,
        status: "pending",
        payment_method: paymentMethod,
        payment_proof_url: paymentProofUrl,
        notes: specialNote
          ? `${specialNote}\n\nContact: ${contact.fullName}, ${contact.email}, ${contact.phone}, ${contact.address}, ${contact.city}`
          : `Contact: ${contact.fullName}, ${contact.email}, ${contact.phone}, ${contact.address}, ${contact.city}`,
      }

      // Add type-specific fields
      if (item.editionId) orderData.edition_id = item.editionId
      if (item.denominationId) orderData.denomination_id = item.denominationId
      if (item.planId) orderData.plan_id = item.planId
      if (item.durationMonths) orderData.duration_months = item.durationMonths
      if (item.licenseTypeId) orderData.license_type_id = item.licenseTypeId
      if (item.licenseDurationLabel) orderData.license_duration = item.licenseDurationLabel
      if (item.platformId) orderData.platform_id = item.platformId

      const { data, error } = await supabaseAdmin.from("orders").insert(orderData).select().single()

      if (error) {
        console.log("[v0] Error creating order:", error)
        throw error
      }

      console.log("[v0] Order created successfully:", data.id, "for product:", data.product_id)
      return data
    })

    const orders = await Promise.all(orderPromises)

    console.log("[v0] All orders created:", orders.length)

    return NextResponse.json({
      success: true,
      orders,
      orderId: orders[0]?.id, // Return primary order ID
    })
  } catch (error: any) {
    console.error("Order creation error:", error)
    return NextResponse.json({ error: error.message || "Failed to create order" }, { status: 500 })
  }
}
