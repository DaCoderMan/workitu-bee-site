export type Project = {
  title: string;
  description: string;
  tags: string[];
  status: "live" | "built" | "in-progress";
  url?: string;
};

export const projects: Project[] = [
  {
    title: "Bee AI Chief of Staff",
    description:
      "Autonomous AI agent that manages tasks, emails, calendar, and daily operations. Runs 24/7 on a VPS with ClickUp, Gmail, and Calendar integrations.",
    tags: ["Python", "DeepSeek API", "ClickUp API", "n8n", "Cron"],
    status: "live",
  },
  {
    title: "PM Auto-Status Reporter",
    description:
      "Automated status report generator for project managers. Pulls data from task boards, generates formatted updates, and sends via Slack/email.",
    tags: ["Next.js", "AI", "Slack API", "n8n"],
    status: "in-progress",
  },
  {
    title: "AI Session Notes for Therapists",
    description:
      "HIPAA-aware tool that summarizes therapy sessions, tracks patient progress, and automates clinical documentation.",
    tags: ["Next.js", "Whisper API", "Claude API", "Encryption"],
    status: "in-progress",
  },
  {
    title: "Smart Lead Follow-Up System",
    description:
      "Automated CRM that follows up with leads via WhatsApp and email based on configurable sequences and triggers.",
    tags: ["n8n", "WhatsApp API", "Resend", "PostgreSQL"],
    status: "built",
  },
  {
    title: "Daily Briefing Engine",
    description:
      "Generates personalized morning briefings from calendar, email, tasks, and news. Delivered via Telegram at 8AM daily.",
    tags: ["Python", "Telegram Bot", "Gmail API", "Calendar API"],
    status: "live",
  },
  {
    title: "Invoice & Quote Generator",
    description:
      "One-click invoice and quote generation for solopreneurs. Auto-calculates tax, generates PDFs, and tracks payment status.",
    tags: ["Next.js", "PDF Generation", "Stripe", "Dashboard"],
    status: "in-progress",
  },
];
