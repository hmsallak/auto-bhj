import { NextResponse } from "next/server";
import { getCarByReference } from "../../../../../backend/models/cars";

export async function GET(request, { params }) {
  const { reference } = await params;
  const car = getCarByReference(reference);

  if (!car) {
    return NextResponse.json({ error: "Vehicule introuvable." }, { status: 404 });
  }

  return NextResponse.json(car);
}
