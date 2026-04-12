"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, PawPrint } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/#services", label: "Services" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
  { href: "/get-quote", label: "Get a Quote" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-light-sage/95 backdrop-blur-sm border-b border-sage-green/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <PawPrint className="h-8 w-8 text-forest-green group-hover:scale-110 transition-transform" />
            <span className="font-heading text-xl font-bold text-dark-olive">
              Apex Pet Care
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-dark-olive/80 hover:text-forest-green transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/get-quote"
              className="btn-hover bg-forest-green text-off-white px-5 py-2 rounded-full text-sm font-semibold"
            >
              Book Now
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-dark-olive"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {isOpen && (
        <div className="md:hidden bg-light-sage border-t border-sage-green/20">
          <div className="px-4 py-3 space-y-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block py-2 text-sm font-medium text-dark-olive/80 hover:text-forest-green"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/get-quote"
              onClick={() => setIsOpen(false)}
              className="block w-full text-center btn-hover bg-forest-green text-off-white px-5 py-2.5 rounded-full text-sm font-semibold mt-2"
            >
              Book Now
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
