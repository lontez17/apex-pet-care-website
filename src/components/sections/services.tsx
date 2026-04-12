import { Dog, Home, Clock, Sun, Moon, Heart } from "lucide-react";

const SERVICES = [
  {
    icon: Dog,
    title: "Dog Walking",
    description:
      "Daily walks tailored to your dog's energy level and needs. From leisurely strolls to high-energy adventures, we keep your pup happy and exercised.",
    features: ["30 or 60 minute walks", "GPS-tracked routes", "Photo & video updates"],
  },
  {
    icon: Home,
    title: "Pet Sitting",
    description:
      "In-home visits so your pets stay comfortable in their own environment. We handle feeding, play time, medication, and all the love they need.",
    features: ["In-home care", "Feeding & medication", "Mail & plant care included"],
  },
  {
    icon: Clock,
    title: "Drop-In Visits",
    description:
      "Quick 15-20 minute check-ins perfect for potty breaks, feeding, and some quality attention during your busy day.",
    features: ["15-20 minute visits", "Potty breaks & feeding", "Perfect for busy days"],
  },
  {
    icon: Sun,
    title: "Puppy Care",
    description:
      "Extra attention for your new family member. Frequent visits to reinforce house training and provide the socialization puppies need.",
    features: ["Multiple daily visits", "House training support", "Socialization"],
  },
  {
    icon: Moon,
    title: "Overnight Stays",
    description:
      "Peace of mind while you travel. We stay overnight with your pets so they never feel alone. Includes evening and morning walks.",
    features: ["Evening & morning walks", "Overnight companionship", "Daily updates"],
  },
  {
    icon: Heart,
    title: "Special Needs Care",
    description:
      "Experienced care for senior pets, pets with medical needs, or anxious animals that need extra patience and attention.",
    features: ["Medication administration", "Senior pet specialists", "Anxiety-aware care"],
  },
];

export function Services() {
  return (
    <section id="services" className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-dark-olive">
            Our Services
          </h2>
          <p className="mt-3 text-muted-olive max-w-2xl mx-auto">
            Comprehensive pet care solutions designed around your pet&apos;s
            comfort and your peace of mind.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service) => (
            <div
              key={service.title}
              className="card bg-off-white p-6 flex flex-col"
            >
              <div className="w-12 h-12 rounded-2xl bg-sage-green/15 flex items-center justify-center mb-4">
                <service.icon className="h-6 w-6 text-forest-green" />
              </div>
              <h3 className="font-heading text-xl font-bold text-dark-olive mb-2">
                {service.title}
              </h3>
              <p className="text-sm text-muted-olive mb-4 flex-1">
                {service.description}
              </p>
              <ul className="space-y-1.5">
                {service.features.map((feature) => (
                  <li
                    key={feature}
                    className="text-sm text-dark-olive/80 flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-forest-green shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
