"use client";

import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Section } from "@/components/layout/section-wrapper";

export function ContactForm() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      company: (form.elements.namedItem("company") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement)
        .value,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to send");

      toast.success("Message sent! I'll get back to you within 24 hours.");
      form.reset();
    } catch {
      toast.error("Something went wrong. Please email me directly.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Section id="contact">
      <div className="mx-auto max-w-xl text-center">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
          Let&apos;s Talk Automation
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Tell me about the repetitive work that eats your time. I&apos;ll show
          you how to automate it.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mx-auto mt-10 flex max-w-lg flex-col gap-4"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Input name="name" placeholder="Your name" required />
          <Input name="email" type="email" placeholder="Email" required />
        </div>
        <Input name="company" placeholder="Company (optional)" />
        <Textarea
          name="message"
          placeholder="What repetitive work do you want automated?"
          rows={5}
          required
        />
        <Button type="submit" size="lg" disabled={loading} className="w-full">
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Send className="mr-2 h-4 w-4" />
          )}
          {loading ? "Sending..." : "Send Message"}
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          Or email me directly at{" "}
          <a
            href="mailto:jonathanperlin@gmail.com"
            className="underline hover:text-foreground"
          >
            jonathanperlin@gmail.com
          </a>
        </p>
      </form>
    </Section>
  );
}
