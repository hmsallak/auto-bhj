// Admin notification types and each user's choices. A user receives a type
// only if (1) their account may see what it is about and (2) they left it on
// in "Application > Notifications". Delivery itself is push.js.

const { getDb } = require("./db/connection");
const { hasPermission, hasAnyPermission, APPOINTMENT_VIEW_PERMISSIONS } = require("./models/adminUsers");
const { sendToUsersWhere } = require("./push");

const NOTIFICATION_TYPES = [
  {
    key: "requests",
    label: "Nouvelles demandes",
    description: "Un client envoie une demande depuis le site.",
    permission: "messages_read",
  },
  {
    key: "reminders",
    label: "Rappel de rendez-vous",
    description: "1 heure avant chaque rendez-vous.",
    permission: APPOINTMENT_VIEW_PERMISSIONS,
  },
  {
    key: "digest",
    label: "Resume du matin",
    description: "A 8 h, les rendez-vous de la journee (s'il y en a).",
    permission: APPOINTMENT_VIEW_PERMISSIONS,
  },
  {
    key: "access",
    label: "Demandes d'acces",
    description: "Quelqu'un demande un compte admin a approuver (onglet Utilisateurs).",
    ownerOnly: true,
  },
];

function parsePrefs(raw) {
  try {
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function canReceive(user, type) {
  if (type.ownerOnly) return user.role === "owner";
  if (!type.permission) return true;
  // A list means "any of these".
  return Array.isArray(type.permission)
    ? hasAnyPermission(user, type.permission)
    : hasPermission(user, type.permission);
}

// Types this user may receive, with their current on/off (default: on).
function getPreferences(user, rawPrefs) {
  const prefs = parsePrefs(rawPrefs);
  return NOTIFICATION_TYPES.filter((type) => canReceive(user, type)).map((type) => ({
    key: type.key,
    label: type.label,
    description: type.description,
    enabled: prefs[type.key] !== false,
  }));
}

function getPreferencesFor(username, user) {
  const row = getDb().prepare("SELECT notification_prefs FROM admin_users WHERE username = ?").get(username);
  return getPreferences(user, row?.notification_prefs);
}

function savePreferences(username, user, changes) {
  const row = getDb().prepare("SELECT notification_prefs FROM admin_users WHERE username = ?").get(username);
  const prefs = parsePrefs(row?.notification_prefs);
  for (const type of NOTIFICATION_TYPES) {
    if (typeof changes?.[type.key] === "boolean" && canReceive(user, type)) prefs[type.key] = changes[type.key];
  }
  getDb().prepare("UPDATE admin_users SET notification_prefs = ? WHERE username = ?").run(JSON.stringify(prefs), username);
  return getPreferences(user, JSON.stringify(prefs));
}

// Send a notification of `typeKey` to everyone allowed and opted in.
// Never throws: a notification must not break what triggered it.
async function notify(typeKey, payload) {
  const type = NOTIFICATION_TYPES.find((item) => item.key === typeKey);
  if (!type) return { sent: 0 };
  return sendToUsersWhere(
    (user) => canReceive(user, type) && parsePrefs(user.notificationPrefs)[type.key] !== false,
    payload
  );
}

module.exports = { NOTIFICATION_TYPES, getPreferencesFor, savePreferences, notify };
