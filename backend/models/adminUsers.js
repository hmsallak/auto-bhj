const { getDb } = require("../db/connection");
const { hashPassword } = require("../auth/passwords");
const activityLog = require("./activityLog");

const VALID_PERMISSIONS = [
  "stock_read",
  "stock_write",
  "stock_create",
  "stock_delete",
  "messages_read",
  "messages_delete",
];

const LEGACY_PERMISSION_MAP = {
  stock: ["stock_read", "stock_write", "stock_create", "stock_delete"],
  messages: ["messages_read", "messages_delete"],
};

function cleanText(value) {
  return String(value ?? "").trim();
}

function parsePermissions(raw) {
  try {
    const list = JSON.parse(raw || "[]");
    return normalizePermissions(Array.isArray(list) ? list : []);
  } catch {
    return [];
  }
}

function normalizePermissions(permissions) {
  const expanded = new Set();

  for (const permission of permissions || []) {
    if (VALID_PERMISSIONS.includes(permission)) {
      expanded.add(permission);
      continue;
    }

    for (const mapped of LEGACY_PERMISSION_MAP[permission] || []) {
      expanded.add(mapped);
    }
  }

  if (
    expanded.has("stock_write") ||
    expanded.has("stock_create") ||
    expanded.has("stock_delete")
  ) {
    expanded.add("stock_read");
  }

  if (expanded.has("messages_delete")) {
    expanded.add("messages_read");
  }

  return [...expanded].filter((p) => VALID_PERMISSIONS.includes(p));
}

function rowToUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    username: row.username,
    firstName: row.first_name || "",
    lastName: row.last_name || "",
    email: row.email || "",
    role: row.role,
    status: row.status || "active",
    permissions: row.role === "owner" ? [...VALID_PERMISSIONS] : parsePermissions(row.permissions),
    createdAt: row.created_at,
  };
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Lets a signed-in admin set/clear their own recovery email (used by the
// password-reset flow). An empty value clears it; anything non-empty must
// look like an address.
function updateEmail(username, email) {
  const clean = cleanText(email).toLowerCase();
  if (clean && !EMAIL_RE.test(clean)) {
    return { error: "Adresse e-mail invalide." };
  }

  getDb()
    .prepare("UPDATE admin_users SET email = ? WHERE username = ?")
    .run(clean || null, cleanText(username));

  return { ok: true, email: clean };
}

// Owners implicitly have every permission; members only what's granted.
// `user` is a rowToUser()-shaped object, so `.permissions` is already a
// parsed array here (not the raw JSON string stored on the DB row).
function hasPermission(user, key) {
  if (!user) return false;
  if (user.role === "owner") return true;
  return Array.isArray(user.permissions) && user.permissions.includes(key);
}

function findByUsername(username) {
  const db = getDb();
  return db
    .prepare("SELECT * FROM admin_users WHERE username = ?")
    .get(cleanText(username));
}

// Login accepts either the account's e-mail or its (legacy) username,
// case-insensitively - accounts are identified by e-mail going forward.
function findByLogin(value) {
  const clean = cleanText(value).toLowerCase();
  if (!clean) return undefined;

  return getDb()
    .prepare(
      "SELECT * FROM admin_users WHERE lower(username) = ? OR (email IS NOT NULL AND lower(email) = ?)"
    )
    .get(clean, clean);
}

function findById(id) {
  const db = getDb();
  return db.prepare("SELECT * FROM admin_users WHERE id = ?").get(id);
}

// Active members plus signup requests awaiting approval. Unconfirmed
// (pending_email) and rejected accounts are not shown.
function listUsers() {
  const db = getDb();
  return db
    .prepare(
      "SELECT * FROM admin_users WHERE status IN ('active', 'pending_approval') ORDER BY created_at ASC"
    )
    .all()
    .map(rowToUser);
}

// Owner approves a signup request: grants permissions and activates it.
function approveUser(id, permissions, actor) {
  const target = findById(id);
  if (!target) return { error: "Utilisateur introuvable." };
  if (target.status !== "pending_approval") {
    return { error: "Cette demande n'est plus en attente." };
  }

  const safePermissions = normalizePermissions(permissions);
  getDb()
    .prepare("UPDATE admin_users SET status = 'active', permissions = ? WHERE id = ?")
    .run(JSON.stringify(safePermissions), id);

  activityLog.log(actor, "user_approved", target.email || target.username);

  return { user: rowToUser(findById(id)) };
}

// Owner rejects a signup request: the row is deleted so the address is free
// to try again.
function rejectUser(id, actor) {
  const target = findById(id);
  if (!target) return { error: "Utilisateur introuvable." };
  if (target.role === "owner") return { error: "Impossible de refuser le proprietaire." };

  getDb().prepare("DELETE FROM admin_users WHERE id = ?").run(id);
  activityLog.log(actor, "user_rejected", target.email || target.username);

  return { ok: true };
}

function updatePassword(username, newPassword) {
  const db = getDb();
  db.prepare("UPDATE admin_users SET password_hash = ? WHERE username = ?").run(
    hashPassword(newPassword),
    cleanText(username)
  );
}

function countAdmins() {
  const db = getDb();
  return db.prepare("SELECT COUNT(*) AS count FROM admin_users").get().count;
}

// Active owners with a usable e-mail - recipients for "new signup request"
// notifications.
function getOwnerEmails() {
  return getDb()
    .prepare(
      "SELECT email FROM admin_users WHERE role = 'owner' AND status = 'active' AND email IS NOT NULL AND email <> ''"
    )
    .all()
    .map((row) => row.email);
}

function ensureSeedAdmin(username, password) {
  if (countAdmins() > 0) return;

  const db = getDb();
  db.prepare(
    "INSERT INTO admin_users (username, password_hash, first_name, last_name, role, permissions, created_at) VALUES (?, ?, '', '', 'owner', '[]', ?)"
  ).run(cleanText(username), hashPassword(password), new Date().toISOString());
}

function createUser({ username, password, firstName, lastName, permissions }, actor) {
  const cleanUsername = cleanText(username);
  const cleanFirstName = cleanText(firstName);
  const cleanLastName = cleanText(lastName);

  if (!cleanUsername || cleanUsername.length < 3) {
    return { error: "Identifiant invalide (3 caracteres minimum)." };
  }

  if (!password || password.length < 8) {
    return { error: "Le mot de passe doit contenir au moins 8 caracteres." };
  }

  if (findByUsername(cleanUsername)) {
    return { error: "Cet identifiant existe deja." };
  }

  const safePermissions = normalizePermissions(permissions);

  const db = getDb();
  const info = db
    .prepare(
      "INSERT INTO admin_users (username, password_hash, first_name, last_name, role, permissions, created_at) VALUES (?, ?, ?, ?, 'member', ?, ?)"
    )
    .run(
      cleanUsername,
      hashPassword(password),
      cleanFirstName,
      cleanLastName,
      JSON.stringify(safePermissions),
      new Date().toISOString()
    );

  activityLog.log(actor, "user_created", cleanUsername);

  return { user: rowToUser(findById(info.lastInsertRowid)) };
}

function updateUser(id, { firstName, lastName, permissions }, actor) {
  const target = findById(id);
  if (!target) return { error: "Utilisateur introuvable." };
  if (target.role === "owner") return { error: "Impossible de modifier le proprietaire." };

  const safePermissions = normalizePermissions(permissions);

  const db = getDb();
  db.prepare("UPDATE admin_users SET first_name = ?, last_name = ?, permissions = ? WHERE id = ?").run(
    cleanText(firstName ?? target.first_name),
    cleanText(lastName ?? target.last_name),
    JSON.stringify(safePermissions),
    id
  );

  activityLog.log(actor, "user_permissions_updated", target.username);

  return { user: rowToUser(findById(id)) };
}

function updateUserPermissions(id, permissions, actor) {
  return updateUser(id, { permissions }, actor);
}

function deleteUser(id, actor) {
  const target = findById(id);
  if (!target) return { error: "Utilisateur introuvable." };
  if (target.role === "owner") return { error: "Impossible de supprimer le proprietaire." };

  getDb().prepare("DELETE FROM admin_users WHERE id = ?").run(id);
  activityLog.log(actor, "user_deleted", target.username);

  return { ok: true };
}

module.exports = {
  VALID_PERMISSIONS,
  rowToUser,
  hasPermission,
  findByUsername,
  findByLogin,
  findById,
  listUsers,
  countAdmins,
  getOwnerEmails,
  ensureSeedAdmin,
  updatePassword,
  updateEmail,
  createUser,
  updateUser,
  updateUserPermissions,
  approveUser,
  rejectUser,
  deleteUser,
};
