import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  // Verify cron secret (Vercel sends this for cron jobs)
  const authHeader = req.headers.get("authorization");
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Revalidate dynamic pages that pull from ClickUp
    revalidatePath("/blog");
    revalidatePath("/");

    return NextResponse.json({
      revalidated: true,
      timestamp: new Date().toISOString(),
      paths: ["/blog", "/"],
    });
  } catch (error) {
    console.error("Cron site-update error:", error);
    return NextResponse.json(
      { error: "Revalidation failed" },
      { status: 500 }
    );
  }
}
