import { NextResponse } from "next/server";
import { listAppointments, createAppointment } from "../../../../../backend/models/appointments";
import { requirePermission, requireAnyPermission, authError } from "../../../../lib/adminAuth";
import { APPOINTMENT_VIEW_PERMISSIONS } from "../../../../../backend/models/adminUsers";
import { apiRoute } from "../../../../lib/apiRoute";
import { resolveBaseUrl } from "../../../../lib/appUrl";
import { notifyAppointment } from "../../../../../backend/appointmentMail";

// Viewing: either appointment right. Creating: "Planifier RDV".
export const GET = apiRoute(async function handleList() {
  if (!(await requireAnyPermission(APPOINTMENT_VIEW_PERMISSIONS))) {
    const { status, error } = await authError();
    return NextResponse.json({ error }, { status });
  }

  return NextResponse.json(listAppointments());
});

export const POST = apiRoute(async function handleCreate(request) {
  const user = await requirePermission("appointments_create");
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
