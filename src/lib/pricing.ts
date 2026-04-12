// TODO: Replace placeholder pricing with actual rates from business owner

export const PRICING = {
  // Dog Walking
  dog_walking: {
    label: "Dog Walking",
    description: "Daily walks tailored to your dog's energy level",
    rates: {
      per_walk_30: 25,   // TODO: 30-minute walk rate
      per_walk_60: 40,   // TODO: 60-minute walk rate
    },
    packages: {
      "5_walks": { walks: 5, price: 110, savings: 15 },   // TODO
      "10_walks": { walks: 10, price: 210, savings: 40 },  // TODO
      "20_walks": { walks: 20, price: 400, savings: 100 }, // TODO
    },
  },

  // Pet Sitting (in-home visits)
  pet_sitting: {
    label: "Pet Sitting",
    description: "In-home visits to care for your pets while you're away",
    rates: {
      per_visit: 35,     // TODO: Per visit rate (30-min visit)
      per_day: 75,       // TODO: Full day rate
      overnight: 95,     // TODO: Overnight rate
    },
    packages: {
      "5_days": { days: 5, price: 340, savings: 35 },    // TODO
      "10_days": { days: 10, price: 650, savings: 100 },  // TODO
    },
  },

  // Drop-In Visits
  drop_in: {
    label: "Drop-In Visit",
    description: "Quick check-ins for feeding, potty breaks, and love",
    rates: {
      per_visit: 20,  // TODO: 15-20 minute drop-in rate
    },
  },

  // Registration fee (one-time, charged with first booking)
  registration_fee: 25, // TODO: One-time registration/meet-and-greet fee

  // Monthly subscription estimates (for recurring clients)
  monthly: {
    dog_walking_3x: 300,  // TODO: 3x/week dog walking monthly
    dog_walking_5x: 475,  // TODO: 5x/week dog walking monthly
    pet_sitting_daily: 600, // TODO: Daily pet sitting monthly
  },
} as const;

export type ServiceType = keyof typeof PRICING.monthly;

export function calculateMonthlyRate(
  careType: "dog_walking" | "pet_sitting" | "drop_in",
  daysPerWeek: number
): number {
  switch (careType) {
    case "dog_walking":
      return PRICING.dog_walking.rates.per_walk_30 * daysPerWeek * 4;
    case "pet_sitting":
      return PRICING.pet_sitting.rates.per_visit * daysPerWeek * 4;
    case "drop_in":
      return PRICING.drop_in.rates.per_visit * daysPerWeek * 4;
    default:
      return 0;
  }
}

export function calculateTotal(monthlyRate: number, includeRegistration: boolean): {
  registrationFee: number;
  firstMonth: number;
  totalDueToday: number;
  monthlyOngoing: number;
} {
  const registrationFee = includeRegistration ? PRICING.registration_fee : 0;
  return {
    registrationFee,
    firstMonth: monthlyRate,
    totalDueToday: monthlyRate + registrationFee,
    monthlyOngoing: monthlyRate,
  };
}
