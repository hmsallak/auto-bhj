import { NextResponse } from "next/server";
import { listRecent } from "../../../../../backend/models/activityLog";
import { requireOwner, authError } from "../../../../lib/adminAuth";
import { apiRoute } from "../../../../lib/apiRoute";

export const GET = apiRoute(async function handleActivity() {
  const user = await requireOwner();
  if (!user) {
    const { status, error } = await authError();
    return NextResponse.json({ error }, { status });
  }

  return NextResponse.json(listRecent(20));
});
