import { NextResponse } from "next/server";
import { confirmEmailChange } from "../../../../../backend/auth/emailChange";
import { apiRoute } from "../../../../lib/apiRoute";

export const POST = apiRoute(async function handleConfirmEmail(request) {
  const payload = await request.json().catch(() => ({}));
  const result = confirmEmailChange(payload.token);
  if (result.error) return NextResponse.json({ error: result.error }, { status: 400 });
  return NextResponse.json({ ok: true, email: result.email });
});
