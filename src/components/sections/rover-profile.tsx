import Link from "next/link";
import { Star, ShieldCheck, Users, Clock, ExternalLink, ArrowRight } from "lucide-react";
import { REVIEWS, REVIEW_STATS } from "@/lib/reviews";

const FEATURED_REVIEWS = REVIEWS.filter((r) => r.text.length > 80).slice(0, 4);

export function RoverProfile() {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header card */}
        <div className="card bg-off-white p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Profile photo */}
            <div className="relative shrink-0">
              <div
                className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-cover bg-center ring-4 ring-forest-green/20"
                style={{ backgroundImage: "url(/images/steph-dog-park.jpeg)" }}
              />
              <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-forest-green flex items-center justify-center ring-2 ring-off-white">
                <ShieldCheck className="h-4 w-4 text-off-white" />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                <h2 className="font-heading text-xl md:text-2xl font-bold text-dark-olive whitespace-nowrap">
                  Founder &amp; CEO Stephanie Winter
                </h2>
                <span className="inline-flex items-center gap-1 text-xs font-medium bg-green-500/15 text-green-600 px-2.5 py-1 rounded-full self-center md:self-auto">
                  <ShieldCheck className="h-3 w-3" />
                  Verified on Rover
                </span>
              </div>
              <p className="text-sm text-muted-olive mb-3">
                Founder & Lead Pet Care Specialist at Apex Pet Care
              </p>

              {/* Stats row */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm">
                <div className="flex items-center gap-1.5">
                  <div className="flex gap-0.5 drop-shadow-[0_0_6px_rgba(245,189,0,0.5)]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <span className="font-heading font-bold text-amber-500">
                    {REVIEW_STATS.averageRating}
                  </span>
                </div>

                <span className="w-1 h-1 rounded-full bg-border-gray hidden sm:block" />
                <span className="flex items-center gap-1 text-dark-olive font-medium">
                  <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                  {REVIEW_STATS.totalReviews} reviews
                </span>
                <span className="w-1 h-1 rounded-full bg-border-gray hidden sm:block" />
                <span className="flex items-center gap-1 text-dark-olive font-medium">
                  <Users className="h-4 w-4 text-forest-green" />
                  {REVIEW_STATS.repeatClients} repeat clients
                </span>
                <span className="w-1 h-1 rounded-full bg-border-gray hidden sm:block" />
                <span className="flex items-center gap-1 text-dark-olive font-medium">
                  <Clock className="h-4 w-4 text-forest-green" />
                  {REVIEW_STATS.yearsExperience} years experience
                </span>
              </div>
            </div>

            {/* Rover link */}
            <a
              href={REVIEW_STATS.roverProfileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-hover shrink-0 inline-flex items-center gap-2 bg-forest-green text-off-white px-5 py-2.5 rounded-full text-sm font-semibold"
            >
              View on Rover
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Reviews grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FEATURED_REVIEWS.map((review) => (
            <div key={review.name + review.date} className="card bg-off-white p-5">
              <div className="flex gap-0.5 mb-2 drop-shadow-[0_0_4px_rgba(245,189,0,0.4)]">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < review.rating
                        ? "text-amber-400 fill-amber-400"
                        : "text-border-gray fill-border-gray/30"
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-dark-olive/80 leading-relaxed mb-3">
                &ldquo;{review.text}&rdquo;
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-dark-olive">{review.name}</span>
                <span className="text-xs text-muted-olive bg-sage-green/15 px-2 py-0.5 rounded-full">
                  {review.service}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-6">
          <Link
            href="/testimonials"
            className="text-sm text-forest-green font-semibold hover:underline inline-flex items-center gap-1"
          >
            Read all {REVIEW_STATS.totalReviews} reviews
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
