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

export async function getClientIp() {
  const store = await headers();
  const forwarded = store.get("x-forwarded-for");
  return forwarded ? forwarded.split(",")[0].trim() : "unknown";
}

export const SESSION_COOKIE_NAME = SESSION_COOKIE;
