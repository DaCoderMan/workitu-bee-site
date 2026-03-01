import { NextResponse } from "next/server";
import { createMagicToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email required" },
        { status: 400 }
      );
    }

    const token = await createMagicToken(email);
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const magicLink = `${baseUrl}/api/auth/verify?token=${token}`;

    // Send magic link email via Resend
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      const { Resend } = await import("resend");
      const resend = new Resend(resendKey);
      await resend.emails.send({
        from: "Workitu Tech <onboarding@resend.dev>",
        to: email,
        subject: "Your login link — Workitu Tech",
        text: `Hi,\n\nClick the link below to sign in to your Workitu Tech dashboard:\n\n${magicLink}\n\nThis link expires in 15 minutes.\n\nIf you didn't request this, you can safely ignore this email.\n\nBest,\nWorkitu Tech`,
      });
    } else {
      // Dev mode: log the link
      console.log(`[DEV] Magic link for ${email}: ${magicLink}`);
    }

    return NextResponse.json({ sent: true });
  } catch (error) {
    console.error("Send magic link error:", error);
    return NextResponse.json(
      { error: "Failed to send login link" },
      { status: 500 }
    );
  }
}
