"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { PortalShell } from "@/components/portal/portal-shell";
import { CreditCard, ExternalLink, AlertCircle } from "lucide-react";
import type { Booking } from "@/lib/portal-helpers";
import { CARE_TYPE_LABELS, STATUS_COLORS, formatDate, formatCurrency } from "@/lib/portal-helpers";

export default function PortalBillingPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

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

  const activeBookings = bookings.filter((b) => b.status === "active");
  const totalMonthly = activeBookings.reduce((sum, b) => sum + b.monthly_rate, 0);
  const failedPayments = bookings.filter((b) => b.status === "payment_failed");

  return (
    <PortalShell>
      <h1 className="font-heading text-2xl md:text-3xl font-bold text-dark-olive mb-6">
        Billing
      </h1>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="h-6 w-6 border-2 border-sage-green border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Payment alert */}
          {failedPayments.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 mb-6">
              <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-700">Payment Failed</p>
                <p className="text-xs text-red-600 mt-0.5">
                  {failedPayments.length} booking{failedPayments.length > 1 ? "s have" : " has"} a
                  failed payment. Please update your payment method or contact us at{" "}
                  <a href="tel:+17636563042" className="underline">
                    (763) 656-3042
                  </a>
                  .
                </p>
              </div>
            </div>
          )}

          {/* Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="card bg-off-white p-5">
              <p className="text-sm text-muted-olive mb-1">Active Subscriptions</p>
              <p className="text-2xl font-heading font-bold text-dark-olive">
                {activeBookings.length}
              </p>
            </div>
            <div className="card bg-off-white p-5">
              <p className="text-sm text-muted-olive mb-1">Monthly Total</p>
              <p className="text-2xl font-heading font-bold text-dark-olive">
                {formatCurrency(totalMonthly)}/mo
              </p>
            </div>
          </div>

          {/* Active subscriptions */}
          <h2 className="font-heading text-lg font-bold text-dark-olive mb-3">
            Active Subscriptions
          </h2>

          {activeBookings.length === 0 ? (
            <div className="card bg-off-white p-8 text-center mb-8">
              <CreditCard className="h-10 w-10 text-border-gray mx-auto mb-3" />
              <p className="text-sm text-muted-olive">No active subscriptions</p>
            </div>
          ) : (
            <div className="space-y-3 mb-8">
              {activeBookings.map((b) => (
                <div key={b.id} className="card bg-off-white p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-dark-olive">
                        {CARE_TYPE_LABELS[b.care_type] || b.care_type} &mdash; {b.pet_name}
                      </h3>
                      <p className="text-xs text-muted-olive mt-0.5">
                        Since {formatDate(b.start_date)}
                        {b.days_per_week ? ` \u00B7 ${b.days_per_week} days/week` : ""}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-dark-olive">
                      {formatCurrency(b.monthly_rate)}/mo
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* All billing history */}
          <h2 className="font-heading text-lg font-bold text-dark-olive mb-3">Billing History</h2>

          {bookings.length === 0 ? (
            <div className="card bg-off-white p-8 text-center">
              <p className="text-sm text-muted-olive">No billing history</p>
            </div>
          ) : (
            <div className="card bg-off-white overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border-gray/30">
                    <th className="text-left p-4 text-xs font-medium text-muted-olive uppercase">
                      Service
                    </th>
                    <th className="text-left p-4 text-xs font-medium text-muted-olive uppercase">
                      Pet
                    </th>
                    <th className="text-left p-4 text-xs font-medium text-muted-olive uppercase">
                      Date
                    </th>
                    <th className="text-left p-4 text-xs font-medium text-muted-olive uppercase">
                      Amount
                    </th>
                    <th className="text-left p-4 text-xs font-medium text-muted-olive uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id} className="border-b border-border-gray/20 last:border-0">
                      <td className="p-4 font-medium text-dark-olive">
                        {CARE_TYPE_LABELS[b.care_type] || b.care_type}
                      </td>
                      <td className="p-4 text-dark-olive">{b.pet_name}</td>
                      <td className="p-4 text-muted-olive">{formatDate(b.created_at)}</td>
                      <td className="p-4 text-dark-olive">{formatCurrency(b.monthly_rate)}/mo</td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[b.status] || ""}`}
                        >
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Help */}
          <div className="mt-8 card bg-sage-green/10 border-sage-green/20 p-5 flex items-start gap-3">
            <ExternalLink className="h-5 w-5 text-forest-green shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-dark-olive">Need to update payment info?</p>
              <p className="text-xs text-muted-olive mt-0.5">
                Contact us at{" "}
                <a href="tel:+17636563042" className="text-forest-green hover:underline">
                  (763) 656-3042
                </a>{" "}
                or{" "}
                <a
                  href="mailto:swinter@apexpetcarellc.com"
                  className="text-forest-green hover:underline"
                >
                  swinter@apexpetcarellc.com
                </a>{" "}
                and we&apos;ll help you update your payment method or manage your subscription.
              </p>
            </div>
          </div>
        </>
      )}
    </PortalShell>
  );
}
