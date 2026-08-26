import { NextResponse } from "next/server";
import { markMessageRead, deleteMessage } from "../../../../../../backend/models/messages";
import { requirePermission, authError } from "../../../../../lib/adminAuth";
import { apiRoute } from "../../../../../lib/apiRoute";

export const PATCH = apiRoute(async function handleUpdate(request, { params }) {
  const user = await requirePermission("messages_read");
  if (!user) {
    const { status, error } = await authError();
    return NextResponse.json({ error }, { status });
  }

  const { id } = await params;
  const payload = await request.json().catch(() => ({}));
  markMessageRead(Number(id), Boolean(payload.isRead));

  return NextResponse.json({ ok: true });
});

export const DELETE = apiRoute(async function handleDelete(request, { params }) {
  const user = await requirePermission("messages_delete");
  if (!user) {
    const { status, error } = await authError();
    return NextResponse.json({ error }, { status });
  }

  const { id } = await params;
  const deleted = deleteMessage(Number(id), user.username);

  if (!deleted) {
    return NextResponse.json({ error: "Message introuvable." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
});
