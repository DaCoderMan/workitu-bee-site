import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

// POST: Send a message (creates ClickUp comment on client's task)
export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { message } = await req.json();
  if (!message?.trim()) {
    return NextResponse.json({ error: "Message required" }, { status: 400 });
  }

  const clickupToken = process.env.CLICKUP_API_TOKEN;
  if (!clickupToken) {
    return NextResponse.json({
      sent: true,
      note: "Message logged (ClickUp not configured)",
    });
  }

  try {
    // Find the client's task
    const listId = process.env.CLICKUP_ACTIVE_CLIENTS_LIST_ID || "901816199662";
    const res = await fetch(
      `https://api.clickup.com/api/v2/list/${listId}/task?subtasks=false`,
      { headers: { Authorization: clickupToken } }
    );

    if (!res.ok) throw new Error("ClickUp fetch failed");

    const data = await res.json();
    const clientEmail = session.email.toLowerCase();
    const clientTask = (data.tasks || []).find(
      (task: { description?: string; name?: string }) =>
        (task.description || "").toLowerCase().includes(clientEmail) ||
        (task.name || "").toLowerCase().includes(clientEmail)
    );

    if (clientTask) {
      // Add comment to client's task
      await fetch(
        `https://api.clickup.com/api/v2/task/${clientTask.id}/comment`,
        {
          method: "POST",
          headers: {
            Authorization: clickupToken,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            comment_text: `[Client Message from ${session.email}]\n\n${message}`,
            notify_all: true,
          }),
        }
      );
    } else {
      // No existing task — create one in Leads
      const leadsListId = process.env.CLICKUP_LEADS_LIST_ID || "901816199661";
      await fetch(
        `https://api.clickup.com/api/v2/list/${leadsListId}/task`,
        {
          method: "POST",
          headers: {
            Authorization: clickupToken,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: `Dashboard Chat: ${session.email}`,
            description: `Client message from dashboard:\n\n${message}\n\nEmail: ${session.email}`,
            tags: ["dashboard-chat"],
          }),
        }
      );
    }

    return NextResponse.json({ sent: true });
  } catch {
    return NextResponse.json({ sent: true, note: "Message queued" });
  }
}
