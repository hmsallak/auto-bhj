const { getDb } = require("../db/connection");

const WINDOW_MS = 1000 * 60 * 10;
const MAX_ATTEMPTS = 8;

function isRateLimited(ip) {
  const db = getDb();
  const since = Date.now() - WINDOW_MS;
  const { count } = db
    .prepare("SELECT COUNT(*) AS count FROM login_attempts WHERE ip = ? AND attempted_at > ?")
    .get(ip, since);

  return count >= MAX_ATTEMPTS;
}

function recordFailedLogin(ip) {
  getDb()
    .prepare("INSERT INTO login_attempts (ip, attempted_at) VALUES (?, ?)")
    .run(ip, Date.now());
}

function clearFailedLogins(ip) {
  getDb().prepare("DELETE FROM login_attempts WHERE ip = ?").run(ip);
}

const CONTACT_WINDOW_MS = 1000 * 60 * 10;
const CONTACT_MAX = 6;

function isContactRateLimited(ip) {
  const since = Date.now() - CONTACT_WINDOW_MS;
  const { count } = getDb()
    .prepare("SELECT COUNT(*) AS count FROM contact_attempts WHERE ip = ? AND attempted_at > ?")
    .get(ip, since);

  return count >= CONTACT_MAX;
}

function recordContactAttempt(ip) {
  getDb()
    .prepare("INSERT INTO contact_attempts (ip, attempted_at) VALUES (?, ?)")
    .run(ip, Date.now());
}

module.exports = {
  isRateLimited,
  recordFailedLogin,
  clearFailedLogins,
  isContactRateLimited,
  recordContactAttempt,
};
