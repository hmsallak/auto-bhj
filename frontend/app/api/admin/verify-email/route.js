import { NextResponse } from "next/server";
import { confirmEmailToken } from "../../../../../backend/auth/accountSignup";
import { getOwnerEmails } from "../../../../../backend/models/adminUsers";
import { sendMail, renderEmail, escapeHtml } from "../../../../../backend/mail";
import { notify } from "../../../../../backend/notifications";
import { apiRoute } from "../../../../lib/apiRoute";
import { resolveBaseUrl } from "../../../../lib/appUrl";


export const POST = apiRoute(async function handleVerifyEmail(request) {
  const payload = await request.json().catch(() => ({}));
  const result = confirmEmailToken(payload.token);

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  // Notify the owner(s) only on the real step to pending_approval.
  if (result.transitioned) {
    notify("access", {
      title: "Nouvelle demande d'acces",
      body: `${result.email} attend ton approbation.`,
      url: "/admin?tab=users",
      tag: "access-request",
    }).catch(() => {});

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
                `<strong>${escapeHtml(result.email)}</strong> a confirme son adresse e-mail et attend ton approbation.`,
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
