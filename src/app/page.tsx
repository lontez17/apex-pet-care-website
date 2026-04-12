import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { Services } from "@/components/sections/services";
import { Benefits } from "@/components/sections/benefits";
import { About } from "@/components/sections/about";
import { Requirements } from "@/components/sections/requirements";
import { Pricing } from "@/components/sections/pricing";
import { CtaBanner } from "@/components/sections/cta-banner";
import { ContactForm } from "@/components/sections/contact-form";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Services />
        <Benefits />
        <About />
        <Requirements />
        <Pricing />
        <CtaBanner />
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
