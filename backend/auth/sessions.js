const crypto = require("crypto");
const { getDb } = require("../db/connection");

const SESSION_SECRET =
  process.env.SESSION_SECRET || crypto.randomBytes(32).toString("hex");
const SESSION_TTL_MS = 1000 * 60 * 60 * 8;
// A session also dies after this long with no request at all, even if the
// 8h absolute cap hasn't been reached yet - whichever limit hits first wins.
const SESSION_IDLE_TTL_MS = 1000 * 60 * 60;

function sign(value) {
  return crypto.createHmac("sha256", SESSION_SECRET).update(value).digest("base64url");
}

function createSessionToken(username) {
  const db = getDb();
  const id = crypto.randomBytes(32).toString("base64url");
  const signature = sign(id);
  const now = Date.now();

  db.prepare(
    "INSERT INTO sessions (id, username, created_at, expires_at, last_seen_at) VALUES (?, ?, ?, ?, ?)"
  ).run(id, username, now, now + SESSION_TTL_MS, now);

  return `${id}.${signature}`;
}

function verifySessionToken(token) {
  if (!token) return null;

  const [id, signature] = String(token).split(".");
  if (!id || !signature || sign(id) !== signature) return null;

  const db = getDb();
  const session = db.prepare("SELECT * FROM sessions WHERE id = ?").get(id);
  if (!session) return null;

  const now = Date.now();
  const lastSeen = session.last_seen_at || session.created_at;

  if (session.expires_at < now || now - lastSeen > SESSION_IDLE_TTL_MS) {
    db.prepare("DELETE FROM sessions WHERE id = ?").run(id);
    return null;
  }

  db.prepare("UPDATE sessions SET last_seen_at = ? WHERE id = ?").run(now, id);

  return { id: session.id, username: session.username };
}

function destroySessionToken(token) {
  const [id] = String(token || "").split(".");
  if (!id) return;
  getDb().prepare("DELETE FROM sessions WHERE id = ?").run(id);
}

module.exports = {
  SESSION_TTL_MS,
  SESSION_IDLE_TTL_MS,
  createSessionToken,
  verifySessionToken,
  destroySessionToken,
};
