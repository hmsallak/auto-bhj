const crypto = require("crypto");
const { getDb } = require("../db/connection");
const { updatePassword } = require("../models/adminUsers");

const TOKEN_TTL_MS = 1000 * 60 * 30; // 30 minutes
const REQUEST_WINDOW_MS = 1000 * 60 * 60; // 1 hour
const MAX_REQUESTS_PER_WINDOW = 5;

function hashToken(token) {
  return crypto.createHash("sha256").update(String(token)).digest("hex");
}

// Match an admin by username OR recovery email (case-insensitive).
function findAdminByIdentifier(identifier) {
  const value = String(identifier || "").trim().toLowerCase();
  if (!value) return undefined;

  return getDb()
    .prepare(
      "SELECT * FROM admin_users WHERE lower(username) = ? OR (email IS NOT NULL AND lower(email) = ?)"
    )
    .get(value, value);
}

function tooManyRecentRequests(username) {
  const since = Date.now() - REQUEST_WINDOW_MS;
  const { count } = getDb()
    .prepare(
      "SELECT COUNT(*) AS count FROM password_reset_tokens WHERE username = ? AND created_at > ?"
    )
    .get(username, since);

  return count >= MAX_REQUESTS_PER_WINDOW;
}

// Creates a reset token when `identifier` matches an admin that has a
// recovery email set. Returns { email, token } on success, or null (caller
// MUST respond identically either way - no account enumeration).
function createResetToken(identifier) {
  const admin = findAdminByIdentifier(identifier);
  if (!admin || !admin.email) return null;
  if (tooManyRecentRequests(admin.username)) return null;

  const token = crypto.randomBytes(32).toString("base64url");
  const now = Date.now();

  getDb()
    .prepare(
      "INSERT INTO password_reset_tokens (token_hash, username, created_at, expires_at, used_at) VALUES (?, ?, ?, ?, NULL)"
    )
    .run(hashToken(token), admin.username, now, now + TOKEN_TTL_MS);

  return { email: admin.email, token };
}

// Consumes a token and sets the new password. Returns { ok: true } or
// { error }.
function resetPasswordWithToken(token, newPassword) {
  if (!token) return { error: "Lien invalide." };
  if (!newPassword || newPassword.length < 8) {
    return { error: "Le nouveau mot de passe doit contenir au moins 8 caracteres." };
  }

  const db = getDb();
  const tokenHash = hashToken(token);
  const row = db
    .prepare("SELECT * FROM password_reset_tokens WHERE token_hash = ?")
    .get(tokenHash);

  if (!row || row.used_at || row.expires_at < Date.now()) {
    return { error: "Lien expire ou deja utilise. Refais une demande." };
  }

  updatePassword(row.username, newPassword);

  // Burn this token and any other outstanding one for the same account.
  db.prepare(
    "UPDATE password_reset_tokens SET used_at = ? WHERE username = ? AND used_at IS NULL"
  ).run(Date.now(), row.username);

  return { ok: true };
}

module.exports = { createResetToken, resetPasswordWithToken };
