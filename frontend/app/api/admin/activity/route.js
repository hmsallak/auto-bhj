import { NextResponse } from "next/server";
import { listRecent } from "../../../../../backend/models/activityLog";
import { requireOwner, authError } from "../../../../lib/adminAuth";

export async function GET() {
  const user = await requireOwner();
  if (!user) {
    const { status, error } = await authError();
    return NextResponse.json({ error }, { status });
  }

  return NextResponse.json(listRecent(20));
}
