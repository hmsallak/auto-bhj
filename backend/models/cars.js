const { getDb } = require("../db/connection");

function cleanText(value) {
  return String(value ?? "").trim();
}

function optionalText(value) {
  const text = cleanText(value);
  return text || null;
}

function optionalInt(value) {
  if (value === undefined || value === null || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? Math.round(n) : null;
}

const DETAIL_FIELDS = [
  ["bodyType", "body_type", optionalText],
  ["seats", "seats", optionalInt],
  ["doors", "doors", optionalInt],
  ["powerKw", "power_kw", optionalInt],
  ["powerCh", "power_ch", optionalInt],
  ["engineCc", "engine_cc", optionalInt],
  ["gears", "gears", optionalInt],
  ["cylinders", "cylinders", optionalInt],
  ["emissionClass", "emission_class", optionalText],
  ["consumption", "consumption", optionalText],
  ["exteriorColor", "exterior_color", optionalText],
  ["paintType", "paint_type", optionalText],
  ["interiorColor", "interior_color", optionalText],
  ["interiorMaterial", "interior_material", optionalText],
  ["previousOwners", "previous_owners", optionalText],
];

function getCarImages(db, carId) {
  return db
    .prepare("SELECT url FROM car_images WHERE car_id = ? ORDER BY position ASC")
    .all(carId)
    .map((row) => row.url);
}

function rowToCar(row, images = []) {
  if (!row) return null;

  const car = {
    id: row.id,
    reference: row.reference,
    brand: row.brand,
    model: row.model,
    year: row.year,
    mileage: row.mileage,
    price: row.price,
    fuel: row.fuel,
    gearbox: row.gearbox,
    imageUrl: row.image_url || images[0] || "",
    images,
    description: row.description || "",
    status: row.status,
    equipment: row.equipment ? JSON.parse(row.equipment) : null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };

  for (const [jsKey, column] of DETAIL_FIELDS) {
    car[jsKey] = row[column] ?? null;
  }

  return car;
}

function validateCarInput(payload, existing = null) {
  const status = cleanText(payload.status) || existing?.status || "available";
  const car = {
    brand: cleanText(payload.brand),
    model: cleanText(payload.model),
    year: Number(payload.year),
    mileage: Number(payload.mileage),
    price: Number(payload.price),
    fuel: cleanText(payload.fuel),
    gearbox: cleanText(payload.gearbox),
    imageUrl: cleanText(payload.imageUrl) || existing?.imageUrl || "",
    description: cleanText(payload.description),
    status,
  };

  if (!car.brand || !car.model || !car.fuel || !car.gearbox) {
    return { error: "Marque, modele, carburant et boite sont obligatoires." };
  }

  if (!Number.isInteger(car.year) || car.year < 1980 || car.year > 2035) {
    return { error: "Annee invalide." };
  }

  if (!Number.isFinite(car.mileage) || car.mileage < 0) {
    return { error: "Kilometrage invalide." };
  }

  if (!Number.isFinite(car.price) || car.price <= 0 || car.price > 100_000_000) {
    return { error: "Prix invalide." };
  }

  if (car.imageUrl && !/^(https?:\/\/.+|\/uploads\/.+)/i.test(car.imageUrl)) {
    return { error: "L'image doit etre une URL http/https ou une image locale." };
  }

  if (!["available", "reserved"].includes(car.status)) {
    return { error: "Statut invalide." };
  }

  for (const [jsKey, , normalize] of DETAIL_FIELDS) {
    car[jsKey] = normalize(payload[jsKey]);
  }

  car.equipment =
    payload.equipment && typeof payload.equipment === "object"
      ? JSON.stringify(payload.equipment)
      : null;

  return { car };
}

function replaceCarImages(db, carId, images) {
  db.prepare("DELETE FROM car_images WHERE car_id = ?").run(carId);

  const insert = db.prepare(
    "INSERT INTO car_images (car_id, url, position) VALUES (?, ?, ?)"
  );

  images.forEach((url, index) => {
    const cleanUrl = cleanText(url);
    if (cleanUrl) insert.run(carId, cleanUrl, index);
  });
}

function listCars() {
  const db = getDb();
  const rows = db.prepare("SELECT * FROM cars ORDER BY created_at DESC").all();
  return rows.map((row) => rowToCar(row, getCarImages(db, row.id)));
}

function searchCars(query) {
  const db = getDb();
  const term = cleanText(query);

  if (!term) return listCars();

  const like = `%${term.toLowerCase()}%`;
  const rows = db
    .prepare(
      `SELECT * FROM cars
       WHERE lower(reference) LIKE ?
          OR lower(brand) LIKE ?
          OR lower(model) LIKE ?
          OR lower(fuel) LIKE ?
          OR lower(gearbox) LIKE ?
          OR lower(description) LIKE ?
       ORDER BY created_at DESC`
    )
    .all(like, like, like, like, like, like);

  return rows.map((row) => rowToCar(row, getCarImages(db, row.id)));
}

function getCarByReference(reference) {
  const db = getDb();
  const row = db
    .prepare("SELECT * FROM cars WHERE reference = ?")
    .get(cleanText(reference).toUpperCase());
  if (!row) return null;
  return rowToCar(row, getCarImages(db, row.id));
}

function getCarById(id) {
  const db = getDb();
  const row = db.prepare("SELECT * FROM cars WHERE id = ?").get(id);
  if (!row) return null;
  return rowToCar(row, getCarImages(db, row.id));
}

function createCar(payload) {
  const { error, car } = validateCarInput(payload);
  if (error) return { error };

  const db = getDb();
  const now = new Date().toISOString();
  const detailColumns = DETAIL_FIELDS.map(([, column]) => column);

  const insert = db.prepare(
    `INSERT INTO cars
      (reference, brand, model, year, mileage, price, fuel, gearbox, image_url, description, status,
       ${detailColumns.join(", ")}, equipment, created_at, updated_at)
     VALUES ('', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
       ${detailColumns.map(() => "?").join(", ")}, ?, ?, ?)`
  );

  const info = insert.run(
    car.brand,
    car.model,
    car.year,
    car.mileage,
    car.price,
    car.fuel,
    car.gearbox,
    car.imageUrl,
    car.description,
    car.status,
    ...DETAIL_FIELDS.map(([jsKey]) => car[jsKey]),
    car.equipment,
    now,
    now
  );

  const reference = `AB-${String(info.lastInsertRowid).padStart(6, "0")}`;
  db.prepare("UPDATE cars SET reference = ? WHERE id = ?").run(reference, info.lastInsertRowid);

  if (Array.isArray(payload.images)) {
    replaceCarImages(db, info.lastInsertRowid, payload.images);
  }

  return { car: getCarById(info.lastInsertRowid) };
}

function updateCar(id, payload) {
  const existing = getCarById(id);
  if (!existing) return { error: "Vehicule introuvable." };

  const { error, car } = validateCarInput(payload, existing);
  if (error) return { error };

  const db = getDb();
  const now = new Date().toISOString();
  const detailColumns = DETAIL_FIELDS.map(([, column]) => column);

  db.prepare(
    `UPDATE cars SET
       brand = ?, model = ?, year = ?, mileage = ?, price = ?, fuel = ?, gearbox = ?,
       image_url = ?, description = ?, status = ?,
       ${detailColumns.map((column) => `${column} = ?`).join(", ")},
       equipment = ?, updated_at = ?
     WHERE id = ?`
  ).run(
    car.brand,
    car.model,
    car.year,
    car.mileage,
    car.price,
    car.fuel,
    car.gearbox,
    car.imageUrl,
    car.description,
    car.status,
    ...DETAIL_FIELDS.map(([jsKey]) => car[jsKey]),
    car.equipment,
    now,
    id
  );

  if (Array.isArray(payload.images)) {
    replaceCarImages(db, id, payload.images);
  }

  return { car: getCarById(id) };
}

function deleteCar(id) {
  const db = getDb();
  const info = db.prepare("DELETE FROM cars WHERE id = ?").run(id);
  return info.changes > 0;
}

module.exports = {
  listCars,
  searchCars,
  getCarByReference,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
};
