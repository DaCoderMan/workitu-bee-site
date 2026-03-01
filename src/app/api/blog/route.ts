import { NextResponse } from "next/server";
import { getBlogPosts } from "@/lib/clickup";

export const revalidate = 3600;

export async function GET() {
  try {
    const posts = await getBlogPosts();
    return NextResponse.json({ posts });
  } catch {
    return NextResponse.json({ posts: [] });
  }
}
