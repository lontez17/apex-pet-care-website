"use client";

import { useQuoteStore } from "@/lib/quote-store";
import { StepPetInfo } from "./step-pet-info";
import { StepService } from "./step-service";
import { StepSummary } from "./step-summary";
import { PawPrint } from "lucide-react";

const STEPS = [
  { num: 1, label: "Pet Info" },
  { num: 2, label: "Service" },
  { num: 3, label: "Quote" },
];

export function QuoteCalculator() {
  const { step } = useQuoteStore();

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress bar */}
      <div className="flex items-center justify-between mb-8">
        {STEPS.map((s, i) => (
          <div key={s.num} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  step >= s.num
                    ? "bg-forest-green text-off-white"
                    : "bg-border-gray/30 text-muted-olive"
                }`}
              >
                {step > s.num ? (
                  <PawPrint className="h-5 w-5" />
                ) : (
                  s.num
                )}
              </div>
              <span className="text-xs text-muted-olive mt-1">{s.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`h-0.5 flex-1 mx-2 -mt-5 transition-colors ${
                  step > s.num ? "bg-forest-green" : "bg-border-gray/30"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="card bg-off-white p-6 md:p-8">
        {step === 1 && <StepPetInfo />}
        {step === 2 && <StepService />}
        {step === 3 && <StepSummary />}
      </div>
    </div>
  );
}
