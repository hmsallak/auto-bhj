import { notFound } from "next/navigation";
import { getAppointmentByToken } from "../../../../../backend/models/appointments";
import { getCarByReference } from "../../../../../backend/models/cars";
import { getSiteSettings } from "../../../../../backend/models/siteSettings";
import { GARAGE, googleCalendarUrl } from "../../../../../backend/calendar";
import { resolveBaseUrl } from "../../../../lib/appUrl";
import AppointmentConfirmation from "../../../../components/site/AppointmentConfirmation";

// Private page reached from the confirmation e-mail: always fresh (the
// appointment can be moved or cancelled) and never indexed.
export const dynamic = "force-dynamic";

export const metadata = {
  title: { absolute: "Votre rendez-vous - Auto BHJ" },
  robots: { index: false, follow: false },
};

export default async function AppointmentPage({ params }) {
  const { token } = await params;
  const appointment = getAppointmentByToken(token);
  if (!appointment) notFound();

  const car = appointment.carReference ? getCarByReference(appointment.carReference) : null;
  const settings = getSiteSettings();
  const pageUrl = `${await resolveBaseUrl(new Request("http://localhost"))}/rdv/${appointment.token}`;

  // Only what the customer needs: no internal note author, no message id.
  return (
    <AppointmentConfirmation
      appointment={{
        name: appointment.name,
        startsAt: appointment.startsAt,
        note: appointment.note,
        token: appointment.token,
      }}
      car={
        car
          ? {
              brand: car.brand,
              model: car.model,
              reference: car.reference,
              imageUrl: car.imageUrl,
              status: car.status,
            }
          : null
      }
      garage={{ address: GARAGE.address, mapsUrl: GARAGE.mapsUrl }}
      googleUrl={googleCalendarUrl({ appointment, car, settings, pageUrl })}
    />
  );
}
