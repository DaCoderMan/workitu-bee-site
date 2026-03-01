"use client";

import { Check, Sparkles, Rocket, Crown, ArrowRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const plans = [
  {
    id: "free-pilot",
    name: "Free Pilot",
    price: "0",
    period: "",
    description:
      "Try before you buy. We automate one workflow and you tell us if it works.",
    icon: Sparkles,
    badge: "Start Here",
    features: [
      "Full workflow audit",
      "One automation built & deployed",
      "Written report with findings",
      "Zero cost — just your honest feedback",
    ],
    cta: "Start Free Pilot",
    paypal: false,
  },
  {
    id: "starter",
    name: "Starter",
    price: "150",
    period: "/mo",
    description:
      "Ongoing monitoring and minor fixes to keep your automations running smoothly.",
    icon: Rocket,
    features: [
      "Monitoring & health checks",
      "Minor fixes & adjustments",
      "Email support",
      "Monthly performance report",
    ],
    cta: "Subscribe",
    paypal: true,
    amount: 150,
  },
  {
    id: "standard",
    name: "Standard",
    price: "500",
    period: "/mo",
    description:
      "Full automation management with priority support and weekly reports.",
    icon: Rocket,
    badge: "Most Popular",
    features: [
      "Full automation management",
      "Priority support",
      "Weekly reports",
      "Up to 5 active automations",
      "ClickUp project board",
    ],
    cta: "Subscribe",
    paypal: true,
    amount: 500,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "1,500",
    period: "/mo",
    description:
      "Dedicated AI instance with unlimited automations and 24/7 support.",
    icon: Crown,
    features: [
      "Dedicated Bee AI instance",
      "Unlimited automations",
      "24/7 priority support",
      "Custom integrations",
      "Daily reports",
      "Direct Slack/Telegram channel",
    ],
    cta: "Contact Us",
    paypal: false,
    enterprise: true,
  },
];

export function PricingCards() {
  const handleContact = () => {
    const el = document.querySelector("#contact");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = "/#contact";
    }
  };

  const handleSubscribe = async (planId: string, amount: number) => {
    try {
      const res = await fetch("/api/paypal/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          description: `Workitu Tech - ${planId} plan`,
        }),
      });

      const data = await res.json();
      if (data.id) {
        // Redirect to PayPal approval
        window.location.href = `https://www.paypal.com/checkoutnow?token=${data.id}`;
      }
    } catch (error) {
      console.error("Payment error:", error);
    }
  };

  return (
    <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {plans.map((plan) => (
        <Card
          key={plan.id}
          className={
            plan.badge === "Most Popular"
              ? "relative border-primary/50 shadow-lg shadow-primary/5"
              : "relative"
          }
        >
          {plan.badge && (
            <Badge className="absolute -top-3 left-4">{plan.badge}</Badge>
          )}
          <CardHeader>
            <plan.icon className="mb-2 h-8 w-8 text-primary" />
            <CardTitle className="text-xl">{plan.name}</CardTitle>
            <div className="flex items-baseline gap-1">
              <span className="text-sm text-muted-foreground">$</span>
              <span className="text-3xl font-bold">{plan.price}</span>
              {plan.period && (
                <span className="text-sm text-muted-foreground">
                  {plan.period}
                </span>
              )}
            </div>
            <CardDescription>{plan.description}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <ul className="space-y-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {feature}
                </li>
              ))}
            </ul>

            <Button
              className="mt-auto w-full"
              variant={plan.badge === "Most Popular" ? "default" : "outline"}
              onClick={() => {
                if (plan.enterprise || !plan.paypal) {
                  handleContact();
                } else if (plan.paypal && plan.amount) {
                  handleSubscribe(plan.id, plan.amount);
                }
              }}
            >
              {plan.cta}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
