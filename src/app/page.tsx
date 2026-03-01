import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { Services } from "@/components/sections/services";
import { Portfolio } from "@/components/sections/portfolio";
import { About } from "@/components/sections/about";
import { ContactForm } from "@/components/sections/contact-form";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Separator />
        <Services />
        <Separator />
        <Portfolio />
        <Separator />
        <About />
        <Separator />
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
}
