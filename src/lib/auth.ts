import { SignJWT, jwtVerify } from "jose";
import { nanoid } from "nanoid";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "dev-secret-change-in-production"
);
const MAGIC_LINK_SECRET = new TextEncoder().encode(
  process.env.MAGIC_LINK_SECRET || "dev-magic-secret-change-in-production"
);

const COOKIE_NAME = "bee-session";
const SESSION_DURATION = 7 * 24 * 60 * 60; // 7 days in seconds

export type SessionPayload = {
  email: string;
  name?: string;
  iat: number;
  exp: number;
};

// Create a magic link token (short-lived, 15 min)
export async function createMagicToken(email: string): Promise<string> {
  return new SignJWT({ email, nonce: nanoid() })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(MAGIC_LINK_SECRET);
}

// Verify a magic link token
export async function verifyMagicToken(
  token: string
): Promise<{ email: string } | null> {
  try {
    const { payload } = await jwtVerify(token, MAGIC_LINK_SECRET);
    return { email: payload.email as string };
  } catch {
    return null;
  }
}

// Create a session JWT (long-lived, 7 days)
export async function createSession(
  email: string,
  name?: string
): Promise<string> {
  return new SignJWT({ email, name })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION}s`)
    .sign(JWT_SECRET);
}

// Verify a session JWT
export async function verifySession(
  token: string
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

// Set the session cookie
export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_DURATION,
    path: "/",
  });
}

// Get the current session from cookies
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySession(token);
}

// Clear the session cookie
export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
