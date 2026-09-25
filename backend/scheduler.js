// Timed admin notifications, checked once a minute inside the web server:
// - "reminders": 1 hour before each appointment (once per appointment time);
// - "digest": the day's appointments, sent once between 08:00 and 11:00.
// Appointments are Brussels wall-clock strings, so "now" is computed in
// Europe/Brussels too, whatever timezone the server runs in (Railway: UTC).

const { getDb } = require("./db/connection");
const { getCarByReference } = require("./models/cars");
const { notify } = require("./notifications");

const TICK_MS = 60 * 1000;
const REMINDER_MINUTES = 60;
const DIGEST_FROM = "08:00";
const DIGEST_UNTIL = "11:00";

const brusselsFormat = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Europe/Brussels",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

function pad(value) {
  return String(value).padStart(2, "0");
}

// "YYYY-MM-DDTHH:MM" in Brussels, optionally shifted by minutes.
function brusselsNow(addMinutes = 0) {
  const parts = Object.fromEntries(
    brusselsFormat.formatToParts(new Date()).map((part) => [part.type, part.value])
  );
  const date = new Date(
    Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day), Number(parts.hour), Number(parts.minute) + addMinutes)
  );
  return (
    `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}` +
    `T${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}`
  );
}

function carLabel(reference) {
  const car = reference ? getCarByReference(reference) : null;
  return car ? `${car.brand} ${car.model}` : reference || "";
}

async function sendReminders(db) {
  const now = brusselsNow();
  const soon = brusselsNow(REMINDER_MINUTES);
  const due = db
    .prepare(
      `SELECT * FROM appointments
       WHERE reminder_sent_at IS NULL AND starts_at > ? AND starts_at <= ?
       ORDER BY starts_at`
    )
    .all(now, soon);

  for (const item of due) {
    // Mark first: a slow push must not make the next tick send it again.
    db.prepare("UPDATE appointments SET reminder_sent_at = ? WHERE id = ?").run(new Date().toISOString(), item.id);
    const car = carLabel(item.car_reference);
    await notify("reminders", {
      title: `Rendez-vous a ${item.starts_at.slice(11, 16)}`,
      body: `${item.name}${car ? ` - ${car}` : ""}`,
      url: `/admin?tab=appointments&appointment=${item.id}`,
      tag: `rdv-${item.id}`,
    });
  }
}

async function sendDigest(db) {
  const now = brusselsNow();
  const today = now.slice(0, 10);
  const time = now.slice(11, 16);
  if (time < DIGEST_FROM || time >= DIGEST_UNTIL) return;

  const key = `digest:${today}`;
  const logged = db
    .prepare("INSERT OR IGNORE INTO notification_log (key, sent_at) VALUES (?, ?)")
    .run(key, new Date().toISOString());
  if (!logged.changes) return; // already done today

  const items = db
    .prepare("SELECT * FROM appointments WHERE starts_at >= ? AND starts_at < ? ORDER BY starts_at")
    .all(`${today}T${time}`, `${today}T24:00`);
  if (!items.length) return;

  await notify("digest", {
    title: `Aujourd'hui : ${items.length} rendez-vous`,
    body: items.map((item) => `${item.starts_at.slice(11, 16)} ${item.name}`).join(" - "),
    url: "/admin?tab=appointments",
    tag: `digest-${today}`,
  });
}

async function tick() {
  try {
    const db = getDb();
    await sendReminders(db);
    await sendDigest(db);
  } catch (error) {
    console.error("[scheduler] tick failed:", error.message);
  }
}

// Idempotent: dev hot-reload may call it more than once in one process.
function startScheduler() {
  if (globalThis.__bhjSchedulerStarted) return;
  globalThis.__bhjSchedulerStarted = true;
  setTimeout(tick, 10 * 1000);
  setInterval(tick, TICK_MS);
  console.log("[scheduler] admin notifications scheduler started");
}

module.exports = { startScheduler, brusselsNow, tick };
