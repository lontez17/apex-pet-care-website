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
  badge?: string;
}

function PriceCard({ title, price, period, description, features, highlighted, badge }: PriceCardProps) {
  return (
    <div
      className={`card p-6 flex flex-col relative ${
        highlighted
          ? "bg-forest-green text-off-white ring-2 ring-forest-green"
          : "bg-off-white text-dark-olive"
      }`}
    >
      {badge && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-dark-olive text-xs font-bold px-3 py-1 rounded-full">
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
            Choose the plan that fits your schedule. Save with walk packs for
            regular clients.
          </p>
        </div>

        {/* ── Individual Walks ── */}
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <h3 className="font-heading text-xl font-bold text-dark-olive">
              Individual Walks
            </h3>
            <span className="text-xs font-medium text-muted-olive bg-sage-green/15 px-3 py-1 rounded-full">
              Per Walk
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <PriceCard
              title="30-Minute Walk"
              price={`$${PRICING.dog_walking.individual["30_min"].price}`}
              period="/walk"
              description="Great for potty breaks & moderate exercise"
              features={[
                "30-minute guided walk",
                "Photo updates",
                "Post-walk report",
                `+$${PRICING.dog_walking.additional_dog} per additional dog`,
              ]}
            />
            <PriceCard
              title="60-Minute Walk"
              price={`$${PRICING.dog_walking.individual["60_min"].price}`}
              period="/walk"
              description="Extended adventure for active dogs"
              features={[
                "60-minute guided walk",
                "Photo & video updates",
                "Post-walk report",
                `+$${PRICING.dog_walking.additional_dog} per additional dog`,
              ]}
              highlighted
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
        </div>

        {/* ── Walk Packs ── */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <h3 className="font-heading text-xl font-bold text-dark-olive">
              Walk Packs
            </h3>
            <span className="text-xs font-medium text-off-white bg-forest-green px-3 py-1 rounded-full">
              Bundle & Save
            </span>
          </div>

          {/* 30-Minute Packs */}
          <p className="text-sm font-semibold text-muted-olive mb-3 uppercase tracking-wide">
            30-Minute Walk Packs
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <PriceCard
              title="5-Walk Pack"
              price={`$${PRICING.dog_walking.packages["30_min_5"].price}`}
              period="/5 walks"
              description="30-minute walks"
              badge={`Save $${PRICING.dog_walking.packages["30_min_5"].savings}`}
              features={[
                "5 x 30-minute walks",
                `$${PRICING.dog_walking.packages["30_min_5"].price / 5} per walk (reg. $${PRICING.dog_walking.individual["30_min"].price})`,
                "Use anytime — no expiration",
                `+$${PRICING.dog_walking.additional_dog}/walk per additional dog`,
              ]}
            />
            <PriceCard
              title="20-Walk Pack"
              price={`$${PRICING.dog_walking.packages["30_min_20"].price}`}
              period="/20 walks"
              description="30-minute walks — best value"
              badge={`Save $${PRICING.dog_walking.packages["30_min_20"].savings}`}
              highlighted
              features={[
                "20 x 30-minute walks",
                `$${PRICING.dog_walking.packages["30_min_20"].price / 20} per walk (reg. $${PRICING.dog_walking.individual["30_min"].price})`,
                "Use anytime — no expiration",
                `+$${PRICING.dog_walking.additional_dog}/walk per additional dog`,
              ]}
            />
          </div>

          {/* 60-Minute Packs */}
          <p className="text-sm font-semibold text-muted-olive mb-3 uppercase tracking-wide">
            60-Minute Walk Packs
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PriceCard
              title="5-Walk Pack"
              price={`$${PRICING.dog_walking.packages["60_min_5"].price}`}
              period="/5 walks"
              description="60-minute walks"
              badge={`Save $${PRICING.dog_walking.packages["60_min_5"].savings}`}
              features={[
                "5 x 60-minute walks",
                `$${PRICING.dog_walking.packages["60_min_5"].price / 5} per walk (reg. $${PRICING.dog_walking.individual["60_min"].price})`,
                "Use anytime — no expiration",
                `+$${PRICING.dog_walking.additional_dog}/walk per additional dog`,
              ]}
            />
            <PriceCard
              title="20-Walk Pack"
              price={`$${PRICING.dog_walking.packages["60_min_20"].price}`}
              period="/20 walks"
              description="60-minute walks — best value"
              badge={`Save $${PRICING.dog_walking.packages["60_min_20"].savings}`}
              highlighted
              features={[
                "20 x 60-minute walks",
                `$${PRICING.dog_walking.packages["60_min_20"].price / 20} per walk (reg. $${PRICING.dog_walking.individual["60_min"].price})`,
                "Use anytime — no expiration",
                `+$${PRICING.dog_walking.additional_dog}/walk per additional dog`,
              ]}
            />
          </div>
        </div>

        <p className="text-center text-sm text-muted-olive mt-8">
          <strong>Additional dogs:</strong> +${PRICING.dog_walking.additional_dog} per walk for each additional dog in the same household.
          <br />
          <em>*All pricing subject to change. Registration fee of ${PRICING.registration_fee} applies to new clients.</em>
        </p>
      </div>
    </section>
  );
}
