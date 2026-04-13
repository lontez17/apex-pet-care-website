export const PRICING = {
  dog_walking: {
    label: "Dog Walking",
    description: "Daily walks tailored to your dog's energy level",
    additional_dog: 10, // per walk, per additional dog
    individual: {
      "30_min": { duration: "30-Minute Walk", price: 35 },
      "60_min": { duration: "60-Minute Walk", price: 55 },
    },
    packages: {
      "30_min_5": { duration: "30-Minute", walks: 5, price: 150, fullPrice: 175, savings: 25 },
      "30_min_20": { duration: "30-Minute", walks: 20, price: 600, fullPrice: 700, savings: 100 },
      "60_min_5": { duration: "60-Minute", walks: 5, price: 250, fullPrice: 275, savings: 25 },
      "60_min_20": { duration: "60-Minute", walks: 20, price: 1000, fullPrice: 1100, savings: 100 },
    },
  },

  // Pet Sitting (in-home visits)
  pet_sitting: {
    label: "Pet Sitting",
    description: "In-home visits to care for your pets while you're away",
    rates: {
      per_visit: 35,
      per_day: 75,
      overnight: 95,
    },
    packages: {
      "5_days": { days: 5, price: 340, savings: 35 },
      "10_days": { days: 10, price: 650, savings: 100 },
    },
  },

  // Drop-In Visits
  drop_in: {
    label: "Drop-In Visit",
    description: "Quick check-ins for feeding, potty breaks, and love",
    rates: {
      per_visit: 20,
    },
  },

  // Registration fee (one-time, charged with first booking)
  registration_fee: 25,

  // Monthly subscription estimates (for recurring clients)
  monthly: {
    dog_walking_3x: 300,
    dog_walking_5x: 475,
    pet_sitting_daily: 600,
  },
} as const;

export type ServiceType = keyof typeof PRICING.monthly;

export function calculateMonthlyRate(
  careType: "dog_walking" | "pet_sitting" | "drop_in",
  daysPerWeek: number
): number {
  switch (careType) {
    case "dog_walking":
      return PRICING.dog_walking.individual["30_min"].price * daysPerWeek * 4;
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
