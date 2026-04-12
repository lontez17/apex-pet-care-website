import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase/server";
import { Resend } from "resend";
import type Stripe from "stripe";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY || "");
}

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutCompleted(session);
      break;
    }
    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      await handlePaymentFailed(invoice);
      break;
    }
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const meta = session.metadata || {};

  // Insert booking into Supabase
  const { error } = await supabaseAdmin.from("bookings").insert({
    pet_name: meta.petName || "",
    pet_type: meta.petType || "dog",
    pet_breed: meta.petBreed || null,
    pet_age: meta.petDob || null,
    owner_name: meta.ownerName || "",
    email: meta.email || "",
    phone: meta.phone || "",
    care_type: (meta.careType as "dog_walking" | "pet_sitting" | "drop_in") || "dog_walking",
    days_per_week: meta.daysPerWeek ? parseInt(meta.daysPerWeek) : null,
    selected_days: meta.selectedDays ? JSON.parse(meta.selectedDays) : null,
    start_date: meta.startDate || new Date().toISOString().split("T")[0],
    notes: meta.notes || null,
    monthly_rate: parseFloat(meta.monthlyRate || "0"),
    registration_fee: parseFloat(meta.registrationFee || "0"),
    stripe_customer_id: session.customer as string | null,
    stripe_subscription_id: session.subscription as string | null,
    stripe_session_id: session.id,
    status: "active",
  });

  if (error) {
    throw new Error(`Supabase insert failed: ${error.message}`);
  }

  // Send confirmation email
  if (meta.email && process.env.RESEND_API_KEY) {
    await getResend().emails.send({
      from: "Apex Pet Care <noreply@apexpetcare.com>",
      to: meta.email,
      subject: "Booking Confirmed — Apex Pet Care",
      html: `
        <h1>Welcome to Apex Pet Care!</h1>
        <p>Hi ${meta.ownerName},</p>
        <p>Your booking for <strong>${meta.petName}</strong> has been confirmed!</p>
        <h3>Booking Details</h3>
        <ul>
          <li><strong>Service:</strong> ${meta.careType?.replace("_", " ")}</li>
          <li><strong>Start Date:</strong> ${meta.startDate}</li>
          <li><strong>Monthly Rate:</strong> $${meta.monthlyRate}/month</li>
        </ul>
        <p>We'll be in touch before your start date to schedule the meet & greet.</p>
        <p>Thank you for trusting us with ${meta.petName}!</p>
        <p>— The Apex Pet Care Team</p>
      `,
    });
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;
  if (!customerId) return;

  await supabaseAdmin
    .from("bookings")
    .update({ status: "payment_failed" as const })
    .eq("stripe_customer_id", customerId);
}
