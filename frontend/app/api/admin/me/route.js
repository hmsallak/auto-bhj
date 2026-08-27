import { NextResponse } from "next/server";
import { getCurrentUser } from "../../../../lib/adminAuth";
import { apiRoute } from "../../../../lib/apiRoute";
import { updateEmail } from "../../../../../backend/models/adminUsers";

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

// Lets the signed-in admin update their own recovery email.
export const PATCH = apiRoute(async function handleUpdateMe(request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Connexion requise." }, { status: 401 });
  }

  const payload = await request.json().catch(() => ({}));
  const result = updateEmail(user.username, payload.email);
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ ok: true, email: result.email });
});
