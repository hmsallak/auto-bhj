import { NextResponse } from "next/server";
import { listRecent, clearJournal, log } from "../../../../../backend/models/activityLog";
import { requireOwner, authError } from "../../../../lib/adminAuth";
import { apiRoute } from "../../../../lib/apiRoute";

export const GET = apiRoute(async function handleActivity() {
  const user = await requireOwner();
  if (!user) {
    const { status, error } = await authError();
    return NextResponse.json({ error }, { status });
  }

  // Split into four journals client-side: keep a useful depth for each.
  return NextResponse.json(listRecent(200));
});

const JOURNAL_LABELS = { cars: "Voitures", messages: "Messages", appointments: "Rendez-vous", settings: "Parametres" };

// Owner only: empty one journal (?journal=cars|messages|appointments|settings).
export const DELETE = apiRoute(async function handleClear(request) {
  const user = await requireOwner();
  if (!user) {
    const { status, error } = await authError();
    return NextResponse.json({ error }, { status });
  }

  const journal = new URL(request.url).searchParams.get("journal");
  const deleted = clearJournal(journal);
  if (deleted === null) {
    return NextResponse.json({ error: "Journal inconnu." }, { status: 400 });
  }

  log(user.username, "journal_cleared", `Journal ${JOURNAL_LABELS[journal]} (${deleted} entree${deleted > 1 ? "s" : ""})`);
  return NextResponse.json({ deleted });
});
