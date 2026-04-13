"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { AdminShell } from "@/components/admin/admin-shell";
import { Users, Search, Eye } from "lucide-react";
import type { Profile } from "@/lib/admin-helpers";
import { formatDate } from "@/lib/admin-helpers";

interface CustomerRow extends Profile {
  pet_count?: number;
  booking_count?: number;
  pack_count?: number;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (!profiles) { setLoading(false); return; }

      const enriched: CustomerRow[] = await Promise.all(
        profiles.map(async (p) => {
          const [petsRes, bookingsRes, packsRes] = await Promise.all([
            supabase.from("pets").select("id", { count: "exact", head: true }).eq("user_id", p.id),
            supabase.from("bookings").select("id", { count: "exact", head: true }).eq("user_id", p.id),
            supabase.from("service_packs").select("id", { count: "exact", head: true }).eq("user_id", p.id).eq("status", "active"),
          ]);
          return {
            ...p,
            pet_count: petsRes.count ?? 0,
            booking_count: bookingsRes.count ?? 0,
            pack_count: packsRes.count ?? 0,
          };
        })
      );

      setCustomers(enriched);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = search
    ? customers.filter((c) => {
        const q = search.toLowerCase();
        return c.full_name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || (c.phone || "").includes(q);
      })
    : customers;

  return (
    <AdminShell>
      <h1 className="font-heading text-2xl md:text-3xl font-bold text-dark-olive mb-6">Customers</h1>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-olive" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, or phone..."
          className="w-full pl-9 pr-4 py-2 rounded-lg border border-border-gray bg-off-white text-dark-olive text-sm focus:outline-none focus:ring-2 focus:ring-sage-green"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="h-6 w-6 border-2 border-sage-green border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card bg-off-white p-12 text-center">
          <Users className="h-12 w-12 text-border-gray mx-auto mb-4" />
          <p className="text-sm text-muted-olive">
            {search ? "No customers match your search." : "No customers registered yet."}
          </p>
        </div>
      ) : (
        <div className="card bg-off-white overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-gray/30">
                <th className="text-left p-4 text-xs font-medium text-muted-olive uppercase">Customer</th>
                <th className="text-left p-4 text-xs font-medium text-muted-olive uppercase">Phone</th>
                <th className="text-left p-4 text-xs font-medium text-muted-olive uppercase">Pets</th>
                <th className="text-left p-4 text-xs font-medium text-muted-olive uppercase">Bookings</th>
                <th className="text-left p-4 text-xs font-medium text-muted-olive uppercase">Active Packs</th>
                <th className="text-left p-4 text-xs font-medium text-muted-olive uppercase">Joined</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-b border-border-gray/20 last:border-0 hover:bg-sage-green/5">
                  <td className="p-4">
                    <p className="font-medium text-dark-olive">{c.full_name}</p>
                    <p className="text-xs text-muted-olive">{c.email}</p>
                  </td>
                  <td className="p-4 text-muted-olive">{c.phone || "-"}</td>
                  <td className="p-4 text-dark-olive">{c.pet_count}</td>
                  <td className="p-4 text-dark-olive">{c.booking_count}</td>
                  <td className="p-4">
                    {(c.pack_count ?? 0) > 0 ? (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        {c.pack_count}
                      </span>
                    ) : (
                      <span className="text-muted-olive">0</span>
                    )}
                  </td>
                  <td className="p-4 text-muted-olive">{formatDate(c.created_at)}</td>
                  <td className="p-4">
                    <Link href={`/admin/customers/${c.id}`} className="text-muted-olive hover:text-forest-green">
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
