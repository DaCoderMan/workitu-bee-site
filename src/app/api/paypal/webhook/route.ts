import { NextResponse } from "next/server";
import { verifyWebhook } from "@/lib/paypal";

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const headers: Record<string, string> = {};
    req.headers.forEach((value, key) => {
      headers[key] = value;
    });

    // Verify webhook signature
    const isValid = await verifyWebhook(headers, body);
    if (!isValid) {
      console.error("PayPal webhook signature verification failed");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(body);
    const eventType = event.event_type;

    const clickupToken = process.env.CLICKUP_API_TOKEN;

    switch (eventType) {
      case "BILLING.SUBSCRIPTION.CREATED":
      case "BILLING.SUBSCRIPTION.ACTIVATED": {
        const sub = event.resource;
        if (clickupToken) {
          await fetch(
            `https://api.clickup.com/api/v2/list/${process.env.CLICKUP_ACTIVE_CLIENTS_LIST_ID || "901816199662"}/task`,
            {
              method: "POST",
              headers: {
                Authorization: clickupToken,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                name: `Subscription: ${sub.subscriber?.name?.given_name || "Client"} — ${sub.plan_id}`,
                description: `PayPal subscription ${eventType}\n\nSubscription ID: ${sub.id}\nPlan: ${sub.plan_id}\nEmail: ${sub.subscriber?.email_address || "N/A"}\nStatus: ${sub.status}`,
                priority: 2,
                tags: ["subscription", "website"],
              }),
            }
          );
        }

        // Send welcome email
        const resendKey = process.env.RESEND_API_KEY;
        if (resendKey && sub.subscriber?.email_address) {
          const { Resend } = await import("resend");
          const resend = new Resend(resendKey);
          await resend.emails.send({
            from: "Workitu Tech <onboarding@resend.dev>",
            to: sub.subscriber.email_address,
            subject: "Welcome to Workitu Tech!",
            text: `Hi ${sub.subscriber?.name?.given_name || "there"},\n\nThank you for subscribing to Workitu Tech! Your subscription is now active.\n\nWe'll be in touch within 24 hours to kick off your automation project.\n\nBest,\nYonatan Perlin\nWorkitu Tech`,
          });
        }
        break;
      }

      case "BILLING.SUBSCRIPTION.CANCELLED":
      case "BILLING.SUBSCRIPTION.EXPIRED": {
        // Log cancellation
        if (clickupToken) {
          const sub = event.resource;
          await fetch(
            `https://api.clickup.com/api/v2/list/${process.env.CLICKUP_ACTIVE_CLIENTS_LIST_ID || "901816199662"}/task`,
            {
              method: "POST",
              headers: {
                Authorization: clickupToken,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                name: `Subscription Ended: ${sub.id}`,
                description: `Subscription ${eventType}\n\nID: ${sub.id}\nReason: ${sub.status_change_note || "N/A"}`,
                tags: ["subscription-ended"],
              }),
            }
          );
        }
        break;
      }

      case "PAYMENT.CAPTURE.COMPLETED": {
        const payment = event.resource;
        if (clickupToken) {
          await fetch(
            `https://api.clickup.com/api/v2/list/${process.env.CLICKUP_REVENUE_LIST_ID || "901816199664"}/task`,
            {
              method: "POST",
              headers: {
                Authorization: clickupToken,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                name: `Payment: $${payment.amount?.value || "?"} — Subscription`,
                description: `Recurring payment received\nAmount: $${payment.amount?.value}\nCapture ID: ${payment.id}`,
                tags: ["payment-received", "recurring"],
              }),
            }
          );
        }
        break;
      }

      default:
        console.log(`Unhandled PayPal webhook event: ${eventType}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("PayPal webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
