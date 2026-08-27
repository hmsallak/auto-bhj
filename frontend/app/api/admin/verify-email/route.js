import { NextResponse } from "next/server";
import { confirmEmailToken } from "../../../../../backend/auth/accountSignup";
import { apiRoute } from "../../../../lib/apiRoute";

export const POST = apiRoute(async function handleVerifyEmail(request) {
  const payload = await request.json().catch(() => ({}));
  const result = confirmEmailToken(payload.token);

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
});
