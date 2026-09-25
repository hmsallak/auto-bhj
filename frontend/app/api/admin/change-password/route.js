import { NextResponse } from "next/server";
import { findByUsername, updatePassword } from "../../../../../backend/models/adminUsers";
import { verifyPassword } from "../../../../../backend/auth/passwords";
import { requireSession, getCurrentUser } from "../../../../lib/adminAuth";
import { destroyUserSessions } from "../../../../../backend/auth/sessions";
import { validatePasswordStrength } from "../../../../../backend/auth/passwordPolicy";
import { apiRoute } from "../../../../lib/apiRoute";

export const POST = apiRoute(async function handleChangePassword(request) {
  const session = await requireSession();
  // A session left over from a now inactive (rejected/pending) account
  // must not be usable to change anything.
  if (!session || !(await getCurrentUser())) {
    return NextResponse.json({ error: "Connexion requise." }, { status: 401 });
  }

  const payload = await request.json().catch(() => ({}));
  const currentPassword = String(payload.currentPassword || "");
  const newPassword = String(payload.newPassword || "");

  const admin = findByUsername(session.username);
  const weak = validatePasswordStrength(newPassword, { email: admin?.email || "" });
  if (weak) {
    return NextResponse.json(
      { error: weak },
      { status: 400 }
    );
  }

  if (!admin || !verifyPassword(currentPassword, admin.password_hash)) {
    return NextResponse.json({ error: "Mot de passe actuel incorrect." }, { status: 403 });
  }

  updatePassword(session.username, newPassword);
  // Everyone else logged into this account is signed out; this device stays.
  destroyUserSessions(session.username, session.id);
  return NextResponse.json({ ok: true });
});
