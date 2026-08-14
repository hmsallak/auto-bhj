import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { destroySessionToken } from "../../../../../backend/auth/sessions";
import { SESSION_COOKIE_NAME } from "../../../../lib/adminAuth";

export async function POST() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE_NAME)?.value;
  if (token) destroySessionToken(token);

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE_NAME, "", { path: "/", maxAge: 0 });
  return response;
}
