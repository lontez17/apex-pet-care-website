import { ServicePageLayout } from "@/components/services/service-page-layout";
import { DogWalkingPricing } from "@/components/services/dog-walking-pricing";
import { MapPin, Camera, Clock, Zap, Route, Shield } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dog Walking Services | Apex Pet Care",
  description: "Professional dog walking tailored to your pup's energy level. Photo updates and flexible scheduling.",
};

export default function DogWalkingPage() {
  return (
    <ServicePageLayout
      title="Dog Walking"
      slug="dog-walking"
      tagline="Daily Exercise & Adventure"
      description="Every dog deserves time outdoors. Our professional dog walkers provide stimulating walks tailored to your dog's breed, age, and energy level, rain or shine."
      heroImage="/images/three-dogs-walk.jpeg"
      icon={Route}
      features={[
        {
          icon: Clock,
          title: "Flexible Walk Lengths",
          description: "Choose 30 or 60 minute walks to match your dog's needs. Puppies get shorter, more frequent outings; high-energy breeds get extended adventures.",
        },
        {
          icon: MapPin,
          title: "Photo & Video Updates",
          description: "Receive real-time photos and videos during every walk so you can see your pup having a great time.",
        },
        {
          icon: Camera,
          title: "Photo & Video Updates",
          description: "Receive real-time photos and videos during the walk so you never miss a tail wag or park adventure.",
        },
        {
          icon: Zap,
          title: "Energy-Matched Pacing",
          description: "We match the walk intensity to your dog, leisurely sniff walks for seniors, power walks for athletic breeds, and everything in between.",
        },
        {
          icon: Shield,
          title: "Safety First",
          description: "All walkers are background-checked, pet first aid certified, and trained to handle reactive or anxious dogs safely.",
        },
        {
          icon: Route,
          title: "Consistent Routine",
          description: "Your dog gets the same trusted walker each visit, building a bond that makes walks something they look forward to all day.",
        },
      ]}
      howItWorks={[
        { step: 1, title: "Book a Free Meet & Greet", description: "We visit your home, meet your dog, learn their personality, and discuss your preferred schedule and routes." },
        { step: 2, title: "Set Your Schedule", description: "Choose your days, times, and walk duration. We'll match you with a dedicated walker who fits your pup's needs." },
        { step: 3, title: "We Walk, You Watch", description: "On walk day, we pick up your pup, head out on their favorite route, and send you photos and updates in real time." },
        { step: 4, title: "Post-Walk Report", description: "After every walk, you receive a summary, route map, duration, bathroom breaks, and how your dog did." },
      ]}
      customPricing={<DogWalkingPricing />}
      whyChooseUs={[
        "Insured, bonded, and background-checked walkers",
        "Same dedicated walker builds trust with your dog",
        "Photo and video updates for complete transparency",
        "Flexible scheduling, daily, weekly, or as-needed",
        "Trained in pet first aid and reactive dog handling",
        "We walk rain or shine (extreme weather excepted)",
        "Additional dogs: +$10 per walk per extra dog",
        "Lockbox or smart lock access, no need to be home",
      ]}
      faqs={[
        { question: "How many dogs do you walk at once?", answer: "We offer solo walks (just your dog) by default. Group walks of 2-3 compatible dogs from different households are available at a discounted rate if your dog enjoys canine company." },
        { question: "What if the weather is bad?", answer: "We walk in light rain and cold, dogs love it! For extreme heat (over 95°F), thunderstorms, or ice, we'll adjust to a shorter route with shade or reschedule. We always prioritize your dog's safety." },
        { question: "Do I need to be home?", answer: "Nope! Most clients provide a lockbox code, smart lock access, or garage code. We'll work out the safest key exchange method during the meet & greet." },
        { question: "Can you handle my reactive dog?", answer: "Yes, our walkers are trained in reactive dog management. We'll discuss your dog's triggers during the meet & greet and plan routes that minimize stress." },
        { question: "What's your cancellation policy?", answer: "We ask for 24-hour notice for cancellations. Same-day cancellations are charged at 50% of the walk rate. No-shows are charged in full." },
      ]}
    />
  );
}
