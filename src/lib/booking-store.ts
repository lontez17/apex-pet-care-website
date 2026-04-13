import { create } from "zustand";

export interface PetData {
  petName: string;
  petType: "dog" | "cat" | "other";
  breed: string;
  age: string;
  weight?: string;
  aggressionLevel: "none" | "mild" | "aggressive";
  spayedNeutered: "yes" | "no";
  vaccinationsUpToDate: "yes" | "no";
  specialNotes?: string;
}

export interface BookingData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
  vetName?: string;
  vetPhone?: string;
  pets: PetData[];
  service: string;
  plan: string;
}

interface BookingStore {
  data: BookingData | null;
  setData: (data: BookingData) => void;
  reset: () => void;
}

export const useBookingStore = create<BookingStore>((set) => ({
  data: null,
  setData: (data) => set({ data }),
  reset: () => set({ data: null }),
}));

// California sales tax rates by zip code prefix (Orange County area)
// Source: California CDTFA — base rate 7.25% + district taxes
const TAX_RATES: Record<string, number> = {
  "926": 0.0775, // most of Orange County
  "927": 0.0775,
  "928": 0.0775,
  "906": 0.095,  // LA area
  "900": 0.095,
  "901": 0.095,
  "917": 0.0875, // Burbank/Glendale
  "921": 0.0775, // Long Beach
  "925": 0.0775, // Anaheim
};
const DEFAULT_TAX_RATE = 0.0775; // OC default

export function getTaxRate(zip: string): number {
  const prefix = zip.slice(0, 3);
  return TAX_RATES[prefix] ?? DEFAULT_TAX_RATE;
}

export function getServicePrice(service: string, plan: string): { label: string; unitPrice: number; quantity: number } {
  const planLower = plan.toLowerCase();

  // Dog walking
  if (service === "dog-walking") {
    if (planLower.includes("20-walk") && planLower.includes("60")) return { label: "20-Walk Pack (60 min)", unitPrice: 1000, quantity: 1 };
    if (planLower.includes("20-walk") && planLower.includes("30")) return { label: "20-Walk Pack (30 min)", unitPrice: 600, quantity: 1 };
    if (planLower.includes("5-walk") && planLower.includes("60")) return { label: "5-Walk Pack (60 min)", unitPrice: 250, quantity: 1 };
    if (planLower.includes("5-walk") && planLower.includes("30")) return { label: "5-Walk Pack (30 min)", unitPrice: 150, quantity: 1 };
    if (planLower.includes("60")) return { label: "60-Minute Walk", unitPrice: 55, quantity: 1 };
    return { label: "30-Minute Walk", unitPrice: 35, quantity: 1 };
  }

  // Boarding
  if (service === "boarding") {
    if (planLower.includes("puppy")) return { label: "Puppy Boarding", unitPrice: 75, quantity: 1 };
    if (planLower.includes("extended")) return { label: "Extended Stay Boarding", unitPrice: 55, quantity: 1 };
    return { label: "Single Night Boarding", unitPrice: 65, quantity: 1 };
  }

  // Daycare
  if (service === "daycare") {
    if (planLower.includes("10")) return { label: "10-Day Daycare Package", unitPrice: 400, quantity: 1 };
    if (planLower.includes("half")) return { label: "Half Day Daycare", unitPrice: 30, quantity: 1 };
    return { label: "Full Day Daycare", unitPrice: 45, quantity: 1 };
  }

  // Drop-in
  if (service === "drop-in-visits") {
    if (planLower.includes("30")) return { label: "30-Minute Visit", unitPrice: 30, quantity: 1 };
    return { label: "15-Minute Visit", unitPrice: 20, quantity: 1 };
  }

  // House sitting
  if (service === "house-sitting") {
    if (planLower.includes("multi")) return { label: "Multi-Pet House Sitting", unitPrice: 95, quantity: 1 };
    if (planLower.includes("extended")) return { label: "Extended House Sitting", unitPrice: 75, quantity: 1 };
    return { label: "Standard House Sitting", unitPrice: 85, quantity: 1 };
  }

  // Transportation
  if (service === "transportation") {
    if (planLower.includes("recurring")) return { label: "Recurring Ride", unitPrice: 20, quantity: 1 };
    if (planLower.includes("round")) return { label: "Round Trip", unitPrice: 40, quantity: 1 };
    return { label: "One-Way Trip", unitPrice: 25, quantity: 1 };
  }

  return { label: plan || "Pet Care Service", unitPrice: 35, quantity: 1 };
}
