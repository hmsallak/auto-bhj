const crypto = require("crypto");
const { getDb } = require("../db/connection");
const { hashPassword } = require("./passwords");
const { validatePasswordStrength } = require("./passwordPolicy");
const { findByLogin } = require("../models/adminUsers");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TOKEN_TTL_MS = 1000 * 60 * 60 * 24; // 24h to confirm the address

function hashToken(token) {
  return crypto.createHash("sha256").update(String(token)).digest("hex");
}

function issueVerificationToken(username) {
  const token = crypto.randomBytes(32).toString("base64url");
  const now = Date.now();

  getDb()
    .prepare(
      "INSERT INTO email_verification_tokens (token_hash, username, created_at, expires_at, used_at) VALUES (?, ?, ?, ?, NULL)"
    )
    .run(hashToken(token), username, now, now + TOKEN_TTL_MS);

  return token;
}

// Registers a new account request. Returns one of:
//   { error }         -> show it (invalid e-mail / weak password)
//   { pending: true } -> address already known; respond vaguely, do nothing
//   { email, token }  -> send the confirmation e-mail with this token
function signup({ email, password }) {
  const cleanEmail = String(email || "").trim().toLowerCase();
  const pw = String(password || "");

  if (!EMAIL_RE.test(cleanEmail)) {
    return { error: "Adresse e-mail invalide." };
  }

  const weak = validatePasswordStrength(pw, { email: cleanEmail });
  if (weak) return { error: weak };

  const existing = findByLogin(cleanEmail);
  if (existing) {
    // Only an unconfirmed request may re-trigger its confirmation e-mail.
    if (existing.status === "pending_email") {
      return { email: cleanEmail, token: issueVerificationToken(existing.username) };
    }
    return { pending: true };
  }

  getDb()
    .prepare(
      "INSERT INTO admin_users " +
        "(username, password_hash, first_name, last_name, email, role, permissions, status, created_at) " +
        "VALUES (?, ?, '', '', ?, 'member', '[]', 'pending_email', ?)"
    )
    .run(cleanEmail, hashPassword(pw), cleanEmail, new Date().toISOString());

  return { email: cleanEmail, token: issueVerificationToken(cleanEmail) };
}

// Confirms the address: pending_email -> pending_approval. Returns
// { ok: true, email } or { error }.
function confirmEmailToken(token) {
  if (!token) return { error: "Lien invalide." };

  const db = getDb();
  const tokenHash = hashToken(token);
  const row = db
    .prepare("SELECT * FROM email_verification_tokens WHERE token_hash = ?")
    .get(tokenHash);

  if (!row || row.used_at || row.expires_at < Date.now()) {
    return { error: "Lien expire ou deja utilise. Refais une demande." };
  }

  const account = db
    .prepare("SELECT * FROM admin_users WHERE username = ?")
    .get(row.username);
  if (!account) return { error: "Compte introuvable." };

  // transitioned is true only on the real pending_email -> pending_approval
  // step, so clicking the link twice does not re-notify the owner.
  const transitioned = account.status === "pending_email";
  if (transitioned) {
    db.prepare("UPDATE admin_users SET status = 'pending_approval' WHERE username = ?").run(
      row.username
    );
  }
  db.prepare("UPDATE email_verification_tokens SET used_at = ? WHERE token_hash = ?").run(
    Date.now(),
    tokenHash
  );

  return { ok: true, email: account.email || row.username, transitioned };
}

module.exports = { signup, confirmEmailToken };
