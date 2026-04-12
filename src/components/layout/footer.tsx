import Link from "next/link";
import { PawPrint, Phone, Mail, MapPin, Globe, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-forest-green text-off-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <PawPrint className="h-7 w-7" />
              <span className="font-heading text-xl font-bold">
                Apex Pet Care
              </span>
            </div>
            <p className="text-off-white/80 text-sm leading-relaxed mb-4">
              Professional pet sitting and dog walking services. Your pets
              deserve the best care when you&apos;re away.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                aria-label="Instagram"
                className="p-2 rounded-full bg-off-white/10 hover:bg-off-white/20 transition-colors"
              >
                <Globe className="h-5 w-5" />
              </a>
              <a
                href="#"
                aria-label="Facebook"
                className="p-2 rounded-full bg-off-white/10 hover:bg-off-white/20 transition-colors"
              >
                <ExternalLink className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Service Area */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-4">
              Service Area
            </h4>
            <div className="space-y-3 text-sm text-off-white/80">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <p>
                  Serving the greater metro area
                  <br />
                  {/* TODO: Update with actual service area */}
                  Including surrounding neighborhoods
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0" />
                {/* TODO: Update with actual phone */}
                <p>(555) 123-4567</p>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0" />
                {/* TODO: Update with actual email */}
                <p>hello@apexpetcare.com</p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-off-white/80">
              <li>
                <Link href="/#services" className="hover:text-off-white transition-colors">
                  Our Services
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="hover:text-off-white transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/get-quote" className="hover:text-off-white transition-colors">
                  Get a Quote
                </Link>
              </li>
              <li>
                <Link href="/#about" className="hover:text-off-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="hover:text-off-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-off-white/20 text-center text-sm text-off-white/60">
          <p>&copy; {new Date().getFullYear()} Apex Pet Care. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
