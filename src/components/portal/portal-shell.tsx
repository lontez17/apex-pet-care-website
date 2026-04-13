"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import type { Profile } from "@/lib/portal-helpers";
import {
  PawPrint,
  LayoutDashboard,
  CalendarDays,
  Dog,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/portal", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portal/bookings", label: "Bookings", icon: CalendarDays },
  { href: "/portal/pets", label: "My Pets", icon: Dog },
  { href: "/portal/billing", label: "Billing", icon: CreditCard },
  { href: "/portal/account", label: "Account", icon: Settings },
];

interface PortalShellProps {
  children: React.ReactNode;
}

export function PortalShell({ children }: PortalShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const loadProfile = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    if (data) setProfile(data);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace("/portal/login");
        return;
      }
      setUser(session.user);
      loadProfile(session.user.id);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.replace("/portal/login");
        return;
      }
      setUser(session.user);
      loadProfile(session.user.id);
    });

    return () => subscription.unsubscribe();
  }, [router, loadProfile]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/portal/login");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-cream">
        <PawPrint className="h-8 w-8 text-sage-green animate-pulse" />
      </div>
    );
  }

  const displayName = profile?.full_name || user?.email?.split("@")[0] || "User";

  return (
    <div className="min-h-screen flex bg-warm-cream">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-off-white border-r border-border-gray/30 fixed inset-y-0 left-0 z-30">
        <div className="p-4 border-b border-border-gray/30">
          <Link href="/">
            <Image
              src="/images/logo.png"
              alt="Apex Pet Care"
              width={600}
              height={200}
              className="h-16 w-auto object-contain"
            />
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? "bg-forest-green/10 text-forest-green"
                    : "text-muted-olive hover:text-dark-olive hover:bg-sage-green/10"
                }`}
              >
                <item.icon className="h-4.5 w-4.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border-gray/30">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-9 w-9 rounded-full bg-forest-green/15 flex items-center justify-center text-forest-green font-heading font-bold text-sm">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-dark-olive truncate">{displayName}</p>
              <p className="text-xs text-muted-olive truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 text-sm text-muted-olive hover:text-red-600 transition-colors w-full"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-off-white/95 backdrop-blur-sm border-b border-border-gray/30">
        <div className="flex items-center justify-between px-4 h-14">
          <Link href="/">
            <Image
              src="/images/logo.png"
              alt="Apex Pet Care"
              width={600}
              height={200}
              className="h-10 w-auto object-contain"
            />
          </Link>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-dark-olive"
            aria-label="Toggle menu"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-dark-olive/30"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="absolute top-0 left-0 bottom-0 w-64 bg-off-white shadow-xl">
            <div className="p-4 border-b border-border-gray/30 flex justify-between items-center">
              <Link href="/">
                <Image
                  src="/images/logo.png"
                  alt="Apex Pet Care"
                  width={600}
                  height={200}
                  className="h-12 w-auto object-contain"
                />
              </Link>
              <button onClick={() => setSidebarOpen(false)} className="p-1 text-muted-olive">
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="p-3 space-y-1">
              {NAV_ITEMS.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      active
                        ? "bg-forest-green/10 text-forest-green"
                        : "text-muted-olive hover:text-dark-olive hover:bg-sage-green/10"
                    }`}
                  >
                    <item.icon className="h-4.5 w-4.5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border-gray/30">
              <p className="text-sm font-medium text-dark-olive truncate mb-1">{displayName}</p>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 text-sm text-muted-olive hover:text-red-600"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 lg:ml-64 pt-14 lg:pt-0">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 lg:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
