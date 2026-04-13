"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { AdminShell } from "@/components/admin/admin-shell";
import { Package, Search, ClipboardCheck, Eye } from "lucide-react";
import type { ServicePack } from "@/lib/admin-helpers";
import { PACK_STATUS_COLORS, formatDate, formatCurrency, packUrgencyColor, packUrgencyBg } from "@/lib/admin-helpers";

export default function AdminPacksPage() {
  const [packs, setPacks] = useState<ServicePack[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("service_packs")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) setPacks(data);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = packs.filter((p) => {
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        p.customer_name.toLowerCase().includes(q) ||
        p.customer_email.toLowerCase().includes(q) ||
        p.pack_label.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const lowBalance = packs.filter((p) => p.status === "active" && p.remaining_sessions <= 2);

  return (
    <AdminShell>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-dark-olive">Walk Packs</h1>
        <Link
          href="/admin/service-log"
          className="btn-hover flex items-center gap-1.5 bg-forest-green text-off-white px-4 py-2 rounded-full text-sm font-semibold"
        >
          <ClipboardCheck className="h-4 w-4" />
          Log Service
        </Link>
      </div>

      {/* Low balance alert */}
      {lowBalance.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <p className="text-sm font-medium text-red-700 mb-1">
            {lowBalance.length} pack{lowBalance.length > 1 ? "s" : ""} nearly exhausted
          </p>
          <div className="flex flex-wrap gap-2">
            {lowBalance.map((p) => (
              <Link
                key={p.id}
                href={`/admin/packs/${p.id}`}
                className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full hover:bg-red-200"
              >
                {p.customer_name}, {p.remaining_sessions} left
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-olive" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or pack..."
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-border-gray bg-off-white text-dark-olive text-sm focus:outline-none focus:ring-2 focus:ring-sage-green"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-border-gray bg-off-white text-dark-olive text-sm focus:outline-none focus:ring-2 focus:ring-sage-green"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="exhausted">Exhausted</option>
          <option value="expired">Expired</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="h-6 w-6 border-2 border-sage-green border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card bg-off-white p-12 text-center">
          <Package className="h-12 w-12 text-border-gray mx-auto mb-4" />
          <h2 className="font-heading text-lg font-bold text-dark-olive mb-2">No packs found</h2>
          <p className="text-sm text-muted-olive">
            {search || statusFilter !== "all" ? "Try adjusting your filters." : "Walk packs will appear here after purchase."}
          </p>
        </div>
      ) : (
        <div className="card bg-off-white overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-gray/30">
                <th className="text-left p-4 text-xs font-medium text-muted-olive uppercase">Customer</th>
                <th className="text-left p-4 text-xs font-medium text-muted-olive uppercase">Pack</th>
                <th className="text-left p-4 text-xs font-medium text-muted-olive uppercase">Remaining</th>
                <th className="text-left p-4 text-xs font-medium text-muted-olive uppercase">Paid</th>
                <th className="text-left p-4 text-xs font-medium text-muted-olive uppercase">Status</th>
                <th className="text-left p-4 text-xs font-medium text-muted-olive uppercase">Purchased</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-border-gray/20 last:border-0 hover:bg-sage-green/5">
                  <td className="p-4">
                    <p className="font-medium text-dark-olive">{p.customer_name}</p>
                    <p className="text-xs text-muted-olive">{p.customer_email}</p>
                  </td>
                  <td className="p-4 text-dark-olive">{p.pack_label}</td>
                  <td className="p-4">
                    <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-lg ${packUrgencyBg(p.remaining_sessions)}`}>
                      <span className={`text-sm font-bold ${packUrgencyColor(p.remaining_sessions)}`}>
                        {p.remaining_sessions}
                      </span>
                      <span className="text-xs text-muted-olive">/ {p.total_sessions}</span>
                    </div>
                    {/* Progress bar */}
                    <div className="w-20 h-1.5 bg-border-gray/30 rounded-full mt-1">
                      <div
                        className={`h-full rounded-full transition-all ${
                          p.remaining_sessions <= 2 ? "bg-red-400" : p.remaining_sessions <= 5 ? "bg-amber-400" : "bg-green-400"
                        }`}
                        style={{ width: `${(p.remaining_sessions / p.total_sessions) * 100}%` }}
                      />
                    </div>
                  </td>
                  <td className="p-4 text-dark-olive">{formatCurrency(p.price_paid)}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${PACK_STATUS_COLORS[p.status] || ""}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="p-4 text-muted-olive">{formatDate(p.purchased_at)}</td>
                  <td className="p-4">
                    <Link
                      href={`/admin/packs/${p.id}`}
                      className="text-muted-olive hover:text-forest-green"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}
