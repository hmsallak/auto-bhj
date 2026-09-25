// Web push for the admin app (installed PWA on phones, or any browser).
// Keys: VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY / VAPID_SUBJECT. Without them
// nothing is sent and callers are told push is off - never an error.

const webpush = require("web-push");
const { getDb } = require("./db/connection");
const { rowToUser, hasPermission } = require("./models/adminUsers");

let configured = null;

function isPushConfigured() {
  if (configured !== null) return configured;
  const { VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT } = process.env;
  configured = Boolean(VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY);
  if (configured) {
    webpush.setVapidDetails(VAPID_SUBJECT || "mailto:contact@autobhj.be", VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
  }
  return configured;
}

function publicKey() {
  return isPushConfigured() ? process.env.VAPID_PUBLIC_KEY : null;
}

// Push goes to the browser vendor's service only. Accepting any https URL
// would let an account make this server POST to a host of its choosing.
const PUSH_HOSTS = [
  /^fcm\.googleapis\.com$/, // Chrome, Samsung Internet, Edge (Android)
  /^updates\.push\.services\.mozilla\.com$/, // Firefox
  /^web\.push\.apple\.com$/, // Safari / iPhone
  /\.notify\.windows\.com$/, // Edge (Windows)
];

function isPushServiceUrl(endpoint) {
  try {
    const url = new URL(endpoint);
    return url.protocol === "https:" && PUSH_HOSTS.some((host) => host.test(url.hostname));
  } catch {
    return false;
  }
}

function saveSubscription(username, subscription, userAgent) {
  const endpoint = String(subscription?.endpoint || "");
  const { p256dh, auth } = subscription?.keys || {};
  if (!isPushServiceUrl(endpoint) || !p256dh || !auth) return { error: "Abonnement invalide." };

  // Same device re-subscribing (or another admin on it) just takes the row over.
  getDb()
    .prepare(
      `INSERT INTO push_subscriptions (username, endpoint, p256dh, auth, user_agent, created_at)
       VALUES (?, ?, ?, ?, ?, ?)
       ON CONFLICT(endpoint) DO UPDATE SET username = excluded.username, p256dh = excluded.p256dh,
         auth = excluded.auth, user_agent = excluded.user_agent`
    )
    .run(username, endpoint, p256dh, auth, String(userAgent || "").slice(0, 300), new Date().toISOString());
  return { ok: true };
}

function removeSubscription(endpoint) {
  getDb().prepare("DELETE FROM push_subscriptions WHERE endpoint = ?").run(String(endpoint || ""));
}

function countSubscriptions(username) {
  return getDb().prepare("SELECT COUNT(*) AS n FROM push_subscriptions WHERE username = ?").get(username).n;
}

function listSubscriptions(username) {
  return getDb()
    .prepare("SELECT id, user_agent, created_at FROM push_subscriptions WHERE username = ? ORDER BY created_at DESC")
    .all(username)
    .map((row) => ({ id: row.id, userAgent: row.user_agent || "Navigateur inconnu", createdAt: row.created_at }));
}

async function sendToRows(rows, payload) {
  if (!isPushConfigured() || !rows.length) return { sent: 0 };
  const body = JSON.stringify(payload);
  let sent = 0;

  await Promise.all(
    rows.map(async (row) => {
      try {
        await webpush.sendNotification(
          { endpoint: row.endpoint, keys: { p256dh: row.p256dh, auth: row.auth } },
          body,
          { TTL: 60 * 60 * 12, urgency: "high" }
        );
        sent += 1;
      } catch (error) {
        // Unsubscribed / expired on the device: forget it.
        if (error.statusCode === 404 || error.statusCode === 410) removeSubscription(row.endpoint);
        else console.error("[push] send failed:", error.statusCode || "", error.message);
      }
    })
  );
  return { sent };
}

// payload: { title, body, url, tag }. `url` is where a tap on the
// notification lands inside the admin.
async function sendToUser(username, payload) {
  const rows = getDb().prepare("SELECT * FROM push_subscriptions WHERE username = ?").all(username);
  return sendToRows(rows, payload);
}

// Everyone whose account allows `permission` (owners always do). Never
// throws: a push problem must not break the action that triggered it.
async function sendToPermission(permission, payload) {
  try {
    const rows = getDb()
      .prepare(
        `SELECT s.*, u.role AS u_role, u.permissions AS u_permissions, u.status AS u_status
         FROM push_subscriptions s JOIN admin_users u ON u.username = s.username`
      )
      .all()
      .filter((row) => {
        if (row.u_status && row.u_status !== "active") return false;
        const user = rowToUser({ role: row.u_role, permissions: row.u_permissions });
        return hasPermission(user, permission);
      });
    return await sendToRows(rows, payload);
  } catch (error) {
    console.error("[push] broadcast failed:", error.message);
    return { sent: 0 };
  }
}

// Every device of every active admin for whom predicate(user) is true;
// `user` is the full rowToUser() object plus `notificationPrefs` (raw JSON).
async function sendToUsersWhere(predicate, payload) {
  try {
    const db = getDb();
    const users = db
      .prepare("SELECT * FROM admin_users WHERE status IS NULL OR status = 'active'")
      .all()
      .map((row) => ({ ...rowToUser(row), notificationPrefs: row.notification_prefs }))
      .filter(predicate);
    if (!users.length) return { sent: 0 };

    const names = users.map((user) => user.username);
    const rows = db
      .prepare(`SELECT * FROM push_subscriptions WHERE username IN (${names.map(() => "?").join(",")})`)
      .all(...names);
    return await sendToRows(rows, payload);
  } catch (error) {
    console.error("[push] targeted send failed:", error.message);
    return { sent: 0 };
  }
}

module.exports = {
  isPushConfigured,
  sendToUsersWhere,
  publicKey,
  saveSubscription,
  removeSubscription,
  countSubscriptions,
  listSubscriptions,
  sendToUser,
  sendToPermission,
};
