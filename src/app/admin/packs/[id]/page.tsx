"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { AdminShell } from "@/components/admin/admin-shell";
import { ArrowLeft, Package, ClipboardCheck } from "lucide-react";
import type { ServicePack, ServiceLog } from "@/lib/admin-helpers";
import { PACK_STATUS_COLORS, LOG_STATUS_COLORS, formatDate, formatCurrency, packUrgencyColor } from "@/lib/admin-helpers";

export default function PackDetailPage() {
  const params = useParams();
  const packId = params.id as string;
  const [pack, setPack] = useState<ServicePack | null>(null);
  const [logs, setLogs] = useState<ServiceLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [packRes, logsRes] = await Promise.all([
        supabase.from("service_packs").select("*").eq("id", packId).single(),
        supabase
          .from("service_logs")
          .select("*")
          .eq("service_pack_id", packId)
          .order("service_date", { ascending: false }),
      ]);
      if (packRes.data) setPack(packRes.data);
      if (logsRes.data) setLogs(logsRes.data);
      setLoading(false);
    }
    load();
  }, [packId]);

  return (
    <AdminShell>
      <Link
        href="/admin/packs"
        className="inline-flex items-center gap-1 text-sm text-muted-olive hover:text-forest-green mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Packs
      </Link>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="h-6 w-6 border-2 border-sage-green border-t-transparent rounded-full animate-spin" />
        </div>
      ) : !pack ? (
        <div className="card bg-off-white p-12 text-center">
          <Package className="h-12 w-12 text-border-gray mx-auto mb-4" />
          <p className="text-sm text-muted-olive">Pack not found</p>
        </div>
      ) : (
        <>
          {/* Pack header */}
          <div className="card bg-off-white p-6 mb-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="font-heading text-xl font-bold text-dark-olive mb-1">
                  {pack.pack_label}
                </h1>
                <p className="text-sm text-muted-olive">
                  {pack.customer_name} &middot; {pack.customer_email}
                  {pack.customer_phone ? ` \u00B7 ${pack.customer_phone}` : ""}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${PACK_STATUS_COLORS[pack.status]}`}>
                {pack.status}
              </span>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              <div>
                <p className="text-xs text-muted-olive">Remaining</p>
                <p className={`text-2xl font-heading font-bold ${packUrgencyColor(pack.remaining_sessions)}`}>
                  {pack.remaining_sessions}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-olive">Used</p>
                <p className="text-2xl font-heading font-bold text-dark-olive">{pack.used_sessions}</p>
              </div>
              <div>
                <p className="text-xs text-muted-olive">Total</p>
                <p className="text-2xl font-heading font-bold text-dark-olive">{pack.total_sessions}</p>
              </div>
              <div>
                <p className="text-xs text-muted-olive">Paid</p>
                <p className="text-2xl font-heading font-bold text-dark-olive">{formatCurrency(pack.price_paid)}</p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-4">
              <div className="w-full h-3 bg-border-gray/20 rounded-full">
                <div
                  className={`h-full rounded-full transition-all ${
                    pack.remaining_sessions <= 2 ? "bg-red-400" : pack.remaining_sessions <= 5 ? "bg-amber-400" : "bg-green-400"
                  }`}
                  style={{ width: `${(pack.remaining_sessions / pack.total_sessions) * 100}%` }}
                />
              </div>
              <p className="text-xs text-muted-olive mt-1">
                {pack.remaining_sessions} of {pack.total_sessions} sessions remaining
              </p>
            </div>

            <div className="flex items-center gap-4 mt-4 text-xs text-muted-olive">
              <span>Purchased: {formatDate(pack.purchased_at)}</span>
              {pack.unit_duration_minutes && <span>Duration: {pack.unit_duration_minutes} min</span>}
            </div>

            {pack.status === "active" && (
              <Link
                href="/admin/service-log"
                className="btn-hover inline-flex items-center gap-1.5 bg-forest-green text-off-white px-4 py-2 rounded-full text-sm font-semibold mt-4"
              >
                <ClipboardCheck className="h-4 w-4" />
                Log a Service for This Pack
              </Link>
            )}
          </div>

          {/* Service history */}
          <h2 className="font-heading text-lg font-bold text-dark-olive mb-3">Service History</h2>

          {logs.length === 0 ? (
            <div className="card bg-off-white p-8 text-center">
              <ClipboardCheck className="h-10 w-10 text-border-gray mx-auto mb-3" />
              <p className="text-sm text-muted-olive">No services logged yet for this pack</p>
            </div>
          ) : (
            <div className="space-y-3">
              {logs.map((log) => (
                <div key={log.id} className="card bg-off-white p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-dark-olive">
                        {formatDate(log.service_date)}
                        {log.start_time ? ` at ${log.start_time}` : ""}
                      </p>
                      <p className="text-xs text-muted-olive mt-0.5">
                        {log.pet_name}
                        {log.walker_name ? ` \u00B7 Walker: ${log.walker_name}` : ""}
                        {log.duration_minutes ? ` \u00B7 ${log.duration_minutes} min` : ""}
                      </p>
                      {log.notes && (
                        <p className="text-xs text-muted-olive mt-1 italic">{log.notes}</p>
                      )}
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${LOG_STATUS_COLORS[log.status]}`}>
                      {log.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </AdminShell>
  );
}
