import Link from "next/link";
import { PawPrint } from "lucide-react";

export function CtaBanner() {
  return (
    <section className="bg-forest-green py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-off-white mb-3">
          Ready to Give Your Pet the Best?
        </h2>
        <p className="text-off-white/80 mb-8 max-w-xl mx-auto">
          Schedule a free meet & greet and see why pet parents love Apex Pet
          Care.
        </p>
        <Link
          href="/get-quote"
          className="btn-hover inline-flex items-center gap-2 bg-off-white text-forest-green px-8 py-3.5 rounded-full text-base font-semibold"
        >
          <PawPrint className="h-5 w-5" />
          Get Started
        </Link>
      </div>
    </section>
  );
}
