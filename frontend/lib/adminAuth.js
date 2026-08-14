import { cookies, headers } from "next/headers";
import { verifySessionToken } from "../../backend/auth/sessions";

const SESSION_COOKIE = "session";

export async function getSession() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  return verifySessionToken(token);
}

export async function requireSession() {
  const session = await getSession();
  if (!session) return null;
  return session;
}

export async function getClientIp() {
  const store = await headers();
  const forwarded = store.get("x-forwarded-for");
  return forwarded ? forwarded.split(",")[0].trim() : "unknown";
}

export const SESSION_COOKIE_NAME = SESSION_COOKIE;
