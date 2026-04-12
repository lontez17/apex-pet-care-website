"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { PawPrint, LogOut, Download, Mail, Eye } from "lucide-react";
import type { Database } from "@/lib/supabase/types";

type Booking = Database["public"]["Tables"]["bookings"]["Row"];
type Contact = Database["public"]["Tables"]["contact_submissions"]["Row"];

type Tab = "bookings" | "contacts";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-gold/30 text-dark-olive",
  active: "bg-forest-green/15 text-forest-green",
  cancelled: "bg-red-100 text-red-700",
  payment_failed: "bg-red-100 text-red-700",
};

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [magicSent, setMagicSent] = useState(false);
  const [tab, setTab] = useState<Tab>("bookings");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthed(!!session);
      setLoading(false);
      if (session) loadData();
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthed(!!session);
      if (session) loadData();
    });

    return () => subscription.unsubscribe();
  }, []);

  async function loadData() {
    const [bookingsRes, contactsRes] = await Promise.all([
      supabase.from("bookings").select("*").order("created_at", { ascending: false }),
      supabase.from("contact_submissions").select("*").order("created_at", { ascending: false }),
    ]);
    if (bookingsRes.data) setBookings(bookingsRes.data);
    if (contactsRes.data) setContacts(contactsRes.data);
  }

  async function handleMagicLink() {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/admin` },
    });
    if (!error) setMagicSent(true);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    setAuthed(false);
  }

  async function markResponded(id: string) {
    await supabase.from("contact_submissions").update({ responded: true } as Database["public"]["Tables"]["contact_submissions"]["Update"]).eq("id", id);
    setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, responded: true } : c)));
  }

  function exportCsv() {
    const headers = [
      "ID", "Created", "Pet Name", "Owner", "Email", "Phone",
      "Care Type", "Days/Week", "Start Date", "Monthly Rate", "Status",
    ];
    const rows = bookings.map((b) => [
      b.id, b.created_at, b.pet_name, b.owner_name, b.email, b.phone,
      b.care_type, b.days_per_week ?? "", b.start_date, b.monthly_rate, b.status,
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-cream">
        <PawPrint className="h-8 w-8 text-sage-green animate-pulse" />
      </div>
    );
  }

  // Login screen
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-cream px-4">
        <div className="card bg-off-white p-8 w-full max-w-sm text-center">
          <PawPrint className="h-10 w-10 text-forest-green mx-auto mb-4" />
          <h1 className="font-heading text-2xl font-bold text-dark-olive mb-2">
            Admin Login
          </h1>
          {magicSent ? (
            <p className="text-sm text-muted-olive">
              Check your email for a login link!
            </p>
          ) : (
            <>
              <p className="text-sm text-muted-olive mb-4">
                Enter your email to receive a magic login link.
              </p>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@apexpetcare.com"
                className="w-full px-4 py-2.5 rounded-lg border border-border-gray bg-warm-cream/50 text-dark-olive text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-sage-green"
              />
              <button
                onClick={handleMagicLink}
                disabled={!email}
                className="btn-hover w-full bg-forest-green text-off-white py-2.5 rounded-full font-semibold text-sm disabled:opacity-50"
              >
                Send Magic Link
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  // Admin dashboard
  return (
    <div className="min-h-screen bg-warm-cream">
      {/* Header */}
      <header className="bg-light-sage/95 border-b border-sage-green/20 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PawPrint className="h-6 w-6 text-forest-green" />
            <span className="font-heading text-lg font-bold text-dark-olive">
              Admin Dashboard
            </span>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-1 text-sm text-muted-olive hover:text-dark-olive"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab("bookings")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              tab === "bookings"
                ? "bg-forest-green text-off-white"
                : "bg-off-white text-muted-olive hover:bg-sage-green/20"
            }`}
          >
            Bookings ({bookings.length})
          </button>
          <button
            onClick={() => setTab("contacts")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              tab === "contacts"
                ? "bg-forest-green text-off-white"
                : "bg-off-white text-muted-olive hover:bg-sage-green/20"
            }`}
          >
            Contact Forms ({contacts.filter((c) => !c.responded).length} new)
          </button>
        </div>

        {/* Bookings Tab */}
        {tab === "bookings" && (
          <>
            <div className="flex justify-end mb-4">
              <button
                onClick={exportCsv}
                className="btn-hover flex items-center gap-1 bg-off-white text-dark-olive px-4 py-2 rounded-full text-sm font-medium border border-border-gray"
              >
                <Download className="h-4 w-4" />
                Export CSV
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border-gray text-left">
                    <th className="pb-2 font-medium text-muted-olive">Pet</th>
                    <th className="pb-2 font-medium text-muted-olive">Owner</th>
                    <th className="pb-2 font-medium text-muted-olive">Service</th>
                    <th className="pb-2 font-medium text-muted-olive">Rate</th>
                    <th className="pb-2 font-medium text-muted-olive">Start</th>
                    <th className="pb-2 font-medium text-muted-olive">Status</th>
                    <th className="pb-2 font-medium text-muted-olive"></th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id} className="border-b border-border-gray/50">
                      <td className="py-3 font-medium text-dark-olive">{b.pet_name}</td>
                      <td className="py-3 text-dark-olive">{b.owner_name}</td>
                      <td className="py-3 text-dark-olive capitalize">{b.care_type.replace("_", " ")}</td>
                      <td className="py-3 text-dark-olive">${b.monthly_rate}/mo</td>
                      <td className="py-3 text-dark-olive">{b.start_date}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[b.status] || ""}`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="py-3">
                        <button
                          onClick={() => setSelectedBooking(b)}
                          className="text-muted-olive hover:text-forest-green"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {bookings.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-muted-olive">
                        No bookings yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Booking Detail Modal */}
            {selectedBooking && (
              <div className="fixed inset-0 bg-dark-olive/50 z-50 flex items-center justify-center p-4">
                <div className="card bg-off-white p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
                  <h3 className="font-heading text-lg font-bold text-dark-olive mb-4">
                    Booking Details
                  </h3>
                  <dl className="space-y-2 text-sm">
                    {[
                      ["Pet Name", selectedBooking.pet_name],
                      ["Pet Type", selectedBooking.pet_type],
                      ["Breed", selectedBooking.pet_breed],
                      ["Owner", selectedBooking.owner_name],
                      ["Email", selectedBooking.email],
                      ["Phone", selectedBooking.phone],
                      ["Service", selectedBooking.care_type.replace("_", " ")],
                      ["Days/Week", selectedBooking.days_per_week],
                      ["Start Date", selectedBooking.start_date],
                      ["Monthly Rate", `$${selectedBooking.monthly_rate}`],
                      ["Registration Fee", `$${selectedBooking.registration_fee}`],
                      ["Status", selectedBooking.status],
                      ["Notes", selectedBooking.notes],
                    ].map(([label, value]) =>
                      value ? (
                        <div key={String(label)} className="flex justify-between">
                          <dt className="text-muted-olive">{String(label)}</dt>
                          <dd className="font-medium text-dark-olive capitalize">{String(value)}</dd>
                        </div>
                      ) : null
                    )}
                  </dl>
                  <button
                    onClick={() => setSelectedBooking(null)}
                    className="btn-hover mt-6 w-full bg-forest-green text-off-white py-2 rounded-full font-semibold text-sm"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Contacts Tab */}
        {tab === "contacts" && (
          <div className="space-y-4">
            {contacts.map((c) => (
              <div key={c.id} className={`card bg-off-white p-5 ${c.responded ? "opacity-60" : ""}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-dark-olive text-sm">{c.name}</p>
                      {!c.responded && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gold/30 text-dark-olive">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-olive">{c.email} {c.phone ? `| ${c.phone}` : ""}</p>
                    <p className="text-sm text-dark-olive mt-2">{c.message}</p>
                    <p className="text-xs text-muted-olive mt-2">
                      {new Date(c.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  {!c.responded && (
                    <button
                      onClick={() => markResponded(c.id)}
                      className="btn-hover flex items-center gap-1 text-xs text-forest-green bg-forest-green/10 px-3 py-1.5 rounded-full font-medium shrink-0"
                    >
                      <Mail className="h-3 w-3" />
                      Mark Responded
                    </button>
                  )}
                </div>
              </div>
            ))}
            {contacts.length === 0 && (
              <p className="text-center text-muted-olive py-8">No contact submissions yet</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
