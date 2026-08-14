import { NextResponse } from "next/server";
import { listMessages } from "../../../../../backend/models/messages";
import { requireSession } from "../../../../lib/adminAuth";

export async function GET() {
  if (!(await requireSession())) {
    return NextResponse.json({ error: "Connexion requise." }, { status: 401 });
  }

  return NextResponse.json(listMessages());
}
