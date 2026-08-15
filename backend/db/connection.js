const fs = require("fs");
const path = require("path");
const { DatabaseSync } = require("node:sqlite");

// Resolved from process.cwd() (the repo root, where npm scripts run from)
// rather than __dirname: when this module is bundled by Next.js, __dirname
// gets rewritten to the bundler's output location and no longer points at
// backend/db on disk.
const dataDir = path.join(process.cwd(), "backend", "data");
const dbFile = path.join(dataDir, "autobhj.db");
const schema = fs.readFileSync(path.join(process.cwd(), "backend", "db", "schema.sql"), "utf8");

let db;

// Additive migration: CREATE TABLE IF NOT EXISTS in schema.sql does not add
// columns to a table that already exists from a previous run, so newly added
// columns are patched in here (SQLite has no "ADD COLUMN IF NOT EXISTS").
const CARS_COLUMNS = {
  body_type: "TEXT",
  seats: "INTEGER",
  doors: "INTEGER",
  power_kw: "INTEGER",
  power_ch: "INTEGER",
  engine_cc: "INTEGER",
  gears: "INTEGER",
  cylinders: "INTEGER",
  emission_class: "TEXT",
  consumption: "TEXT",
  exterior_color: "TEXT",
  paint_type: "TEXT",
  interior_color: "TEXT",
  interior_material: "TEXT",
  equipment: "TEXT",
  previous_owners: "TEXT",
};

const ADMIN_USERS_COLUMNS = {
  role: "TEXT NOT NULL DEFAULT 'member'",
  permissions: "TEXT NOT NULL DEFAULT '[]'",
};

function migrateColumns(database, table, columns) {
  const existing = new Set(
    database.prepare(`PRAGMA table_info(${table})`).all().map((col) => col.name)
  );

  for (const [column, type] of Object.entries(columns)) {
    if (!existing.has(column)) {
      database.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${type};`);
    }
  }
}

// The very first admin account (created before roles existed, or the oldest
// one otherwise) becomes 'owner' so someone always has full access and can
// manage other users - without this, an existing deployment's admin would be
// silently locked out of user management after this upgrade.
function ensureOwnerExists(database) {
  const { count } = database
    .prepare("SELECT COUNT(*) AS count FROM admin_users WHERE role = 'owner'")
    .get();
  if (count > 0) return;

  const oldest = database
    .prepare("SELECT id FROM admin_users ORDER BY id ASC LIMIT 1")
    .get();
  if (!oldest) return;

  database.prepare("UPDATE admin_users SET role = 'owner' WHERE id = ?").run(oldest.id);
}

function getDb() {
  if (db) return db;

  fs.mkdirSync(dataDir, { recursive: true });
  db = new DatabaseSync(dbFile);
  db.exec("PRAGMA journal_mode = WAL;");
  db.exec("PRAGMA foreign_keys = ON;");
  db.exec(schema);
  migrateColumns(db, "cars", CARS_COLUMNS);
  migrateColumns(db, "admin_users", ADMIN_USERS_COLUMNS);
  ensureOwnerExists(db);

  return db;
}

module.exports = { getDb };
