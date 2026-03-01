import { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Section } from "@/components/layout/section-wrapper";
import { PricingCards } from "@/components/sections/pricing-cards";

export const metadata: Metadata = {
  title: "Pricing | Workitu Tech",
  description: "Simple, transparent pricing for AI automation consulting. Start with a free pilot.",
};

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Section id="pricing-page">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
              Simple, Transparent Pricing
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Start free. Pay only when you see results. Cancel anytime.
            </p>
          </div>
          <PricingCards />
        </Section>
      </main>
      <Footer />
    </div>
  );
}
