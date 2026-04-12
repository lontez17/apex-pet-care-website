"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { petInfoSchema, type PetInfoData } from "@/lib/schemas";
import { useQuoteStore } from "@/lib/quote-store";

export function StepPetInfo() {
  const { setPetInfo, petInfo } = useQuoteStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PetInfoData>({
    resolver: zodResolver(petInfoSchema),
    defaultValues: petInfo ?? undefined,
  });

  return (
    <form onSubmit={handleSubmit(setPetInfo)} className="space-y-4">
      <h3 className="font-heading text-xl font-bold text-dark-olive">
        Step 1: Tell Us About Your Pet
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="petName" className="block text-sm font-medium text-dark-olive mb-1">
            Pet&apos;s Name *
          </label>
          <input
            id="petName"
            {...register("petName")}
            className="w-full px-4 py-2.5 rounded-lg border border-border-gray bg-warm-cream/50 text-dark-olive text-sm focus:outline-none focus:ring-2 focus:ring-sage-green"
          />
          {errors.petName && (
            <p className="text-red-600 text-xs mt-1">{errors.petName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="petType" className="block text-sm font-medium text-dark-olive mb-1">
            Pet Type *
          </label>
          <select
            id="petType"
            {...register("petType")}
            className="w-full px-4 py-2.5 rounded-lg border border-border-gray bg-warm-cream/50 text-dark-olive text-sm focus:outline-none focus:ring-2 focus:ring-sage-green"
          >
            <option value="dog">Dog</option>
            <option value="cat">Cat</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="petBreed" className="block text-sm font-medium text-dark-olive mb-1">
            Breed <span className="text-muted-olive">(optional)</span>
          </label>
          <input
            id="petBreed"
            {...register("petBreed")}
            className="w-full px-4 py-2.5 rounded-lg border border-border-gray bg-warm-cream/50 text-dark-olive text-sm focus:outline-none focus:ring-2 focus:ring-sage-green"
          />
        </div>

        <div>
          <label htmlFor="petDob" className="block text-sm font-medium text-dark-olive mb-1">
            Date of Birth *
          </label>
          <input
            id="petDob"
            type="date"
            {...register("petDob")}
            className="w-full px-4 py-2.5 rounded-lg border border-border-gray bg-warm-cream/50 text-dark-olive text-sm focus:outline-none focus:ring-2 focus:ring-sage-green"
          />
          {errors.petDob && (
            <p className="text-red-600 text-xs mt-1">{errors.petDob.message}</p>
          )}
        </div>
      </div>

      <hr className="border-border-gray/50" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label htmlFor="ownerName" className="block text-sm font-medium text-dark-olive mb-1">
            Your Name *
          </label>
          <input
            id="ownerName"
            {...register("ownerName")}
            className="w-full px-4 py-2.5 rounded-lg border border-border-gray bg-warm-cream/50 text-dark-olive text-sm focus:outline-none focus:ring-2 focus:ring-sage-green"
          />
          {errors.ownerName && (
            <p className="text-red-600 text-xs mt-1">{errors.ownerName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-dark-olive mb-1">
            Email *
          </label>
          <input
            id="email"
            type="email"
            {...register("email")}
            className="w-full px-4 py-2.5 rounded-lg border border-border-gray bg-warm-cream/50 text-dark-olive text-sm focus:outline-none focus:ring-2 focus:ring-sage-green"
          />
          {errors.email && (
            <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-dark-olive mb-1">
            Phone *
          </label>
          <input
            id="phone"
            type="tel"
            {...register("phone")}
            className="w-full px-4 py-2.5 rounded-lg border border-border-gray bg-warm-cream/50 text-dark-olive text-sm focus:outline-none focus:ring-2 focus:ring-sage-green"
          />
          {errors.phone && (
            <p className="text-red-600 text-xs mt-1">{errors.phone.message}</p>
          )}
        </div>
      </div>

      <button
        type="submit"
        className="btn-hover w-full bg-forest-green text-off-white py-3 rounded-full font-semibold"
      >
        Continue to Service Selection
      </button>
    </form>
  );
}
