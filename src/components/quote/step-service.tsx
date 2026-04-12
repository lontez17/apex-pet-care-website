"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { serviceSelectionSchema, type ServiceSelectionData } from "@/lib/schemas";
import { useQuoteStore } from "@/lib/quote-store";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const CARE_OPTIONS = [
  {
    value: "dog_walking" as const,
    label: "Dog Walking",
    description: "Daily walks tailored to your pup",
  },
  {
    value: "pet_sitting" as const,
    label: "Pet Sitting",
    description: "In-home visits while you're away",
  },
  {
    value: "drop_in" as const,
    label: "Drop-In Visit",
    description: "Quick check-ins and potty breaks",
  },
];

export function StepService() {
  const { setServiceSelection, serviceSelection, setStep } = useQuoteStore();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ServiceSelectionData>({
    resolver: zodResolver(serviceSelectionSchema),
    defaultValues: serviceSelection ?? { careType: "dog_walking", daysPerWeek: 3 },
  });

  const careType = watch("careType");

  return (
    <form onSubmit={handleSubmit(setServiceSelection)} className="space-y-5">
      <h3 className="font-heading text-xl font-bold text-dark-olive">
        Step 2: Choose Your Service
      </h3>

      {/* Care Type */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-dark-olive">
          Service Type *
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {CARE_OPTIONS.map((option) => (
            <label
              key={option.value}
              className="cursor-pointer card bg-off-white p-4 flex flex-col items-center text-center has-[:checked]:ring-2 has-[:checked]:ring-forest-green"
            >
              <input
                type="radio"
                value={option.value}
                {...register("careType")}
                className="sr-only"
              />
              <p className="font-heading font-bold text-dark-olive text-sm">
                {option.label}
              </p>
              <p className="text-xs text-muted-olive mt-1">
                {option.description}
              </p>
            </label>
          ))}
        </div>
        {errors.careType && (
          <p className="text-red-600 text-xs">{errors.careType.message}</p>
        )}
      </div>

      {/* Days per week */}
      {careType !== "drop_in" && (
        <div>
          <label htmlFor="daysPerWeek" className="block text-sm font-medium text-dark-olive mb-1">
            Days per Week *
          </label>
          <select
            id="daysPerWeek"
            {...register("daysPerWeek", { valueAsNumber: true })}
            className="w-full px-4 py-2.5 rounded-lg border border-border-gray bg-warm-cream/50 text-dark-olive text-sm focus:outline-none focus:ring-2 focus:ring-sage-green"
          >
            {[1, 2, 3, 4, 5, 6, 7].map((n) => (
              <option key={n} value={n}>
                {n} day{n > 1 ? "s" : ""} per week
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Selected Days */}
      {careType !== "drop_in" && (
        <div>
          <label className="block text-sm font-medium text-dark-olive mb-2">
            Preferred Days
          </label>
          <div className="flex flex-wrap gap-2">
            {DAYS.map((day) => (
              <label
                key={day}
                className="cursor-pointer text-xs font-medium px-3 py-1.5 rounded-full border border-border-gray bg-off-white has-[:checked]:bg-forest-green has-[:checked]:text-off-white has-[:checked]:border-forest-green transition-colors"
              >
                <input
                  type="checkbox"
                  value={day}
                  {...register("selectedDays")}
                  className="sr-only"
                />
                {day.slice(0, 3)}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Start Date */}
      <div>
        <label htmlFor="startDate" className="block text-sm font-medium text-dark-olive mb-1">
          Desired Start Date *
        </label>
        <input
          id="startDate"
          type="date"
          {...register("startDate")}
          className="w-full px-4 py-2.5 rounded-lg border border-border-gray bg-warm-cream/50 text-dark-olive text-sm focus:outline-none focus:ring-2 focus:ring-sage-green"
        />
        {errors.startDate && (
          <p className="text-red-600 text-xs mt-1">{errors.startDate.message}</p>
        )}
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-dark-olive mb-1">
          Special Needs or Notes <span className="text-muted-olive">(optional)</span>
        </label>
        <textarea
          id="notes"
          rows={3}
          {...register("notes")}
          className="w-full px-4 py-2.5 rounded-lg border border-border-gray bg-warm-cream/50 text-dark-olive text-sm focus:outline-none focus:ring-2 focus:ring-sage-green resize-none"
          placeholder="Allergies, medications, temperament notes..."
        />
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setStep(1)}
          className="btn-hover flex-1 bg-border-gray/30 text-dark-olive py-3 rounded-full font-semibold"
        >
          Back
        </button>
        <button
          type="submit"
          className="btn-hover flex-1 bg-forest-green text-off-white py-3 rounded-full font-semibold"
        >
          See My Quote
        </button>
      </div>
    </form>
  );
}
