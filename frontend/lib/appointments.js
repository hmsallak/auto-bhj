// Appointments are stored as local wall-clock "YYYY-MM-DDTHH:MM" strings.
// new Date("YYYY-MM-DDTHH:MM") (no "Z") is parsed as local time, which is
// exactly what we want: no timezone conversion anywhere.

export function pad(value) {
  return String(value).padStart(2, "0");
}

export function toDateKey(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function startsAtDate(startsAt) {
  return new Date(startsAt);
}

export function formatAppointmentDay(startsAt) {
  return new Intl.DateTimeFormat("fr-BE", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(startsAtDate(startsAt));
}

export function formatAppointment(startsAt) {
  return `${formatAppointmentDay(startsAt)} a ${startsAt.slice(11, 16)}`;
}

export function isPastAppointment(startsAt) {
  return startsAtDate(startsAt).getTime() < Date.now();
}
