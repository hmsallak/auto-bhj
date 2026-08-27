import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { confirmEmailToken } from "../../../../../backend/auth/accountSignup";
import { getOwnerEmails } from "../../../../../backend/models/adminUsers";
import { sendMail, renderEmail } from "../../../../../backend/mail";
import { apiRoute } from "../../../../lib/apiRoute";

async function resolveBaseUrl(request) {
  if (process.env.APP_URL) return process.env.APP_URL.replace(/\/$/, "");

  const store = await headers();
  const host = store.get("x-forwarded-host") || store.get("host");
  const proto = store.get("x-forwarded-proto") || "https";
  if (host) return `${proto}://${host}`;

  return new URL(request.url).origin;
}

export const POST = apiRoute(async function handleVerifyEmail(request) {
  const payload = await request.json().catch(() => ({}));
  const result = confirmEmailToken(payload.token);

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  // Notify the owner(s) only on the real step to pending_approval.
  if (result.transitioned) {
    const owners = getOwnerEmails();
    if (owners.length) {
      const base = await resolveBaseUrl(request);
      for (const to of owners) {
        try {
          await sendMail({
            to,
            subject: "Nouvelle demande de compte - Auto BHJ",
            text:
              `${result.email} a confirme son adresse et attend ton approbation.\n\n` +
              `Gere la demande dans l'onglet Equipe : ${base}/admin`,
            html: renderEmail({
              heading: "Nouvelle demande de compte",
              lines: [
                `<strong>${result.email}</strong> a confirme son adresse e-mail et attend ton approbation.`,
                "Ouvre l'onglet Equipe pour lui attribuer des droits ou refuser la demande.",
              ],
              button: { label: "Ouvrir l'espace admin", url: `${base}/admin` },
            }),
          });
        } catch (error) {
          console.error("[verify-email] owner notice failed:", error.message);
        }
      }
    }
  }

  return NextResponse.json({ ok: true });
});
