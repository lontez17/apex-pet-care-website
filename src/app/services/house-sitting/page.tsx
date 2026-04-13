import { ServicePageLayout } from "@/components/services/service-page-layout";
import { Home, Moon, Flower2, Mail, Shield, Heart } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "House Sitting | Apex Pet Care",
  description: "We stay in your home with your pets, maintaining their routine while you travel. Includes walks, feeding, and home care.",
};

export default function HouseSittingPage() {
  return (
    <ServicePageLayout
      title="House Sitting"
      slug="house-sitting"
      tagline="Your Home, Their Routine"
      description="The ultimate comfort for your pet while you're away. We move into your home so your pets stay in their own environment with their own beds, their own smells, and their own routine, just with a caring professional by their side."
      heroImage="/images/gray-cat.jpeg"
      icon={Home}
      features={[
        {
          icon: Moon,
          title: "Overnight In-Home Stays",
          description: "Our sitter sleeps at your home so your pet is never alone. Nighttime potty breaks and morning routines happen on schedule.",
        },
        {
          icon: Heart,
          title: "Full Pet Care",
          description: "Walking, feeding, playtime, medication, grooming maintenance, everything your pet needs, exactly as you'd do it yourself.",
        },
        {
          icon: Home,
          title: "Multi-Pet Households",
          description: "Have dogs, cats, birds, and fish? No problem. We care for all your animals under one roof with individualized attention.",
        },
        {
          icon: Mail,
          title: "Mail & Package Collection",
          description: "We bring in your mail, accept packages, and make sure your home looks lived-in while you're away, added security at no extra cost.",
        },
        {
          icon: Flower2,
          title: "Plant & Home Care",
          description: "Water the plants, rotate the lights, take out the trash, and handle any small home tasks to keep everything running smoothly.",
        },
        {
          icon: Shield,
          title: "Home Security Presence",
          description: "A lived-in home deters break-ins. Our sitter's presence keeps your home secure with lights on, curtains adjusted, and activity visible.",
        },
      ]}
      howItWorks={[
        { step: 1, title: "Consultation & Meet", description: "We visit your home, meet all your pets, walk through routines, learn the house systems (alarm, thermostat, etc.), and discuss your trip dates." },
        { step: 2, title: "Pre-Trip Prep", description: "You leave us keys, detailed care instructions, vet info, and emergency contacts. We confirm everything is clear before you depart." },
        { step: 3, title: "We Move In", description: "Our sitter arrives before you leave (or shortly after). Your pets keep their exact routine, same walks, same feeding times, same couch spot." },
        { step: 4, title: "Daily Updates", description: "You receive daily photos, pet updates, and home status checks throughout your trip. We're always reachable by text or call." },
      ]}
      pricing={[
        {
          name: "Standard House Sit",
          price: "$85",
          period: "/night",
          description: "Overnight stay with full pet care",
          features: ["Overnight in-home stay", "2-3 walks per day", "All feedings & meds", "Mail & plant care", "Daily photo updates"],
        },
        {
          name: "Extended Stay",
          price: "$75",
          period: "/night",
          description: "7+ nights at a reduced rate",
          features: ["Everything in standard", "Discounted nightly rate", "Weekly home check report", "Priority rebooking", "Trash & recycling handling"],
          highlighted: true,
        },
        {
          name: "Multi-Pet Home",
          price: "$95",
          period: "/night",
          description: "3+ pets in the household",
          features: ["Everything in standard", "Care for all pets", "Individual feeding schedules", "Species-specific care", "Extra walk for each dog"],
        },
      ]}
      whyChooseUs={[
        "Your pets stay in their own home, zero stress from new environments",
        "Full house care included: mail, plants, trash, lights",
        "All species cared for under one roof",
        "Experienced sitters who are background-checked and insured",
        "Home security presence deters break-ins",
        "Daily photos and updates keep you connected",
        "Flexible arrival and departure coordination",
        "Extended stay discounts for longer trips",
      ]}
      faqs={[
        { question: "Can you handle multiple species?", answer: "Absolutely. We've cared for households with dogs, cats, birds, fish, reptiles, and small animals all at once. Each pet gets individualized care based on their species and needs." },
        { question: "Will you use my car or personal items?", answer: "No. Our sitters bring their own essentials and respect your personal space. We'll only access areas relevant to pet care and home maintenance tasks we've agreed on." },
        { question: "What about my home alarm system?", answer: "We'll do a walkthrough of your alarm, thermostat, smart home systems, and any other tech before you leave. We're comfortable with Ring, SimpliSafe, Nest, and most common systems." },
        { question: "What if there's a home emergency?", answer: "We're prepared for basics, we'll know where your shutoff valves and breaker box are. For anything beyond our scope, we'll contact you and your designated emergency contacts immediately." },
        { question: "How far in advance should I book?", answer: "We recommend 2-3 weeks in advance, especially for holidays and summer travel season. Last-minute availability may be possible, just ask!" },
      ]}
    />
  );
}
