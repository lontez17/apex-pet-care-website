import Link from "next/link";
import { PawPrint, Heart, Star } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Image marquee */}
      <div className="relative h-48 sm:h-64 md:h-80 overflow-hidden">
        <div className="flex animate-marquee">
          {[...Array(2)].map((_, setIdx) =>
            HERO_IMAGES.map((img, i) => (
              <div
                key={`${setIdx}-${i}`}
                className="shrink-0 w-48 sm:w-56 md:w-72 h-48 sm:h-64 md:h-80 p-1"
              >
                <div
                  className="w-full h-full rounded-2xl bg-sage-green/20 bg-cover bg-center"
                  style={{ backgroundImage: `url(${img.src})` }}
                  aria-label={img.alt}
                />
              </div>
            ))
          )}
        </div>
        {/* Gradient overlays */}
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-warm-cream to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-warm-cream to-transparent z-10" />
      </div>

      {/* Hero content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 text-center">
        <div className="flex justify-center gap-2 mb-4">
          <Star className="h-5 w-5 text-gold fill-gold" />
          <Star className="h-5 w-5 text-gold fill-gold" />
          <Star className="h-5 w-5 text-gold fill-gold" />
          <Star className="h-5 w-5 text-gold fill-gold" />
          <Star className="h-5 w-5 text-gold fill-gold" />
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-dark-olive leading-tight">
          Your Pets Deserve
          <br />
          <span className="text-forest-green">The Best Care</span>
        </h1>
        <p className="mt-4 text-lg text-muted-olive max-w-2xl mx-auto">
          Professional pet sitting and dog walking services tailored to your
          pet&apos;s unique needs. Trusted, reliable, and loving care — right in
          your neighborhood.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/get-quote"
            className="btn-hover inline-flex items-center justify-center gap-2 bg-forest-green text-off-white px-8 py-3.5 rounded-full text-base font-semibold"
          >
            <PawPrint className="h-5 w-5" />
            Get a Free Quote
          </Link>
          <Link
            href="/#services"
            className="btn-hover inline-flex items-center justify-center gap-2 bg-sage-green/20 text-dark-olive px-8 py-3.5 rounded-full text-base font-semibold border border-sage-green"
          >
            <Heart className="h-5 w-5" />
            Our Services
          </Link>
        </div>
      </div>
    </section>
  );
}

// Placeholder images — replace with actual pet photos
const HERO_IMAGES = [
  { src: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop", alt: "Happy dog on a walk" },
  { src: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=300&fit=crop", alt: "Two dogs playing" },
  { src: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop", alt: "Cat being pet" },
  { src: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&h=300&fit=crop", alt: "Dog with owner" },
  { src: "https://images.unsplash.com/photo-1560807707-8cc77767d783?w=400&h=300&fit=crop", alt: "Puppy portrait" },
  { src: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=300&fit=crop", alt: "Cute cat" },
  { src: "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=400&h=300&fit=crop", alt: "Dog running in park" },
  { src: "https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=400&h=300&fit=crop", alt: "Dog and human bonding" },
];
