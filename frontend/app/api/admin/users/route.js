import { NextResponse } from "next/server";
import { listUsers, createUser } from "../../../../../backend/models/adminUsers";
import { requireOwner, authError } from "../../../../lib/adminAuth";

export async function GET() {
  const user = await requireOwner();
  if (!user) {
    const { status, error } = await authError();
    return NextResponse.json({ error }, { status });
  }

  return NextResponse.json(listUsers());
}

export async function POST(request) {
  const user = await requireOwner();
  if (!user) {
    const { status, error } = await authError();
    return NextResponse.json({ error }, { status });
  }

  const payload = await request.json().catch(() => ({}));
  const result = createUser(payload, user.username);
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json(result.user, { status: 201 });
}
