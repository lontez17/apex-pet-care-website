"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";

type Tab = "individual" | "bundles";
type Duration = "30" | "60";

interface PriceCardProps {
  title: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  badge?: string;
  bookUrl?: string;
}

function PriceCard({ title, price, period, description, features, highlighted, badge, bookUrl = "/get-quote" }: PriceCardProps) {
  return (
    <div
      className={`card p-6 flex flex-col relative ${
        highlighted
          ? "bg-forest-green text-off-white ring-2 ring-forest-green"
          : "bg-off-white text-dark-olive"
      }`}
    >
      {badge && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
          {badge}
        </span>
      )}
      <h3 className="font-heading text-xl font-bold mb-1">{title}</h3>
      <p className={`text-sm mb-4 ${highlighted ? "text-off-white/70" : "text-muted-olive"}`}>
        {description}
      </p>
      <div className="mb-4">
        <span className="font-heading text-3xl font-bold">{price}</span>
        <span className={`text-sm ${highlighted ? "text-off-white/70" : "text-muted-olive"}`}>
          {period}
        </span>
      </div>
      <ul className="space-y-2 mb-6 flex-1">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm">
            <Check
              className={`h-4 w-4 mt-0.5 shrink-0 ${
                highlighted ? "text-light-sage" : "text-forest-green"
              }`}
            />
            {feature}
          </li>
        ))}
      </ul>
      <Link
        href={bookUrl}
        className={`btn-hover block text-center py-2.5 rounded-full text-sm font-semibold ${
          highlighted
            ? "bg-off-white text-forest-green"
            : "bg-sage-green text-off-white"
        }`}
      >
        Get Started
      </Link>
    </div>
  );
}

function DurationSelector({ duration, setDuration }: { duration: Duration; setDuration: (d: Duration) => void }) {
  return (
    <div className="flex justify-center mb-8">
      <div className="inline-flex bg-off-white rounded-full p-1 border border-border-gray/30">
        <button
          onClick={() => setDuration("30")}
          className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors cursor-pointer ${
            duration === "30"
              ? "bg-dark-olive text-off-white shadow-sm"
              : "text-muted-olive hover:text-dark-olive"
          }`}
        >
          30 Minutes
        </button>
        <button
          onClick={() => setDuration("60")}
          className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors cursor-pointer ${
            duration === "60"
              ? "bg-dark-olive text-off-white shadow-sm"
              : "text-muted-olive hover:text-dark-olive"
          }`}
        >
          60 Minutes
        </button>
      </div>
    </div>
  );
}

export function DogWalkingPricing() {
  const [tab, setTab] = useState<Tab>("bundles");
  const [individualDuration, setIndividualDuration] = useState<Duration>("30");
  const [bundleDuration, setBundleDuration] = useState<Duration>("30");

  return (
    <section id="pricing" className="py-16 md:py-24 bg-gold/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-dark-olive">
            Pricing
          </h2>
          <p className="mt-3 text-muted-olive">
            Transparent rates with no hidden fees.
          </p>
        </div>

        {/* Tab selector */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-off-white rounded-full p-1 border border-border-gray/30">
            <button
              onClick={() => setTab("individual")}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-colors cursor-pointer ${
                tab === "individual"
                  ? "bg-forest-green text-off-white shadow-sm"
                  : "text-muted-olive hover:text-dark-olive"
              }`}
            >
              Individual Walk
            </button>
            <button
              onClick={() => setTab("bundles")}
              className={`relative px-6 py-2.5 rounded-full text-sm font-semibold transition-colors cursor-pointer shadow-[0_0_12px_rgba(245,189,0,0.4),0_0_24px_rgba(245,189,0,0.2)] ring-2 ring-amber-400/50 ${
                tab === "bundles"
                  ? "bg-forest-green text-off-white"
                  : "text-muted-olive hover:text-dark-olive"
              }`}
            >
              Walk Bundle
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-dark-olive text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                BEST DEAL
              </span>
            </button>
          </div>
        </div>

        {/* Individual Walks */}
        {tab === "individual" && (
          <div>
            <DurationSelector duration={individualDuration} setDuration={setIndividualDuration} />
            <div className="max-w-sm mx-auto">
              {individualDuration === "30" ? (
                <PriceCard
                  title="30-Minute Walk"
                  price="$35"
                  period="/walk"
                  description="Great for potty breaks & moderate exercise"
                  highlighted
                  bookUrl="/book?service=dog-walking&plan=30-Minute Walk"
                  features={[
                    "Up to 30 minutes",
                    "Photo updates",
                    "Post-walk report",
                    "+$10 per additional dog",
                  ]}
                />
              ) : (
                <PriceCard
                  title="60-Minute Walk"
                  price="$55"
                  period="/walk"
                  description="Extended adventure for active dogs"
                  highlighted
                  bookUrl="/book?service=dog-walking&plan=60-Minute Walk"
                  features={[
                    "Up to 60 minutes",
                    "Photo & video updates",
                    "Post-walk report",
                    "+$10 per additional dog",
                  ]}
                />
              )}
            </div>
          </div>
        )}

        {/* Walk Bundles */}
        {tab === "bundles" && (
          <div>
            <DurationSelector duration={bundleDuration} setDuration={setBundleDuration} />
            {bundleDuration === "30" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <PriceCard
                  title="5-Walk Pack"
                  price="$150"
                  period="/5 walks"
                  description="30-minute walks"
                  badge="Save $25"
                  bookUrl="/book?service=dog-walking&plan=5-Walk Pack (30 min)"
                  features={[
                    "5 x 30-minute walks",
                    "$30 per walk (reg. $35)",
                    "Use anytime — no expiration",
                    "+$10/walk per additional dog",
                  ]}
                />
                <PriceCard
                  title="20-Walk Pack"
                  price="$600"
                  period="/20 walks"
                  description="30-minute walks — best value"
                  badge="Save $100"
                  highlighted
                  bookUrl="/book?service=dog-walking&plan=20-Walk Pack (30 min)"
                  features={[
                    "20 x 30-minute walks",
                    "$30 per walk (reg. $35)",
                    "Use anytime — no expiration",
                    "+$10/walk per additional dog",
                  ]}
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <PriceCard
                  title="5-Walk Pack"
                  price="$250"
                  period="/5 walks"
                  description="60-minute walks"
                  badge="Save $25"
                  bookUrl="/book?service=dog-walking&plan=5-Walk Pack (60 min)"
                  features={[
                    "5 x 60-minute walks",
                    "$50 per walk (reg. $55)",
                    "Use anytime — no expiration",
                    "+$10/walk per additional dog",
                  ]}
                />
                <PriceCard
                  title="20-Walk Pack"
                  price="$1,000"
                  period="/20 walks"
                  description="60-minute walks — best value"
                  badge="Save $100"
                  highlighted
                  bookUrl="/book?service=dog-walking&plan=20-Walk Pack (60 min)"
                  features={[
                    "20 x 60-minute walks",
                    "$50 per walk (reg. $55)",
                    "Use anytime — no expiration",
                    "+$10/walk per additional dog",
                  ]}
                />
              </div>
            )}
          </div>
        )}

        <p className="text-center text-sm text-muted-olive mt-8">
          <strong>Additional dogs:</strong> +$10 per walk for each additional dog in the same household.
        </p>
      </div>
    </section>
  );
}
