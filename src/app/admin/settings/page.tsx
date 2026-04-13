"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { AdminShell } from "@/components/admin/admin-shell";
import { Settings, Plus, Trash2, Shield } from "lucide-react";
import type { AdminUser } from "@/lib/admin-helpers";
import { formatDate } from "@/lib/admin-helpers";

export default function AdminSettingsPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState<"admin" | "owner" | "walker">("admin");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("admin_users").select("*").order("created_at");
      if (data) setAdmins(data);
      setLoading(false);
    }
    load();
  }, []);

  async function addAdmin(e: React.FormEvent) {
    e.preventDefault();
    setAdding(true);

    const { data, error } = await supabase
      .from("admin_users")
      .insert({ email: newEmail, name: newName || null, role: newRole })
      .select()
      .single();

    if (error) {
      alert(`Error: ${error.message}`);
    } else if (data) {
      setAdmins((prev) => [...prev, data]);
      setNewEmail("");
      setNewName("");
      setNewRole("admin");
    }
    setAdding(false);
  }

  async function removeAdmin(id: string) {
    if (!confirm("Remove this admin user?")) return;
    await supabase.from("admin_users").delete().eq("id", id);
    setAdmins((prev) => prev.filter((a) => a.id !== id));
  }

  const ROLE_COLORS: Record<string, string> = {
    owner: "bg-amber-100 text-amber-700",
    admin: "bg-forest-green/10 text-forest-green",
    walker: "bg-sage-green/20 text-dark-olive",
  };

  return (
    <AdminShell>
      <h1 className="font-heading text-2xl md:text-3xl font-bold text-dark-olive mb-6">Settings</h1>

      {/* Admin Users */}
      <div className="card bg-off-white p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-5 w-5 text-forest-green" />
          <h2 className="font-heading text-lg font-bold text-dark-olive">Admin Users</h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="h-6 w-6 border-2 border-sage-green border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-3 mb-6">
            {admins.map((admin) => (
              <div key={admin.id} className="flex items-center justify-between py-3 border-b border-border-gray/20 last:border-0">
                <div>
                  <p className="text-sm font-medium text-dark-olive">
                    {admin.name || admin.email}
                  </p>
                  <p className="text-xs text-muted-olive">{admin.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ROLE_COLORS[admin.role]}`}>
                    {admin.role}
                  </span>
                  <button
                    onClick={() => removeAdmin(admin.id)}
                    className="p-1 text-muted-olive hover:text-red-600 rounded hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
            {admins.length === 0 && (
              <p className="text-sm text-muted-olive py-4 text-center">No admin users configured</p>
            )}
          </div>
        )}

        <form onSubmit={addAdmin} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            required
            placeholder="Email address"
            className="flex-1 px-3 py-2 rounded-lg border border-border-gray bg-warm-cream/50 text-dark-olive text-sm focus:outline-none focus:ring-2 focus:ring-sage-green"
          />
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Name (optional)"
            className="sm:w-40 px-3 py-2 rounded-lg border border-border-gray bg-warm-cream/50 text-dark-olive text-sm focus:outline-none focus:ring-2 focus:ring-sage-green"
          />
          <select
            value={newRole}
            onChange={(e) => setNewRole(e.target.value as "admin" | "owner" | "walker")}
            className="sm:w-28 px-3 py-2 rounded-lg border border-border-gray bg-warm-cream/50 text-dark-olive text-sm focus:outline-none focus:ring-2 focus:ring-sage-green"
          >
            <option value="admin">Admin</option>
            <option value="owner">Owner</option>
            <option value="walker">Walker</option>
          </select>
          <button
            type="submit"
            disabled={adding || !newEmail}
            className="btn-hover flex items-center gap-1.5 bg-forest-green text-off-white px-4 py-2 rounded-full text-sm font-semibold disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            Add
          </button>
        </form>
      </div>

      {/* Business info */}
      <div className="card bg-off-white p-6">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="h-5 w-5 text-forest-green" />
          <h2 className="font-heading text-lg font-bold text-dark-olive">Business Info</h2>
        </div>
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-olive">Business</dt>
            <dd className="font-medium text-dark-olive">Apex Pet Care LLC</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-olive">Phone</dt>
            <dd className="font-medium text-dark-olive">(763) 656-3042</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-olive">Email</dt>
            <dd className="font-medium text-dark-olive">swinter@apexpetcarellc.com</dd>
          </div>
        </dl>
      </div>
    </AdminShell>
  );
}
