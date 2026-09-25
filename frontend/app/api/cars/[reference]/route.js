import { NextResponse } from "next/server";
import { getCarByReference, toPublicCar } from "../../../../../backend/models/cars";
import { apiRoute } from "../../../../lib/apiRoute";

export const GET = apiRoute(async function handleGet(request, { params }) {
  const { reference } = await params;
  const car = getCarByReference(reference);

  if (!car) {
    return NextResponse.json({ error: "Vehicule introuvable." }, { status: 404 });
  }

  return NextResponse.json(toPublicCar(car));
});
