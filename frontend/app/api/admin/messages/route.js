import { NextResponse } from "next/server";
import { listMessages } from "../../../../../backend/models/messages";
import { requirePermission, authError } from "../../../../lib/adminAuth";
import { apiRoute } from "../../../../lib/apiRoute";

export const GET = apiRoute(async function handleList() {
  if (!(await requirePermission("messages_read"))) {
    const { status, error } = await authError();
    return NextResponse.json({ error }, { status });
  }

  return NextResponse.json(listMessages());
});
