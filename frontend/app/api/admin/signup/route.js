import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { signup } from "../../../../../backend/auth/accountSignup";
import { sendMail, renderEmail } from "../../../../../backend/mail";
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

export const POST = apiRoute(async function handleSignup(request) {
  const ip = await getClientIp();
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Trop de tentatives. Reessayez plus tard." },
      { status: 429 }
    );
  }

  const payload = await request.json().catch(() => ({}));
  const result = signup({ email: payload.email, password: payload.password });

  if (result.error) {
    recordFailedLogin(ip);
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  if (result.token) {
    const link = `${await resolveBaseUrl(request)}/admin/verify-email?token=${encodeURIComponent(
      result.token
    )}`;
    try {
      await sendMail({
        to: result.email,
        subject: "Confirme ton adresse - Espace Auto BHJ",
        text:
          `Confirme ton adresse e-mail pour finaliser ta demande de compte ` +
          `(lien valable 24 heures) :\n\n${link}\n\n` +
          `Si tu n'es pas a l'origine de cette demande, ignore cet e-mail.`,
        html: renderEmail({
          heading: "Confirme ton adresse",
          lines: [
            "Tu as demande un compte pour l'espace administrateur d'Auto BHJ.",
            "Clique sur le bouton ci-dessous pour confirmer ton adresse. Ta demande sera ensuite examinee par un administrateur.",
          ],
          button: { label: "Confirmer mon adresse", url: link },
          footnote:
            "Lien valable 24 heures. Si tu n'es pas a l'origine de cette demande, ignore cet e-mail.",
        }),
      });
    } catch (error) {
      console.error("[signup] mail send failed:", error.message);
    }
  }

  // Same answer whether or not the address was already known.
  return NextResponse.json({ ok: true });
});
