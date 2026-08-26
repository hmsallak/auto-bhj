import { cookies, headers } from "next/headers";
import { verifySessionToken } from "../../backend/auth/sessions";
import { findByUsername, rowToUser, hasPermission } from "../../backend/models/adminUsers";

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

// Loads the user's role/permissions fresh from the database on every call
// (rather than trusting the session), so revoking access takes effect
// immediately instead of waiting for the session to expire.
export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;

  const row = findByUsername(session.username);
  return rowToUser(row);
}

export async function requireOwner() {
  const user = await getCurrentUser();
  if (!user || user.role !== "owner") return null;
  return user;
}

export async function requirePermission(key) {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user, key)) return null;
  return user;
}

// Distinguishes "no valid session" (401 - the frontend should drop back to
// the login screen) from "logged in but not allowed" (403 - the frontend
// should just show an error) after a requireSession/requireOwner/
// requirePermission call has already returned null.
export async function authError() {
  const user = await getCurrentUser();
  return user
    ? { status: 403, error: "Acces refuse." }
    : { status: 401, error: "Session expiree. Reconnectez-vous." };
}

// x-forwarded-for is a comma-separated hop chain: each proxy appends the
// address it saw the request come from. The *first* entry is whatever the
// original client sent - trivially spoofable, since anyone can set that
// header themselves before it ever reaches your infrastructure. The *last*
// entry is the one your own reverse proxy appended, which it set from the
// real TCP connection, so it's the one to trust. This still assumes the app
// only receives traffic through that trusted proxy; if it's ever exposed
// directly to the internet with no proxy in front, this header is entirely
// attacker-controlled and should not be trusted at all.
export async function getClientIp() {
  const store = await headers();
  const forwarded = store.get("x-forwarded-for");
  if (!forwarded) return "unknown";

  const hops = forwarded.split(",").map((hop) => hop.trim()).filter(Boolean);
  return hops.length ? hops[hops.length - 1] : "unknown";
}

export const SESSION_COOKIE_NAME = SESSION_COOKIE;
