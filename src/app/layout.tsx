import type { Metadata } from "next";
import { Nunito, Fredoka } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  display: "swap",
});

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Apex Pet Care | Pet Sitting & Dog Walking",
  description:
    "Professional pet sitting and dog walking services. Your pets deserve the best care when you're away. Book online today!",
  openGraph: {
    title: "Apex Pet Care | Pet Sitting & Dog Walking",
    description:
      "Professional pet sitting and dog walking services. Your pets deserve the best care when you're away.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${nunito.variable} ${fredoka.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-body">{children}</body>
    </html>
  );
}
