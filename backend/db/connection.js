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

function migrateCarsColumns(database) {
  const existing = new Set(
    database.prepare("PRAGMA table_info(cars)").all().map((col) => col.name)
  );

  for (const [column, type] of Object.entries(CARS_COLUMNS)) {
    if (!existing.has(column)) {
      database.exec(`ALTER TABLE cars ADD COLUMN ${column} ${type};`);
    }
  }
}

function getDb() {
  if (db) return db;

  fs.mkdirSync(dataDir, { recursive: true });
  db = new DatabaseSync(dbFile);
  db.exec("PRAGMA journal_mode = WAL;");
  db.exec("PRAGMA foreign_keys = ON;");
  db.exec(schema);
  migrateCarsColumns(db);

  return db;
}

module.exports = { getDb };
