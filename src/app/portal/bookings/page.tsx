"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { PortalShell } from "@/components/portal/portal-shell";
import { CalendarDays, Eye, X } from "lucide-react";
import type { Booking } from "@/lib/portal-helpers";
import { CARE_TYPE_LABELS, STATUS_COLORS, formatDate, formatCurrency } from "@/lib/portal-helpers";

export default function PortalBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Booking | null>(null);

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data } = await supabase
        .from("bookings")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (data) setBookings(data);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <PortalShell>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-dark-olive">
          My Bookings
        </h1>
        <Link
          href="/get-quote"
          className="btn-hover bg-forest-green text-off-white px-4 py-2 rounded-full text-sm font-semibold"
        >
          New Booking
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="h-6 w-6 border-2 border-sage-green border-t-transparent rounded-full animate-spin" />
        </div>
      ) : bookings.length === 0 ? (
        <div className="card bg-off-white p-12 text-center">
          <CalendarDays className="h-12 w-12 text-border-gray mx-auto mb-4" />
          <h2 className="font-heading text-lg font-bold text-dark-olive mb-2">No bookings yet</h2>
          <p className="text-sm text-muted-olive mb-4">
            Once you book a service, it will appear here.
          </p>
          <Link
            href="/get-quote"
            className="btn-hover inline-flex items-center gap-2 bg-forest-green text-off-white px-6 py-2.5 rounded-full text-sm font-semibold"
          >
            Book a Service
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => (
            <div key={b.id} className="card bg-off-white p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="text-sm font-semibold text-dark-olive">
                      {CARE_TYPE_LABELS[b.care_type] || b.care_type}
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[b.status] || ""}`}
                    >
                      {b.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-olive">
                    {b.pet_name} &middot; Started {formatDate(b.start_date)}
                  </p>
                  <p className="text-sm font-medium text-dark-olive mt-1">
                    {formatCurrency(b.monthly_rate)}/mo
                  </p>
                  {b.selected_days && b.selected_days.length > 0 && (
                    <p className="text-xs text-muted-olive mt-1">
                      {b.selected_days.join(", ")}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setSelected(b)}
                  className="text-muted-olive hover:text-forest-green shrink-0"
                >
                  <Eye className="h-4.5 w-4.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-dark-olive/50 z-50 flex items-center justify-center p-4">
          <div className="card bg-off-white p-6 max-w-md w-full max-h-[80vh] overflow-y-auto relative">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 text-muted-olive hover:text-dark-olive"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="font-heading text-lg font-bold text-dark-olive mb-4">
              Booking Details
            </h3>

            <dl className="space-y-3 text-sm">
              {([
                ["Service", CARE_TYPE_LABELS[selected.care_type] || selected.care_type],
                ["Pet", selected.pet_name],
                ["Pet Type", selected.pet_type],
                ["Breed", selected.pet_breed],
                ["Start Date", formatDate(selected.start_date)],
                ["Days/Week", selected.days_per_week],
                ["Schedule", selected.selected_days?.join(", ")],
                ["Monthly Rate", formatCurrency(selected.monthly_rate)],
                ["Registration Fee", formatCurrency(selected.registration_fee)],
                ["Status", selected.status],
                ["Notes", selected.notes],
                ["Booked", formatDate(selected.created_at)],
              ] as [string, string | number | null | undefined][]).map(([label, value]) =>
                value ? (
                  <div key={label} className="flex justify-between gap-4">
                    <dt className="text-muted-olive shrink-0">{label}</dt>
                    <dd className="font-medium text-dark-olive text-right capitalize">
                      {String(value)}
                    </dd>
                  </div>
                ) : null
              )}
            </dl>

            <button
              onClick={() => setSelected(null)}
              className="btn-hover mt-6 w-full bg-forest-green text-off-white py-2 rounded-full font-semibold text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </PortalShell>
  );
}
