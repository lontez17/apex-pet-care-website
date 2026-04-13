"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { PawPrint } from "lucide-react";

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace("/admin/dashboard");
      } else {
        router.replace("/admin/login");
      }
    });
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-charcoal">
      <PawPrint className="h-8 w-8 text-sage-green animate-pulse" />
    </div>
  );
}
