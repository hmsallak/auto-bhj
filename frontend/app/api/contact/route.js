import { NextResponse } from "next/server";
import { createMessage } from "../../../../backend/models/messages";
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

  return NextResponse.json({ ok: true }, { status: 201 });
});
