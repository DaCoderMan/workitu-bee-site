import { NextResponse } from "next/server";
import { getPortfolioItems } from "@/lib/clickup";
import { projects as fallbackProjects } from "@/lib/portfolio-data";

export const revalidate = 3600; // ISR: revalidate every hour

export async function GET() {
  try {
    const items = await getPortfolioItems();

    // If ClickUp returns data, use it. Otherwise fall back to static data.
    if (items.length > 0) {
      return NextResponse.json({ source: "clickup", projects: items });
    }

    return NextResponse.json({ source: "static", projects: fallbackProjects });
  } catch {
    return NextResponse.json({ source: "static", projects: fallbackProjects });
  }
}
