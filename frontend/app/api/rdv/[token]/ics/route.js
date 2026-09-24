import { NextResponse } from "next/server";
import { getAppointmentByToken } from "../../../../../../backend/models/appointments";
import { getCarByReference } from "../../../../../../backend/models/cars";
import { getSiteSettings } from "../../../../../../backend/models/siteSettings";
import { buildIcs } from "../../../../../../backend/calendar";
import { apiRoute } from "../../../../../lib/apiRoute";
import { resolveBaseUrl } from "../../../../../lib/appUrl";

// Public: the unguessable token is the only key, like the confirmation page.
export const GET = apiRoute(async function handleIcs(request, { params }) {
  const { token } = await params;
  const appointment = getAppointmentByToken(token);
  if (!appointment) {
    return NextResponse.json({ error: "Rendez-vous introuvable." }, { status: 404 });
  }

  const car = appointment.carReference ? getCarByReference(appointment.carReference) : null;
  const pageUrl = `${await resolveBaseUrl(request)}/rdv/${appointment.token}`;
  const ics = buildIcs({ appointment, car, settings: getSiteSettings(), pageUrl });

  return new NextResponse(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="rendez-vous-auto-bhj.ics"',
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex",
    },
  });
});
