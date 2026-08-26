import { NextResponse } from "next/server";
import { getCurrentUser } from "../../../../lib/adminAuth";
import { apiRoute } from "../../../../lib/apiRoute";

export const GET = apiRoute(async function handleMe() {
  const user = await getCurrentUser();

  return NextResponse.json({
    authenticated: Boolean(user),
    username: user?.username || null,
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    role: user?.role || null,
    permissions: user?.permissions || [],
  });
});
