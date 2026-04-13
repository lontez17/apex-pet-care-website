import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { Services } from "@/components/sections/services";
import { Benefits } from "@/components/sections/benefits";
import { About } from "@/components/sections/about";
import { Requirements } from "@/components/sections/requirements";
import { CtaBanner } from "@/components/sections/cta-banner";
import { ContactForm } from "@/components/sections/contact-form";
import { RoverProfile } from "@/components/sections/rover-profile";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <RoverProfile />
        <Services />
        <Benefits />
        <About />
        <Requirements />
        <CtaBanner />
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
