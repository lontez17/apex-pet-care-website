"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { AdminShell } from "@/components/admin/admin-shell";
import { ArrowLeft, User, Dog, CalendarDays, Package } from "lucide-react";
import type { Profile, Pet, Booking, ServicePack, ServiceLog } from "@/lib/admin-helpers";
import {
  BOOKING_STATUS_COLORS, PACK_STATUS_COLORS, LOG_STATUS_COLORS,
  formatDate, formatCurrency, packUrgencyColor, SERVICE_LABELS,
} from "@/lib/admin-helpers";

export default function CustomerDetailPage() {
  const params = useParams();
  const customerId = params.id as string;
  const [profile, setProfile] = useState<Profile | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [packs, setPacks] = useState<ServicePack[]>([]);
  const [logs, setLogs] = useState<ServiceLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [profileRes, petsRes, bookingsRes, packsRes, logsRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", customerId).single(),
        supabase.from("pets").select("*").eq("user_id", customerId).order("created_at", { ascending: false }),
        supabase.from("bookings").select("*").eq("user_id", customerId).order("created_at", { ascending: false }),
        supabase.from("service_packs").select("*").eq("user_id", customerId).order("created_at", { ascending: false }),
        supabase.from("service_logs").select("*").eq("user_id", customerId).order("service_date", { ascending: false }).limit(20),
      ]);
      if (profileRes.data) setProfile(profileRes.data);
      if (petsRes.data) setPets(petsRes.data);
      if (bookingsRes.data) setBookings(bookingsRes.data);
      if (packsRes.data) setPacks(packsRes.data);
      if (logsRes.data) setLogs(logsRes.data);
      setLoading(false);
    }
    load();
  }, [customerId]);

  return (
    <AdminShell>
      <Link href="/admin/customers" className="inline-flex items-center gap-1 text-sm text-muted-olive hover:text-forest-green mb-4">
        <ArrowLeft className="h-4 w-4" /> Back to Customers
      </Link>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="h-6 w-6 border-2 border-sage-green border-t-transparent rounded-full animate-spin" />
        </div>
      ) : !profile ? (
        <div className="card bg-off-white p-12 text-center">
          <p className="text-sm text-muted-olive">Customer not found</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Profile card */}
          <div className="card bg-off-white p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-forest-green/15 flex items-center justify-center text-forest-green font-heading font-bold text-lg">
                {profile.full_name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="font-heading text-xl font-bold text-dark-olive">{profile.full_name}</h1>
                <p className="text-sm text-muted-olive">
                  {profile.email} {profile.phone ? `\u00B7 ${profile.phone}` : ""}
                </p>
                <p className="text-xs text-muted-olive">Member since {formatDate(profile.created_at)}</p>
              </div>
            </div>
          </div>

          {/* Pets */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Dog className="h-5 w-5 text-forest-green" />
              <h2 className="font-heading text-lg font-bold text-dark-olive">Pets ({pets.length})</h2>
            </div>
            {pets.length === 0 ? (
              <p className="text-sm text-muted-olive">No pets registered</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {pets.map((pet) => (
                  <div key={pet.id} className="card bg-off-white p-4">
                    <p className="text-sm font-semibold text-dark-olive">{pet.name}</p>
                    <p className="text-xs text-muted-olive">
                      {pet.type}{pet.breed ? ` \u00B7 ${pet.breed}` : ""}{pet.age ? ` \u00B7 ${pet.age}` : ""}
                    </p>
                    <div className="flex gap-1.5 mt-2 flex-wrap">
                      {pet.spayed_neutered && <span className="px-1.5 py-0.5 rounded text-[10px] bg-green-100 text-green-700">Spayed/Neutered</span>}
                      {pet.vaccinations_current && <span className="px-1.5 py-0.5 rounded text-[10px] bg-green-100 text-green-700">Vaccinated</span>}
                      <span className={`px-1.5 py-0.5 rounded text-[10px] ${pet.aggression_level === "none" ? "bg-green-100 text-green-700" : pet.aggression_level === "mild" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>
                        {pet.aggression_level}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Packs */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Package className="h-5 w-5 text-forest-green" />
              <h2 className="font-heading text-lg font-bold text-dark-olive">Walk Packs ({packs.length})</h2>
            </div>
            {packs.length === 0 ? (
              <p className="text-sm text-muted-olive">No packs purchased</p>
            ) : (
              <div className="space-y-3">
                {packs.map((p) => (
                  <Link key={p.id} href={`/admin/packs/${p.id}`} className="card bg-off-white p-4 block hover:border-forest-green/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-dark-olive">{p.pack_label}</p>
                        <p className="text-xs text-muted-olive">{formatDate(p.purchased_at)} &middot; {formatCurrency(p.price_paid)}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-bold ${packUrgencyColor(p.remaining_sessions)}`}>
                          {p.remaining_sessions}/{p.total_sessions}
                        </p>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${PACK_STATUS_COLORS[p.status]}`}>{p.status}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Bookings */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CalendarDays className="h-5 w-5 text-forest-green" />
              <h2 className="font-heading text-lg font-bold text-dark-olive">Bookings ({bookings.length})</h2>
            </div>
            {bookings.length === 0 ? (
              <p className="text-sm text-muted-olive">No bookings</p>
            ) : (
              <div className="space-y-2">
                {bookings.map((b) => (
                  <div key={b.id} className="card bg-off-white p-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-dark-olive">
                        {SERVICE_LABELS[b.care_type] || b.care_type}, {b.pet_name}
                      </p>
                      <p className="text-xs text-muted-olive">
                        {formatDate(b.start_date)} &middot; {formatCurrency(b.monthly_rate)}/mo
                        {b.plan_label ? ` \u00B7 ${b.plan_label}` : ""}
                      </p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${BOOKING_STATUS_COLORS[b.status]}`}>{b.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent service logs */}
          {logs.length > 0 && (
            <div>
              <h2 className="font-heading text-lg font-bold text-dark-olive mb-3">Recent Service History</h2>
              <div className="space-y-2">
                {logs.map((log) => (
                  <div key={log.id} className="card bg-off-white p-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-dark-olive">
                        {formatDate(log.service_date)}, {log.pet_name}
                      </p>
                      <p className="text-xs text-muted-olive">
                        {log.service_type.replace("_", " ")}{log.walker_name ? ` \u00B7 ${log.walker_name}` : ""}
                      </p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${LOG_STATUS_COLORS[log.status]}`}>{log.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </AdminShell>
  );
}
