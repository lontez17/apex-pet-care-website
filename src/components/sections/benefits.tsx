import { Brain, Eye, Users, SmilePlus, BatteryFull, Bed } from "lucide-react";

const BENEFITS = [
  {
    icon: Brain,
    title: "Mental Stimulation",
    description:
      "Enriching walks and play sessions prevent boredom and reduce destructive behaviors at home.",
  },
  {
    icon: Eye,
    title: "Professional Supervision",
    description:
      "Every walk and visit is guided by trained, insured professionals who prioritize safety.",
  },
  {
    icon: Users,
    title: "Socialization",
    description:
      "Appropriate interactions with other dogs build confidence and improve social skills.",
  },
  {
    icon: SmilePlus,
    title: "Reduced Anxiety",
    description:
      "Consistent routines and familiar faces help anxious pets feel safe and secure.",
  },
  {
    icon: BatteryFull,
    title: "Happy, Tired Pets",
    description:
      "Pets come home fulfilled, content, and ready to relax. The best kind of tired!",
  },
  {
    icon: Bed,
    title: "Comfort of Home",
    description:
      "In-home pet sitting means your pets stay in their own space with their own routines.",
  },
];

export function Benefits() {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-dark-olive">
            The Apex Pet Care Difference
          </h2>
          <p className="mt-3 text-muted-olive max-w-2xl mx-auto">
            We don&apos;t just care for pets, we provide the structure and
            attention they need to truly thrive.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {BENEFITS.map((benefit) => (
            <div
              key={benefit.title}
              className="card bg-off-white p-6 text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-gold/30 flex items-center justify-center mx-auto mb-4">
                <benefit.icon className="h-7 w-7 text-dark-olive" />
              </div>
              <h3 className="font-heading text-lg font-bold text-dark-olive mb-2">
                {benefit.title}
              </h3>
              <p className="text-sm text-muted-olive">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
