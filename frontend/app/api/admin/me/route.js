import { NextResponse } from "next/server";
import { getCurrentUser } from "../../../../lib/adminAuth";
import { apiRoute } from "../../../../lib/apiRoute";
import { requestEmailChange, findByUsername } from "../../../../../backend/models/adminUsers";
import { verifyPassword } from "../../../../../backend/auth/passwords";
import { issueEmailChangeToken, cancelEmailChange } from "../../../../../backend/auth/emailChange";
import { sendMail, renderEmail } from "../../../../../backend/mail";
import { resolveBaseUrl } from "../../../../lib/appUrl";

export const GET = apiRoute(async function handleMe() {
  const user = await getCurrentUser();

  return NextResponse.json({
    authenticated: Boolean(user),
    username: user?.username || null,
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    pendingEmail: user?.pendingEmail || "",
    role: user?.role || null,
    isAdmin: Boolean(user?.isAdmin),
    permissions: user?.permissions || [],
  });
});

// Lets the signed-in admin update their own login / recovery e-mail. The
// current password is required: with only an open session, someone could
// otherwise swap in their own address and take the account via "forgot".

export const PATCH = apiRoute(async function handleUpdateMe(request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Connexion requise." }, { status: 401 });
  }

  const payload = await request.json().catch(() => ({}));
  const row = findByUsername(user.username);
  if (!row || !verifyPassword(String(payload.currentPassword || ""), row.password_hash)) {
    return NextResponse.json({ error: "Mot de passe actuel incorrect." }, { status: 403 });
  }

  const result = requestEmailChange(user.username, payload.email);
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  if (!result.pendingEmail) {
    return NextResponse.json({ ok: true, pendingEmail: "" });
  }

  const token = issueEmailChangeToken(user.username, result.pendingEmail);
  const link = `${await resolveBaseUrl(request)}/admin/confirm-email?token=${encodeURIComponent(token)}`;
  try {
    const delivery = await sendMail({
      to: result.pendingEmail,
      subject: "Confirme ta nouvelle adresse - Espace Auto BHJ",
      text:
        `Confirme cette adresse e-mail pour l'utiliser avec ton compte administrateur ` +
        `(lien valable 24 heures) :\n\n${link}\n\n` +
        `Si tu n'as pas demande cette modification, ignore cet e-mail.`,
      html: renderEmail({
        heading: "Confirme ta nouvelle adresse",
        lines: [
          "Une modification de l'adresse e-mail de ton compte administrateur Auto BHJ a ete demandee.",
          "Clique sur le bouton ci-dessous pour confirmer que cette adresse t'appartient.",
        ],
        button: { label: "Confirmer mon adresse", url: link },
        footnote: "Lien valable 24 heures. Si tu n'es pas a l'origine de cette demande, ignore cet e-mail.",
      }),
    });
    if (!delivery.sent) {
      cancelEmailChange(user.username);
      return NextResponse.json(
        { error: "E-mail non envoye : l'envoi n'est pas configure sur cet environnement." },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error("[admin] e-mail change confirmation failed:", error.message);
    cancelEmailChange(user.username);
    return NextResponse.json(
      { error: "L'e-mail de confirmation n'a pas pu etre envoye. Reessaie plus tard." },
      { status: 503 }
    );
  }

  return NextResponse.json({ ok: true, pendingEmail: result.pendingEmail });
});
