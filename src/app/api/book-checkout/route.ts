import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { z } from "zod";

const petSchema = z.object({
  petName: z.string(),
  petType: z.string(),
  breed: z.string(),
  age: z.string(),
  weight: z.string().optional(),
  aggressionLevel: z.string(),
  spayedNeutered: z.string(),
  vaccinationsUpToDate: z.string(),
  specialNotes: z.string().optional(),
});

const checkoutSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  phone: z.string(),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  zip: z.string(),
  emergencyContactName: z.string(),
  emergencyContactPhone: z.string(),
  emergencyContactRelation: z.string(),
  vetName: z.string().optional(),
  vetPhone: z.string().optional(),
  service: z.string(),
  plan: z.string(),
  pets: z.array(petSchema),
  subtotal: z.number(),
  taxAmount: z.number(),
  taxRate: z.number(),
  total: z.number(),
  planLabel: z.string(),
  additionalDogFee: z.number(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = checkoutSchema.parse(body);

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const customer = await stripe.customers.create({
      email: data.email,
      name: `${data.firstName} ${data.lastName}`,
      phone: data.phone,
      address: {
        line1: data.address,
        city: data.city,
        state: data.state,
        postal_code: data.zip,
        country: "US",
      },
      metadata: {
        service: data.service,
        plan: data.plan,
        emergencyContact: `${data.emergencyContactName} (${data.emergencyContactRelation}) — ${data.emergencyContactPhone}`,
        vetInfo: data.vetName ? `${data.vetName}${data.vetPhone ? ` — ${data.vetPhone}` : ""}` : "",
        pets: data.pets.map((p) => `${p.petName} (${p.petType}, ${p.breed})`).join("; "),
      },
    });

    const lineItems: {
      price_data: {
        currency: string;
        product_data: { name: string; description?: string };
        unit_amount: number;
      };
      quantity: number;
    }[] = [];

    // Main service
    lineItems.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: `${data.planLabel}`,
          description: `${data.service.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} for ${data.pets.map((p) => p.petName).join(", ")}`,
        },
        unit_amount: Math.round(data.subtotal * 100 - data.additionalDogFee * 100),
      },
      quantity: 1,
    });

    // Additional dog fee
    if (data.additionalDogFee > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: "Additional Dog Fee",
            description: `+$10 per additional dog`,
          },
          unit_amount: Math.round(data.additionalDogFee * 100),
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      automatic_tax: { enabled: false },
      success_url: `${siteUrl}/booking-confirmed?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/book/summary`,
      metadata: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        address: `${data.address}, ${data.city}, ${data.state} ${data.zip}`,
        service: data.service,
        plan: data.plan,
        planLabel: data.planLabel,
        emergencyContact: `${data.emergencyContactName} (${data.emergencyContactRelation}) — ${data.emergencyContactPhone}`,
        vetInfo: data.vetName || "",
        pets: JSON.stringify(data.pets),
        subtotal: String(data.subtotal),
        taxAmount: String(data.taxAmount),
        taxRate: String(data.taxRate),
        total: String(data.total),
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
