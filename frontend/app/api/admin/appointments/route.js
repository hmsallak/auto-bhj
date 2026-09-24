import { NextResponse } from "next/server";
import { listAppointments, createAppointment } from "../../../../../backend/models/appointments";
import { requirePermission, authError } from "../../../../lib/adminAuth";
import { apiRoute } from "../../../../lib/apiRoute";
import { resolveBaseUrl } from "../../../../lib/appUrl";
import { notifyAppointment } from "../../../../../backend/appointmentMail";

// Appointments come out of customer requests, so they share the
// messages_read permission rather than adding a new one.
export const GET = apiRoute(async function handleList() {
  if (!(await requirePermission("messages_read"))) {
    const { status, error } = await authError();
    return NextResponse.json({ error }, { status });
  }

  return NextResponse.json(listAppointments());
});

export const POST = apiRoute(async function handleCreate(request) {
  const user = await requirePermission("messages_read");
  if (!user) {
    const { status, error } = await authError();
    return NextResponse.json({ error }, { status });
  }

  const payload = await request.json().catch(() => ({}));
  const result = createAppointment(payload, user.username);
  if (result.error) {
    const status = result.error === "Demande introuvable." ? 404 : 400;
    return NextResponse.json({ error: result.error }, { status });
  }

  const mailStatus = await notifyAppointment({
    appointment: result.appointment,
    kind: "created",
    baseUrl: await resolveBaseUrl(request),
  });

  return NextResponse.json({ ...result.appointment, mailStatus }, { status: 201 });
});
