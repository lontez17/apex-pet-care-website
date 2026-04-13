"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { REVIEWS, REVIEW_STATS, SERVICE_FILTERS, type Review } from "@/lib/reviews";
import {
  Star,
  ShieldCheck,
  Users,
  Clock,
  ExternalLink,
  Quote,
  Filter,
  Award,
} from "lucide-react";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5 drop-shadow-[0_0_4px_rgba(245,189,0,0.4)]">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating
              ? "text-amber-400 fill-amber-400"
              : "text-border-gray fill-border-gray/30"
          }`}
        />
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="card bg-off-white p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <StarRating rating={review.rating} />
        <span className="text-xs text-muted-olive">{review.date}</span>
      </div>
      <div className="relative flex-1 mb-4">
        <Quote className="absolute -top-1 -left-1 h-6 w-6 text-forest-green/10" />
        <p className="text-sm text-dark-olive/85 leading-relaxed pl-4">
          {review.text}
        </p>
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-border-gray/30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-forest-green/10 flex items-center justify-center">
            <span className="text-xs font-bold text-forest-green">
              {review.name.charAt(0)}
            </span>
          </div>
          <span className="text-sm font-semibold text-dark-olive">
            {review.name}
          </span>
        </div>
        <span className="text-xs font-medium text-muted-olive bg-sage-green/15 px-2.5 py-1 rounded-full">
          {review.service}
        </span>
      </div>
    </div>
  );
}

export default function TestimonialsPage() {
  const [activeFilter, setActiveFilter] = useState<string>("All");

  const filtered =
    activeFilter === "All"
      ? REVIEWS
      : REVIEWS.filter((r) => r.service === activeFilter);

  const fiveStarCount = REVIEWS.filter((r) => r.rating === 5).length;
  const fiveStarPercent = Math.round((fiveStarCount / REVIEWS.length) * 100);

  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="py-12 md:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 bg-forest-green/10 text-forest-green text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              <ShieldCheck className="h-4 w-4" />
              Verified Reviews from Rover.com
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-dark-olive leading-tight mb-4">
              What Pet Parents Are Saying
            </h1>
            <p className="text-lg text-muted-olive max-w-2xl mx-auto mb-8">
              Real reviews from real families. Every review is verified through
              Rover, the world&apos;s largest network of trusted pet sitters and
              dog walkers.
            </p>

            {/* Stats banner */}
            <div className="card bg-off-white p-6 md:p-8 max-w-3xl mx-auto">
              <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                {/* Big rating */}
                <div className="text-center">
                  <div className="font-heading text-6xl font-bold text-dark-olive mb-1">
                    {REVIEW_STATS.averageRating}
                  </div>
                  <div className="flex gap-0.5 justify-center mb-1 drop-shadow-[0_0_8px_rgba(245,189,0,0.5)]">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-6 w-6 text-amber-400 fill-amber-400"
                      />
                    ))}
                  </div>
                  <p className="text-xs text-muted-olive">Perfect Rating</p>
                </div>

                <div className="hidden md:block w-px h-20 bg-border-gray/40" />

                {/* Stat columns */}
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                      <Award className="h-5 w-5 text-forest-green" />
                      <span className="font-heading text-2xl font-bold text-dark-olive">
                        {REVIEW_STATS.totalReviews}
                      </span>
                    </div>
                    <p className="text-xs text-muted-olive">Total Reviews</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                      <Users className="h-5 w-5 text-forest-green" />
                      <span className="font-heading text-2xl font-bold text-dark-olive">
                        {REVIEW_STATS.repeatClients}
                      </span>
                    </div>
                    <p className="text-xs text-muted-olive">Repeat Clients</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                      <Clock className="h-5 w-5 text-forest-green" />
                      <span className="font-heading text-2xl font-bold text-dark-olive">
                        {REVIEW_STATS.yearsExperience}+
                      </span>
                    </div>
                    <p className="text-xs text-muted-olive">Years Exp.</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Filter + Reviews */}
        <section className="py-8 md:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Filter bar */}
            <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2">
              <Filter className="h-4 w-4 text-muted-olive shrink-0" />
              {SERVICE_FILTERS.map((filter) => {
                const count =
                  filter === "All"
                    ? REVIEWS.length
                    : REVIEWS.filter((r) => r.service === filter).length;
                return (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                      activeFilter === filter
                        ? "bg-forest-green text-off-white"
                        : "bg-off-white text-muted-olive hover:bg-sage-green/20 border border-border-gray/30"
                    }`}
                  >
                    {filter} ({count})
                  </button>
                );
              })}
            </div>

            {/* Masonry-style grid */}
            <div className="columns-1 md:columns-2 lg:columns-3 gap-5 space-y-5">
              {filtered.map((review, i) => (
                <div key={`${review.name}-${review.date}-${i}`} className="break-inside-avoid">
                  <ReviewCard review={review} />
                </div>
              ))}
            </div>

            {/* Bottom CTA */}
            <div className="text-center mt-12 space-y-4">
              <p className="text-sm text-muted-olive">
                Showing {filtered.length} of {REVIEW_STATS.totalReviews} total
                verified reviews
              </p>
              <a
                href={REVIEW_STATS.roverProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-hover inline-flex items-center gap-2 bg-off-white text-dark-olive border border-border-gray/30 px-6 py-3 rounded-full text-sm font-semibold"
              >
                Read All {REVIEW_STATS.totalReviews} Reviews on Rover
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="bg-forest-green py-12 md:py-16 mt-8">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-off-white mb-3">
              Ready to Join Our Happy Families?
            </h2>
            <p className="text-off-white/80 mb-8 max-w-xl mx-auto">
              See why {REVIEW_STATS.repeatClients} families keep coming back.
              Schedule a free meet & greet today.
            </p>
            <Link
              href="/get-quote"
              className="btn-hover inline-flex items-center gap-2 bg-off-white text-forest-green px-8 py-3.5 rounded-full text-base font-semibold"
            >
              Get a Free Quote
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
