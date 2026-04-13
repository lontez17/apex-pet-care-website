"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { AdminShell } from "@/components/admin/admin-shell";
import {
  Users, Package, CalendarDays, DollarSign, AlertTriangle, ClipboardCheck, Mail,
} from "lucide-react";
import type { ServicePack, ServiceLog, Booking } from "@/lib/admin-helpers";
import { formatDate, formatCurrency, packUrgencyColor, SERVICE_LABELS, LOG_STATUS_COLORS } from "@/lib/admin-helpers";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    customerCount: 0,
    activePacks: 0,
    activeBookings: 0,
    newContacts: 0,
    revenueThisMonth: 0,
  });
  const [lowPacks, setLowPacks] = useState<ServicePack[]>([]);
  const [recentLogs, setRecentLogs] = useState<ServiceLog[]>([]);
  const [failedBookings, setFailedBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

      const [
        customersRes,
        activePacksRes,
        activeBookingsRes,
        newContactsRes,
        revenueRes,
        lowPacksRes,
        logsRes,
        failedRes,
      ] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("service_packs").select("id", { count: "exact", head: true }).eq("status", "active"),
        supabase.from("bookings").select("id", { count: "exact", head: true }).eq("status", "active"),
        supabase.from("contact_submissions").select("id", { count: "exact", head: true }).eq("responded", false),
        supabase.from("service_packs").select("price_paid").gte("purchased_at", monthStart),
        supabase.from("service_packs").select("*").eq("status", "active").lte("remaining_sessions", 2).order("remaining_sessions"),
        supabase.from("service_logs").select("*").order("created_at", { ascending: false }).limit(10),
        supabase.from("bookings").select("*").eq("status", "payment_failed").limit(5),
      ]);

      const revenue = (revenueRes.data || []).reduce((sum, p) => sum + Number(p.price_paid), 0);

      setStats({
        customerCount: customersRes.count ?? 0,
        activePacks: activePacksRes.count ?? 0,
        activeBookings: activeBookingsRes.count ?? 0,
        newContacts: newContactsRes.count ?? 0,
        revenueThisMonth: revenue,
      });

      if (lowPacksRes.data) setLowPacks(lowPacksRes.data);
      if (logsRes.data) setRecentLogs(logsRes.data);
      if (failedRes.data) setFailedBookings(failedRes.data);
      setLoading(false);
    }
    load();
  }, []);

  const statCards = [
    { label: "Customers", value: stats.customerCount, icon: Users, href: "/admin/customers", color: "bg-forest-green/10 text-forest-green" },
    { label: "Active Packs", value: stats.activePacks, icon: Package, href: "/admin/packs", color: "bg-green-100 text-green-700" },
    { label: "Active Bookings", value: stats.activeBookings, icon: CalendarDays, href: "/admin/bookings", color: "bg-sage-green/20 text-forest-green" },
    { label: "Pack Revenue (Mo)", value: formatCurrency(stats.revenueThisMonth), icon: DollarSign, href: "/admin/packs", color: "bg-amber-100 text-amber-700" },
  ];

  return (
    <AdminShell>
      <h1 className="font-heading text-2xl md:text-3xl font-bold text-dark-olive mb-6">Dashboard</h1>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="h-6 w-6 border-2 border-sage-green border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statCards.map((s) => (
              <Link key={s.label} href={s.href} className="card bg-off-white p-5 hover:border-forest-green/30 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${s.color}`}>
                    <s.icon className="h-4.5 w-4.5" />
                  </div>
                  <p className="text-xs text-muted-olive">{s.label}</p>
                </div>
                <p className="text-2xl font-heading font-bold text-dark-olive">
                  {typeof s.value === "number" ? s.value : s.value}
                </p>
              </Link>
            ))}
          </div>

          {/* Alerts */}
          {(lowPacks.length > 0 || failedBookings.length > 0 || stats.newContacts > 0) && (
            <div className="space-y-3 mb-8">
              {lowPacks.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-700">
                      {lowPacks.length} pack{lowPacks.length > 1 ? "s" : ""} nearly exhausted
                    </p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {lowPacks.map((p) => (
                        <Link key={p.id} href={`/admin/packs/${p.id}`} className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full hover:bg-red-200">
                          {p.customer_name}: {p.remaining_sessions} left
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {failedBookings.length > 0 && (
                <Link href="/admin/bookings" className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 block">
                  <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-sm font-medium text-amber-700">
                    {failedBookings.length} booking{failedBookings.length > 1 ? "s" : ""} with failed payments
                  </p>
                </Link>
              )}
              {stats.newContacts > 0 && (
                <Link href="/admin/contacts" className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3 block">
                  <Mail className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                  <p className="text-sm font-medium text-blue-700">
                    {stats.newContacts} unresponded contact submission{stats.newContacts > 1 ? "s" : ""}
                  </p>
                </Link>
              )}
            </div>
          )}

          {/* Recent activity */}
          <div className="card bg-off-white p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-lg font-bold text-dark-olive">Recent Activity</h2>
              <Link href="/admin/service-log" className="text-sm text-forest-green hover:underline">View all</Link>
            </div>
            {recentLogs.length === 0 ? (
              <div className="text-center py-6">
                <ClipboardCheck className="h-8 w-8 text-border-gray mx-auto mb-2" />
                <p className="text-sm text-muted-olive">No service logs yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {recentLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between py-2 border-b border-border-gray/20 last:border-0">
                    <div>
                      <p className="text-sm text-dark-olive">
                        {log.pet_name}, {log.service_type.replace("_", " ")}
                      </p>
                      <p className="text-xs text-muted-olive">
                        {formatDate(log.service_date)}{log.walker_name ? ` \u00B7 ${log.walker_name}` : ""}
                      </p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${LOG_STATUS_COLORS[log.status]}`}>
                      {log.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </AdminShell>
  );
}
