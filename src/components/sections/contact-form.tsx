"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactData } from "@/lib/schemas";
import { Send, CheckCircle } from "lucide-react";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactData>({
    resolver: zodResolver(contactSchema),
  });

  async function onSubmit(data: ContactData) {
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "Failed to send message");
      }
      setSubmitted(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
    }
  }

  if (submitted) {
    return (
      <section id="contact" className="py-16 md:py-24 bg-sage-green/10">
        <div className="max-w-xl mx-auto px-4 text-center">
          <CheckCircle className="h-12 w-12 text-forest-green mx-auto mb-4" />
          <h2 className="font-heading text-2xl font-bold text-dark-olive mb-2">
            Message Sent!
          </h2>
          <p className="text-muted-olive">
            We&apos;ll get back to you within 24 hours. Thank you!
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="py-16 md:py-24 bg-sage-green/10">
      <div className="max-w-xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-dark-olive">
            Get in Touch
          </h2>
          <p className="mt-3 text-muted-olive">
            Have questions? We&apos;d love to hear from you.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="card bg-off-white p-6 md:p-8 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-dark-olive mb-1">
              Name
            </label>
            <input
              id="name"
              {...register("name")}
              className="w-full px-4 py-2.5 rounded-lg border border-border-gray bg-warm-cream/50 text-dark-olive text-sm focus:outline-none focus:ring-2 focus:ring-sage-green"
              placeholder="Your name"
            />
            {errors.name && (
              <p className="text-red-600 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-dark-olive mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register("email")}
              className="w-full px-4 py-2.5 rounded-lg border border-border-gray bg-warm-cream/50 text-dark-olive text-sm focus:outline-none focus:ring-2 focus:ring-sage-green"
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-dark-olive mb-1">
              Phone <span className="text-muted-olive">(optional)</span>
            </label>
            <input
              id="phone"
              type="tel"
              {...register("phone")}
              className="w-full px-4 py-2.5 rounded-lg border border-border-gray bg-warm-cream/50 text-dark-olive text-sm focus:outline-none focus:ring-2 focus:ring-sage-green"
              placeholder="(555) 123-4567"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-dark-olive mb-1">
              Message
            </label>
            <textarea
              id="message"
              rows={4}
              {...register("message")}
              className="w-full px-4 py-2.5 rounded-lg border border-border-gray bg-warm-cream/50 text-dark-olive text-sm focus:outline-none focus:ring-2 focus:ring-sage-green resize-none"
              placeholder="Tell us about your pet and what you're looking for..."
            />
            {errors.message && (
              <p className="text-red-600 text-xs mt-1">{errors.message.message}</p>
            )}
          </div>

          {error && (
            <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{error}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-hover w-full bg-forest-green text-off-white py-3 rounded-full font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </section>
  );
}
