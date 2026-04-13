import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { QuoteCalculator } from "@/components/quote/quote-calculator";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Get a Quote | Apex Pet Care",
  description: "Get an instant quote for pet sitting and dog walking services.",
};

export default function GetQuotePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 py-12 md:py-20 px-4">
        <div className="text-center mb-10">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-dark-olive">
            Get Your Free Quote
          </h1>
          <p className="mt-3 text-muted-olive max-w-lg mx-auto">
            Tell us about your pet and choose a service. We&apos;ll show you
            transparent pricing, no surprises.
          </p>
        </div>
        <QuoteCalculator />
      </main>
      <Footer />
    </>
  );
}
