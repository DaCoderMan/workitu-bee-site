import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const startTime = Date.now();

export async function GET() {
  const uptimeMs = Date.now() - startTime;
  const uptimeHours = Math.floor(uptimeMs / 3600000);

  const services: Record<string, string> = {};

  // Check ClickUp connectivity
  if (process.env.CLICKUP_API_TOKEN) {
    try {
      const res = await fetch("https://api.clickup.com/api/v2/user", {
        headers: { Authorization: process.env.CLICKUP_API_TOKEN },
      });
      services.clickup = res.ok ? "connected" : "error";
    } catch {
      services.clickup = "unreachable";
    }
  } else {
    services.clickup = "not_configured";
  }

  // Check PayPal connectivity
  if (process.env.PAYPAL_CLIENT_ID) {
    services.paypal = "configured";
  } else {
    services.paypal = "not_configured";
  }

  // Check Resend connectivity
  if (process.env.RESEND_API_KEY) {
    services.resend = "configured";
  } else {
    services.resend = "not_configured";
  }

  return NextResponse.json({
    status: "ok",
    version: "2.0.0",
    uptime: `${uptimeHours}h`,
    last_build: process.env.VERCEL_GIT_COMMIT_SHA
      ? new Date().toISOString()
      : "local",
    services,
  });
}
