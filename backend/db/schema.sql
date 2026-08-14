CREATE TABLE IF NOT EXISTS cars (
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
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'reserved')),
  -- Details etendues (optionnelles), pour une fiche complete type AutoScout24
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

CREATE INDEX IF NOT EXISTS idx_cars_search ON cars (brand, model, fuel, gearbox);

CREATE TABLE IF NOT EXISTS car_images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  car_id INTEGER NOT NULL REFERENCES cars (id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_car_images_car_id ON car_images (car_id, position);

CREATE TABLE IF NOT EXISTS admin_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL
);

-- Sessions and login attempts live in the database (not in-memory) because
-- Next.js compiles each API route into its own bundle: a plain in-memory
-- Map would not be shared reliably between route handlers.
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS login_attempts (
  ip TEXT NOT NULL,
  attempted_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_login_attempts_ip ON login_attempts (ip, attempted_at);

CREATE TABLE IF NOT EXISTS contact_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  car_reference TEXT,
  message TEXT NOT NULL,
  is_read INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_contact_messages_created ON contact_messages (created_at DESC);
