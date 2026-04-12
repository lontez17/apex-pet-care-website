import Link from "next/link";
import { PRICING } from "@/lib/pricing";
import { Check } from "lucide-react";

interface PriceCardProps {
  title: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted?: boolean;
}

function PriceCard({ title, price, period, description, features, highlighted }: PriceCardProps) {
  return (
    <div
      className={`card p-6 flex flex-col ${
        highlighted
          ? "bg-forest-green text-off-white ring-2 ring-forest-green"
          : "bg-off-white text-dark-olive"
      }`}
    >
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
        href="/get-quote"
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

export function Pricing() {
  return (
    <section id="pricing" className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-dark-olive">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-3 text-muted-olive max-w-2xl mx-auto">
            Choose the plan that fits your schedule. Package discounts available
            for regular clients.
          </p>
        </div>

        {/* Individual Rates */}
        <h3 className="font-heading text-xl font-bold text-dark-olive mb-4">
          Individual Rates
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <PriceCard
            title="Dog Walking"
            price={`$${PRICING.dog_walking.rates.per_walk_30}`}
            period="/walk (30 min)"
            description="Daily walks for your pup"
            features={[
              "30-minute guided walk",
              "GPS-tracked route",
              "Photo updates after each walk",
              `60-min option: $${PRICING.dog_walking.rates.per_walk_60}/walk`,
            ]}
          />
          <PriceCard
            title="Pet Sitting"
            price={`$${PRICING.pet_sitting.rates.per_visit}`}
            period="/visit"
            description="In-home care visits"
            features={[
              "30-minute in-home visit",
              "Feeding & medication",
              "Play time & companionship",
              `Overnight: $${PRICING.pet_sitting.rates.overnight}/night`,
            ]}
            highlighted
          />
          <PriceCard
            title="Drop-In Visit"
            price={`$${PRICING.drop_in.rates.per_visit}`}
            period="/visit"
            description="Quick check-ins"
            features={[
              "15-20 minute visit",
              "Potty break & feeding",
              "Quick love & attention",
              "Perfect for midday breaks",
            ]}
          />
        </div>

        {/* Packages */}
        <h3 className="font-heading text-xl font-bold text-dark-olive mb-4">
          Walk Packages
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {Object.entries(PRICING.dog_walking.packages).map(([key, pkg]) => (
            <div key={key} className="card bg-off-white p-6 text-center">
              <h4 className="font-heading text-lg font-bold text-dark-olive">
                {pkg.walks} Walks
              </h4>
              <p className="font-heading text-2xl font-bold text-dark-olive mt-2">
                ${pkg.price}
              </p>
              <p className="text-sm text-forest-green font-medium mt-1">
                Save ${pkg.savings}
              </p>
              <Link
                href="/get-quote"
                className="btn-hover mt-4 inline-block bg-sage-green text-off-white px-6 py-2 rounded-full text-sm font-semibold"
              >
                Book Now
              </Link>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-muted-olive">
          <strong>Multi-pet discount:</strong> $5 off per additional pet in the
          same household.
          <br />
          <em>*All pricing subject to change. Registration fee of ${PRICING.registration_fee} applies to new clients.</em>
        </p>
      </div>
    </section>
  );
}
