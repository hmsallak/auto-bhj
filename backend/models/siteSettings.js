const { getDb } = require("../db/connection");

const DEFAULTS = {
  phone: "0483 20 88 01",
  email: "contact@autobhj.be",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// From a human phone string ("0483 20 88 01" or "+32 483...") derive the
// tel: value and the wa.me number. Belgian numbers starting with 0 get +32.
function derivePhone(raw) {
  const display = String(raw || "").trim() || DEFAULTS.phone;
  const digits = display.replace(/\D/g, "");

  let tel;
  if (display.startsWith("+")) tel = `+${digits}`;
  else if (digits.startsWith("0")) tel = `+32${digits.slice(1)}`;
  else tel = `+${digits}`;

  return { display, tel, whatsapp: tel.replace(/^\+/, "") };
}

function getRaw() {
  try {
    const rows = getDb().prepare("SELECT key, value FROM site_settings").all();
    return { ...DEFAULTS, ...Object.fromEntries(rows.map((r) => [r.key, r.value])) };
  } catch {
    return { ...DEFAULTS };
  }
}

// Shape consumed everywhere on the site.
function getSiteSettings() {
  const raw = getRaw();
  const phone = derivePhone(raw.phone);
  return {
    phone: phone.display,
    phoneTel: phone.tel,
    whatsapp: phone.whatsapp,
    email: raw.email,
  };
}

function updateSiteSettings({ phone, email }) {
  const db = getDb();
  const upsert = db.prepare(
    "INSERT INTO site_settings (key, value) VALUES (?, ?) " +
      "ON CONFLICT(key) DO UPDATE SET value = excluded.value"
  );

  if (typeof phone === "string" && phone.trim()) {
    upsert.run("phone", phone.trim());
  }

  if (typeof email === "string") {
    const clean = email.trim().toLowerCase();
    if (!clean || !EMAIL_RE.test(clean)) {
      return { error: "Adresse e-mail invalide." };
    }
    upsert.run("email", clean);
  }

  return { ok: true, settings: getSiteSettings() };
}

module.exports = { getSiteSettings, updateSiteSettings };
