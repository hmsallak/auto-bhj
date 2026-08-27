import { NextResponse } from "next/server";
import {
  updateUser,
  approveUser,
  rejectUser,
  deleteUser,
} from "../../../../../../backend/models/adminUsers";
import { sendMail, renderEmail } from "../../../../../../backend/mail";
import { requireOwner, authError } from "../../../../../lib/adminAuth";
import { apiRoute } from "../../../../../lib/apiRoute";

function baseUrl(request) {
  return (process.env.APP_URL || new URL(request.url).origin).replace(/\/$/, "");
}

export const PATCH = apiRoute(async function handleUpdate(request, { params }) {
  const user = await requireOwner();
  if (!user) {
    const { status, error } = await authError();
    return NextResponse.json({ error }, { status });
  }

  const { id } = await params;
  const payload = await request.json().catch(() => ({}));

  if (payload.approve) {
    const result = approveUser(Number(id), payload.permissions, user.username);
    if (result.error) {
      const status = result.error === "Utilisateur introuvable." ? 404 : 400;
      return NextResponse.json({ error: result.error }, { status });
    }

    if (result.user?.email) {
      const base = baseUrl(request);
      try {
        await sendMail({
          to: result.user.email,
          subject: "Ton compte Auto BHJ est actif",
          text:
            `Bonne nouvelle : ta demande de compte a ete approuvee.\n\n` +
            `Connecte-toi sur ${base}/admin avec ton adresse e-mail et ton mot de passe.`,
          html: renderEmail({
            heading: "Ton compte est actif",
            lines: [
              "Bonne nouvelle : ta demande de compte a ete approuvee par un administrateur.",
              "Tu peux maintenant te connecter avec ton adresse e-mail et le mot de passe choisi a l'inscription.",
            ],
            button: { label: "Acceder a l'espace admin", url: `${base}/admin` },
          }),
        });
      } catch (error) {
        console.error("[approve] mail send failed:", error.message);
      }
    }

    return NextResponse.json(result.user);
  }

  if (payload.reject) {
    const result = rejectUser(Number(id), user.username);
    if (result.error) {
      const status = result.error === "Utilisateur introuvable." ? 404 : 400;
      return NextResponse.json({ error: result.error }, { status });
    }
    return NextResponse.json({ ok: true });
  }

  const result = updateUser(Number(id), payload, user.username);
  if (result.error) {
    const status = result.error === "Utilisateur introuvable." ? 404 : 400;
    return NextResponse.json({ error: result.error }, { status });
  }

  return NextResponse.json(result.user);
});

export const DELETE = apiRoute(async function handleDelete(request, { params }) {
  const user = await requireOwner();
  if (!user) {
    const { status, error } = await authError();
    return NextResponse.json({ error }, { status });
  }

  const { id } = await params;
  const result = deleteUser(Number(id), user.username);
  if (result.error) {
    const status = result.error === "Utilisateur introuvable." ? 404 : 400;
    return NextResponse.json({ error: result.error }, { status });
  }

  return NextResponse.json({ ok: true });
});
