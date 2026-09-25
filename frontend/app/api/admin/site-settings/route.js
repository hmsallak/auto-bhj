import { NextResponse } from "next/server";
import {
  getSiteSettings,
  updateSiteSettings,
} from "../../../../../backend/models/siteSettings";
import { findByUsername } from "../../../../../backend/models/adminUsers";
import { verifyPassword } from "../../../../../backend/auth/passwords";
import { requireOwner, authError } from "../../../../lib/adminAuth";
import { apiRoute } from "../../../../lib/apiRoute";
import activityLog from "../../../../../backend/models/activityLog";

export const GET = apiRoute(async function handleGet() {
  const user = await requireOwner();
  if (!user) {
    const { status, error } = await authError();
    return NextResponse.json({ error }, { status });
  }
  return NextResponse.json(getSiteSettings());
});

export const PATCH = apiRoute(async function handleUpdate(request) {
  const user = await requireOwner();
  if (!user) {
    const { status, error } = await authError();
    return NextResponse.json({ error }, { status });
  }

  const payload = await request.json().catch(() => ({}));

  // Mandatory password confirmation before any change takes effect.
  const admin = findByUsername(user.username);
  if (!admin || !verifyPassword(String(payload.currentPassword || ""), admin.password_hash)) {
    return NextResponse.json({ error: "Mot de passe actuel incorrect." }, { status: 403 });
  }

  const result = updateSiteSettings({ phone: payload.phone, email: payload.email });
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  activityLog.log(user.username, "site_settings_updated", `${result.settings.phone} - ${result.settings.email}`);
  return NextResponse.json(result.settings);
});
