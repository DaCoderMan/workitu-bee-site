"use client";

import { ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <div className="relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-background to-accent/10" />
      <div className="absolute -top-40 right-0 -z-10 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />

      <div className="mx-auto flex max-w-6xl flex-col items-center px-4 py-24 text-center md:py-36">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-muted/50 px-4 py-1.5 text-sm text-muted-foreground">
          <Zap className="h-3.5 w-3.5" />
          Free pilot project &mdash; zero risk
        </div>

        <h1 className="max-w-3xl text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
          AI Automation That{" "}
          <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Saves You Hours
          </span>
        </h1>

        <p className="mt-6 max-w-xl text-lg text-muted-foreground md:text-xl">
          We audit your workflows, find where AI saves time and money, and build
          the solution. You just tell us if it works.
        </p>

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
