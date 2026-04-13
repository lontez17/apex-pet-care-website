import type { Database } from "@/lib/supabase/types";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Pet = Database["public"]["Tables"]["pets"]["Row"];
export type PetInsert = Database["public"]["Tables"]["pets"]["Insert"];
export type PetUpdate = Database["public"]["Tables"]["pets"]["Update"];
export type Booking = Database["public"]["Tables"]["bookings"]["Row"];
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

export const CARE_TYPE_LABELS: Record<string, string> = {
  dog_walking: "Dog Walking",
  pet_sitting: "Pet Sitting",
  drop_in: "Drop-In Visit",
};

export const STATUS_COLORS: Record<string, string> = {
  pending: "bg-gold/30 text-dark-olive",
  active: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  payment_failed: "bg-red-100 text-red-700",
};

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatCurrency(cents: number): string {
  return `$${cents.toLocaleString()}`;
}
