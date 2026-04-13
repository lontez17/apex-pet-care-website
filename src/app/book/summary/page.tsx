"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useBookingStore, getTaxRate, getServicePrice } from "@/lib/booking-store";
import {
  PawPrint,
  User,
  MapPin,
  ShieldAlert,
  Dog,
  Receipt,
  ArrowLeft,
  CreditCard,
} from "lucide-react";

const SERVICE_LABELS: Record<string, string> = {
  "dog-walking": "Dog Walking",
  "drop-in-visits": "Drop-In Visits",
  boarding: "Boarding",
  daycare: "Daycare",
  "house-sitting": "House Sitting",
  transportation: "Transportation",
};

export default function BookingSummaryPage() {
  const router = useRouter();
  const data = useBookingStore((s) => s.data);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!data) {
    return (
      <>
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-20 px-4">
          <div className="text-center">
            <PawPrint className="h-10 w-10 text-sage-green mx-auto mb-4" />
            <h2 className="font-heading text-2xl font-bold text-dark-olive mb-2">
              No Booking Data Found
            </h2>
            <p className="text-muted-olive mb-6">
              Please fill out the booking form first.
            </p>
            <Link
              href="/services/dog-walking"
              className="btn-hover inline-flex items-center gap-2 bg-forest-green text-off-white px-6 py-3 rounded-full font-semibold"
            >
              Browse Services
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const serviceLabel = SERVICE_LABELS[data.service] || data.service;
  const { label: planLabel, unitPrice } = getServicePrice(data.service, data.plan);
  const additionalDogs = Math.max(0, data.pets.filter((p) => p.petType === "dog").length - 1);
  const additionalDogFee = additionalDogs * 10;
  const subtotal = unitPrice + additionalDogFee;
  const taxRate = getTaxRate(data.zip);
  const taxAmount = subtotal * taxRate;
  const total = subtotal + taxAmount;

  async function handleConfirm() {
    if (!data) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/book-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          subtotal,
          taxAmount,
          taxRate,
          total,
          planLabel,
          additionalDogFee,
        }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Checkout failed");
      if (result.url) {
        window.location.href = result.url;
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 py-12 md:py-16">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-forest-green/10 text-forest-green text-sm font-medium px-4 py-1.5 rounded-full mb-4">
              <Receipt className="h-4 w-4" />
              Review & Confirm
            </div>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-dark-olive mb-2">
              Booking Summary
            </h1>
            <p className="text-muted-olive">
              Review your details and total before confirming.
            </p>
          </div>

          <div className="space-y-6">
            {/* Customer Info */}
            <div className="card bg-off-white p-6">
              <div className="flex items-center gap-2 mb-3">
                <User className="h-4 w-4 text-forest-green" />
                <h3 className="font-heading font-bold text-dark-olive text-sm">Customer</h3>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                <span className="text-muted-olive">Name</span>
                <span className="text-dark-olive font-medium">{data.firstName} {data.lastName}</span>
                <span className="text-muted-olive">Email</span>
                <span className="text-dark-olive font-medium">{data.email}</span>
                <span className="text-muted-olive">Phone</span>
                <span className="text-dark-olive font-medium">{data.phone}</span>
              </div>
            </div>

            {/* Address */}
            <div className="card bg-off-white p-6">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="h-4 w-4 text-forest-green" />
                <h3 className="font-heading font-bold text-dark-olive text-sm">Service Address</h3>
              </div>
              <p className="text-sm text-dark-olive">
                {data.address}<br />
                {data.city}, {data.state} {data.zip}
              </p>
            </div>

            {/* Emergency Contact */}
            <div className="card bg-off-white p-6">
              <div className="flex items-center gap-2 mb-3">
                <ShieldAlert className="h-4 w-4 text-forest-green" />
                <h3 className="font-heading font-bold text-dark-olive text-sm">Emergency Contact</h3>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                <span className="text-muted-olive">Contact</span>
                <span className="text-dark-olive font-medium">
                  {data.emergencyContactName} ({data.emergencyContactRelation})
                </span>
                <span className="text-muted-olive">Phone</span>
                <span className="text-dark-olive font-medium">{data.emergencyContactPhone}</span>
                {data.vetName && (
                  <>
                    <span className="text-muted-olive">Veterinarian</span>
                    <span className="text-dark-olive font-medium">
                      {data.vetName}{data.vetPhone ? `, ${data.vetPhone}` : ""}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Pets */}
            {data.pets.map((pet, i) => (
              <div key={i} className="card bg-off-white p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Dog className="h-4 w-4 text-forest-green" />
                  <h3 className="font-heading font-bold text-dark-olive text-sm">
                    {pet.petName}
                  </h3>
                  <span className="text-xs text-muted-olive bg-sage-green/15 px-2 py-0.5 rounded-full capitalize">
                    {pet.petType}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-1 text-sm">
                  <span className="text-muted-olive">Breed</span>
                  <span className="text-dark-olive font-medium">{pet.breed}</span>
                  <span className="text-muted-olive">Age</span>
                  <span className="text-dark-olive font-medium">{pet.age}</span>
                  {pet.weight && (
                    <>
                      <span className="text-muted-olive">Weight</span>
                      <span className="text-dark-olive font-medium">{pet.weight} lbs</span>
                    </>
                  )}
                  <span className="text-muted-olive">Aggression</span>
                  <span className="text-dark-olive font-medium capitalize">{pet.aggressionLevel}</span>
                  <span className="text-muted-olive">Spayed/Neutered</span>
                  <span className="text-dark-olive font-medium capitalize">{pet.spayedNeutered}</span>
                  <span className="text-muted-olive">Vaccinations</span>
                  <span className="text-dark-olive font-medium capitalize">{pet.vaccinationsUpToDate}</span>
                </div>
                {pet.specialNotes && (
                  <p className="text-sm text-muted-olive mt-2 italic">
                    Note: {pet.specialNotes}
                  </p>
                )}
              </div>
            ))}

            {/* Price Breakdown */}
            <div className="card bg-forest-green text-off-white p-6">
              <div className="flex items-center gap-2 mb-4">
                <Receipt className="h-4 w-4" />
                <h3 className="font-heading font-bold text-sm">Price Breakdown</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-off-white/80">{serviceLabel}, {planLabel}</span>
                  <span className="font-semibold">${unitPrice.toFixed(2)}</span>
                </div>
                {additionalDogs > 0 && (
                  <div className="flex justify-between">
                    <span className="text-off-white/80">
                      Additional dog{additionalDogs > 1 ? "s" : ""} ({additionalDogs} x $10)
                    </span>
                    <span className="font-semibold">${additionalDogFee.toFixed(2)}</span>
                  </div>
                )}
                <hr className="border-off-white/20" />
                <div className="flex justify-between">
                  <span className="text-off-white/80">Subtotal</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-off-white/80">
                    Sales Tax ({(taxRate * 100).toFixed(2)}%, {data.city}, {data.state} {data.zip})
                  </span>
                  <span className="font-semibold">${taxAmount.toFixed(2)}</span>
                </div>
                <hr className="border-off-white/20" />
                <div className="flex justify-between text-lg">
                  <span className="font-bold">Total</span>
                  <span className="font-bold">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {error && (
              <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{error}</p>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="btn-hover flex-1 bg-off-white text-dark-olive py-3 rounded-full font-semibold flex items-center justify-center gap-2 border border-border-gray/30 cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                Edit Details
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={loading}
                className="btn-hover flex-1 bg-forest-green text-off-white py-3 rounded-full font-semibold flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                <CreditCard className="h-4 w-4" />
                {loading ? "Redirecting to payment..." : "Proceed to Payment"}
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
