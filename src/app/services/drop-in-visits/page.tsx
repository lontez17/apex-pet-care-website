import { ServicePageLayout } from "@/components/services/service-page-layout";
import { Clock, Heart, Pill, Droplets, Camera, MessageCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Drop-In Visits | Apex Pet Care",
  description: "Quick 15-30 minute check-ins for feeding, potty breaks, medication, and some quality time with your pet.",
};

export default function DropInVisitsPage() {
  return (
    <ServicePageLayout
      title="Drop-In Visits"
      slug="drop-in-visits"
      tagline="Quick Care When You Need It"
      description="Life gets busy. Our drop-in visits give your pet the attention they need — feeding, potty breaks, medication, and a little love — even when you can't be there. Perfect for long work days or quick errands."
      heroImage="/images/orange-tabby-cat.jpeg"
      icon={Clock}
      features={[
        {
          icon: Droplets,
          title: "Potty Breaks",
          description: "We let your dog out, refresh water bowls, and make sure they're comfortable. No more rushing home on your lunch break.",
        },
        {
          icon: Heart,
          title: "Feeding & Fresh Water",
          description: "Meals served on schedule with fresh water. We follow your exact feeding instructions — portions, supplements, and all.",
        },
        {
          icon: Pill,
          title: "Medication Administration",
          description: "Oral meds, eye drops, insulin shots — our trained sitters handle it all with care and on the schedule your vet requires.",
        },
        {
          icon: Clock,
          title: "Playtime & Enrichment",
          description: "A few minutes of focused play, belly rubs, or puzzle toys. Even a short visit can make a big difference in your pet's day.",
        },
        {
          icon: Camera,
          title: "Photo Updates",
          description: "Every visit comes with a photo and a quick note about how your pet is doing. You'll always know they're happy.",
        },
        {
          icon: MessageCircle,
          title: "Visit Notes",
          description: "We log feeding times, bathroom details, and behavior observations so you have a complete picture of your pet's day.",
        },
      ]}
      howItWorks={[
        { step: 1, title: "Tell Us Your Needs", description: "Share your schedule, your pet's routine, and any special requirements — feeding times, medications, favorite toys." },
        { step: 2, title: "Meet & Greet", description: "We visit your home to meet your pet, find the treats, learn the quirks, and make sure everyone's comfortable." },
        { step: 3, title: "We Drop In", description: "At the scheduled time, we arrive, complete all care tasks, give your pet some love, and lock up securely behind us." },
        { step: 4, title: "Get Your Update", description: "Within minutes of leaving, you'll get a photo, visit summary, and any notes about how your pet did." },
      ]}
      pricing={[
        {
          name: "15-Minute Visit",
          price: "$20",
          period: "/visit",
          description: "Quick check-in & potty break",
          features: ["Potty break", "Fresh water", "Quick cuddles", "Photo update", "Visit notes"],
        },
        {
          name: "30-Minute Visit",
          price: "$30",
          period: "/visit",
          description: "Full care visit with playtime",
          features: ["Everything in 15-min", "Full feeding", "Medication admin", "Playtime & enrichment", "Detailed report"],
          highlighted: true,
        },
        {
          name: "Multiple Pets",
          price: "+$5",
          period: "/additional pet",
          description: "Same household, same visit",
          features: ["Each additional pet", "All species welcome", "Individual care notes", "Same great service"],
        },
      ]}
      whyChooseUs={[
        "Perfect for work-from-office days or long shifts",
        "Trained in medication administration including injections",
        "All species welcome — dogs, cats, birds, reptiles, small animals",
        "Consistent sitter so your pet recognizes a friendly face",
        "Fully insured and bonded for your peace of mind",
        "Flexible scheduling — one-time or recurring visits",
        "We handle multi-pet households with ease",
        "Lockbox or smart lock access — you don't need to be home",
      ]}
      faqs={[
        { question: "Can you care for cats and other animals too?", answer: "Absolutely! Drop-in visits are perfect for cats, birds, reptiles, fish, rabbits, and any pet that needs feeding and attention. We tailor the visit to each species' needs." },
        { question: "How do I know you actually came?", answer: "Every visit includes a timestamped photo of your pet and a detailed note. You'll know exactly when we arrived, what we did, and how your pet was doing." },
        { question: "Can you give my pet medication?", answer: "Yes! Our sitters are trained to administer oral medications, eye/ear drops, and even insulin injections. We'll go over the procedure during the meet & greet." },
        { question: "What if my pet is hiding or anxious?", answer: "We're patient. We'll sit quietly, use treats, and let your pet come to us. Over time, most pets warm up and start looking forward to visits." },
      ]}
    />
  );
}
