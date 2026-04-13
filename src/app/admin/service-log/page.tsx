"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { AdminShell } from "@/components/admin/admin-shell";
import { ClipboardCheck, Plus } from "lucide-react";
import type { ServicePack, ServiceLog } from "@/lib/admin-helpers";
import { LOG_STATUS_COLORS, formatDate } from "@/lib/admin-helpers";

export default function AdminServiceLogPage() {
  const [packs, setPacks] = useState<ServicePack[]>([]);
  const [logs, setLogs] = useState<ServiceLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");

  // Form state
  const [selectedPackId, setSelectedPackId] = useState("");
  const [petName, setPetName] = useState("");
  const [serviceDate, setServiceDate] = useState(new Date().toISOString().split("T")[0]);
  const [startTime, setStartTime] = useState("");
  const [walkerName, setWalkerName] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    async function load() {
      const [packsRes, logsRes] = await Promise.all([
        supabase
          .from("service_packs")
          .select("*")
          .eq("status", "active")
          .order("customer_name"),
        supabase
          .from("service_logs")
          .select("*")
          .order("service_date", { ascending: false })
          .limit(50),
      ]);
      if (packsRes.data) setPacks(packsRes.data);
      if (logsRes.data) setLogs(logsRes.data);
      setLoading(false);
    }
    load();
  }, []);

  const selectedPack = packs.find((p) => p.id === selectedPackId);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedPack) return;
    setSaving(true);
    setSuccess("");

    const { data: { session } } = await supabase.auth.getSession();
    const adminEmail = session?.user?.email || "admin";

    // Call the atomic DB function
    const { data, error } = await supabase.rpc("log_service_and_deduct", {
      p_pack_id: selectedPack.id,
      p_user_id: selectedPack.user_id,
      p_pet_name: petName,
      p_service_date: serviceDate,
      p_start_time: startTime || null,
      p_duration: selectedPack.unit_duration_minutes,
      p_walker: walkerName || null,
      p_notes: notes || null,
      p_logged_by: adminEmail,
    });

    if (error) {
      alert(`Error: ${error.message}`);
      setSaving(false);
      return;
    }

    // Refresh data
    const [packsRes, logsRes] = await Promise.all([
      supabase.from("service_packs").select("*").eq("status", "active").order("customer_name"),
      supabase.from("service_logs").select("*").order("service_date", { ascending: false }).limit(50),
    ]);
    if (packsRes.data) setPacks(packsRes.data);
    if (logsRes.data) setLogs(logsRes.data);

    // Reset form
    setSelectedPackId("");
    setPetName("");
    setStartTime("");
    setWalkerName("");
    setNotes("");
    setSuccess(`Logged! ${selectedPack.customer_name} now has ${selectedPack.remaining_sessions - 1} sessions left.`);
    setSaving(false);
    setTimeout(() => setSuccess(""), 5000);
  }

  const inputClass =
    "w-full px-3 py-2 rounded-lg border border-border-gray bg-warm-cream/50 text-dark-olive text-sm focus:outline-none focus:ring-2 focus:ring-sage-green";

  return (
    <AdminShell>
      <h1 className="font-heading text-2xl md:text-3xl font-bold text-dark-olive mb-6">
        Service Log
      </h1>

      {/* Log form */}
      <div className="card bg-off-white p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Plus className="h-5 w-5 text-forest-green" />
          <h2 className="font-heading text-lg font-bold text-dark-olive">Log a Completed Service</h2>
        </div>

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg p-3 mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-olive mb-1">
                Select Pack *
              </label>
              <select
                value={selectedPackId}
                onChange={(e) => setSelectedPackId(e.target.value)}
                required
                className={inputClass}
              >
                <option value="">Choose a pack...</option>
                {packs.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.customer_name}, {p.pack_label} ({p.remaining_sessions} left)
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-olive mb-1">
                Pet Name *
              </label>
              <input
                type="text"
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
                required
                className={inputClass}
                placeholder="Buddy"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-olive mb-1">
                Date *
              </label>
              <input
                type="date"
                value={serviceDate}
                onChange={(e) => setServiceDate(e.target.value)}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-olive mb-1">
                Start Time
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-olive mb-1">
                Walker/Staff
              </label>
              <input
                type="text"
                value={walkerName}
                onChange={(e) => setWalkerName(e.target.value)}
                className={inputClass}
                placeholder="Staff name"
              />
            </div>
          </div>

          {selectedPack && (
            <div className="bg-sage-green/10 rounded-lg p-3 text-sm">
              <span className="font-medium text-dark-olive">{selectedPack.pack_label}</span>
              <span className="text-muted-olive">, </span>
              <span className="font-bold text-forest-green">{selectedPack.remaining_sessions}</span>
              <span className="text-muted-olive"> sessions remaining</span>
              {selectedPack.unit_duration_minutes && (
                <span className="text-muted-olive"> ({selectedPack.unit_duration_minutes} min each)</span>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-dark-olive mb-1">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className={inputClass}
              placeholder="Walk notes, behavior observations..."
            />
          </div>

          <button
            type="submit"
            disabled={saving || !selectedPackId || !petName}
            className="btn-hover bg-forest-green text-off-white px-6 py-2.5 rounded-full font-semibold text-sm disabled:opacity-50"
          >
            {saving ? "Logging..." : "Log Service & Deduct"}
          </button>
        </form>
      </div>

      {/* Recent logs */}
      <h2 className="font-heading text-lg font-bold text-dark-olive mb-3">Recent Service Logs</h2>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="h-6 w-6 border-2 border-sage-green border-t-transparent rounded-full animate-spin" />
        </div>
      ) : logs.length === 0 ? (
        <div className="card bg-off-white p-8 text-center">
          <ClipboardCheck className="h-10 w-10 text-border-gray mx-auto mb-3" />
          <p className="text-sm text-muted-olive">No service logs yet</p>
        </div>
      ) : (
        <div className="card bg-off-white overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-gray/30">
                <th className="text-left p-4 text-xs font-medium text-muted-olive uppercase">Date</th>
                <th className="text-left p-4 text-xs font-medium text-muted-olive uppercase">Pet</th>
                <th className="text-left p-4 text-xs font-medium text-muted-olive uppercase">Service</th>
                <th className="text-left p-4 text-xs font-medium text-muted-olive uppercase">Duration</th>
                <th className="text-left p-4 text-xs font-medium text-muted-olive uppercase">Walker</th>
                <th className="text-left p-4 text-xs font-medium text-muted-olive uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b border-border-gray/20 last:border-0">
                  <td className="p-4 text-dark-olive">{formatDate(log.service_date)}</td>
                  <td className="p-4 font-medium text-dark-olive">{log.pet_name}</td>
                  <td className="p-4 text-dark-olive capitalize">{log.service_type.replace("_", " ")}</td>
                  <td className="p-4 text-muted-olive">{log.duration_minutes ? `${log.duration_minutes} min` : "-"}</td>
                  <td className="p-4 text-muted-olive">{log.walker_name || "-"}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${LOG_STATUS_COLORS[log.status] || ""}`}>
                      {log.status}
                    </span>
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
