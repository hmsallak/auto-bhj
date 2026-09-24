import { NextResponse } from "next/server";
import { isPushConfigured, sendToUser } from "../../../../../../backend/push";
import { getCurrentUser, authError } from "../../../../../lib/adminAuth";
import { apiRoute } from "../../../../../lib/apiRoute";

// Sends a test notification to every device of the logged-in admin.
export const POST = apiRoute(async function handleTest() {
  const user = await getCurrentUser();
  if (!user) {
    const { status, error } = await authError();
    return NextResponse.json({ error }, { status });
  }
  if (!isPushConfigured()) {
    return NextResponse.json({ error: "Notifications non configurees sur le serveur." }, { status: 503 });
  }

  const { sent } = await sendToUser(user.username, {
    title: "Auto BHJ",
    body: "Les notifications fonctionnent sur cet appareil.",
    url: "/admin",
    tag: "test",
  });

  return NextResponse.json({ sent });
});
