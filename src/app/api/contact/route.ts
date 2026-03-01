import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, email, company, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    // Create ClickUp task in Leads & Prospects list
    const clickupToken = process.env.CLICKUP_API_TOKEN;
    if (clickupToken) {
      await fetch("https://api.clickup.com/api/v2/list/901816199661/task", {
        method: "POST",
        headers: {
          Authorization: clickupToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `Lead: ${name}${company ? ` (${company})` : ""}`,
          description: `Name: ${name}\nEmail: ${email}\nCompany: ${company || "N/A"}\n\nMessage:\n${message}\n\nSource: Website contact form`,
          priority: 2,
          tags: ["website-lead"],
        }),
      });
    }

    // Send notification email via Resend
    const resendKey = process.env.RESEND_API_KEY;
    const notifyEmail = process.env.CONTACT_NOTIFICATION_EMAIL;
    if (resendKey && notifyEmail) {
      const { Resend } = await import("resend");
      const resend = new Resend(resendKey);

      // Notify Yonatan
      await resend.emails.send({
        from: "Workitu Tech <onboarding@resend.dev>",
        to: notifyEmail,
        subject: `New Lead: ${name}${company ? ` from ${company}` : ""}`,
        text: `New contact form submission:\n\nName: ${name}\nEmail: ${email}\nCompany: ${company || "N/A"}\n\nMessage:\n${message}`,
      });

      // Auto-respond to the lead
      await resend.emails.send({
        from: "Workitu Tech <onboarding@resend.dev>",
        to: email,
        subject: "Thanks for reaching out — Workitu Tech",
        text: `Hi ${name},\n\nThanks for your interest in AI automation. I've received your message and will get back to you within 24 hours.\n\nIn the meantime, you can book a free discovery call here:\n${process.env.NEXT_PUBLIC_APP_URL || "https://workitu.tech"}/book\n\nBest,\nYonatan Perlin\nWorkitu Tech`,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
