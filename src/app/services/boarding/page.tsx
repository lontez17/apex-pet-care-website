import { ServicePageLayout } from "@/components/services/service-page-layout";
import { Building, Moon, Sun, Shield, Users, Camera } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pet Boarding | Apex Pet Care",
  description: "A home away from home for your pet. 24/7 supervised boarding with structured play, rest, and daily photo updates.",
};

export default function BoardingPage() {
  return (
    <ServicePageLayout
      title="Boarding"
      slug="boarding"
      tagline="A Home Away From Home"
      description="Going on vacation? Business trip? Your pet deserves more than a kennel. Our boarding provides a comfortable, supervised environment with structured play, socialization, and plenty of love — so you can travel worry-free."
      heroImage="/images/cozy-dog-blanket.jpeg"
      icon={Building}
      features={[
        {
          icon: Moon,
          title: "Comfortable Overnight Care",
          description: "Cozy sleeping arrangements with your pet's own bed, blanket, or crate. We maintain their bedtime routine so they feel right at home.",
        },
        {
          icon: Sun,
          title: "Structured Daily Schedule",
          description: "Morning potty breaks, breakfast, play sessions, afternoon rest, evening walks, and dinner — a full day that mirrors home life.",
        },
        {
          icon: Users,
          title: "Supervised Socialization",
          description: "Compatible dogs enjoy monitored playgroups. If your dog prefers solo time, they get one-on-one attention instead.",
        },
        {
          icon: Shield,
          title: "24/7 Supervision",
          description: "A trained caregiver is always present. Overnight monitoring ensures your pet is safe, comfortable, and never alone.",
        },
        {
          icon: Camera,
          title: "Daily Photo Updates",
          description: "Receive photos and videos every day so you can see your pet happy, playing, and thriving while you're away.",
        },
        {
          icon: Building,
          title: "Medication & Special Diets",
          description: "We follow your vet's instructions precisely — medications on schedule, special diets prepared exactly as directed.",
        },
      ]}
      howItWorks={[
        { step: 1, title: "Book Your Stay", description: "Tell us your travel dates and your pet's needs. We'll confirm availability and schedule a meet & greet if it's your first time." },
        { step: 2, title: "Drop Off Day", description: "Bring your pet with their food, any medications, and a comfort item from home. We'll do a quick check-in and health assessment." },
        { step: 3, title: "Daily Care & Updates", description: "Your pet enjoys structured days with play, walks, meals, and rest. You receive daily photos and updates throughout your trip." },
        { step: 4, title: "Happy Reunion", description: "Pick up your well-rested, happy pet at the scheduled time. We'll share a full summary of their stay." },
      ]}
      pricing={[
        {
          name: "Single Night",
          price: "$65",
          period: "/night",
          description: "Overnight boarding with full day care",
          features: ["Overnight supervision", "2 walks per day", "Structured play sessions", "Feeding on schedule", "Daily photo updates"],
        },
        {
          name: "Extended Stay",
          price: "$55",
          period: "/night",
          description: "5+ nights at a discounted rate",
          features: ["Everything in single night", "Discounted nightly rate", "Extra play sessions", "Detailed stay report", "Priority booking"],
          highlighted: true,
        },
        {
          name: "Puppy Boarding",
          price: "$75",
          period: "/night",
          description: "Extra attention for pups under 1 year",
          features: ["Frequent potty breaks", "Crate training support", "Socialization time", "Puppy-safe play areas", "Training reinforcement"],
        },
      ]}
      whyChooseUs={[
        "No cages or kennels — real living spaces with room to play",
        "24/7 on-site supervision by trained caregivers",
        "Small group sizes for personalized attention",
        "Your pet keeps their routine — same meals, same bedtime",
        "Fully insured and bonded with vet on call",
        "Medication administration at no extra charge",
        "Extended stay discounts for longer trips",
        "Flexible drop-off and pick-up times",
      ]}
      faqs={[
        { question: "What do I need to bring for my pet?", answer: "Bring enough of their regular food for the stay, any medications with written instructions, and a favorite toy or blanket for comfort. We provide beds, bowls, and treats." },
        { question: "Is there a vet on call?", answer: "Yes. We have a relationship with a local veterinarian who can be reached 24/7 for emergencies. We'll also contact you immediately if anything comes up." },
        { question: "Can my dog play with other dogs?", answer: "If your dog is social and passes our temperament assessment, they'll enjoy supervised playgroups with compatible dogs. Dogs that prefer solo time get dedicated one-on-one attention." },
        { question: "What vaccinations are required?", answer: "All boarding guests must be current on Rabies, DHPP, and Bordetella. We also require a negative fecal test within the past year and flea/tick prevention." },
        { question: "What about holidays?", answer: "We're open 365 days a year including holidays. Holiday stays may have a small surcharge — we'll let you know when you book." },
      ]}
    />
  );
}
