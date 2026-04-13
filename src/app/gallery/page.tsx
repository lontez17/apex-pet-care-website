"use client";

import { useState } from "react";
import Image from "next/image";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { GALLERY_IMAGES, GALLERY_TAGS } from "@/lib/gallery";
import { Camera, Filter, X } from "lucide-react";

export default function GalleryPage() {
  const [activeTag, setActiveTag] = useState<string>("All");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered =
    activeTag === "All"
      ? GALLERY_IMAGES
      : GALLERY_IMAGES.filter((img) => img.tag === activeTag);

  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="py-12 md:py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 bg-forest-green/10 text-forest-green text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              <Camera className="h-4 w-4" />
              Real Moments with Real Pets
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-dark-olive leading-tight mb-4">
              Our Gallery
            </h1>
            <p className="text-lg text-muted-olive max-w-2xl mx-auto">
              A peek into the daily adventures, snuggles, and happy tails at
              Apex Pet Care. Every photo is a real moment with one of our
              beloved clients.
            </p>
          </div>
        </section>

        {/* Filter + Grid */}
        <section className="pb-16 md:pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Filters */}
            <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2">
              <Filter className="h-4 w-4 text-muted-olive shrink-0" />
              {GALLERY_TAGS.map((tag) => {
                const count =
                  tag === "All"
                    ? GALLERY_IMAGES.length
                    : GALLERY_IMAGES.filter((i) => i.tag === tag).length;
                return (
                  <button
                    key={tag}
                    onClick={() => setActiveTag(tag)}
                    className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                      activeTag === tag
                        ? "bg-forest-green text-off-white"
                        : "bg-off-white text-muted-olive hover:bg-sage-green/20 border border-border-gray/30"
                    }`}
                  >
                    {tag} ({count})
                  </button>
                );
              })}
            </div>

            {/* Masonry grid */}
            <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
              {filtered.map((img, i) => (
                <div
                  key={img.src}
                  className="break-inside-avoid cursor-pointer group"
                  onClick={() => setLightbox(i)}
                >
                  <div className="relative overflow-hidden rounded-2xl">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      width={600}
                      height={600}
                      className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-dark-olive/0 group-hover:bg-dark-olive/30 transition-colors duration-300 flex items-end">
                      <div className="w-full p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <span className="inline-block text-xs font-medium text-off-white bg-forest-green/80 backdrop-blur-sm px-2.5 py-1 rounded-full">
                          {img.tag}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Count */}
            <p className="text-center text-sm text-muted-olive mt-8">
              Showing {filtered.length} of {GALLERY_IMAGES.length} photos
            </p>
          </div>
        </section>
      </main>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[100] bg-dark-charcoal/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 text-off-white/80 hover:text-off-white z-10"
            aria-label="Close lightbox"
          >
            <X className="h-8 w-8" />
          </button>

          {/* Nav arrows */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightbox((lightbox - 1 + filtered.length) % filtered.length);
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-off-white/60 hover:text-off-white text-4xl font-light z-10"
            aria-label="Previous"
          >
            &#8249;
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightbox((lightbox + 1) % filtered.length);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-off-white/60 hover:text-off-white text-4xl font-light z-10"
            aria-label="Next"
          >
            &#8250;
          </button>

          <div
            className="max-w-4xl max-h-[85vh] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={filtered[lightbox].src}
              alt={filtered[lightbox].alt}
              width={1200}
              height={1200}
              className="max-h-[85vh] w-auto rounded-2xl object-contain"
            />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
              <span className="text-sm text-off-white bg-dark-olive/60 backdrop-blur-sm px-4 py-2 rounded-full">
                {filtered[lightbox].alt}
              </span>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
