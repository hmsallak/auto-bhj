import { NextResponse } from "next/server";
import { isPastAppointment } from "../../../../../lib/appointments";
import { updateAppointment, deleteAppointment } from "../../../../../../backend/models/appointments";
import { requirePermission, authError } from "../../../../../lib/adminAuth";
import { apiRoute } from "../../../../../lib/apiRoute";
import { resolveBaseUrl } from "../../../../../lib/appUrl";
import { notifyAppointment } from "../../../../../../backend/appointmentMail";

export const PATCH = apiRoute(async function handleUpdate(request, { params }) {
  const user = await requirePermission("appointments_create");
  if (!user) {
    const { status, error } = await authError();
    return NextResponse.json({ error }, { status });
  }

  const payload = await request.json().catch(() => ({}));
  const { id: rawId } = await params;
  const result = updateAppointment(Number(rawId), payload, user.username);
  if (result.error) {
    const status = result.error === "Rendez-vous introuvable." ? 404 : 400;
    return NextResponse.json({ error: result.error }, { status });
  }

  const mailStatus = await notifyAppointment({
    appointment: result.appointment,
    kind: "updated",
    baseUrl: await resolveBaseUrl(request),
  });

  return NextResponse.json({ ...result.appointment, mailStatus });
});

export const DELETE = apiRoute(async function handleDelete(request, { params }) {
  const user = await requirePermission("appointments_cancel");
  if (!user) {
    const { status, error } = await authError();
    return NextResponse.json({ error }, { status });
  }

  const { id: rawId } = await params;
  const deleted = deleteAppointment(Number(rawId), user.username);
  if (!deleted) {
    return NextResponse.json({ error: "Rendez-vous introuvable." }, { status: 404 });
  }

  // A past appointment needs no cancellation notice.
  const mailStatus = isPastAppointment(deleted.startsAt)
    ? "none"
    : await notifyAppointment({ appointment: deleted, kind: "cancelled", baseUrl: await resolveBaseUrl(request) });

  return NextResponse.json({ ok: true, mailStatus });
});
