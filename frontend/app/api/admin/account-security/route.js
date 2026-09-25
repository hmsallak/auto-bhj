import { NextResponse } from "next/server";
import { requireSession, requireAdmin, authError } from "../../../../lib/adminAuth";
import { findByUsername } from "../../../../../backend/models/adminUsers";
import { verifyPassword } from "../../../../../backend/auth/passwords";
import { destroyUserSessions, listUserSessions } from "../../../../../backend/auth/sessions";
import { listSubscriptions } from "../../../../../backend/push";
import { apiRoute } from "../../../../lib/apiRoute";

export const GET = apiRoute(async function handleGet() {
  const session = await requireSession();
  const user = await requireAdmin();
  if (!session || !user) {
    const { status, error } = await authError();
    return NextResponse.json({ error }, { status });
  }
  return NextResponse.json({
    sessions: listUserSessions(user.username, session.id),
    notificationDevices: listSubscriptions(user.username),
  });
});

export const POST = apiRoute(async function handleDisconnectOthers(request) {
  const session = await requireSession();
  const user = await requireAdmin();
  if (!session || !user) {
    const { status, error } = await authError();
    return NextResponse.json({ error }, { status });
  }
  const payload = await request.json().catch(() => ({}));
  const account = findByUsername(user.username);
  if (!account || !verifyPassword(String(payload.currentPassword || ""), account.password_hash)) {
    return NextResponse.json({ error: "Mot de passe actuel incorrect." }, { status: 403 });
  }
  destroyUserSessions(user.username, session.id);
  return NextResponse.json({
    ok: true,
    sessions: listUserSessions(user.username, session.id),
    notificationDevices: listSubscriptions(user.username),
  });
});
