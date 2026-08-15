import { NextResponse } from "next/server";
import { listRecent } from "../../../../../backend/models/activityLog";
import { requireOwner } from "../../../../lib/adminAuth";

export async function GET() {
  const user = await requireOwner();
  if (!user) {
    return NextResponse.json({ error: "Acces refuse." }, { status: 403 });
  }

  return NextResponse.json(listRecent(20));
}
