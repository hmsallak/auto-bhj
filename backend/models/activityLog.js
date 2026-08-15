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

module.exports = { log, listRecent };
