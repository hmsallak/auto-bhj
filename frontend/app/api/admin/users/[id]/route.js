import { NextResponse } from "next/server";
import { updateUser, deleteUser } from "../../../../../../backend/models/adminUsers";
import { requireOwner, authError } from "../../../../../lib/adminAuth";
import { apiRoute } from "../../../../../lib/apiRoute";

export const PATCH = apiRoute(async function handleUpdate(request, { params }) {
  const user = await requireOwner();
  if (!user) {
    const { status, error } = await authError();
    return NextResponse.json({ error }, { status });
  }

  const { id } = await params;
  const payload = await request.json().catch(() => ({}));
  const result = updateUser(Number(id), payload, user.username);
  if (result.error) {
    const status = result.error === "Utilisateur introuvable." ? 404 : 400;
    return NextResponse.json({ error: result.error }, { status });
  }

  return NextResponse.json(result.user);
});

export const DELETE = apiRoute(async function handleDelete(request, { params }) {
  const user = await requireOwner();
  if (!user) {
    const { status, error } = await authError();
    return NextResponse.json({ error }, { status });
  }

  const { id } = await params;
  const result = deleteUser(Number(id), user.username);
  if (result.error) {
    const status = result.error === "Utilisateur introuvable." ? 404 : 400;
    return NextResponse.json({ error: result.error }, { status });
  }

  return NextResponse.json({ ok: true });
});
