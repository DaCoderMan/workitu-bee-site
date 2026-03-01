import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Invoices are tracked in ClickUp Revenue Tracker list
  // Each task created by PayPal webhook contains client email
  const clickupToken = process.env.CLICKUP_API_TOKEN;
  if (!clickupToken) {
    return NextResponse.json({ invoices: [] });
  }

  try {
    const listId = process.env.CLICKUP_REVENUE_LIST_ID || "901816199664";
    const res = await fetch(
      `https://api.clickup.com/api/v2/list/${listId}/task?subtasks=false`,
      {
        headers: { Authorization: clickupToken },
      }
    );

    if (!res.ok) {
      return NextResponse.json({ invoices: [] });
    }

    const data = await res.json();
    const clientEmail = session.email.toLowerCase();

    const clientInvoices = (data.tasks || [])
      .filter(
        (task: { description?: string }) =>
          (task.description || "").toLowerCase().includes(clientEmail)
      )
      .map(
        (task: {
          id: string;
          name: string;
          description?: string;
          date_created: string;
          status: { status: string };
        }) => {
          // Extract amount from task name (format: "Payment: $XXX — Client")
          const amountMatch = (task.name || "").match(/\$[\d,.]+/);
          return {
            id: task.id,
            description: task.name,
            amount: amountMatch ? amountMatch[0] : "N/A",
            date: task.date_created,
            status: task.status.status,
          };
        }
      );

    return NextResponse.json({ invoices: clientInvoices });
  } catch {
    return NextResponse.json({ invoices: [] });
  }
}
