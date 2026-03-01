"use client";

import { useState, useEffect, useCallback } from "react";
import { ArrowRight, Zap, Bot, Target } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const heroVariants = [
  {
    badge: "Free pilot project — zero risk",
    badgeIcon: Zap,
    headline: "AI Automation That",
    headlineAccent: "Saves You Hours",
    subhead:
      "We audit your workflows, find where AI saves time and money, and build the solution. You just tell us if it works.",
  },
  {
    badge: "Built by AI, managed by AI",
    badgeIcon: Bot,
    headline: "Your Business",
    headlineAccent: "Runs Itself",
    subhead:
      "From lead capture to invoice generation — we automate the workflows that drain your time.",
  },
  {
    badge: "Real results, real automation",
    badgeIcon: Target,
    headline: "Stop Doing What",
    headlineAccent: "Machines Can Do",
    subhead:
      "Custom AI agents that handle your repetitive work 24/7. No templates, no bloat — built for your exact workflow.",
  },
];

export function Hero() {
  const [index, setIndex] = useState(0);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % heroVariants.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 10000);
    return () => clearInterval(timer);
  }, [next]);

  const variant = heroVariants[index];
  const BadgeIcon = variant.badgeIcon;

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-background to-accent/10" />
      <div className="absolute -top-40 right-0 -z-10 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />

      <div className="mx-auto flex max-w-6xl flex-col items-center px-4 py-24 text-center md:py-36">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-muted/50 px-4 py-1.5 text-sm text-muted-foreground">
              <BadgeIcon className="h-3.5 w-3.5" />
              {variant.badge}
            </div>

            <h1 className="max-w-3xl text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              {variant.headline}{" "}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                {variant.headlineAccent}
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg text-muted-foreground md:text-xl">
              {variant.subhead}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Dot indicators */}
        <div className="mt-6 flex gap-2">
          {heroVariants.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all ${
                i === index ? "w-6 bg-primary" : "w-2 bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Button
            size="lg"
            onClick={() =>
              document
                .querySelector("#contact")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Start Free Pilot
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() =>
              document
                .querySelector("#portfolio")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            See Our Work
          </Button>
        </div>
      </div>
    </div>
  );
}
