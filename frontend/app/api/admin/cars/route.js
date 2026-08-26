import { NextResponse } from "next/server";
import { createCar } from "../../../../../backend/models/cars";
import { requirePermission, authError } from "../../../../lib/adminAuth";
import { readCarPayload } from "../../../../lib/carPayload";
import { apiRoute } from "../../../../lib/apiRoute";

export const POST = apiRoute(async function handleCreate(request) {
  const user = await requirePermission("stock_create");
  if (!user) {
    const { status, error } = await authError();
    return NextResponse.json({ error }, { status });
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
});
