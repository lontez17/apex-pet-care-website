import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CtaBanner } from "@/components/sections/cta-banner";
import { PawPrint, ArrowLeft, Check } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
}

interface PriceTier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted?: boolean;
}

interface FAQ {
  question: string;
  answer: string;
}

interface ServicePageProps {
  title: string;
  slug?: string;
  tagline: string;
  description: string;
  heroImage: string;
  icon: LucideIcon;
  features: Feature[];
  howItWorks: { step: number; title: string; description: string }[];
  pricing?: PriceTier[];
  customPricing?: React.ReactNode;
  faqs: FAQ[];
  whyChooseUs: string[];
}

export function ServicePageLayout({
  title,
  slug,
  tagline,
  description,
  heroImage,
  icon: Icon,
  features,
  howItWorks,
  pricing,
  customPricing,
  faqs,
  whyChooseUs,
}: ServicePageProps) {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
            <Link
              href="/#services"
              className="inline-flex items-center gap-1 text-sm text-muted-olive hover:text-forest-green mb-6 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              All Services
            </Link>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-forest-green/10 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-forest-green" />
                  </div>
                  <span className="text-sm font-medium text-forest-green bg-forest-green/10 px-3 py-1 rounded-full">
                    {tagline}
                  </span>
                </div>
                <h1 className="font-heading text-4xl md:text-5xl font-bold text-dark-olive leading-tight mb-4">
                  {title}
                </h1>
                <p className="text-lg text-muted-olive leading-relaxed mb-8">
                  {description}
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href="#pricing"
                    className="btn-hover inline-flex items-center justify-center gap-2 bg-forest-green text-off-white px-8 py-3.5 rounded-full font-semibold"
                  >
                    <PawPrint className="h-5 w-5" />
                    Pick {title} Options
                  </a>
                  <Link
                    href="/#contact"
                    className="btn-hover inline-flex items-center justify-center gap-2 bg-sage-green/20 text-dark-olive px-8 py-3.5 rounded-full font-semibold border border-sage-green"
                  >
                    Ask a Question
                  </Link>
                </div>
              </div>
              <div className="relative">
                <div
                  className="aspect-[4/3] rounded-3xl bg-cover bg-center shadow-lg"
                  style={{ backgroundImage: `url(${heroImage})` }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 md:py-24 bg-sage-green/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-dark-olive">
                What&apos;s Included
              </h2>
              <p className="mt-3 text-muted-olive max-w-2xl mx-auto">
                Every detail is taken care of so you can have complete peace of mind.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature) => (
                <div key={feature.title} className="card bg-off-white p-6">
                  <div className="w-11 h-11 rounded-xl bg-gold/25 flex items-center justify-center mb-4">
                    <feature.icon className="h-5 w-5 text-dark-olive" />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-dark-olive mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-olive">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-dark-olive">
                How It Works
              </h2>
            </div>
            <div className="space-y-6">
              {howItWorks.map((step, i) => (
                <div key={step.step} className="flex gap-5">
                  <div className="shrink-0">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-heading font-bold text-sm ${
                        i === 0
                          ? "bg-forest-green text-off-white"
                          : "bg-sage-green/20 text-dark-olive"
                      }`}
                    >
                      {step.step}
                    </div>
                    {i < howItWorks.length - 1 && (
                      <div className="w-0.5 h-full bg-sage-green/20 mx-auto mt-2" />
                    )}
                  </div>
                  <div className="pb-6">
                    <h3 className="font-heading text-lg font-bold text-dark-olive mb-1">
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-olive">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        {customPricing ? customPricing : <section id="pricing" className="py-16 md:py-24 bg-gold/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-dark-olive">
                Pricing
              </h2>
              <p className="mt-3 text-muted-olive">
                Transparent rates with no hidden fees.
              </p>
            </div>
            <div className={`grid grid-cols-1 gap-6 ${
              (pricing?.length ?? 0) === 1 ? "max-w-sm mx-auto" :
              (pricing?.length ?? 0) === 2 ? "md:grid-cols-2 max-w-2xl mx-auto" :
              "md:grid-cols-3"
            }`}>
              {(pricing ?? []).map((tier) => (
                <div
                  key={tier.name}
                  className={`card p-6 flex flex-col ${
                    tier.highlighted
                      ? "bg-forest-green text-off-white ring-2 ring-forest-green"
                      : "bg-off-white text-dark-olive"
                  }`}
                >
                  <h3 className="font-heading text-xl font-bold mb-1">{tier.name}</h3>
                  <p className={`text-sm mb-3 ${tier.highlighted ? "text-off-white/70" : "text-muted-olive"}`}>
                    {tier.description}
                  </p>
                  <div className="mb-4">
                    <span className="font-heading text-3xl font-bold">{tier.price}</span>
                    <span className={`text-sm ${tier.highlighted ? "text-off-white/70" : "text-muted-olive"}`}>
                      {tier.period}
                    </span>
                  </div>
                  <ul className="space-y-2 mb-6 flex-1">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <Check className={`h-4 w-4 mt-0.5 shrink-0 ${tier.highlighted ? "text-light-sage" : "text-forest-green"}`} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/book?service=${slug || "general"}&plan=${encodeURIComponent(tier.name)}`}
                    className={`btn-hover block text-center py-2.5 rounded-full text-sm font-semibold ${
                      tier.highlighted
                        ? "bg-off-white text-forest-green"
                        : "bg-sage-green text-off-white"
                    }`}
                  >
                    Get Started
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>}

        {/* Why Choose Us */}
        <section className="py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-dark-olive">
                Why Choose Apex Pet Care
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {whyChooseUs.map((reason) => (
                <div key={reason} className="flex items-start gap-3 card bg-off-white p-4">
                  <Check className="h-5 w-5 text-forest-green shrink-0 mt-0.5" />
                  <p className="text-sm text-dark-olive">{reason}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-16 md:py-24 bg-sage-green/10">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-dark-olive">
                Frequently Asked Questions
              </h2>
            </div>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <div key={faq.question} className="card bg-off-white p-5">
                  <h3 className="font-heading font-bold text-dark-olive mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-sm text-muted-olive">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}
