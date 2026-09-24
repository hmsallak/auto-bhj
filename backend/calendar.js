// Calendar helpers for customer appointments: the .ics file (Apple
// Calendar, Outlook, attached to the confirmation e-mail) and the Google
// Calendar "add event" link.
//
// Appointments are stored as Brussels wall-clock "YYYY-MM-DDTHH:MM", so the
// event is written with TZID=Europe/Brussels and a VTIMEZONE block: the
// customer's calendar converts it, we never do.

const GARAGE = {
  name: "Auto BHJ",
  address: "Mekingenweg 99, 1600 Sint-Pieters-Leeuw",
};
GARAGE.mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(GARAGE.address)}`;

const DURATION_MINUTES = 60;
const TIMEZONE = "Europe/Brussels";

// Standard EU rules (last Sunday of March / October) for Europe/Brussels.
const VTIMEZONE = [
  "BEGIN:VTIMEZONE",
  "TZID:Europe/Brussels",
  "BEGIN:DAYLIGHT",
  "TZOFFSETFROM:+0100",
  "TZOFFSETTO:+0200",
  "TZNAME:CEST",
  "DTSTART:19700329T020000",
  "RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU",
  "END:DAYLIGHT",
  "BEGIN:STANDARD",
  "TZOFFSETFROM:+0200",
  "TZOFFSETTO:+0100",
  "TZNAME:CET",
  "DTSTART:19701025T030000",
  "RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU",
  "END:STANDARD",
  "END:VTIMEZONE",
];

function pad(value) {
  return String(value).padStart(2, "0");
}

// "2026-09-26T18:30" -> "20260926T183000" (+ minutes, wall clock).
function compactLocal(startsAt, addMinutes = 0) {
  const [datePart, timePart] = startsAt.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);
  // Date.UTC only as a calendar calculator (handles day/month rollover);
  // the result is read back as-is, no timezone meaning.
  const date = new Date(Date.UTC(year, month - 1, day, hour, minute + addMinutes));
  return (
    `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}` +
    `T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}00`
  );
}

function escapeIcs(value) {
  return String(value || "")
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

// RFC 5545: content lines longer than 75 octets are folded.
function fold(line) {
  const parts = [];
  let rest = line;
  while (Buffer.byteLength(rest, "utf8") > 75) {
    let cut = 75;
    while (Buffer.byteLength(rest.slice(0, cut), "utf8") > 75) cut -= 1;
    parts.push(rest.slice(0, cut));
    rest = ` ${rest.slice(cut)}`;
  }
  parts.push(rest);
  return parts.join("\r\n");
}

function eventTitle(appointment, car) {
  const carLabel = car ? ` - ${car.brand} ${car.model}` : "";
  return `Rendez-vous ${GARAGE.name}${carLabel}`;
}

function eventDetails(appointment, car, settings, pageUrl) {
  return [
    car ? `Vehicule : ${car.brand} ${car.model} (${car.reference})` : null,
    appointment.note ? `Note : ${appointment.note}` : null,
    `Adresse : ${GARAGE.address}`,
    `Telephone : ${settings.phone}`,
    `E-mail : ${settings.email}`,
    pageUrl ? `Votre rendez-vous : ${pageUrl}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}

// method "REQUEST" for a new/updated event, "CANCEL" to remove it.
function buildIcs({ appointment, car, settings, pageUrl, method = "REQUEST", sequence = 0 }) {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Auto BHJ//Rendez-vous//FR",
    "CALSCALE:GREGORIAN",
    `METHOD:${method === "CANCEL" ? "CANCEL" : "PUBLISH"}`,
    ...VTIMEZONE,
    "BEGIN:VEVENT",
    `UID:rdv-${appointment.token}@autobhj.be`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")}`,
    `SEQUENCE:${sequence}`,
    `DTSTART;TZID=${TIMEZONE}:${compactLocal(appointment.startsAt)}`,
    `DTEND;TZID=${TIMEZONE}:${compactLocal(appointment.startsAt, DURATION_MINUTES)}`,
    `SUMMARY:${escapeIcs(eventTitle(appointment, car))}`,
    `LOCATION:${escapeIcs(GARAGE.address)}`,
    `DESCRIPTION:${escapeIcs(eventDetails(appointment, car, settings, pageUrl))}`,
    pageUrl ? `URL:${pageUrl}` : null,
    method === "CANCEL" ? "STATUS:CANCELLED" : "STATUS:CONFIRMED",
    // Reminder the day before is handled by the customer's own calendar
    // settings; one alert 2 hours before is a sensible default.
    method === "CANCEL" ? null : "BEGIN:VALARM",
    method === "CANCEL" ? null : "TRIGGER:-PT2H",
    method === "CANCEL" ? null : "ACTION:DISPLAY",
    method === "CANCEL" ? null : `DESCRIPTION:${escapeIcs(eventTitle(appointment, car))}`,
    method === "CANCEL" ? null : "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean);

  return `${lines.map(fold).join("\r\n")}\r\n`;
}

function googleCalendarUrl({ appointment, car, settings, pageUrl }) {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: eventTitle(appointment, car),
    dates: `${compactLocal(appointment.startsAt)}/${compactLocal(appointment.startsAt, DURATION_MINUTES)}`,
    ctz: TIMEZONE,
    location: GARAGE.address,
    details: eventDetails(appointment, car, settings, pageUrl),
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

module.exports = { GARAGE, DURATION_MINUTES, buildIcs, googleCalendarUrl };
