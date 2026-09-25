const crypto = require("crypto");
const { getDb } = require("../db/connection");
const activityLog = require("./activityLog");

const STARTS_AT_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function rowToAppointment(row) {
  if (!row) return null;
  return {
    id: row.id,
    messageId: row.message_id,
    name: row.name,
    email: row.email || "",
    phone: row.phone || "",
    carReference: row.car_reference || "",
    startsAt: row.starts_at,
    note: row.note || "",
    token: row.token,
    createdBy: row.created_by,
    createdAt: row.created_at,
  };
}

function listAppointments() {
  return getDb()
    .prepare("SELECT * FROM appointments ORDER BY starts_at ASC")
    .all()
    .map(rowToAppointment);
}

function readSlot(payload) {
  const startsAt = String(payload.startsAt || "").trim();
  const note = String(payload.note || "").trim();

  if (!STARTS_AT_PATTERN.test(startsAt) || Number.isNaN(new Date(startsAt).getTime())) {
    return { error: "Date ou heure invalide." };
  }
  if (note.length > 500) {
    return { error: "Note trop longue." };
  }
  return { startsAt, note };
}

function createAppointment(payload, actor) {
  const { error, startsAt, note } = readSlot(payload);
  if (error) return { error };
  const db = getDb();
  let message;

  if (payload.messageId) {
    message = db.prepare("SELECT * FROM contact_messages WHERE id = ?").get(Number(payload.messageId));
    if (!message) return { error: "Demande introuvable." };
  } else {
    // Manual appointment (phone call, walk-in): no request behind it, so
    // the customer is typed in and shaped like a message row.
    const customer = payload.customer || {};
    const firstName = String(customer.firstName || "").trim();
    const lastName = String(customer.lastName || "").trim();
    const phone = String(customer.phone || "").trim();
    const carReference = String(customer.carReference || "").trim().toUpperCase();
    const email = String(customer.email || "").trim().toLowerCase();

    if (!firstName || !lastName) return { error: "Nom et prenom sont obligatoires." };
    if (phone.replace(/\D/g, "").length < 8) return { error: "Numero de GSM invalide." };
    if (`${firstName} ${lastName}`.length > 120 || phone.length > 40) return { error: "Champ trop long." };
    if (email && (!EMAIL_PATTERN.test(email) || email.length > 160)) return { error: "Adresse e-mail invalide." };

    message = {
      id: null,
      name: `${firstName} ${lastName}`,
      email: email || null,
      phone,
      car_reference: carReference || null,
    };
  }

  const info = db
    .prepare(
      `INSERT INTO appointments
        (message_id, name, email, phone, car_reference, starts_at, note, token, created_by, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      message.id,
      message.name,
      message.email,
      message.phone,
      message.car_reference,
      startsAt,
      note || null,
      crypto.randomBytes(16).toString("hex"),
      actor,
      new Date().toISOString()
    );

  activityLog.log(actor, "appointment_created", `${message.name} - ${startsAt.replace("T", " ")}`);

  return {
    appointment: rowToAppointment(
      db.prepare("SELECT * FROM appointments WHERE id = ?").get(info.lastInsertRowid)
    ),
  };
}

// Reschedule: only the date/time and note change, the customer stays.
function updateAppointment(id, payload, actor) {
  const { error, startsAt, note } = readSlot(payload);
  if (error) return { error };

  const db = getDb();
  const existing = db.prepare("SELECT * FROM appointments WHERE id = ?").get(id);
  if (!existing) return { error: "Rendez-vous introuvable." };

  // A new time needs a new reminder.
  db.prepare("UPDATE appointments SET starts_at = ?, note = ?, reminder_sent_at = NULL WHERE id = ?").run(
    startsAt,
    note || null,
    id
  );
  activityLog.log(actor, "appointment_updated", `${existing.name} - ${startsAt.replace("T", " ")}`);

  return { appointment: rowToAppointment(db.prepare("SELECT * FROM appointments WHERE id = ?").get(id)) };
}

// Returns the deleted appointment (so the caller can notify the customer),
// or null when it did not exist.
function deleteAppointment(id, actor) {
  const db = getDb();
  const existing = db.prepare("SELECT * FROM appointments WHERE id = ?").get(id);
  if (!existing) return null;

  db.prepare("DELETE FROM appointments WHERE id = ?").run(id);
  activityLog.log(actor, "appointment_deleted", `${existing.name} - ${existing.starts_at.replace("T", " ")}`);
  return rowToAppointment(existing);
}

// Public lookup for the customer's confirmation page and calendar file.
function getAppointmentByToken(token) {
  if (!/^[a-f0-9]{32}$/.test(String(token || ""))) return null;
  return rowToAppointment(getDb().prepare("SELECT * FROM appointments WHERE token = ?").get(token));
}

module.exports = {
  listAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getAppointmentByToken,
};
