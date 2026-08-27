import { NextResponse } from "next/server";
import { getSiteSettings } from "../../../../backend/models/siteSettings";
import { apiRoute } from "../../../lib/apiRoute";

export const dynamic = "force-dynamic";

export const GET = apiRoute(async function handleGet() {
  return NextResponse.json(getSiteSettings());
});
