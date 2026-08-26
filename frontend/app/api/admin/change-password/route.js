import { NextResponse } from "next/server";
import { findByUsername, updatePassword } from "../../../../../backend/models/adminUsers";
import { verifyPassword } from "../../../../../backend/auth/passwords";
import { requireSession } from "../../../../lib/adminAuth";
import { apiRoute } from "../../../../lib/apiRoute";

export const POST = apiRoute(async function handleChangePassword(request) {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ error: "Connexion requise." }, { status: 401 });
  }

  const payload = await request.json().catch(() => ({}));
  const currentPassword = String(payload.currentPassword || "");
  const newPassword = String(payload.newPassword || "");

  if (newPassword.length < 8) {
    return NextResponse.json(
      { error: "Le nouveau mot de passe doit contenir au moins 8 caracteres." },
      { status: 400 }
    );
  }

  const admin = findByUsername(session.username);
  if (!admin || !verifyPassword(currentPassword, admin.password_hash)) {
    return NextResponse.json({ error: "Mot de passe actuel incorrect." }, { status: 401 });
  }

  updatePassword(session.username, newPassword);
  return NextResponse.json({ ok: true });
});
