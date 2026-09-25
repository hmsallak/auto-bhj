const { getDb } = require("../db/connection");

function log(actor, action, target) {
  const db = getDb();
  db.prepare(
    "INSERT INTO activity_log (actor, action, target, created_at) VALUES (?, ?, ?, ?)"
  ).run(String(actor || "systeme"), action, target || null, new Date().toISOString());
}

function listRecent(limit = 12) {
  const db = getDb();
  return db
    .prepare("SELECT * FROM activity_log ORDER BY created_at DESC LIMIT ?")
    .all(limit)
    .map((row) => ({
      id: row.id,
      actor: row.actor,
      action: row.action,
      target: row.target,
      createdAt: row.created_at,
    }));
}

// Journals shown in Admin > Utilisateurs > Journal, by action prefix.
const JOURNAL_PREFIXES = {
  cars: ["car_"],
  messages: ["message_"],
  appointments: ["appointment_"],
  settings: ["user_", "site_settings", "journal_"],
};

// Deletes every entry of one journal; returns how many went. The clearing
// itself is then logged (in the Parametres journal) so it leaves a trace.
function clearJournal(journal) {
  const prefixes = JOURNAL_PREFIXES[journal];
  if (!prefixes) return null;
  const where = prefixes.map(() => "action LIKE ?").join(" OR ");
  const info = getDb()
    .prepare(`DELETE FROM activity_log WHERE ${where}`)
    .run(...prefixes.map((prefix) => `${prefix}%`));
  return info.changes;
}

module.exports = { log, listRecent, clearJournal };
