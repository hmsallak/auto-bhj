import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { createResetToken } from "../../../../../backend/auth/passwordReset";
import { sendMail } from "../../../../../backend/mail";
import { isRateLimited, recordFailedLogin } from "../../../../../backend/auth/rateLimit";
import { getClientIp } from "../../../../lib/adminAuth";
import { apiRoute } from "../../../../lib/apiRoute";

async function resolveBaseUrl(request) {
  if (process.env.APP_URL) return process.env.APP_URL.replace(/\/$/, "");

  const store = await headers();
  const host = store.get("x-forwarded-host") || store.get("host");
  const proto = store.get("x-forwarded-proto") || "https";
  if (host) return `${proto}://${host}`;

  return new URL(request.url).origin;
}

export const POST = apiRoute(async function handleForgot(request) {
  const ip = await getClientIp();
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Trop de tentatives. Reessayez plus tard." },
      { status: 429 }
    );
  }

  const payload = await request.json().catch(() => ({}));
  const identifier = String(payload.identifier || "").trim();

  const result = createResetToken(identifier);

  if (result) {
    const base = await resolveBaseUrl(request);
    const link = `${base}/admin/reset?token=${encodeURIComponent(result.token)}`;
    try {
      await sendMail({
        to: result.email,
        subject: "Reinitialisation de votre mot de passe - Auto BHJ",
        text:
          `Pour choisir un nouveau mot de passe, ouvrez ce lien (valable 30 minutes) :\n\n` +
          `${link}\n\nSi vous n'avez rien demande, ignorez cet e-mail.`,
        html:
          `<p>Pour choisir un nouveau mot de passe, cliquez sur ce lien ` +
          `(valable 30 minutes) :</p>` +
          `<p><a href="${link}">${link}</a></p>` +
          `<p>Si vous n'avez rien demande, ignorez cet e-mail.</p>`,
      });
    } catch (error) {
      console.error("[forgot] mail send failed:", error.message);
    }
  } else {
    // Feed the shared login rate limiter so blind guessing gets throttled.
    recordFailedLogin(ip);
  }

  // Always the same answer - never reveal whether the account or email exists.
  return NextResponse.json({ ok: true });
});
