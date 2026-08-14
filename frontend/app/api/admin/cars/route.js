import { NextResponse } from "next/server";
import { createCar } from "../../../../../backend/models/cars";
import { requireSession } from "../../../../lib/adminAuth";
import { readCarPayload } from "../../../../lib/carPayload";

export async function POST(request) {
  if (!(await requireSession())) {
    return NextResponse.json({ error: "Connexion requise." }, { status: 401 });
  }

  let payload;
  try {
    payload = await readCarPayload(request);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const result = createCar(payload);
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json(result.car, { status: 201 });
}
