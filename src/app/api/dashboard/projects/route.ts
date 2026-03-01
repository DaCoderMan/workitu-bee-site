import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const clickupToken = process.env.CLICKUP_API_TOKEN;
  if (!clickupToken) {
    return NextResponse.json({ projects: [] });
  }

  try {
    // Search for tasks in Active Clients list that mention client's email
    const listId = process.env.CLICKUP_ACTIVE_CLIENTS_LIST_ID || "901816199662";
    const res = await fetch(
      `https://api.clickup.com/api/v2/list/${listId}/task?subtasks=false`,
      {
        headers: { Authorization: clickupToken },
      }
    );

    if (!res.ok) {
      return NextResponse.json({ projects: [] });
    }

    const data = await res.json();
    const clientEmail = session.email.toLowerCase();

    // Filter tasks that contain the client's email
    const clientTasks = (data.tasks || []).filter(
      (task: { description?: string; name?: string }) =>
        (task.description || "").toLowerCase().includes(clientEmail) ||
        (task.name || "").toLowerCase().includes(clientEmail)
    );

    const projects = clientTasks.map(
      (task: {
        id: string;
        name: string;
        description?: string;
        status: { status: string; color: string };
        date_created: string;
        due_date?: string;
      }) => ({
        id: task.id,
        name: task.name,
        status: task.status.status,
        statusColor: task.status.color,
        created: task.date_created,
        dueDate: task.due_date,
        description: (task.description || "").slice(0, 200),
      })
    );

    return NextResponse.json({ projects });
  } catch {
    return NextResponse.json({ projects: [] });
  }
}
