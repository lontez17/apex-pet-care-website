"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase/client";
import { PawPrint, Shield } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [magicSent, setMagicSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  const urlError = searchParams.get("error");

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        const { data } = await supabase
          .from("admin_users")
          .select("id")
          .eq("email", session.user.email || "")
          .single();
        if (data) {
          router.replace("/admin/dashboard");
          return;
        }
      }
      setCheckingSession(false);
    });
  }, [router]);

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/admin/dashboard` },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    setMagicSent(true);
    setLoading(false);
  }

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-charcoal">
        <PawPrint className="h-8 w-8 text-sage-green animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-charcoal px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <Link href="/">
            <Image
              src="/images/logo.png"
              alt="Apex Pet Care"
              width={600}
              height={200}
              className="h-24 w-auto object-contain mx-auto brightness-0 invert"
            />
          </Link>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Shield className="h-5 w-5 text-sage-green" />
            <h1 className="font-heading text-xl font-bold text-white">Admin Login</h1>
          </div>
          <p className="text-sm text-white/50 text-center mb-6">
            Enter your email to receive a login link
          </p>

          {urlError === "not_admin" && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-300 text-sm rounded-lg p-3 mb-4">
              This email is not authorized for admin access.
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-300 text-sm rounded-lg p-3 mb-4">
              {error}
            </div>
          )}

          {magicSent ? (
            <div className="text-center">
              <div className="bg-green-500/10 border border-green-500/20 text-green-300 text-sm rounded-lg p-4">
                Check your email for a login link!
              </div>
              <button
                onClick={() => setMagicSent(false)}
                className="text-sm text-white/40 hover:text-white/60 mt-4"
              >
                Send again
              </button>
            </div>
          ) : (
            <form onSubmit={handleMagicLink} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white/70 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-white/10 bg-white/5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-sage-green placeholder:text-white/30"
                  placeholder="admin@apexpetcarellc.com"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !email}
                className="w-full bg-forest-green text-white py-2.5 rounded-full font-semibold text-sm disabled:opacity-50 hover:brightness-110 transition"
              >
                {loading ? "Sending..." : "Send Magic Link"}
              </button>
            </form>
          )}
        </div>

        <p className="text-xs text-white/30 text-center mt-4">
          <Link href="/" className="hover:text-white/50">
            &larr; Back to website
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-dark-charcoal">
          <PawPrint className="h-8 w-8 text-sage-green animate-pulse" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
