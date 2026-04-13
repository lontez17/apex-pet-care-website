"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { AdminShell } from "@/components/admin/admin-shell";
import { CalendarDays, Search, Download, Eye, X } from "lucide-react";
import type { Booking } from "@/lib/admin-helpers";
import { BOOKING_STATUS_COLORS, SERVICE_LABELS, formatDate, formatCurrency } from "@/lib/admin-helpers";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selected, setSelected] = useState<Booking | null>(null);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) setBookings(data);
      setLoading(false);
    }
    load();
  }, []);

  async function updateStatus(id: string, status: string) {
    await supabase.from("bookings").update({ status: status as Booking["status"] }).eq("id", id);
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: status as Booking["status"] } : b)));
    if (selected?.id === id) setSelected({ ...selected, status: status as Booking["status"] });
  }

  function exportCsv() {
    const headers = ["ID", "Created", "Pet", "Owner", "Email", "Phone", "Service", "Type", "Plan", "Rate", "Start", "Status"];
    const rows = bookings.map((b) => [
      b.id, b.created_at, b.pet_name, b.owner_name, b.email, b.phone,
      b.care_type, b.booking_type || "subscription", b.plan_label || "", b.monthly_rate, b.start_date, b.status,
    ]);
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bookings-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const filtered = bookings.filter((b) => {
    if (statusFilter !== "all" && b.status !== statusFilter) return false;
    if (typeFilter !== "all" && (b.booking_type || "subscription") !== typeFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return b.owner_name.toLowerCase().includes(q) || b.email.toLowerCase().includes(q) || b.pet_name.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <AdminShell>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-dark-olive">Bookings</h1>
        <button
          onClick={exportCsv}
          className="btn-hover flex items-center gap-1.5 bg-off-white text-dark-olive px-4 py-2 rounded-full text-sm font-medium border border-border-gray"
        >
          <Download className="h-4 w-4" /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-olive" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or pet..."
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-border-gray bg-off-white text-dark-olive text-sm focus:outline-none focus:ring-2 focus:ring-sage-green"
          />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-border-gray bg-off-white text-dark-olive text-sm">
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="active">Active</option>
          <option value="cancelled">Cancelled</option>
          <option value="payment_failed">Payment Failed</option>
        </select>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-border-gray bg-off-white text-dark-olive text-sm">
          <option value="all">All Types</option>
          <option value="subscription">Subscription</option>
          <option value="pack">Pack</option>
          <option value="one_time">One-Time</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="h-6 w-6 border-2 border-sage-green border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card bg-off-white p-12 text-center">
          <CalendarDays className="h-12 w-12 text-border-gray mx-auto mb-4" />
          <p className="text-sm text-muted-olive">No bookings found</p>
        </div>
      ) : (
        <div className="card bg-off-white overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-gray/30">
                <th className="text-left p-4 text-xs font-medium text-muted-olive uppercase">Pet</th>
                <th className="text-left p-4 text-xs font-medium text-muted-olive uppercase">Owner</th>
                <th className="text-left p-4 text-xs font-medium text-muted-olive uppercase">Service</th>
                <th className="text-left p-4 text-xs font-medium text-muted-olive uppercase">Type</th>
                <th className="text-left p-4 text-xs font-medium text-muted-olive uppercase">Rate</th>
                <th className="text-left p-4 text-xs font-medium text-muted-olive uppercase">Start</th>
                <th className="text-left p-4 text-xs font-medium text-muted-olive uppercase">Status</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b.id} className="border-b border-border-gray/20 last:border-0 hover:bg-sage-green/5">
                  <td className="p-4 font-medium text-dark-olive">{b.pet_name}</td>
                  <td className="p-4">
                    <p className="text-dark-olive">{b.owner_name}</p>
                    <p className="text-xs text-muted-olive">{b.email}</p>
                  </td>
                  <td className="p-4 text-dark-olive">{SERVICE_LABELS[b.care_type] || b.care_type}</td>
                  <td className="p-4">
                    <span className="text-xs text-muted-olive capitalize">{(b.booking_type || "subscription").replace("_", " ")}</span>
                  </td>
                  <td className="p-4 text-dark-olive">{formatCurrency(b.monthly_rate)}</td>
                  <td className="p-4 text-muted-olive">{formatDate(b.start_date)}</td>
                  <td className="p-4">
                    <select
                      value={b.status}
                      onChange={(e) => updateStatus(b.id, e.target.value)}
                      className={`px-2 py-0.5 rounded-full text-xs font-medium border-0 cursor-pointer ${BOOKING_STATUS_COLORS[b.status]}`}
                    >
                      <option value="pending">pending</option>
                      <option value="active">active</option>
                      <option value="cancelled">cancelled</option>
                      <option value="payment_failed">payment_failed</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <button onClick={() => setSelected(b)} className="text-muted-olive hover:text-forest-green">
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-dark-olive/50 z-50 flex items-center justify-center p-4">
          <div className="card bg-off-white p-6 max-w-md w-full max-h-[80vh] overflow-y-auto relative">
            <button onClick={() => setSelected(null)} className="absolute top-4 right-4 text-muted-olive hover:text-dark-olive">
              <X className="h-5 w-5" />
            </button>
            <h3 className="font-heading text-lg font-bold text-dark-olive mb-4">Booking Details</h3>
            <dl className="space-y-2 text-sm">
              {([
                ["Pet", selected.pet_name],
                ["Type", selected.pet_type],
                ["Breed", selected.pet_breed],
                ["Owner", selected.owner_name],
                ["Email", selected.email],
                ["Phone", selected.phone],
                ["Service", SERVICE_LABELS[selected.care_type] || selected.care_type],
                ["Booking Type", selected.booking_type || "subscription"],
                ["Plan", selected.plan_label],
                ["Days/Week", selected.days_per_week],
                ["Schedule", selected.selected_days?.join(", ")],
                ["Start Date", formatDate(selected.start_date)],
                ["Rate", formatCurrency(selected.monthly_rate)],
                ["Reg Fee", formatCurrency(selected.registration_fee)],
                ["Status", selected.status],
                ["Notes", selected.notes],
              ] as [string, string | number | null | undefined][]).map(([label, value]) =>
                value ? (
                  <div key={label} className="flex justify-between gap-4">
                    <dt className="text-muted-olive shrink-0">{label}</dt>
                    <dd className="font-medium text-dark-olive text-right capitalize">{String(value)}</dd>
                  </div>
                ) : null
              )}
            </dl>
            <button onClick={() => setSelected(null)} className="btn-hover mt-6 w-full bg-forest-green text-off-white py-2 rounded-full font-semibold text-sm">
              Close
            </button>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
