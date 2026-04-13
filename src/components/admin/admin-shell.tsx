"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import {
  PawPrint,
  LayoutDashboard,
  Users,
  CalendarDays,
  Package,
  ClipboardCheck,
  Calendar,
  Mail,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const ADMIN_NAV = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarDays },
  { href: "/admin/packs", label: "Walk Packs", icon: Package },
  { href: "/admin/service-log", label: "Service Log", icon: ClipboardCheck },
  { href: "/admin/schedule", label: "Schedule", icon: Calendar },
  { href: "/admin/contacts", label: "Contacts", icon: Mail },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

interface AdminShellProps {
  children: React.ReactNode;
}

export function AdminShell({ children }: AdminShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const checkAdmin = useCallback(async (email: string): Promise<boolean> => {
    const { data } = await supabase
      .from("admin_users")
      .select("id")
      .eq("email", email)
      .single();
    return !!data;
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) {
        router.replace("/admin/login");
        return;
      }
      const isAdmin = await checkAdmin(session.user.email || "");
      if (!isAdmin) {
        await supabase.auth.signOut();
        router.replace("/admin/login?error=not_admin");
        return;
      }
      setUser(session.user);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session) {
        router.replace("/admin/login");
        return;
      }
      const isAdmin = await checkAdmin(session.user.email || "");
      if (!isAdmin) {
        await supabase.auth.signOut();
        router.replace("/admin/login?error=not_admin");
        return;
      }
      setUser(session.user);
    });

    return () => subscription.unsubscribe();
  }, [router, checkAdmin]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-cream">
        <PawPrint className="h-8 w-8 text-sage-green animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-warm-cream">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-dark-charcoal fixed inset-y-0 left-0 z-30">
        <div className="p-4 border-b border-white/10">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/logo.png"
              alt="Apex Pet Care"
              width={600}
              height={200}
              className="h-14 w-auto object-contain brightness-0 invert"
            />
          </Link>
          <p className="text-xs text-white/40 mt-1 pl-1">Admin Portal</p>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {ADMIN_NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? "bg-white/10 text-white"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <p className="text-xs text-white/60 truncate mb-2">{user?.email}</p>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 text-sm text-white/40 hover:text-red-400 transition-colors w-full"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-dark-charcoal">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2">
            <Link href="/">
              <Image
                src="/images/logo.png"
                alt="Apex Pet Care"
                width={600}
                height={200}
                className="h-10 w-auto object-contain brightness-0 invert"
              />
            </Link>
            <span className="text-xs text-white/40">Admin</span>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-white/70"
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
            className="absolute inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="absolute top-0 left-0 bottom-0 w-64 bg-dark-charcoal shadow-xl">
            <div className="p-4 border-b border-white/10 flex justify-between items-center">
              <span className="text-sm font-medium text-white/80">Admin Portal</span>
              <button onClick={() => setSidebarOpen(false)} className="p-1 text-white/50">
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="p-3 space-y-1">
              {ADMIN_NAV.map((item) => {
                const active = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      active
                        ? "bg-white/10 text-white"
                        : "text-white/50 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
              <p className="text-xs text-white/50 truncate mb-2">{user?.email}</p>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 text-sm text-white/40 hover:text-red-400"
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 lg:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
