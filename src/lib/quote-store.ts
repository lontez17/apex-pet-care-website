import { create } from "zustand";
import type { PetInfoData, ServiceSelectionData } from "./schemas";

interface QuoteState {
  step: number;
  petInfo: PetInfoData | null;
  serviceSelection: ServiceSelectionData | null;
  setStep: (step: number) => void;
  setPetInfo: (data: PetInfoData) => void;
  setServiceSelection: (data: ServiceSelectionData) => void;
  reset: () => void;
}

export const useQuoteStore = create<QuoteState>((set) => ({
  step: 1,
  petInfo: null,
  serviceSelection: null,
  setStep: (step) => set({ step }),
  setPetInfo: (data) => set({ petInfo: data, step: 2 }),
  setServiceSelection: (data) => set({ serviceSelection: data, step: 3 }),
  reset: () => set({ step: 1, petInfo: null, serviceSelection: null }),
}));
