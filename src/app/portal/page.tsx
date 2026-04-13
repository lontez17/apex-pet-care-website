"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { PortalShell } from "@/components/portal/portal-shell";
import {
  CalendarDays,
  Dog,
  CreditCard,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import type { Booking, Pet } from "@/lib/portal-helpers";
import { CARE_TYPE_LABELS, STATUS_COLORS, formatDate, formatCurrency } from "@/lib/portal-helpers";

export default function PortalDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const [bookingsRes, petsRes] = await Promise.all([
        supabase
          .from("bookings")
          .select("*")
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false })
          .limit(5),
        supabase
          .from("pets")
          .select("*")
          .eq("user_id", session.user.id),
      ]);

      if (bookingsRes.data) setBookings(bookingsRes.data);
      if (petsRes.data) setPets(petsRes.data);
      setLoading(false);
    }
    load();
  }, []);

  const activeBookings = bookings.filter((b) => b.status === "active");
  const totalMonthly = activeBookings.reduce((sum, b) => sum + b.monthly_rate, 0);

  return (
    <PortalShell>
      <h1 className="font-heading text-2xl md:text-3xl font-bold text-dark-olive mb-6">
        Dashboard
      </h1>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="card bg-off-white p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-9 w-9 rounded-xl bg-forest-green/10 flex items-center justify-center">
              <CalendarDays className="h-4.5 w-4.5 text-forest-green" />
            </div>
            <p className="text-sm text-muted-olive">Active Bookings</p>
          </div>
          <p className="text-2xl font-heading font-bold text-dark-olive">
            {loading ? "..." : activeBookings.length}
          </p>
        </div>

        <div className="card bg-off-white p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-9 w-9 rounded-xl bg-sage-green/20 flex items-center justify-center">
              <Dog className="h-4.5 w-4.5 text-forest-green" />
            </div>
            <p className="text-sm text-muted-olive">Registered Pets</p>
          </div>
          <p className="text-2xl font-heading font-bold text-dark-olive">
            {loading ? "..." : pets.length}
          </p>
        </div>

        <div className="card bg-off-white p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-9 w-9 rounded-xl bg-gold/20 flex items-center justify-center">
              <TrendingUp className="h-4.5 w-4.5 text-dark-olive" />
            </div>
            <p className="text-sm text-muted-olive">Monthly Total</p>
          </div>
          <p className="text-2xl font-heading font-bold text-dark-olive">
            {loading ? "..." : formatCurrency(totalMonthly)}
          </p>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <Link
          href="/portal/pets"
          className="card bg-off-white p-5 flex items-center justify-between group hover:border-forest-green/30 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Dog className="h-5 w-5 text-forest-green" />
            <span className="text-sm font-medium text-dark-olive">Add a Pet</span>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-olive group-hover:text-forest-green transition-colors" />
        </Link>

        <Link
          href="/get-quote"
          className="card bg-off-white p-5 flex items-center justify-between group hover:border-forest-green/30 transition-colors"
        >
          <div className="flex items-center gap-3">
            <CreditCard className="h-5 w-5 text-forest-green" />
            <span className="text-sm font-medium text-dark-olive">Book a Service</span>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-olive group-hover:text-forest-green transition-colors" />
        </Link>
      </div>

      {/* Recent bookings */}
      <div className="card bg-off-white p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-lg font-bold text-dark-olive">Recent Bookings</h2>
          {bookings.length > 0 && (
            <Link href="/portal/bookings" className="text-sm text-forest-green hover:underline">
              View all
            </Link>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="h-6 w-6 border-2 border-sage-green border-t-transparent rounded-full animate-spin" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-8">
            <CalendarDays className="h-10 w-10 text-border-gray mx-auto mb-3" />
            <p className="text-sm text-muted-olive mb-3">No bookings yet</p>
            <Link
              href="/get-quote"
              className="btn-hover inline-flex items-center gap-2 bg-forest-green text-off-white px-5 py-2 rounded-full text-sm font-semibold"
            >
              Book Your First Service
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.map((b) => (
              <div
                key={b.id}
                className="flex items-center justify-between py-3 border-b border-border-gray/30 last:border-0"
              >
                <div>
                  <p className="text-sm font-medium text-dark-olive">
                    {CARE_TYPE_LABELS[b.care_type] || b.care_type} &mdash; {b.pet_name}
                  </p>
                  <p className="text-xs text-muted-olive">
                    Started {formatDate(b.start_date)} &middot; {formatCurrency(b.monthly_rate)}/mo
                  </p>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[b.status] || ""}`}
                >
                  {b.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </PortalShell>
  );
}
