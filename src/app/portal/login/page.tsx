"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase/client";
import { PawPrint, Eye, EyeOff } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace("/portal");
      } else {
        setCheckingSession(false);
      }
    });
  }, [router]);

  const urlError = searchParams.get("error");
  const registered = searchParams.get("registered");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push("/portal");
  }

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-cream">
        <PawPrint className="h-8 w-8 text-sage-green animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-warm-cream px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <Link href="/">
            <Image
              src="/images/logo.png"
              alt="Apex Pet Care"
              width={600}
              height={200}
              className="h-28 w-auto object-contain mx-auto"
            />
          </Link>
        </div>

        <div className="card bg-off-white p-8">
          <h1 className="font-heading text-2xl font-bold text-dark-olive text-center mb-1">
            Welcome Back
          </h1>
          <p className="text-sm text-muted-olive text-center mb-6">
            Sign in to your client portal
          </p>

          {registered && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg p-3 mb-4">
              Account created! Please sign in.
            </div>
          )}

          {(error || urlError) && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-4">
              {error || "Invalid or expired link. Please try again."}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-dark-olive mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-border-gray bg-warm-cream/50 text-dark-olive text-sm focus:outline-none focus:ring-2 focus:ring-sage-green"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-dark-olive mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-border-gray bg-warm-cream/50 text-dark-olive text-sm focus:outline-none focus:ring-2 focus:ring-sage-green pr-10"
                  placeholder="Your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-olive hover:text-dark-olive"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-hover w-full bg-forest-green text-off-white py-2.5 rounded-full font-semibold text-sm disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-sm text-muted-olive text-center mt-5">
            Don&apos;t have an account?{" "}
            <Link href="/portal/signup" className="text-forest-green font-medium hover:underline">
              Create one
            </Link>
          </p>
        </div>

        <p className="text-xs text-muted-olive text-center mt-4">
          <Link href="/" className="hover:text-forest-green">
            &larr; Back to website
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function PortalLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-warm-cream">
          <PawPrint className="h-8 w-8 text-sage-green animate-pulse" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
