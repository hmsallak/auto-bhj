import { NextResponse } from "next/server";
import { resetPasswordWithToken } from "../../../../../backend/auth/passwordReset";
import { apiRoute } from "../../../../lib/apiRoute";

export const POST = apiRoute(async function handleReset(request) {
  const payload = await request.json().catch(() => ({}));
  const result = resetPasswordWithToken(payload.token, payload.newPassword);

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
});
