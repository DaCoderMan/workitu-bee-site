import { NextResponse } from "next/server";
import { captureOrder } from "@/lib/paypal";

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID required" },
        { status: 400 }
      );
    }

    const capture = await captureOrder(orderId);

    // On successful capture, create ClickUp task + send notification
    if (capture.status === "COMPLETED") {
      const payer = capture.payer;
      const amount = capture.purchase_units?.[0]?.payments?.captures?.[0]?.amount;

      // Create ClickUp task in Active Clients
      const clickupToken = process.env.CLICKUP_API_TOKEN;
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
              name: `Client: ${payer?.name?.given_name || ""} ${payer?.name?.surname || ""} — $${amount?.value || "?"}`,
              description: `Payment captured via PayPal\n\nEmail: ${payer?.email_address || "N/A"}\nAmount: $${amount?.value || "?"} ${amount?.currency_code || "USD"}\nOrder ID: ${orderId}\nCapture ID: ${capture.id}\n\nSource: Website payment`,
              priority: 2,
              tags: ["paid-client", "website"],
            }),
          }
        );
      }

      // Log to Revenue Tracker
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
              name: `Payment: $${amount?.value || "?"} — ${payer?.name?.given_name || "Client"}`,
              description: `PayPal payment received\nOrder: ${orderId}\nAmount: $${amount?.value || "?"}`,
              tags: ["payment-received"],
            }),
          }
        );
      }

      // Send notification email
      const resendKey = process.env.RESEND_API_KEY;
      const notifyEmail = process.env.CONTACT_NOTIFICATION_EMAIL;
      if (resendKey && notifyEmail) {
        const { Resend } = await import("resend");
        const resend = new Resend(resendKey);
        await resend.emails.send({
          from: "Workitu Tech <onboarding@resend.dev>",
          to: notifyEmail,
          subject: `Payment Received: $${amount?.value || "?"} from ${payer?.name?.given_name || "Client"}`,
          text: `New payment captured!\n\nClient: ${payer?.name?.given_name || ""} ${payer?.name?.surname || ""}\nEmail: ${payer?.email_address || "N/A"}\nAmount: $${amount?.value || "?"}\nOrder ID: ${orderId}`,
        });
      }
    }

    return NextResponse.json({
      status: capture.status,
      id: capture.id,
    });
  } catch (error) {
    console.error("PayPal capture error:", error);
    return NextResponse.json(
      { error: "Failed to capture order" },
      { status: 500 }
    );
  }
}
