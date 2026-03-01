import { NextResponse } from "next/server";
import {
  verifyMagicToken,
  createSession,
  setSessionCookie,
} from "@/lib/auth";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/login?error=missing_token", req.url));
  }

  const result = await verifyMagicToken(token);
  if (!result) {
    return NextResponse.redirect(
      new URL("/login?error=invalid_or_expired", req.url)
    );
  }

  // Create session and set cookie
  const sessionToken = await createSession(result.email);
  await setSessionCookie(sessionToken);

  return NextResponse.redirect(new URL("/dashboard", req.url));
}
