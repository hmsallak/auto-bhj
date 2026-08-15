import { NextResponse } from "next/server";
import { updateUserPermissions, deleteUser } from "../../../../../../backend/models/adminUsers";
import { requireOwner } from "../../../../../lib/adminAuth";

export async function PATCH(request, { params }) {
  const user = await requireOwner();
  if (!user) {
    return NextResponse.json({ error: "Acces refuse." }, { status: 403 });
  }

  const { id } = await params;
  const payload = await request.json().catch(() => ({}));
  const result = updateUserPermissions(Number(id), payload.permissions, user.username);
  if (result.error) {
    const status = result.error === "Utilisateur introuvable." ? 404 : 400;
    return NextResponse.json({ error: result.error }, { status });
  }

  return NextResponse.json(result.user);
}

export async function DELETE(request, { params }) {
  const user = await requireOwner();
  if (!user) {
    return NextResponse.json({ error: "Acces refuse." }, { status: 403 });
  }

  const { id } = await params;
  const result = deleteUser(Number(id), user.username);
  if (result.error) {
    const status = result.error === "Utilisateur introuvable." ? 404 : 400;
    return NextResponse.json({ error: result.error }, { status });
  }

  return NextResponse.json({ ok: true });
}
