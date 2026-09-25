import { NextResponse } from "next/server";
import { createMessage } from "../../../../backend/models/messages";
import { getCarByReference } from "../../../../backend/models/cars";
import { notify } from "../../../../backend/notifications";
import { isContactRateLimited, recordContactAttempt } from "../../../../backend/auth/rateLimit";
import { getClientIp } from "../../../lib/adminAuth";
import { apiRoute } from "../../../lib/apiRoute";

export const POST = apiRoute(async function handleContact(request) {
  const ip = await getClientIp();
  if (isContactRateLimited(ip)) {
    return NextResponse.json(
      { error: "Trop de messages envoyes. Reessayez plus tard." },
      { status: 429 }
    );
  }

  const payload = await request.json().catch(() => ({}));

  // Honeypot: a hidden field a real user never fills. Bots do - drop it
  // silently with a success-looking response so they do not retry.
  if (typeof payload.company === "string" && payload.company.trim() !== "") {
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  recordContactAttempt(ip);

  const result = createMessage(payload);
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  // Push to the team; not awaited so the visitor never waits on it.
  const message = result.message;
  const car = message.carReference ? getCarByReference(message.carReference) : null;
  notify("requests", {
    title: "Nouvelle demande",
    body: `${message.name}${car ? ` - ${car.brand} ${car.model}` : ""}`,
    url: `/admin?tab=messages&message=${message.id}`,
    tag: `message-${message.id}`,
  }).catch(() => {});

  return NextResponse.json({ ok: true }, { status: 201 });
});
