import { NextResponse } from "next/server";
import { createCar } from "../../../../../backend/models/cars";
import { requirePermission } from "../../../../lib/adminAuth";
import { readCarPayload } from "../../../../lib/carPayload";

export async function POST(request) {
  const user = await requirePermission("stock");
  if (!user) {
    return NextResponse.json({ error: "Acces refuse." }, { status: 403 });
  }

  let payload;
  try {
    payload = await readCarPayload(request);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const result = createCar(payload, user.username);
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json(result.car, { status: 201 });
}
