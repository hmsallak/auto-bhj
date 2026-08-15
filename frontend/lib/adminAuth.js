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

export async function getClientIp() {
  const store = await headers();
  const forwarded = store.get("x-forwarded-for");
  return forwarded ? forwarded.split(",")[0].trim() : "unknown";
}

export const SESSION_COOKIE_NAME = SESSION_COOKIE;
