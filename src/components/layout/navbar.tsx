"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronDown, UserCircle } from "lucide-react";

const SERVICE_LINKS = [
  { href: "/services/dog-walking", label: "Dog Walking" },
  { href: "/services/drop-in-visits", label: "Drop-In Visits" },
  { href: "/services/boarding", label: "Boarding" },
  { href: "/services/daycare", label: "Daycare" },
  { href: "/services/house-sitting", label: "House Sitting" },
  { href: "/services/transportation", label: "Transportation" },
];

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/testimonials", label: "Reviews" },
  { href: "/gallery", label: "Gallery" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-warm-cream/95 backdrop-blur-sm border-b border-sage-green/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-36">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <Image
              src="/images/logo.png"
              alt="Apex Pet Care"
              width={600}
              height={200}
              className="h-52 w-auto object-contain group-hover:scale-105 transition-transform"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-dark-olive/80 hover:text-forest-green transition-colors"
            >
              Home
            </Link>

            {/* Services dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button className="flex items-center gap-1 text-sm font-medium text-dark-olive/80 hover:text-forest-green transition-colors">
                Services
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${servicesOpen ? "rotate-180" : ""}`} />
              </button>
              {servicesOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2">
                  <div className="bg-off-white rounded-2xl shadow-lg border border-sage-green/20 py-2 w-52">
                    {SERVICE_LINKS.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="block px-4 py-2 text-sm text-dark-olive/80 hover:text-forest-green hover:bg-sage-green/10 transition-colors"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {NAV_LINKS.filter((l) => l.href !== "/").map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-dark-olive/80 hover:text-forest-green transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col items-center gap-1">
              <Link
                href="/portal"
                className="text-dark-olive/70 hover:text-forest-green transition-colors"
                aria-label="My Account"
              >
                <UserCircle className="h-6 w-6" />
              </Link>
              <Link
                href="/get-quote"
                className="btn-hover bg-forest-green text-off-white px-5 py-2 rounded-full text-sm font-semibold"
              >
                Book Now
              </Link>
            </div>
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
        <div className="md:hidden bg-warm-cream border-t border-sage-green/15">
          <div className="px-4 py-3 space-y-1">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="block py-2 text-sm font-medium text-dark-olive/80 hover:text-forest-green"
            >
              Home
            </Link>

            {/* Mobile services accordion */}
            <div>
              <button
                onClick={() => setServicesOpen(!servicesOpen)}
                className="flex items-center justify-between w-full py-2 text-sm font-medium text-dark-olive/80 hover:text-forest-green"
              >
                Services
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${servicesOpen ? "rotate-180" : ""}`} />
              </button>
              {servicesOpen && (
                <div className="pl-4 space-y-1">
                  {SERVICE_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="block py-1.5 text-sm text-muted-olive hover:text-forest-green"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {NAV_LINKS.filter((l) => l.href !== "/").map((link) => (
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
