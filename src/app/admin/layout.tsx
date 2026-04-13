import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Portal | Apex Pet Care",
  description: "Manage customers, bookings, and services.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
