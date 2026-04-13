"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { PortalShell } from "@/components/portal/portal-shell";
import { User, Lock, CheckCircle } from "lucide-react";
import type { Profile, ProfileUpdate } from "@/lib/portal-helpers";

export default function PortalAccountPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Profile form
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  // Password form
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (data) {
        setProfile(data);
        setFullName(data.full_name);
        setPhone(data.phone || "");
      }
      setLoading(false);
    }
    load();
  }, []);

  async function handleProfileSave(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) return;
    setSavingProfile(true);
    setProfileSaved(false);

    const updates: ProfileUpdate = {
      full_name: fullName,
      phone: phone || null,
    };

    const { data } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", profile.id)
      .select()
      .single();

    if (data) {
      setProfile(data);
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    }
    setSavingProfile(false);
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setPasswordError("");
    setPasswordSaved(false);

    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    setSavingPassword(true);

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setPasswordError(error.message);
    } else {
      setPasswordSaved(true);
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordSaved(false), 3000);
    }
    setSavingPassword(false);
  }

  const inputClass =
    "w-full px-4 py-2.5 rounded-lg border border-border-gray bg-warm-cream/50 text-dark-olive text-sm focus:outline-none focus:ring-2 focus:ring-sage-green";

  return (
    <PortalShell>
      <h1 className="font-heading text-2xl md:text-3xl font-bold text-dark-olive mb-6">
        Account Settings
      </h1>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="h-6 w-6 border-2 border-sage-green border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Profile info */}
          <div className="card bg-off-white p-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-forest-green" />
              <h2 className="font-heading text-lg font-bold text-dark-olive">
                Profile Information
              </h2>
            </div>

            <form onSubmit={handleProfileSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark-olive mb-1">Email</label>
                <input
                  type="email"
                  value={profile?.email || ""}
                  disabled
                  className={`${inputClass} opacity-60 cursor-not-allowed`}
                />
                <p className="text-xs text-muted-olive mt-1">
                  Contact us to change your email address.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark-olive mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-olive mb-1">Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={inputClass}
                    placeholder="(763) 555-0100"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="btn-hover bg-forest-green text-off-white px-6 py-2 rounded-full text-sm font-semibold disabled:opacity-50"
                >
                  {savingProfile ? "Saving..." : "Save Changes"}
                </button>
                {profileSaved && (
                  <span className="flex items-center gap-1 text-sm text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    Saved
                  </span>
                )}
              </div>
            </form>
          </div>

          {/* Change password */}
          <div className="card bg-off-white p-6">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="h-5 w-5 text-forest-green" />
              <h2 className="font-heading text-lg font-bold text-dark-olive">Change Password</h2>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              {passwordError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
                  {passwordError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark-olive mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={8}
                    className={inputClass}
                    placeholder="Min. 8 characters"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-olive mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className={inputClass}
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={savingPassword}
                  className="btn-hover bg-forest-green text-off-white px-6 py-2 rounded-full text-sm font-semibold disabled:opacity-50"
                >
                  {savingPassword ? "Updating..." : "Update Password"}
                </button>
                {passwordSaved && (
                  <span className="flex items-center gap-1 text-sm text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    Password updated
                  </span>
                )}
              </div>
            </form>
          </div>

          {/* Account info */}
          <div className="card bg-sage-green/10 border-sage-green/20 p-5">
            <p className="text-sm text-dark-olive">
              <span className="font-medium">Member since:</span>{" "}
              {profile ? new Date(profile.created_at).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              }) : ""}
            </p>
          </div>
        </div>
      )}
    </PortalShell>
  );
}
