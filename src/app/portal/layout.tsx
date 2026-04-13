import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Client Portal | Apex Pet Care",
  description: "Manage your bookings, pets, and account settings.",
};

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
