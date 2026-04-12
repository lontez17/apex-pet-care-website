import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CheckCircle, PawPrint, Calendar, Mail } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Booking Confirmed | Apex Pet Care",
  description: "Your booking has been confirmed!",
};

export default function BookingConfirmedPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 py-16 md:py-24 px-4">
        <div className="max-w-lg mx-auto text-center">
          <div className="w-20 h-20 rounded-full bg-forest-green/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-forest-green" />
          </div>

          <h1 className="font-heading text-3xl font-bold text-dark-olive mb-3">
            Booking Confirmed!
          </h1>
          <p className="text-muted-olive mb-8">
            Thank you for choosing Apex Pet Care. We&apos;re excited to meet
            your furry friend!
          </p>

          <div className="card bg-off-white p-6 text-left space-y-4 mb-8">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-forest-green mt-0.5" />
              <div>
                <p className="font-medium text-dark-olive text-sm">Confirmation Email</p>
                <p className="text-xs text-muted-olive">
                  A confirmation email with all the details has been sent to your inbox.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-forest-green mt-0.5" />
              <div>
                <p className="font-medium text-dark-olive text-sm">Meet & Greet</p>
                <p className="text-xs text-muted-olive">
                  We&apos;ll contact you within 24 hours to schedule a complimentary meet
                  & greet before your start date.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <PawPrint className="h-5 w-5 text-forest-green mt-0.5" />
              <div>
                <p className="font-medium text-dark-olive text-sm">What&apos;s Next?</p>
                <p className="text-xs text-muted-olive">
                  Please have your pet&apos;s vaccination records ready for the meet & greet.
                  We&apos;ll go over everything you need to know.
                </p>
              </div>
            </div>
          </div>

          <Link
            href="/"
            className="btn-hover inline-flex items-center gap-2 bg-forest-green text-off-white px-8 py-3 rounded-full font-semibold"
          >
            <PawPrint className="h-5 w-5" />
            Back to Home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
