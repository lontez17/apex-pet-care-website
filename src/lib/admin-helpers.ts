import type { Database } from "@/lib/supabase/types";

export type ServicePack = Database["public"]["Tables"]["service_packs"]["Row"];
export type ServicePackInsert = Database["public"]["Tables"]["service_packs"]["Insert"];
export type ServiceLog = Database["public"]["Tables"]["service_logs"]["Row"];
export type ServiceLogInsert = Database["public"]["Tables"]["service_logs"]["Insert"];
export type AdminUser = Database["public"]["Tables"]["admin_users"]["Row"];
export type Booking = Database["public"]["Tables"]["bookings"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Pet = Database["public"]["Tables"]["pets"]["Row"];

export const SERVICE_LABELS: Record<string, string> = {
  dog_walking: "Dog Walking",
  pet_sitting: "Pet Sitting",
  drop_in: "Drop-In Visit",
  boarding: "Boarding",
  daycare: "Daycare",
  house_sitting: "House Sitting",
  transportation: "Transportation",
};

export const BOOKING_STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  active: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  payment_failed: "bg-red-100 text-red-700",
};

export const PACK_STATUS_COLORS: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  exhausted: "bg-gray-100 text-gray-500",
  expired: "bg-amber-100 text-amber-700",
  refunded: "bg-red-100 text-red-700",
};

export const LOG_STATUS_COLORS: Record<string, string> = {
  scheduled: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-gray-100 text-gray-500",
  no_show: "bg-red-100 text-red-700",
};

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatCurrency(amount: number): string {
  return `$${Number(amount).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

export function packUrgencyColor(remaining: number): string {
  if (remaining <= 0) return "text-gray-400";
  if (remaining <= 2) return "text-red-600";
  if (remaining <= 5) return "text-amber-600";
  return "text-green-600";
}

export function packUrgencyBg(remaining: number): string {
  if (remaining <= 0) return "bg-gray-100";
  if (remaining <= 2) return "bg-red-50";
  if (remaining <= 5) return "bg-amber-50";
  return "bg-green-50";
}

// Detect if a checkout is a pack purchase and extract pack config
interface PackConfig {
  service_type: string;
  pack_type: string;
  pack_label: string;
  total_sessions: number;
  unit_duration_minutes: number | null;
}

export function detectPack(service: string, plan: string): PackConfig | null {
  const s = service.toLowerCase().replace(/-/g, "_");
  const p = plan.toLowerCase();

  // Dog walking packs
  if (s === "dog_walking" || s === "dog-walking") {
    if (p.includes("20-walk") && p.includes("60"))
      return { service_type: "dog_walking", pack_type: "60_min_20", pack_label: "20-Walk Pack (60 min)", total_sessions: 20, unit_duration_minutes: 60 };
    if (p.includes("20-walk") && p.includes("30"))
      return { service_type: "dog_walking", pack_type: "30_min_20", pack_label: "20-Walk Pack (30 min)", total_sessions: 20, unit_duration_minutes: 30 };
    if (p.includes("5-walk") && p.includes("60"))
      return { service_type: "dog_walking", pack_type: "60_min_5", pack_label: "5-Walk Pack (60 min)", total_sessions: 5, unit_duration_minutes: 60 };
    if (p.includes("5-walk") && p.includes("30"))
      return { service_type: "dog_walking", pack_type: "30_min_5", pack_label: "5-Walk Pack (30 min)", total_sessions: 5, unit_duration_minutes: 30 };
  }

  // Daycare pack
  if (s === "daycare") {
    if (p.includes("10"))
      return { service_type: "daycare", pack_type: "daycare_10", pack_label: "10-Day Daycare Package", total_sessions: 10, unit_duration_minutes: null };
  }

  // Pet sitting packs
  if (s === "pet_sitting" || s === "pet-sitting") {
    if (p.includes("10"))
      return { service_type: "pet_sitting", pack_type: "pet_sitting_10", pack_label: "10-Day Pet Sitting Package", total_sessions: 10, unit_duration_minutes: null };
    if (p.includes("5"))
      return { service_type: "pet_sitting", pack_type: "pet_sitting_5", pack_label: "5-Day Pet Sitting Package", total_sessions: 5, unit_duration_minutes: null };
  }

  return null;
}
