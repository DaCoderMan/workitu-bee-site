import { Check, Sparkles, Rocket, RefreshCw } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Section } from "@/components/layout/section-wrapper";

const tiers = [
  {
    name: "Free Pilot",
    price: "Free",
    description: "Try before you buy. We automate one workflow and you tell us if it works.",
    icon: Sparkles,
    badge: "Most Popular",
    features: [
      "Full workflow audit",
      "One automation built & deployed",
      "Written report with findings",
      "Zero cost — just your honest feedback",
    ],
  },
  {
    name: "Standard",
    price: "2,000 - 5,000",
    currency: "ILS",
    description: "Full implementation. We audit, design, and build your custom automation.",
    icon: Rocket,
    features: [
      "Comprehensive workflow audit",
      "Custom automation solution",
      "Full implementation & deployment",
      "2 weeks of support & adjustments",
      "Documentation & training",
    ],
  },
  {
    name: "Monthly Retainer",
    price: "500",
    currency: "ILS/mo",
    description: "Ongoing optimization. We keep your automations running and improve them.",
    icon: RefreshCw,
    features: [
      "Continuous monitoring",
      "Monthly optimization pass",
      "Priority support",
      "New automation builds (1/mo)",
      "Performance reporting",
    ],
  },
];

export function Services() {
  return (
    <Section id="services">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
          How We Work
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Simple pricing. Start free, scale when you see results.
        </p>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {tiers.map((tier) => (
          <Card
            key={tier.name}
            className={
              tier.badge
                ? "relative border-primary/50 shadow-lg shadow-primary/5"
                : ""
            }
          >
            {tier.badge && (
              <Badge className="absolute -top-3 left-4">{tier.badge}</Badge>
            )}
            <CardHeader>
              <tier.icon className="mb-2 h-8 w-8 text-primary" />
              <CardTitle className="text-xl">{tier.name}</CardTitle>
              <div className="flex items-baseline gap-1">
                {tier.currency && (
                  <span className="text-sm text-muted-foreground">
                    {tier.currency === "ILS/mo" ? "ILS" : tier.currency}
                  </span>
                )}
                <span className="text-3xl font-bold">{tier.price}</span>
                {tier.currency === "ILS/mo" && (
                  <span className="text-sm text-muted-foreground">/mo</span>
                )}
              </div>
              <CardDescription>{tier.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
}
