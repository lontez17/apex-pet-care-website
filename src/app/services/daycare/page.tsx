import { ServicePageLayout } from "@/components/services/service-page-layout";
import { Sun, Brain, Users, Clock, Bed, Zap } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dog Daycare | Apex Pet Care",
  description: "Structured days of supervised play, enrichment, and rest. Full and half day options to fit your schedule.",
};

export default function DaycarePage() {
  return (
    <ServicePageLayout
      title="Daycare"
      slug="daycare"
      tagline="Structured Play & Socialization"
      description="No more guilt about leaving your pup home alone all day. Our daycare program provides structured play sessions, mental enrichment, and proper rest breaks, so your dog comes home happy, socialized, and ready to relax."
      heroImage="/images/happy-pitbull.jpeg"
      icon={Sun}
      features={[
        {
          icon: Users,
          title: "Supervised Playgroups",
          description: "Dogs are grouped by size, temperament, and play style. Every interaction is monitored by trained staff to ensure positive socialization.",
        },
        {
          icon: Brain,
          title: "Mental Enrichment",
          description: "Puzzle toys, scent games, and training exercises keep your dog mentally stimulated. A tired brain is just as important as tired legs.",
        },
        {
          icon: Bed,
          title: "Structured Rest Breaks",
          description: "We balance play with quiet rest time. Downtime prevents overstimulation and teaches dogs to self-settle, a skill they carry home.",
        },
        {
          icon: Clock,
          title: "Full Day Schedule",
          description: "Morning energy release, midday rest, afternoon play, and an evening wind-down. A complete day that mirrors healthy routines.",
        },
        {
          icon: Zap,
          title: "Energy-Appropriate Groups",
          description: "High-energy dogs get vigorous play. Seniors and mellow pups enjoy a calmer pace. Everyone gets the right level of activity.",
        },
        {
          icon: Sun,
          title: "Indoor & Outdoor Play",
          description: "Climate-controlled indoor areas plus outdoor yard time (weather permitting) give your dog variety and fresh air throughout the day.",
        },
      ]}
      howItWorks={[
        { step: 1, title: "Schedule an Assessment", description: "Every new dog goes through a temperament assessment to determine their play style, social preferences, and which group is the best fit." },
        { step: 2, title: "First Day Orientation", description: "We start with a half day so your dog can acclimate to the environment, meet the staff, and get comfortable with the routine." },
        { step: 3, title: "The Daycare Day", description: "Drop off in the morning, and your pup enjoys a structured day of play, enrichment, meals, and rest. We send photo updates throughout." },
        { step: 4, title: "Happy Pickup", description: "Pick up a tired, happy dog at the end of the day. We'll give you a quick debrief on how they did." },
      ]}
      pricing={[
        {
          name: "Full Day",
          price: "$45",
          period: "/day",
          description: "5+ hours of structured care",
          features: ["Full day (5+ hours)", "2 play sessions", "Lunch & rest break", "Enrichment activities", "Photo updates"],
        },
        {
          name: "Half Day",
          price: "$30",
          period: "/day",
          description: "Up to 5 hours",
          features: ["Half day (up to 5 hrs)", "1 play session", "Snack break", "Enrichment activities", "Photo updates"],
        },
        {
          name: "10-Day Package",
          price: "$400",
          period: "/10 days",
          description: "Save $50 with a prepaid bundle",
          features: ["10 full days", "$40 per day", "Priority scheduling", "Monthly behavior notes", "Flexible usage"],
          highlighted: true,
        },
      ]}
      whyChooseUs={[
        "Small playgroups with a high staff-to-dog ratio",
        "Temperament-matched groups for safe socialization",
        "Structured rest breaks prevent overstimulation",
        "Indoor climate-controlled space plus outdoor play",
        "Trained staff certified in pet first aid and behavior",
        "Daily report cards with photos and behavior notes",
        "Flexible scheduling, use package days anytime",
        "Discounts for multi-dog households",
      ]}
      faqs={[
        { question: "Does my dog need to pass an assessment?", answer: "Yes. Every new dog attends a temperament assessment before their first full day. This helps us understand their play style and place them in the right group. The assessment is complimentary." },
        { question: "What if my dog doesn't do well in groups?", answer: "That's okay! Some dogs prefer solo enrichment and one-on-one time with staff. We'll work with your dog's comfort level and never force group play." },
        { question: "What's your staff-to-dog ratio?", answer: "We maintain a maximum of 8-10 dogs per handler depending on the group. This ensures every dog gets supervision and attention throughout the day." },
        { question: "Do you provide food?", answer: "We ask that you bring your dog's regular food to maintain their diet. We have treats on hand for enrichment activities and training reinforcement." },
        { question: "What are your hours?", answer: "Daycare runs Monday through Friday, 7:00 AM to 6:30 PM. Early drop-off (6:30 AM) and late pickup (7:00 PM) are available for a small fee." },
      ]}
    />
  );
}
