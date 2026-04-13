import { Phone } from "lucide-react";

export function FloatingPhone() {
  return (
    <a
      href="tel:+17636563042"
      aria-label="Call Apex Pet Care"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 hover:bg-green-600 hover:scale-110 hover:shadow-xl hover:shadow-green-500/40 transition-all duration-200"
    >
      <Phone className="h-6 w-6" />
    </a>
  );
}
