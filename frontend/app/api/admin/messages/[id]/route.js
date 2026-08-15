import { NextResponse } from "next/server";
import { markMessageRead, deleteMessage } from "../../../../../../backend/models/messages";
import { requirePermission } from "../../../../../lib/adminAuth";

export async function PATCH(request, { params }) {
  const user = await requirePermission("messages");
  if (!user) {
    return NextResponse.json({ error: "Acces refuse." }, { status: 403 });
  }

  const { id } = await params;
  const payload = await request.json().catch(() => ({}));
  markMessageRead(Number(id), Boolean(payload.isRead));

  return NextResponse.json({ ok: true });
}

export async function DELETE(request, { params }) {
  const user = await requirePermission("messages");
  if (!user) {
    return NextResponse.json({ error: "Acces refuse." }, { status: 403 });
  }

  const { id } = await params;
  const deleted = deleteMessage(Number(id), user.username);

  if (!deleted) {
    return NextResponse.json({ error: "Message introuvable." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
