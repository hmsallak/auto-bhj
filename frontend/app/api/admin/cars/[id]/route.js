import { NextResponse } from "next/server";
import { updateCar, deleteCar } from "../../../../../../backend/models/cars";
import { requireSession } from "../../../../../lib/adminAuth";
import { readCarPayload } from "../../../../../lib/carPayload";

async function handleUpdate(request, { params }) {
  if (!(await requireSession())) {
    return NextResponse.json({ error: "Connexion requise." }, { status: 401 });
  }

  const { id: rawId } = await params;
  const id = Number(rawId);
  let payload;
  try {
    payload = await readCarPayload(request);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const result = updateCar(id, payload);
  if (result.error) {
    const status = result.error === "Vehicule introuvable." ? 404 : 400;
    return NextResponse.json({ error: result.error }, { status });
  }

  return NextResponse.json(result.car);
}

export const POST = handleUpdate;
export const PUT = handleUpdate;

export async function DELETE(request, { params }) {
  if (!(await requireSession())) {
    return NextResponse.json({ error: "Connexion requise." }, { status: 401 });
  }

  const { id: rawId } = await params;
  const id = Number(rawId);
  const deleted = deleteCar(id);

  if (!deleted) {
    return NextResponse.json({ error: "Vehicule introuvable." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
