import { NextResponse } from "next/server";
import { searchCars } from "../../../../backend/models/cars";
import { apiRoute } from "../../../lib/apiRoute";

export const GET = apiRoute(async function handleList(request) {
  const { searchParams } = new URL(request.url);
  const cars = searchCars(searchParams.get("q") || "");
  return NextResponse.json(cars);
});
