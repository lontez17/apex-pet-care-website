"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useBookingStore } from "@/lib/booking-store";
import { PawPrint, Plus, Trash2, User, Dog, MapPin, ShieldAlert, ArrowRight } from "lucide-react";

const petSchema = z.object({
  petName: z.string().min(1, "Pet name is required"),
  petType: z.enum(["dog", "cat", "other"]),
  breed: z.string().min(1, "Breed is required"),
  age: z.string().min(1, "Age is required"),
  weight: z.string().optional(),
  aggressionLevel: z.enum(["none", "mild", "aggressive"]),
  spayedNeutered: z.enum(["yes", "no"]),
  vaccinationsUpToDate: z.enum(["yes", "no"]),
  specialNotes: z.string().optional(),
});

const bookingSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip: z.string().min(5, "Valid zip code is required"),
  emergencyContactName: z.string().min(1, "Emergency contact name is required"),
  emergencyContactPhone: z.string().min(10, "Valid phone number is required"),
  emergencyContactRelation: z.string().min(1, "Relationship is required"),
  vetName: z.string().optional(),
  vetPhone: z.string().optional(),
  pets: z.array(petSchema).min(1, "At least one pet is required"),
});

type FormData = z.infer<typeof bookingSchema>;

const inputClass =
  "w-full px-4 py-2.5 rounded-lg border border-border-gray bg-warm-cream/50 text-dark-olive text-sm focus:outline-none focus:ring-2 focus:ring-forest-green/40";
const labelClass = "block text-sm font-medium text-dark-olive mb-1";
const errorClass = "text-red-600 text-xs mt-1";

function BookingFormInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const service = searchParams.get("service") || "dog-walking";
  const plan = searchParams.get("plan") || "";
  const setData = useBookingStore((s) => s.setData);

  const serviceLabels: Record<string, string> = {
    "dog-walking": "Dog Walking",
    "drop-in-visits": "Drop-In Visits",
    boarding: "Boarding",
    daycare: "Daycare",
    "house-sitting": "House Sitting",
    transportation: "Transportation",
  };

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "CA",
      zip: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      emergencyContactRelation: "",
      vetName: "",
      vetPhone: "",
      pets: [
        {
          petName: "",
          petType: "dog",
          breed: "",
          age: "",
          weight: "",
          aggressionLevel: "none",
          spayedNeutered: "yes",
          vaccinationsUpToDate: "yes",
          specialNotes: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "pets",
  });

  function onSubmit(data: FormData) {
    setData({ ...data, service, plan });
    router.push("/book/summary");
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 md:py-16">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-forest-green/10 text-forest-green text-sm font-medium px-4 py-1.5 rounded-full mb-4">
          <PawPrint className="h-4 w-4" />
          {serviceLabels[service] || "Pet Care"}
          {plan && <span className="text-muted-olive">— {plan}</span>}
        </div>
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-dark-olive mb-2">
          Book Your Service
        </h1>
        <p className="text-muted-olive">
          Fill out the details below, then review your total on the next step.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* ── Section 1: Your Info ── */}
        <div className="card bg-off-white p-6 md:p-8">
          <div className="flex items-center gap-2 mb-5">
            <User className="h-5 w-5 text-forest-green" />
            <h2 className="font-heading text-lg font-bold text-dark-olive">Your Information</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className={labelClass}>First Name *</label>
              <input id="firstName" {...register("firstName")} className={inputClass} />
              {errors.firstName && <p className={errorClass}>{errors.firstName.message}</p>}
            </div>
            <div>
              <label htmlFor="lastName" className={labelClass}>Last Name *</label>
              <input id="lastName" {...register("lastName")} className={inputClass} />
              {errors.lastName && <p className={errorClass}>{errors.lastName.message}</p>}
            </div>
            <div>
              <label htmlFor="email" className={labelClass}>Email *</label>
              <input id="email" type="email" {...register("email")} className={inputClass} />
              {errors.email && <p className={errorClass}>{errors.email.message}</p>}
            </div>
            <div>
              <label htmlFor="phone" className={labelClass}>Phone *</label>
              <input id="phone" type="tel" {...register("phone")} placeholder="(555) 123-4567" className={inputClass} />
              {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
            </div>
          </div>
        </div>

        {/* ── Section 2: Address ── */}
        <div className="card bg-off-white p-6 md:p-8">
          <div className="flex items-center gap-2 mb-5">
            <MapPin className="h-5 w-5 text-forest-green" />
            <h2 className="font-heading text-lg font-bold text-dark-olive">Service Address</h2>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label htmlFor="address" className={labelClass}>Street Address *</label>
              <input id="address" {...register("address")} placeholder="123 Main St, Apt 4" className={inputClass} />
              {errors.address && <p className={errorClass}>{errors.address.message}</p>}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="col-span-2 sm:col-span-2">
                <label htmlFor="city" className={labelClass}>City *</label>
                <input id="city" {...register("city")} className={inputClass} />
                {errors.city && <p className={errorClass}>{errors.city.message}</p>}
              </div>
              <div>
                <label htmlFor="state" className={labelClass}>State *</label>
                <input id="state" {...register("state")} className={inputClass} />
                {errors.state && <p className={errorClass}>{errors.state.message}</p>}
              </div>
              <div>
                <label htmlFor="zip" className={labelClass}>Zip Code *</label>
                <input id="zip" {...register("zip")} placeholder="92612" className={inputClass} />
                {errors.zip && <p className={errorClass}>{errors.zip.message}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* ── Section 3: Emergency Contact ── */}
        <div className="card bg-off-white p-6 md:p-8">
          <div className="flex items-center gap-2 mb-5">
            <ShieldAlert className="h-5 w-5 text-forest-green" />
            <h2 className="font-heading text-lg font-bold text-dark-olive">Emergency Contact</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="emergencyContactName" className={labelClass}>Contact Name *</label>
              <input id="emergencyContactName" {...register("emergencyContactName")} className={inputClass} />
              {errors.emergencyContactName && <p className={errorClass}>{errors.emergencyContactName.message}</p>}
            </div>
            <div>
              <label htmlFor="emergencyContactPhone" className={labelClass}>Contact Phone *</label>
              <input id="emergencyContactPhone" type="tel" {...register("emergencyContactPhone")} placeholder="(555) 123-4567" className={inputClass} />
              {errors.emergencyContactPhone && <p className={errorClass}>{errors.emergencyContactPhone.message}</p>}
            </div>
            <div>
              <label htmlFor="emergencyContactRelation" className={labelClass}>Relationship *</label>
              <input id="emergencyContactRelation" {...register("emergencyContactRelation")} placeholder="e.g. Spouse, Parent, Friend" className={inputClass} />
              {errors.emergencyContactRelation && <p className={errorClass}>{errors.emergencyContactRelation.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label htmlFor="vetName" className={labelClass}>Veterinarian Name <span className="text-muted-olive font-normal">optional</span></label>
              <input id="vetName" {...register("vetName")} placeholder="e.g. Dr. Smith at OC Animal Hospital" className={inputClass} />
            </div>
            <div>
              <label htmlFor="vetPhone" className={labelClass}>Vet Phone <span className="text-muted-olive font-normal">optional</span></label>
              <input id="vetPhone" type="tel" {...register("vetPhone")} placeholder="(555) 123-4567" className={inputClass} />
            </div>
          </div>
        </div>

        {/* ── Section 4: Pets ── */}
        {fields.map((field, index) => (
          <div key={field.id} className="card bg-off-white p-6 md:p-8">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Dog className="h-5 w-5 text-forest-green" />
                <h2 className="font-heading text-lg font-bold text-dark-olive">
                  Pet {fields.length > 1 ? `#${index + 1}` : "Information"}
                </h2>
              </div>
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-red-400 hover:text-red-600 transition-colors cursor-pointer"
                  aria-label="Remove pet"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Pet Name *</label>
                <input {...register(`pets.${index}.petName`)} className={inputClass} />
                {errors.pets?.[index]?.petName && <p className={errorClass}>{errors.pets[index].petName?.message}</p>}
              </div>
              <div>
                <label className={labelClass}>Type of Pet *</label>
                <select {...register(`pets.${index}.petType`)} className={inputClass}>
                  <option value="dog">Dog</option>
                  <option value="cat">Cat</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Breed *</label>
                <input {...register(`pets.${index}.breed`)} placeholder="e.g. Golden Retriever" className={inputClass} />
                {errors.pets?.[index]?.breed && <p className={errorClass}>{errors.pets[index].breed?.message}</p>}
              </div>
              <div>
                <label className={labelClass}>Age *</label>
                <input {...register(`pets.${index}.age`)} placeholder="e.g. 3 years" className={inputClass} />
                {errors.pets?.[index]?.age && <p className={errorClass}>{errors.pets[index].age?.message}</p>}
              </div>
              <div>
                <label className={labelClass}>Weight (lbs) <span className="text-muted-olive font-normal">optional</span></label>
                <input {...register(`pets.${index}.weight`)} placeholder="e.g. 45" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Aggression Level *</label>
                <select {...register(`pets.${index}.aggressionLevel`)} className={inputClass}>
                  <option value="none">None</option>
                  <option value="mild">Mild</option>
                  <option value="aggressive">Aggressive</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Spayed / Neutered *</label>
                <select {...register(`pets.${index}.spayedNeutered`)} className={inputClass}>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Vaccinations Up to Date *</label>
                <select {...register(`pets.${index}.vaccinationsUpToDate`)} className={inputClass}>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Special Notes <span className="text-muted-olive font-normal">optional</span></label>
                <textarea
                  {...register(`pets.${index}.specialNotes`)}
                  rows={2}
                  placeholder="Allergies, medications, behavioral notes..."
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() =>
            append({
              petName: "",
              petType: "dog",
              breed: "",
              age: "",
              weight: "",
              aggressionLevel: "none",
              spayedNeutered: "yes",
              vaccinationsUpToDate: "yes",
              specialNotes: "",
            })
          }
          className="w-full btn-hover flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-dashed border-sage-green/50 text-sm font-semibold text-forest-green hover:bg-sage-green/10 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Add Another Pet (+$10/walk per additional dog)
        </button>

        <button
          type="submit"
          className="btn-hover w-full bg-forest-green text-off-white py-3.5 rounded-full font-semibold flex items-center justify-center gap-2 cursor-pointer"
        >
          Schedule Booking
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}

export default function BookPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={
          <div className="flex items-center justify-center py-20">
            <PawPrint className="h-8 w-8 text-sage-green animate-pulse" />
          </div>
        }>
          <BookingFormInner />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
