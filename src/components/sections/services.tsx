"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Dog, Clock, Home, Sun, Building, Car, ArrowRight } from "lucide-react";

const SERVICES = [
  {
    icon: Dog,
    slug: "dog-walking",
    title: "Dog Walking",
    description:
      "Daily walks tailored to your dog's energy level. From leisurely neighborhood strolls to high-energy adventures in the park.",
    features: ["30 or 60 minute walks", "Photo & video updates", "Post-walk reports"],
    color: "bg-forest-green/10",
    iconColor: "text-forest-green",
  },
  {
    icon: Clock,
    slug: "drop-in-visits",
    title: "Drop-In Visits",
    description:
      "Quick check-ins for potty breaks, feeding, and some quality love during your busy day. Perfect for midday breaks.",
    features: ["15-30 minute visits", "Feeding & medication", "Potty breaks & play"],
    color: "bg-gold/20",
    iconColor: "text-dark-olive",
  },
  {
    icon: Building,
    slug: "boarding",
    title: "Boarding",
    description:
      "A home away from home for your pet while you travel. 24/7 supervised care with structured play, rest, and socialization.",
    features: ["Overnight & extended stays", "Supervised playgroups", "Daily photo updates"],
    color: "bg-sage-green/15",
    iconColor: "text-forest-green",
  },
  {
    icon: Sun,
    slug: "daycare",
    title: "Daycare",
    description:
      "Structured days of play, enrichment, and rest so your pup comes home happy and tired. Socialization in a safe environment.",
    features: ["Full & half day options", "Structured play sessions", "Rest & enrichment breaks"],
    color: "bg-forest-green/10",
    iconColor: "text-forest-green",
  },
  {
    icon: Home,
    slug: "house-sitting",
    title: "House Sitting",
    description:
      "We stay in your home so your pets keep their routine. Includes walks, feeding, playtime, plus mail and plant care.",
    features: ["Overnight in-home stays", "All pets cared for", "Mail & plant care included"],
    color: "bg-gold/20",
    iconColor: "text-dark-olive",
  },
  {
    icon: Car,
    slug: "transportation",
    title: "Transportation",
    description:
      "Safe, comfortable rides for your pet to vet appointments, grooming, daycare, or anywhere they need to go.",
    features: ["Vet & groomer trips", "Daycare pickup/dropoff", "Climate-controlled vehicle"],
    color: "bg-sage-green/15",
    iconColor: "text-forest-green",
  },
];

export { SERVICES };

export function Services() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    function handleHash() {
      if (window.location.hash === "#select-service") {
        setShowBanner(true);
        history.replaceState(null, "", window.location.pathname);
        document.getElementById("services")?.scrollIntoView({ behavior: "smooth", block: "start" });
        setTimeout(() => setShowBanner(false), 5000);
      }
    }

    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

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

        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 rounded-3xl p-4 -m-4 transition-all duration-500 ${showBanner ? "service-glow ring-2 ring-amber-400/60" : ""}`}>
          {SERVICES.map((service) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className="card bg-off-white p-6 flex flex-col group"
            >
              <div
                className={`w-12 h-12 rounded-2xl ${service.color} flex items-center justify-center mb-4`}
              >
                <service.icon className={`h-6 w-6 ${service.iconColor}`} />
              </div>
              <h3 className="font-heading text-xl font-bold text-dark-olive mb-2 flex items-center gap-2">
                {service.title}
                <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-forest-green" />
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
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
