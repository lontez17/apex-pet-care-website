import { Syringe, ShieldCheck, FileCheck, Stethoscope, Scissors, ClipboardCheck } from "lucide-react";

const REQUIREMENTS = [
  {
    icon: Syringe,
    title: "Up-to-Date Vaccines",
    detail: "Rabies, DHPP, Bordetella",
  },
  {
    icon: ShieldCheck,
    title: "Flea & Tick Prevention",
    detail: "Current preventative required",
  },
  {
    icon: FileCheck,
    title: "Vet Records on File",
    detail: "Provided before first visit",
  },
  {
    icon: Stethoscope,
    title: "Health Information",
    detail: "Allergies, medications, conditions",
  },
  {
    icon: Scissors,
    title: "Spayed / Neutered",
    detail: "Required for group walks*",
  },
  {
    icon: ClipboardCheck,
    title: "Meet & Greet",
    detail: "Complimentary assessment visit",
  },
];

export function Requirements() {
  return (
    <section className="py-16 md:py-24 bg-gold/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-dark-olive">
            Keeping Your Pets Safe
          </h2>
          <p className="mt-3 text-muted-olive max-w-2xl mx-auto">
            Safety is our top priority. To ensure a happy and healthy experience
            for every pet, we ask that all clients meet these requirements.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {REQUIREMENTS.map((req) => (
            <div
              key={req.title}
              className="card bg-off-white p-5 text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-sage-green/15 flex items-center justify-center mx-auto mb-3">
                <req.icon className="h-6 w-6 text-forest-green" />
              </div>
              <h3 className="font-heading text-base font-bold text-dark-olive mb-1">
                {req.title}
              </h3>
              <p className="text-xs text-muted-olive">{req.detail}</p>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-muted-olive mt-6">
          * Special exceptions may apply with veterinary clearance. All pets
          must demonstrate appropriate behavior during the meet & greet.
        </p>
      </div>
    </section>
  );
}
