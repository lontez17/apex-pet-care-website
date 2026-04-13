import { ServicePageLayout } from "@/components/services/service-page-layout";
import { Car, Thermometer, Shield, Clock, MapPin, Heart } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pet Transportation | Apex Pet Care",
  description: "Safe, comfortable pet transportation to vet visits, grooming, daycare, and more. Climate-controlled vehicle with trained handlers.",
};

export default function TransportationPage() {
  return (
    <ServicePageLayout
      title="Transportation"
      slug="transportation"
      tagline="Safe Rides for Your Pet"
      description="Can't make the vet appointment? Need daycare pickup? Our pet transportation service provides safe, comfortable rides for your pet in a climate-controlled vehicle with a trained handler — so you don't have to rearrange your day."
      heroImage="/images/apricot-poodle-walk.jpeg"
      icon={Car}
      features={[
        {
          icon: Car,
          title: "Climate-Controlled Vehicle",
          description: "Our dedicated pet transport vehicle is climate-controlled year-round with secure crate anchoring and non-slip flooring for safe travel.",
        },
        {
          icon: Shield,
          title: "Secure & Safe",
          description: "Crates and harnesses sized for your pet. We never leave a pet unattended in the vehicle and follow all safety protocols for every ride.",
        },
        {
          icon: Clock,
          title: "Flexible Scheduling",
          description: "Morning vet visits, afternoon grooming, daycare commutes — we work around your pet's appointments and your schedule.",
        },
        {
          icon: MapPin,
          title: "Door-to-Door Service",
          description: "We pick up from your home and deliver directly to the destination. No transfers, no strangers — just one trusted handler the entire trip.",
        },
        {
          icon: Heart,
          title: "Calm & Gentle Handling",
          description: "Anxious travelers get extra patience. We use calming techniques, familiar blankets, and gentle loading to minimize stress.",
        },
        {
          icon: Thermometer,
          title: "Wait & Return Service",
          description: "We can wait at the vet or groomer and bring your pet home after — a round-trip service so you don't have to coordinate two pickups.",
        },
      ]}
      howItWorks={[
        { step: 1, title: "Book Your Ride", description: "Tell us the date, time, pickup location, and destination. Share any notes about your pet's travel temperament and preferred setup." },
        { step: 2, title: "Pickup", description: "We arrive at your home, safely load your pet into our secure vehicle, and confirm departure with you via text." },
        { step: 3, title: "The Ride", description: "Your pet travels in a climate-controlled, secured space. We drive carefully and monitor their comfort throughout the trip." },
        { step: 4, title: "Drop-off & Confirmation", description: "We deliver your pet to the destination (or back home), hand them off safely, and send you a confirmation with timestamps." },
      ]}
      pricing={[
        {
          name: "One-Way Trip",
          price: "$25",
          period: "/trip",
          description: "Single direction transport",
          features: ["Up to 10 miles", "Secure crate transport", "Climate-controlled vehicle", "Text confirmations", "$2/mile beyond 10 mi"],
        },
        {
          name: "Round Trip",
          price: "$40",
          period: "/trip",
          description: "Pickup, wait, and return",
          features: ["Up to 10 miles each way", "Wait at destination", "Up to 2 hour wait included", "Both-way confirmations", "Best value for vet trips"],
          highlighted: true,
        },
        {
          name: "Recurring Rides",
          price: "$20",
          period: "/trip",
          description: "Weekly or regular transport",
          features: ["Discounted per-trip rate", "Same driver each time", "Priority scheduling", "Daycare commute perfect", "Flexible cancellation"],
        },
      ]}
      whyChooseUs={[
        "Dedicated pet transport vehicle — not a personal car",
        "Climate-controlled with secure crate anchoring",
        "Trained handlers experienced with anxious travelers",
        "Never leave a pet unattended in the vehicle",
        "Real-time text updates with pickup and dropoff times",
        "Round-trip service includes wait time at the destination",
        "Recurring ride discounts for daycare or regular appointments",
        "Fully insured with commercial vehicle coverage",
      ]}
      faqs={[
        { question: "What size pets can you transport?", answer: "We can safely transport pets from tiny to large breed dogs (up to 100 lbs). We have appropriately sized crates and harness setups for all sizes. For very large or giant breeds, let us know when booking so we can prepare." },
        { question: "Can you transport cats or other animals?", answer: "Yes! We transport cats in their carriers, as well as small animals in appropriate enclosures. We keep the vehicle calm and quiet for feline passengers." },
        { question: "What if my pet gets car sick?", answer: "Let us know during booking. We'll prepare with towels, go-slow driving, and can recommend pre-trip tips from our vet partners. Short acclimation rides can also help." },
        { question: "How far do you travel?", answer: "Our standard service area covers up to 15 miles from our base. Longer trips are available at an additional per-mile rate. Contact us for a quote on longer distances." },
        { question: "Can you handle vet visit check-ins?", answer: "Yes! For round-trip service, we can check your pet in at the vet, wait in the lobby or nearby, and transport them home after the appointment. We'll relay any instructions the vet gives us." },
      ]}
    />
  );
}
