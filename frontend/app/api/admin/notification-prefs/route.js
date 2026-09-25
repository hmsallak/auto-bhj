import { NextResponse } from "next/server";
import { getPreferencesFor, savePreferences } from "../../../../../backend/notifications";
import { getCurrentUser, authError } from "../../../../lib/adminAuth";
import { apiRoute } from "../../../../lib/apiRoute";

// The logged-in admin's notification choices (only the types they may get).
export const GET = apiRoute(async function handleGet() {
  const user = await getCurrentUser();
  if (!user) {
    const { status, error } = await authError();
    return NextResponse.json({ error }, { status });
  }
  return NextResponse.json(getPreferencesFor(user.username, user));
});

// Body: { requests: true, reminders: false, ... } - unknown or forbidden keys are ignored.
export const PUT = apiRoute(async function handlePut(request) {
  const user = await getCurrentUser();
  if (!user) {
    const { status, error } = await authError();
    return NextResponse.json({ error }, { status });
  }
  const payload = await request.json().catch(() => ({}));
  return NextResponse.json(savePreferences(user.username, user, payload));
});
