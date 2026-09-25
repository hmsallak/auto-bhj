import { NextResponse } from "next/server";
import { getCurrentUser } from "../../../../lib/adminAuth";
import { apiRoute } from "../../../../lib/apiRoute";
import { updateEmail, findByUsername } from "../../../../../backend/models/adminUsers";
import { verifyPassword } from "../../../../../backend/auth/passwords";

export const GET = apiRoute(async function handleMe() {
  const user = await getCurrentUser();

  return NextResponse.json({
    authenticated: Boolean(user),
    username: user?.username || null,
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    role: user?.role || null,
    permissions: user?.permissions || [],
  });
});

// Lets the signed-in admin update their own login / recovery e-mail. The
// current password is required: with only an open session, someone could
// otherwise swap in their own address and take the account via "forgot".

export const PATCH = apiRoute(async function handleUpdateMe(request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Connexion requise." }, { status: 401 });
  }

  const payload = await request.json().catch(() => ({}));
  const row = findByUsername(user.username);
  if (!row || !verifyPassword(String(payload.currentPassword || ""), row.password_hash)) {
    return NextResponse.json({ error: "Mot de passe actuel incorrect." }, { status: 401 });
  }

  const result = updateEmail(user.username, payload.email);
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ ok: true, email: result.email });
});
