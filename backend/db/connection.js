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
  first_name: "TEXT",
  last_name: "TEXT",
  role: "TEXT NOT NULL DEFAULT 'member'",
  permissions: "TEXT NOT NULL DEFAULT '[]'",
};

const SESSIONS_COLUMNS = {
  last_seen_at: "INTEGER",
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

// SQLite has no "ALTER TABLE ... DROP/MODIFY CONSTRAINT": a CHECK constraint
// baked into an existing table (like status IN ('available', 'reserved'))
// stays in force forever, even after schema.sql is edited, so adding the
// 'sold' status previously started rejecting every update that set it with
// a raw SQLite constraint error. Rebuild the table with the wider CHECK,
// copying the data across, the way SQLite's own docs recommend.
function migrateCarsStatusCheck(database) {
  const row = database
    .prepare("SELECT sql FROM sqlite_master WHERE type = 'table' AND name = 'cars'")
    .get();
  if (!row || row.sql.includes("'sold'")) return;

  const columns = [
    "id", "reference", "brand", "model", "year", "mileage", "price", "fuel", "gearbox",
    "image_url", "description", "status", "body_type", "seats", "doors", "power_kw",
    "power_ch", "engine_cc", "gears", "cylinders", "emission_class", "consumption",
    "exterior_color", "paint_type", "interior_color", "interior_material", "equipment",
    "previous_owners", "created_at", "updated_at",
  ];
  const existingCols = new Set(
    database.prepare("PRAGMA table_info(cars)").all().map((col) => col.name)
  );
  const colList = columns.filter((col) => existingCols.has(col)).join(", ");

  database.exec("PRAGMA foreign_keys = OFF;");
  try {
    database.exec("BEGIN TRANSACTION;");
    database.exec(`
      CREATE TABLE cars_new (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        reference TEXT NOT NULL UNIQUE,
        brand TEXT NOT NULL,
        model TEXT NOT NULL,
        year INTEGER NOT NULL,
        mileage INTEGER NOT NULL,
        price INTEGER NOT NULL,
        fuel TEXT NOT NULL,
        gearbox TEXT NOT NULL,
        image_url TEXT,
        description TEXT,
        status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'sold')),
        body_type TEXT,
        seats INTEGER,
        doors INTEGER,
        power_kw INTEGER,
        power_ch INTEGER,
        engine_cc INTEGER,
        gears INTEGER,
        cylinders INTEGER,
        emission_class TEXT,
        consumption TEXT,
        exterior_color TEXT,
        paint_type TEXT,
        interior_color TEXT,
        interior_material TEXT,
        equipment TEXT,
        previous_owners TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `);
    database.exec(`INSERT INTO cars_new (${colList}) SELECT ${colList} FROM cars;`);
    database.exec("DROP TABLE cars;");
    database.exec("ALTER TABLE cars_new RENAME TO cars;");
    database.exec("CREATE INDEX IF NOT EXISTS idx_cars_search ON cars (brand, model, fuel, gearbox);");
    database.exec("COMMIT;");
  } catch (error) {
    database.exec("ROLLBACK;");
    throw error;
  } finally {
    database.exec("PRAGMA foreign_keys = ON;");
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
  migrateCarsStatusCheck(db);
  migrateColumns(db, "admin_users", ADMIN_USERS_COLUMNS);
  migrateColumns(db, "sessions", SESSIONS_COLUMNS);
  ensureOwnerExists(db);

  return db;
}

module.exports = { getDb };
