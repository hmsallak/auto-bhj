import { NextResponse } from "next/server";
import { searchCars } from "../../../../backend/models/cars";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const cars = searchCars(searchParams.get("q") || "");
  return NextResponse.json(cars);
}
