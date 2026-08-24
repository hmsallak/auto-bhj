import { NextResponse } from "next/server";
import { listMessages } from "../../../../../backend/models/messages";
import { requirePermission, authError } from "../../../../lib/adminAuth";

export async function GET() {
  if (!(await requirePermission("messages_read"))) {
    const { status, error } = await authError();
    return NextResponse.json({ error }, { status });
  }

  return NextResponse.json(listMessages());
}
