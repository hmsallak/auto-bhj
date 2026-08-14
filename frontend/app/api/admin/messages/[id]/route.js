import { NextResponse } from "next/server";
import { markMessageRead, deleteMessage } from "../../../../../../backend/models/messages";
import { requireSession } from "../../../../../lib/adminAuth";

export async function PATCH(request, { params }) {
  if (!(await requireSession())) {
    return NextResponse.json({ error: "Connexion requise." }, { status: 401 });
  }

  const { id } = await params;
  const payload = await request.json().catch(() => ({}));
  markMessageRead(Number(id), Boolean(payload.isRead));

  return NextResponse.json({ ok: true });
}

export async function DELETE(request, { params }) {
  if (!(await requireSession())) {
    return NextResponse.json({ error: "Connexion requise." }, { status: 401 });
  }

  const { id } = await params;
  const deleted = deleteMessage(Number(id));

  if (!deleted) {
    return NextResponse.json({ error: "Message introuvable." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
