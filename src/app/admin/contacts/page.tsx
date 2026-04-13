"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { AdminShell } from "@/components/admin/admin-shell";
import { Mail, Check, Search } from "lucide-react";
import { formatDate } from "@/lib/admin-helpers";

interface Contact {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  responded: boolean;
  admin_notes: string | null;
}

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "new" | "responded">("all");
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [notesValue, setNotesValue] = useState("");

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) setContacts(data as Contact[]);
      setLoading(false);
    }
    load();
  }, []);

  async function markResponded(id: string) {
    await supabase.from("contact_submissions").update({ responded: true }).eq("id", id);
    setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, responded: true } : c)));
  }

  async function saveNotes(id: string) {
    await supabase.from("contact_submissions").update({ admin_notes: notesValue || null }).eq("id", id);
    setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, admin_notes: notesValue || null } : c)));
    setEditingNotes(null);
  }

  const filtered = contacts.filter((c) => {
    if (filter === "new") return !c.responded;
    if (filter === "responded") return c.responded;
    return true;
  });

  const newCount = contacts.filter((c) => !c.responded).length;

  return (
    <AdminShell>
      <h1 className="font-heading text-2xl md:text-3xl font-bold text-dark-olive mb-6">
        Contacts
        {newCount > 0 && (
          <span className="ml-2 text-sm font-normal bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
            {newCount} new
          </span>
        )}
      </h1>

      <div className="flex gap-2 mb-6">
        {(["all", "new", "responded"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === f ? "bg-forest-green text-off-white" : "bg-off-white text-muted-olive hover:bg-sage-green/20"
            }`}
          >
            {f === "all" ? `All (${contacts.length})` : f === "new" ? `New (${newCount})` : `Responded (${contacts.length - newCount})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="h-6 w-6 border-2 border-sage-green border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card bg-off-white p-12 text-center">
          <Mail className="h-12 w-12 text-border-gray mx-auto mb-4" />
          <p className="text-sm text-muted-olive">No contacts found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((c) => (
            <div key={c.id} className={`card bg-off-white p-5 ${c.responded ? "opacity-70" : ""}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-dark-olive text-sm">{c.name}</p>
                    {!c.responded && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">New</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-olive">{c.email} {c.phone ? `| ${c.phone}` : ""}</p>
                  <p className="text-sm text-dark-olive mt-2">{c.message}</p>
                  <p className="text-xs text-muted-olive mt-2">{formatDate(c.created_at)}</p>

                  {/* Admin notes */}
                  {editingNotes === c.id ? (
                    <div className="mt-3 flex gap-2">
                      <input
                        type="text"
                        value={notesValue}
                        onChange={(e) => setNotesValue(e.target.value)}
                        placeholder="Admin notes..."
                        className="flex-1 px-3 py-1.5 rounded-lg border border-border-gray bg-warm-cream/50 text-dark-olive text-xs focus:outline-none focus:ring-2 focus:ring-sage-green"
                        autoFocus
                      />
                      <button onClick={() => saveNotes(c.id)} className="text-xs bg-forest-green text-white px-3 py-1.5 rounded-lg">Save</button>
                      <button onClick={() => setEditingNotes(null)} className="text-xs text-muted-olive">Cancel</button>
                    </div>
                  ) : c.admin_notes ? (
                    <p
                      className="text-xs text-forest-green mt-2 cursor-pointer hover:underline"
                      onClick={() => { setEditingNotes(c.id); setNotesValue(c.admin_notes || ""); }}
                    >
                      Note: {c.admin_notes}
                    </p>
                  ) : (
                    <button
                      onClick={() => { setEditingNotes(c.id); setNotesValue(""); }}
                      className="text-xs text-muted-olive mt-2 hover:text-forest-green"
                    >
                      + Add note
                    </button>
                  )}
                </div>
                {!c.responded && (
                  <button
                    onClick={() => markResponded(c.id)}
                    className="btn-hover flex items-center gap-1 text-xs text-forest-green bg-forest-green/10 px-3 py-1.5 rounded-full font-medium shrink-0"
                  >
                    <Check className="h-3 w-3" /> Responded
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
