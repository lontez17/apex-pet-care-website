import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase/server";
import { Resend } from "resend";
import { detectPack } from "@/lib/admin-helpers";
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

  // Detect if this is a pack purchase (from /api/book-checkout flow)
  const packConfig = meta.service && meta.plan ? detectPack(meta.service, meta.plan) : null;
  const isSubscription = !!session.subscription;
  const bookingType = packConfig ? "pack" : isSubscription ? "subscription" : "one_time";

  let servicePackId: string | null = null;

  // If it's a pack purchase, create the service_packs record
  if (packConfig) {
    const customerName = meta.firstName
      ? `${meta.firstName} ${meta.lastName || ""}`.trim()
      : meta.ownerName || "";

    const { data: pack, error: packError } = await supabaseAdmin
      .from("service_packs")
      .insert({
        customer_name: customerName,
        customer_email: meta.email || "",
        customer_phone: meta.phone || null,
        service_type: packConfig.service_type,
        pack_type: packConfig.pack_type,
        pack_label: packConfig.pack_label,
        total_sessions: packConfig.total_sessions,
        unit_duration_minutes: packConfig.unit_duration_minutes,
        price_paid: parseFloat(meta.total || meta.subtotal || "0"),
        stripe_session_id: session.id,
        stripe_customer_id: session.customer as string | null,
        status: "active",
      })
      .select("id")
      .single();

    if (packError) {
      throw new Error(`Service pack insert failed: ${packError.message}`);
    }
    servicePackId = pack.id;
  }

  // Insert booking record
  const ownerName = meta.firstName
    ? `${meta.firstName} ${meta.lastName || ""}`.trim()
    : meta.ownerName || "";

  const petName = meta.pets
    ? (() => { try { const pets = JSON.parse(meta.pets); return pets[0]?.petName || ""; } catch { return ""; } })()
    : meta.petName || "";

  const { error } = await supabaseAdmin.from("bookings").insert({
    pet_name: petName,
    pet_type: meta.petType || "dog",
    pet_breed: meta.petBreed || null,
    pet_age: meta.petDob || null,
    owner_name: ownerName,
    email: meta.email || "",
    phone: meta.phone || "",
    care_type: (meta.careType as "dog_walking" | "pet_sitting" | "drop_in") || "dog_walking",
    days_per_week: meta.daysPerWeek ? parseInt(meta.daysPerWeek) : null,
    selected_days: meta.selectedDays ? JSON.parse(meta.selectedDays) : null,
    start_date: meta.startDate || new Date().toISOString().split("T")[0],
    notes: meta.notes || null,
    monthly_rate: parseFloat(meta.monthlyRate || meta.total || "0"),
    registration_fee: parseFloat(meta.registrationFee || "0"),
    stripe_customer_id: session.customer as string | null,
    stripe_subscription_id: session.subscription as string | null,
    stripe_session_id: session.id,
    status: "active",
    booking_type: bookingType,
    service_pack_id: servicePackId,
    plan_label: meta.planLabel || packConfig?.pack_label || null,
  });

  if (error) {
    throw new Error(`Supabase insert failed: ${error.message}`);
  }

  // Link to user profile if email matches
  if (meta.email) {
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("email", meta.email)
      .single();

    if (profile) {
      await supabaseAdmin
        .from("bookings")
        .update({ user_id: profile.id })
        .eq("stripe_session_id", session.id);

      if (servicePackId) {
        await supabaseAdmin
          .from("service_packs")
          .update({ user_id: profile.id })
          .eq("id", servicePackId);
      }
    }
  }

  // Send confirmation email
  if (meta.email && process.env.RESEND_API_KEY) {
    const serviceName = packConfig?.pack_label || meta.careType?.replace("_", " ") || "Pet Care";
    await getResend().emails.send({
      from: "Apex Pet Care <noreply@apexpetcare.com>",
      to: meta.email,
      subject: "Booking Confirmed, Apex Pet Care",
      html: `
        <h1>Welcome to Apex Pet Care!</h1>
        <p>Hi ${ownerName},</p>
        <p>Your booking for <strong>${petName}</strong> has been confirmed!</p>
        <h3>Booking Details</h3>
        <ul>
          <li><strong>Service:</strong> ${serviceName}</li>
          ${meta.startDate ? `<li><strong>Start Date:</strong> ${meta.startDate}</li>` : ""}
          ${packConfig ? `<li><strong>Sessions:</strong> ${packConfig.total_sessions} sessions</li>` : ""}
          ${meta.monthlyRate ? `<li><strong>Monthly Rate:</strong> $${meta.monthlyRate}/month</li>` : ""}
        </ul>
        <p>We'll be in touch before your start date to schedule the meet & greet.</p>
        <p>Thank you for trusting us with ${petName}!</p>
        <p>- The Apex Pet Care Team</p>
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
