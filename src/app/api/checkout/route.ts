import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { z } from "zod";

const checkoutSchema = z.object({
  petInfo: z.object({
    petName: z.string(),
    petType: z.string(),
    petBreed: z.string().optional(),
    petDob: z.string(),
    ownerName: z.string(),
    email: z.string().email(),
    phone: z.string(),
  }),
  serviceSelection: z.object({
    careType: z.enum(["dog_walking", "pet_sitting", "drop_in"]),
    daysPerWeek: z.number(),
    selectedDays: z.array(z.string()).optional(),
    startDate: z.string(),
    notes: z.string().optional(),
  }),
  monthlyRate: z.number(),
  registrationFee: z.number(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = checkoutSchema.parse(body);

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    // Create or find Stripe customer
    const customer = await stripe.customers.create({
      email: data.petInfo.email,
      name: data.petInfo.ownerName,
      phone: data.petInfo.phone,
      metadata: {
        petName: data.petInfo.petName,
        petType: data.petInfo.petType,
        careType: data.serviceSelection.careType,
      },
    });

    const careLabel =
      data.serviceSelection.careType === "dog_walking"
        ? "Dog Walking"
        : data.serviceSelection.careType === "pet_sitting"
          ? "Pet Sitting"
          : "Drop-In Visits";

    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        // Monthly subscription
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${careLabel}, Monthly`,
              description: `${data.serviceSelection.daysPerWeek}x/week for ${data.petInfo.petName}`,
            },
            unit_amount: Math.round(data.monthlyRate * 100),
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${siteUrl}/booking-confirmed?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/get-quote`,
      metadata: {
        petName: data.petInfo.petName,
        petType: data.petInfo.petType,
        petBreed: data.petInfo.petBreed || "",
        petDob: data.petInfo.petDob,
        ownerName: data.petInfo.ownerName,
        email: data.petInfo.email,
        phone: data.petInfo.phone,
        careType: data.serviceSelection.careType,
        daysPerWeek: String(data.serviceSelection.daysPerWeek),
        selectedDays: JSON.stringify(data.serviceSelection.selectedDays || []),
        startDate: data.serviceSelection.startDate,
        notes: data.serviceSelection.notes || "",
        monthlyRate: String(data.monthlyRate),
        registrationFee: String(data.registrationFee),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: err.issues },
        { status: 400 }
      );
    }
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
