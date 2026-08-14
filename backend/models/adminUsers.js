const { getDb } = require("../db/connection");
const { hashPassword } = require("../auth/passwords");

function findByUsername(username) {
  const db = getDb();
  return db
    .prepare("SELECT * FROM admin_users WHERE username = ?")
    .get(String(username || "").trim());
}

function updatePassword(username, newPassword) {
  const db = getDb();
  db.prepare("UPDATE admin_users SET password_hash = ? WHERE username = ?").run(
    hashPassword(newPassword),
    String(username || "").trim()
  );
}

function countAdmins() {
  const db = getDb();
  return db.prepare("SELECT COUNT(*) AS count FROM admin_users").get().count;
}

function ensureSeedAdmin(username, password) {
  if (countAdmins() > 0) return;

  const db = getDb();
  db.prepare(
    "INSERT INTO admin_users (username, password_hash, created_at) VALUES (?, ?, ?)"
  ).run(String(username).trim(), hashPassword(password), new Date().toISOString());
}

module.exports = { findByUsername, countAdmins, ensureSeedAdmin, updatePassword };
