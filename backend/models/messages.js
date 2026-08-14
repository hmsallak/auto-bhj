const { getDb } = require("../db/connection");

function cleanText(value) {
  return String(value ?? "").trim();
}

function rowToMessage(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone || "",
    carReference: row.car_reference || "",
    message: row.message,
    isRead: Boolean(row.is_read),
    createdAt: row.created_at,
  };
}

function createMessage(payload) {
  const name = cleanText(payload.name);
  const email = cleanText(payload.email);
  const phone = cleanText(payload.phone);
  const carReference = cleanText(payload.carReference).toUpperCase();
  const message = cleanText(payload.message);

  if (!name || !email || !message) {
    return { error: "Nom, email et message sont obligatoires." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Adresse email invalide." };
  }

  if (message.length > 4000) {
    return { error: "Message trop long." };
  }

  const db = getDb();
  const now = new Date().toISOString();

  const info = db
    .prepare(
      `INSERT INTO contact_messages (name, email, phone, car_reference, message, is_read, created_at)
       VALUES (?, ?, ?, ?, ?, 0, ?)`
    )
    .run(name, email, phone || null, carReference || null, message, now);

  return { message: rowToMessage(db.prepare("SELECT * FROM contact_messages WHERE id = ?").get(info.lastInsertRowid)) };
}

function listMessages() {
  const db = getDb();
  return db
    .prepare("SELECT * FROM contact_messages ORDER BY created_at DESC")
    .all()
    .map(rowToMessage);
}

function markMessageRead(id, isRead) {
  const db = getDb();
  db.prepare("UPDATE contact_messages SET is_read = ? WHERE id = ?").run(isRead ? 1 : 0, id);
}

function deleteMessage(id) {
  const db = getDb();
  const info = db.prepare("DELETE FROM contact_messages WHERE id = ?").run(id);
  return info.changes > 0;
}

module.exports = { createMessage, listMessages, markMessageRead, deleteMessage };
