const { getDb } = require("../db/connection");
const { hashPassword } = require("../auth/passwords");
const activityLog = require("./activityLog");

const VALID_PERMISSIONS = ["stock", "messages"];

function cleanText(value) {
  return String(value ?? "").trim();
}

function parsePermissions(raw) {
  try {
    const list = JSON.parse(raw || "[]");
    return Array.isArray(list) ? list.filter((p) => VALID_PERMISSIONS.includes(p)) : [];
  } catch {
    return [];
  }
}

function rowToUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    username: row.username,
    role: row.role,
    permissions: row.role === "owner" ? [...VALID_PERMISSIONS] : parsePermissions(row.permissions),
    createdAt: row.created_at,
  };
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

function findById(id) {
  const db = getDb();
  return db.prepare("SELECT * FROM admin_users WHERE id = ?").get(id);
}

function listUsers() {
  const db = getDb();
  return db
    .prepare("SELECT * FROM admin_users ORDER BY created_at ASC")
    .all()
    .map(rowToUser);
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

function ensureSeedAdmin(username, password) {
  if (countAdmins() > 0) return;

  const db = getDb();
  db.prepare(
    "INSERT INTO admin_users (username, password_hash, role, permissions, created_at) VALUES (?, ?, 'owner', '[]', ?)"
  ).run(cleanText(username), hashPassword(password), new Date().toISOString());
}

function createUser({ username, password, permissions }, actor) {
  const cleanUsername = cleanText(username);

  if (!cleanUsername || cleanUsername.length < 3) {
    return { error: "Identifiant invalide (3 caracteres minimum)." };
  }

  if (!password || password.length < 8) {
    return { error: "Le mot de passe doit contenir au moins 8 caracteres." };
  }

  if (findByUsername(cleanUsername)) {
    return { error: "Cet identifiant existe deja." };
  }

  const safePermissions = Array.isArray(permissions)
    ? permissions.filter((p) => VALID_PERMISSIONS.includes(p))
    : [];

  const db = getDb();
  const info = db
    .prepare(
      "INSERT INTO admin_users (username, password_hash, role, permissions, created_at) VALUES (?, ?, 'member', ?, ?)"
    )
    .run(cleanUsername, hashPassword(password), JSON.stringify(safePermissions), new Date().toISOString());

  activityLog.log(actor, "user_created", cleanUsername);

  return { user: rowToUser(findById(info.lastInsertRowid)) };
}

function updateUserPermissions(id, permissions, actor) {
  const target = findById(id);
  if (!target) return { error: "Utilisateur introuvable." };
  if (target.role === "owner") return { error: "Impossible de modifier le proprietaire." };

  const safePermissions = Array.isArray(permissions)
    ? permissions.filter((p) => VALID_PERMISSIONS.includes(p))
    : [];

  const db = getDb();
  db.prepare("UPDATE admin_users SET permissions = ? WHERE id = ?").run(
    JSON.stringify(safePermissions),
    id
  );

  activityLog.log(actor, "user_permissions_updated", target.username);

  return { user: rowToUser(findById(id)) };
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
  findById,
  listUsers,
  countAdmins,
  ensureSeedAdmin,
  updatePassword,
  createUser,
  updateUserPermissions,
  deleteUser,
};
