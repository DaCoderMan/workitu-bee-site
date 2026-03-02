"use client";

import { Badge } from "@/components/ui/badge";
import { Section } from "@/components/layout/section-wrapper";
import { Bot, Code, Workflow, Cpu } from "lucide-react";
import { FadeUp, StaggerGroup, StaggerItem, HoverScale } from "@/components/ui/motion";

const techStack = [
  "Next.js",
  "React",
  "TypeScript",
  "Python",
  "n8n",
  "Claude API",
  "DeepSeek",
  "Node.js",
  "PostgreSQL",
  "Tailwind CSS",
  "Vercel",
  "Docker",
];

const capabilities = [
  {
    icon: Bot,
    title: "AI Agents",
    description: "Autonomous agents that handle tasks, emails, and scheduling",
  },
  {
    icon: Workflow,
    title: "Workflow Automation",
    description: "n8n flows, cron jobs, and event-driven pipelines",
  },
  {
    icon: Code,
    title: "Full-Stack Development",
    description: "Web apps, APIs, dashboards, and internal tools",
  },
  {
    icon: Cpu,
    title: "AI Integration",
    description: "Claude, GPT, Whisper, and custom ML pipelines",
  },
];

export function About() {
  return (
    <Section id="about">
      <div className="grid gap-12 lg:grid-cols-2">
        <FadeUp>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Built by an Automation Obsessive
          </h2>
          <p className="mt-6 text-muted-foreground leading-relaxed">
            I&apos;m Yonatan Perlin, founder of Workitu Tech. I&apos;ve built
            39+ automation projects — from AI agents that run businesses to
            workflow pipelines that save hours of manual work every day.
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            My AI Chief of Staff, Bee, manages my entire operation: tasks,
            email, calendar, daily briefings, and even deploys code
            autonomously. Now I&apos;m bringing that same capability to your
            business.
          </p>

          <div className="mt-8 flex flex-wrap gap-2">
            {techStack.map((tech) => (
              <Badge key={tech} variant="outline">
                {tech}
              </Badge>
            ))}
          </div>
        </FadeUp>

        <StaggerGroup className="grid gap-4 sm:grid-cols-2">
          {capabilities.map((cap) => (
            <StaggerItem key={cap.title}>
              <HoverScale>
                <div className="rounded-lg border bg-card p-5 transition-colors hover:bg-accent/50">
                  <cap.icon className="mb-3 h-6 w-6 text-primary" />
                  <h3 className="font-semibold">{cap.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {cap.description}
                  </p>
                </div>
              </HoverScale>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </Section>
  );
}
