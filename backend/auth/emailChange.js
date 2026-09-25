const crypto = require("crypto");
const { getDb } = require("../db/connection");

const TOKEN_TTL_MS = 1000 * 60 * 60 * 24;

function hashToken(token) {
  return crypto.createHash("sha256").update(String(token)).digest("hex");
}

function issueEmailChangeToken(username, email) {
  const token = crypto.randomBytes(32).toString("base64url");
  const now = Date.now();
  const db = getDb();
  db.prepare("DELETE FROM email_change_tokens WHERE username = ?").run(username);
  db.prepare(
    "INSERT INTO email_change_tokens (token_hash, username, email, created_at, expires_at, used_at) VALUES (?, ?, ?, ?, ?, NULL)"
  ).run(hashToken(token), username, email, now, now + TOKEN_TTL_MS);
  return token;
}

function cancelEmailChange(username) {
  const db = getDb();
  db.exec("BEGIN IMMEDIATE;");
  try {
    db.prepare("DELETE FROM email_change_tokens WHERE username = ?").run(username);
    db.prepare("UPDATE admin_users SET pending_email = NULL WHERE username = ?").run(username);
    db.exec("COMMIT;");
  } catch (error) {
    db.exec("ROLLBACK;");
    throw error;
  }
}

function confirmEmailChange(token) {
  if (!token) return { error: "Lien invalide." };
  const db = getDb();
  const tokenHash = hashToken(token);
  const row = db.prepare("SELECT * FROM email_change_tokens WHERE token_hash = ?").get(tokenHash);
  if (!row || row.used_at || row.expires_at < Date.now()) {
    return { error: "Lien expire ou deja utilise. Refais la demande depuis Parametres." };
  }

  const account = db.prepare("SELECT * FROM admin_users WHERE username = ?").get(row.username);
  if (!account || account.pending_email !== row.email) {
    return { error: "Cette modification n'est plus en attente." };
  }

  const conflict = db
    .prepare("SELECT 1 FROM admin_users WHERE lower(email) = ? AND username != ?")
    .get(row.email.toLowerCase(), row.username);
  if (conflict) return { error: "Cette adresse est deja utilisee par un autre compte." };

  db.exec("BEGIN IMMEDIATE;");
  try {
    db.prepare("UPDATE admin_users SET email = ?, pending_email = NULL WHERE username = ?").run(row.email, row.username);
    db.prepare("UPDATE email_change_tokens SET used_at = ? WHERE token_hash = ?").run(Date.now(), tokenHash);
    db.exec("COMMIT;");
  } catch (error) {
    db.exec("ROLLBACK;");
    throw error;
  }
  return { ok: true, email: row.email };
}

module.exports = { issueEmailChangeToken, cancelEmailChange, confirmEmailChange };
