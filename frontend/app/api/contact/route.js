import { NextResponse } from "next/server";
import { createMessage } from "../../../../backend/models/messages";

export async function POST(request) {
  const payload = await request.json().catch(() => ({}));
  const result = createMessage(payload);

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
