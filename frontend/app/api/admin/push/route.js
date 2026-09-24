import { NextResponse } from "next/server";
import { headers } from "next/headers";
import {
  countSubscriptions,
  publicKey,
  removeSubscription,
  saveSubscription,
} from "../../../../../backend/push";
import { getCurrentUser, authError } from "../../../../lib/adminAuth";
import { apiRoute } from "../../../../lib/apiRoute";

async function requireUser() {
  const user = await getCurrentUser();
  if (user) return { user };
  const { status, error } = await authError();
  return { response: NextResponse.json({ error }, { status }) };
}

// Is push available, and with which public key the browser should subscribe.
export const GET = apiRoute(async function handleStatus() {
  const { user, response } = await requireUser();
  if (response) return response;

  return NextResponse.json({
    publicKey: publicKey(),
    devices: countSubscriptions(user.username),
  });
});

// Registers this device for the logged-in admin.
export const POST = apiRoute(async function handleSubscribe(request) {
  const { user, response } = await requireUser();
  if (response) return response;

  const payload = await request.json().catch(() => ({}));
  const userAgent = (await headers()).get("user-agent");
  const result = saveSubscription(user.username, payload.subscription, userAgent);
  if (result.error) return NextResponse.json({ error: result.error }, { status: 400 });

  return NextResponse.json({ ok: true });
});

// Turns notifications off for this device.
export const DELETE = apiRoute(async function handleUnsubscribe(request) {
  const { response } = await requireUser();
  if (response) return response;

  const payload = await request.json().catch(() => ({}));
  removeSubscription(payload.endpoint);
  return NextResponse.json({ ok: true });
});
