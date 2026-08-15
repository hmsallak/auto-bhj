import { NextResponse } from "next/server";
import { listMessages } from "../../../../../backend/models/messages";
import { requirePermission } from "../../../../lib/adminAuth";

export async function GET() {
  if (!(await requirePermission("messages"))) {
    return NextResponse.json({ error: "Acces refuse." }, { status: 403 });
  }

  return NextResponse.json(listMessages());
}
