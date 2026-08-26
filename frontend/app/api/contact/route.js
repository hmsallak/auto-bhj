import { NextResponse } from "next/server";
import { createMessage } from "../../../../backend/models/messages";
import { apiRoute } from "../../../lib/apiRoute";

export const POST = apiRoute(async function handleContact(request) {
  const payload = await request.json().catch(() => ({}));
  const result = createMessage(payload);

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
});
