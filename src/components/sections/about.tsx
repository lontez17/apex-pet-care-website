import { Shield, Award, Clock, Users } from "lucide-react";

const STATS = [
  { icon: Shield, label: "Insured & Bonded", value: "Fully" },
  { icon: Award, label: "Years Experience", value: "5+" },
  { icon: Clock, label: "Availability", value: "7 Days" },
  { icon: Users, label: "Happy Clients", value: "500+" },
];

export function About() {
  return (
    <section id="about" className="py-16 md:py-24 bg-sage-green/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image side */}
          <div className="relative">
            <div
              className="aspect-[4/3] rounded-3xl bg-cover bg-center"
              style={{
                backgroundImage:
                  "url(https://images.unsplash.com/photo-1601758174493-b8236e67c3b4?w=800&h=600&fit=crop)",
              }}
            />
            <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-2xl bg-forest-green flex items-center justify-center text-off-white">
              <div className="text-center">
                <p className="font-heading text-3xl font-bold">5+</p>
                <p className="text-xs">Years of Love</p>
              </div>
            </div>
          </div>

          {/* Text side */}
          <div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-dark-olive mb-4">
              Why Pet Parents Trust Us
            </h2>
            <p className="text-muted-olive mb-6 leading-relaxed">
              At Apex Pet Care, we treat every pet like family. Founded by animal
              lovers who understand the anxiety of leaving your furry friends
              behind, we&apos;ve built our business on trust, reliability, and
              genuine love for animals.
            </p>
            <p className="text-muted-olive mb-8 leading-relaxed">
              Every team member is background-checked, pet first aid certified,
              and trained to handle pets of all temperaments. We send real-time
              updates so you always know your pet is safe and happy.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="card bg-off-white p-4 flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-sage-green/15 flex items-center justify-center shrink-0">
                    <stat.icon className="h-5 w-5 text-forest-green" />
                  </div>
                  <div>
                    <p className="font-heading font-bold text-dark-olive">
                      {stat.value}
                    </p>
                    <p className="text-xs text-muted-olive">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
