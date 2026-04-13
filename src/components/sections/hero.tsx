import Link from "next/link";
import { PawPrint, Heart, Star } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Image marquee */}
      <div className="relative h-36 sm:h-56 md:h-80 overflow-hidden">
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-8 md:pt-4 md:pb-10 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="flex gap-0.5 drop-shadow-[0_0_8px_rgba(245,189,0,0.5)]">
            <Star className="h-6 w-6 text-amber-400 fill-amber-400" />
            <Star className="h-6 w-6 text-amber-400 fill-amber-400" />
            <Star className="h-6 w-6 text-amber-400 fill-amber-400" />
            <Star className="h-6 w-6 text-amber-400 fill-amber-400" />
            <Star className="h-6 w-6 text-amber-400 fill-amber-400" />
          </div>
          <span className="font-heading text-lg font-bold text-amber-500">5.0</span>
          <span className="w-1 h-1 rounded-full bg-border-gray" />
          <span className="text-sm font-medium text-muted-olive">Founded in 2021</span>
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
          <a
            href="#select-service"
            className="btn-hover inline-flex items-center justify-center gap-2 bg-forest-green text-off-white px-8 py-3.5 rounded-full text-base font-semibold"
          >
            <PawPrint className="h-5 w-5" />
            Get a Free Quote
          </a>
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

const HERO_IMAGES = [
  { src: "/images/steph-hugging-dog.jpeg", alt: "Stephanie hugging a dog" },
  { src: "/images/white-poodle-walk.jpeg", alt: "White poodle on a walk" },
  { src: "/images/two-dogs-trail.jpeg", alt: "Two dogs on a scenic trail" },
  { src: "/images/blue-eyed-cat-bed.jpeg", alt: "Blue-eyed cat in bed" },
  { src: "/images/cavaliers-in-car.jpeg", alt: "Two Cavalier King Charles in a car" },
  { src: "/images/happy-pitbull.jpeg", alt: "Happy pitbull smiling" },
  { src: "/images/german-shepherd-smile.jpeg", alt: "German Shepherd smiling on trail" },
  { src: "/images/steph-frenchie-couch.jpeg", alt: "Stephanie with French Bulldog on couch" },
  { src: "/images/three-dogs-walk.jpeg", alt: "Three dogs on a group walk" },
  { src: "/images/orange-tabby-cat.jpeg", alt: "Orange tabby cat" },
  { src: "/images/shepherd-puppy-turf.jpeg", alt: "Shepherd puppy on turf" },
  { src: "/images/yellow-lab-walk.jpeg", alt: "Yellow Lab on a walk" },
  { src: "/images/steph-kissing-dog.jpeg", alt: "Stephanie kissing a dog" },
  { src: "/images/cozy-dog-blanket.jpeg", alt: "Cozy dog in a blanket" },
  { src: "/images/dogs-daycare-group.jpeg", alt: "Group of dogs at daycare" },
  { src: "/images/corgi-looking-up.jpeg", alt: "Corgi looking up" },
  { src: "/images/four-dogs-group-walk.jpeg", alt: "Four dogs on a group walk" },
  { src: "/images/husky-park-resting.jpeg", alt: "Husky resting at park" },
  { src: "/images/steph-bulldog-selfie.jpeg", alt: "Stephanie with Bulldog" },
  { src: "/images/shiba-inu-indoors.jpeg", alt: "Shiba Inu sitting indoors" },
];
