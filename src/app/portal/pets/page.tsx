"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase/client";
import { PortalShell } from "@/components/portal/portal-shell";
import { Dog, Plus, Pencil, Trash2, X, Check } from "lucide-react";
import type { Pet, PetInsert } from "@/lib/portal-helpers";

const PET_TYPES = ["Dog", "Cat", "Bird", "Rabbit", "Fish", "Reptile", "Other"];
const AGGRESSION_LEVELS = [
  { value: "none", label: "None" },
  { value: "mild", label: "Mild" },
  { value: "aggressive", label: "Aggressive" },
] as const;

type AggressionValue = "none" | "mild" | "aggressive";

interface PetForm {
  name: string;
  type: string;
  breed: string;
  age: string;
  weight: string;
  aggression_level: AggressionValue;
  spayed_neutered: boolean;
  vaccinations_current: boolean;
  special_notes: string;
}

const EMPTY_FORM: PetForm = {
  name: "",
  type: "Dog",
  breed: "",
  age: "",
  weight: "",
  aggression_level: "none",
  spayed_neutered: false,
  vaccinations_current: false,
  special_notes: "",
};

export default function PortalPetsPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const loadPets = useCallback(async (uid: string) => {
    const { data } = await supabase
      .from("pets")
      .select("*")
      .eq("user_id", uid)
      .order("created_at", { ascending: false });
    if (data) setPets(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) return;
      setUserId(session.user.id);
      loadPets(session.user.id);
    });
  }, [loadPets]);

  function openAdd() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
  }

  function openEdit(pet: Pet) {
    setForm({
      name: pet.name,
      type: pet.type,
      breed: pet.breed || "",
      age: pet.age || "",
      weight: pet.weight || "",
      aggression_level: pet.aggression_level as AggressionValue,
      spayed_neutered: pet.spayed_neutered,
      vaccinations_current: pet.vaccinations_current,
      special_notes: pet.special_notes || "",
    });
    setEditingId(pet.id);
    setShowForm(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) return;
    setSaving(true);

    if (editingId) {
      const { data } = await supabase
        .from("pets")
        .update({
          name: form.name,
          type: form.type,
          breed: form.breed || null,
          age: form.age || null,
          weight: form.weight || null,
          aggression_level: form.aggression_level,
          spayed_neutered: form.spayed_neutered,
          vaccinations_current: form.vaccinations_current,
          special_notes: form.special_notes || null,
        })
        .eq("id", editingId)
        .select()
        .single();

      if (data) {
        setPets((prev) => prev.map((p) => (p.id === editingId ? data : p)));
      }
    } else {
      const insert: PetInsert = {
        user_id: userId,
        name: form.name,
        type: form.type,
        breed: form.breed || null,
        age: form.age || null,
        weight: form.weight || null,
        aggression_level: form.aggression_level,
        spayed_neutered: form.spayed_neutered,
        vaccinations_current: form.vaccinations_current,
        special_notes: form.special_notes || null,
      };

      const { data } = await supabase.from("pets").insert(insert).select().single();
      if (data) setPets((prev) => [data, ...prev]);
    }

    setSaving(false);
    setShowForm(false);
    setEditingId(null);
  }

  async function handleDelete(id: string) {
    await supabase.from("pets").delete().eq("id", id);
    setPets((prev) => prev.filter((p) => p.id !== id));
    setDeleteConfirm(null);
  }

  const inputClass =
    "w-full px-3 py-2 rounded-lg border border-border-gray bg-warm-cream/50 text-dark-olive text-sm focus:outline-none focus:ring-2 focus:ring-sage-green";

  return (
    <PortalShell>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-dark-olive">My Pets</h1>
        <button
          onClick={openAdd}
          className="btn-hover flex items-center gap-1.5 bg-forest-green text-off-white px-4 py-2 rounded-full text-sm font-semibold"
        >
          <Plus className="h-4 w-4" />
          Add Pet
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="h-6 w-6 border-2 border-sage-green border-t-transparent rounded-full animate-spin" />
        </div>
      ) : pets.length === 0 && !showForm ? (
        <div className="card bg-off-white p-12 text-center">
          <Dog className="h-12 w-12 text-border-gray mx-auto mb-4" />
          <h2 className="font-heading text-lg font-bold text-dark-olive mb-2">No pets added</h2>
          <p className="text-sm text-muted-olive mb-4">
            Add your pets so we have their details on file.
          </p>
          <button
            onClick={openAdd}
            className="btn-hover inline-flex items-center gap-2 bg-forest-green text-off-white px-6 py-2.5 rounded-full text-sm font-semibold"
          >
            <Plus className="h-4 w-4" />
            Add Your First Pet
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Pet cards */}
          {pets.map((pet) => (
            <div key={pet.id} className="card bg-off-white p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-xl bg-sage-green/20 flex items-center justify-center shrink-0">
                    <Dog className="h-5 w-5 text-forest-green" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-dark-olive">{pet.name}</h3>
                    <p className="text-xs text-muted-olive">
                      {pet.type}
                      {pet.breed ? ` \u00B7 ${pet.breed}` : ""}
                      {pet.age ? ` \u00B7 ${pet.age}` : ""}
                      {pet.weight ? ` \u00B7 ${pet.weight}` : ""}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {pet.spayed_neutered && (
                        <span className="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700">
                          Spayed/Neutered
                        </span>
                      )}
                      {pet.vaccinations_current && (
                        <span className="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700">
                          Vaccinations Current
                        </span>
                      )}
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs ${
                          pet.aggression_level === "none"
                            ? "bg-green-100 text-green-700"
                            : pet.aggression_level === "mild"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        Aggression: {pet.aggression_level}
                      </span>
                    </div>
                    {pet.special_notes && (
                      <p className="text-xs text-muted-olive mt-2 italic">{pet.special_notes}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => openEdit(pet)}
                    className="p-1.5 text-muted-olive hover:text-forest-green rounded-lg hover:bg-sage-green/10"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  {deleteConfirm === pet.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDelete(pet.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Confirm delete"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="p-1.5 text-muted-olive hover:bg-sage-green/10 rounded-lg"
                        title="Cancel"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(pet.id)}
                      className="p-1.5 text-muted-olive hover:text-red-600 rounded-lg hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-dark-olive/50 z-50 flex items-center justify-center p-4">
          <div className="card bg-off-white p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto relative">
            <button
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
              }}
              className="absolute top-4 right-4 text-muted-olive hover:text-dark-olive"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="font-heading text-lg font-bold text-dark-olive mb-4">
              {editingId ? "Edit Pet" : "Add a Pet"}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark-olive mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    className={inputClass}
                    placeholder="Buddy"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-olive mb-1">
                    Type *
                  </label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className={inputClass}
                  >
                    {PET_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark-olive mb-1">Breed</label>
                  <input
                    type="text"
                    value={form.breed}
                    onChange={(e) => setForm({ ...form, breed: e.target.value })}
                    className={inputClass}
                    placeholder="Golden Retriever"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-olive mb-1">Age</label>
                  <input
                    type="text"
                    value={form.age}
                    onChange={(e) => setForm({ ...form, age: e.target.value })}
                    className={inputClass}
                    placeholder="3 years"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-olive mb-1">Weight</label>
                  <input
                    type="text"
                    value={form.weight}
                    onChange={(e) => setForm({ ...form, weight: e.target.value })}
                    className={inputClass}
                    placeholder="65 lbs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-olive mb-1">
                  Aggression Level
                </label>
                <div className="flex gap-2">
                  {AGGRESSION_LEVELS.map((level) => (
                    <button
                      key={level.value}
                      type="button"
                      onClick={() => setForm({ ...form, aggression_level: level.value })}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors border ${
                        form.aggression_level === level.value
                          ? level.value === "none"
                            ? "bg-green-100 border-green-300 text-green-700"
                            : level.value === "mild"
                              ? "bg-amber-100 border-amber-300 text-amber-700"
                              : "bg-red-100 border-red-300 text-red-700"
                          : "bg-warm-cream/50 border-border-gray text-muted-olive hover:border-sage-green"
                      }`}
                    >
                      {level.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.spayed_neutered}
                    onChange={(e) => setForm({ ...form, spayed_neutered: e.target.checked })}
                    className="h-4 w-4 rounded border-border-gray text-forest-green focus:ring-sage-green"
                  />
                  <span className="text-sm text-dark-olive">Spayed/Neutered</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.vaccinations_current}
                    onChange={(e) =>
                      setForm({ ...form, vaccinations_current: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-border-gray text-forest-green focus:ring-sage-green"
                  />
                  <span className="text-sm text-dark-olive">Vaccinations Current</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-olive mb-1">
                  Special Notes
                </label>
                <textarea
                  value={form.special_notes}
                  onChange={(e) => setForm({ ...form, special_notes: e.target.value })}
                  rows={3}
                  className={inputClass}
                  placeholder="Allergies, medications, behavioral notes..."
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="btn-hover w-full bg-forest-green text-off-white py-2.5 rounded-full font-semibold text-sm disabled:opacity-50"
              >
                {saving ? "Saving..." : editingId ? "Save Changes" : "Add Pet"}
              </button>
            </form>
          </div>
        </div>
      )}
    </PortalShell>
  );
}
