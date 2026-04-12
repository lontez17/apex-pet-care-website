"use client";

import { useState } from "react";
import { useQuoteStore } from "@/lib/quote-store";
import { calculateMonthlyRate, calculateTotal, PRICING } from "@/lib/pricing";
import { differenceInYears, differenceInMonths, parseISO } from "date-fns";

const CARE_LABELS: Record<string, string> = {
  dog_walking: "Dog Walking",
  pet_sitting: "Pet Sitting",
  drop_in: "Drop-In Visit",
};

export function StepSummary() {
  const { petInfo, serviceSelection, setStep } = useQuoteStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!petInfo || !serviceSelection) return null;

  const petAge = (() => {
    try {
      const dob = parseISO(petInfo.petDob);
      const years = differenceInYears(new Date(), dob);
      const months = differenceInMonths(new Date(), dob) % 12;
      if (years > 0) return `${years} year${years > 1 ? "s" : ""}${months > 0 ? `, ${months} mo` : ""}`;
      return `${months} month${months !== 1 ? "s" : ""}`;
    } catch {
      return "Unknown";
    }
  })();

  const daysPerWeek = serviceSelection.careType === "drop_in" ? 1 : (serviceSelection.daysPerWeek ?? 3);
  const monthlyRate = calculateMonthlyRate(serviceSelection.careType, daysPerWeek);
  const totals = calculateTotal(monthlyRate, true);

  async function handleBooking() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          petInfo,
          serviceSelection: { ...serviceSelection, daysPerWeek },
          monthlyRate,
          registrationFee: PRICING.registration_fee,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      <h3 className="font-heading text-xl font-bold text-dark-olive">
        Step 3: Your Quote Summary
      </h3>

      {/* Pet & Owner Info */}
      <div className="card bg-off-white p-5 space-y-2">
        <h4 className="font-heading font-bold text-dark-olive text-sm">Pet Details</h4>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
          <span className="text-muted-olive">Pet Name:</span>
          <span className="text-dark-olive font-medium">{petInfo.petName}</span>
          <span className="text-muted-olive">Type:</span>
          <span className="text-dark-olive font-medium capitalize">{petInfo.petType}</span>
          {petInfo.petBreed && (
            <>
              <span className="text-muted-olive">Breed:</span>
              <span className="text-dark-olive font-medium">{petInfo.petBreed}</span>
            </>
          )}
          <span className="text-muted-olive">Age:</span>
          <span className="text-dark-olive font-medium">{petAge}</span>
          <span className="text-muted-olive">Owner:</span>
          <span className="text-dark-olive font-medium">{petInfo.ownerName}</span>
          <span className="text-muted-olive">Email:</span>
          <span className="text-dark-olive font-medium">{petInfo.email}</span>
        </div>
      </div>

      {/* Service Selection */}
      <div className="card bg-off-white p-5 space-y-2">
        <h4 className="font-heading font-bold text-dark-olive text-sm">Service Details</h4>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
          <span className="text-muted-olive">Service:</span>
          <span className="text-dark-olive font-medium">
            {CARE_LABELS[serviceSelection.careType]}
          </span>
          {serviceSelection.careType !== "drop_in" && (
            <>
              <span className="text-muted-olive">Frequency:</span>
              <span className="text-dark-olive font-medium">{daysPerWeek}x per week</span>
            </>
          )}
          {serviceSelection.selectedDays && serviceSelection.selectedDays.length > 0 && (
            <>
              <span className="text-muted-olive">Days:</span>
              <span className="text-dark-olive font-medium">
                {serviceSelection.selectedDays.map((d) => d.slice(0, 3)).join(", ")}
              </span>
            </>
          )}
          <span className="text-muted-olive">Start Date:</span>
          <span className="text-dark-olive font-medium">{serviceSelection.startDate}</span>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="card bg-forest-green text-off-white p-5 space-y-3">
        <h4 className="font-heading font-bold text-sm">Price Breakdown</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-off-white/80">Monthly Rate</span>
            <span className="font-semibold">${totals.firstMonth.toFixed(2)}/mo</span>
          </div>
          <div className="flex justify-between">
            <span className="text-off-white/80">Registration Fee (one-time)</span>
            <span className="font-semibold">${totals.registrationFee.toFixed(2)}</span>
          </div>
          <hr className="border-off-white/20" />
          <div className="flex justify-between text-base">
            <span className="font-bold">Due Today</span>
            <span className="font-bold">${totals.totalDueToday.toFixed(2)}</span>
          </div>
          <p className="text-xs text-off-white/60">
            Then ${totals.monthlyOngoing.toFixed(2)}/month going forward
          </p>
        </div>
      </div>

      {error && (
        <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{error}</p>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setStep(2)}
          className="btn-hover flex-1 bg-border-gray/30 text-dark-olive py-3 rounded-full font-semibold"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleBooking}
          disabled={loading}
          className="btn-hover flex-1 bg-forest-green text-off-white py-3 rounded-full font-semibold disabled:opacity-50"
        >
          {loading ? "Processing..." : "Reserve My Spot"}
        </button>
      </div>
    </div>
  );
}
