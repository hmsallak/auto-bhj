/*
 * Telecharge les photos des annonces 2ememain d'Auto BHJ et les attache aux
 * fiches deja importees (voir import-2ememain.js).
 *
 * - recupere le HTML de chaque annonce (bloc __NEXT_DATA__ -> "imageUrls")
 * - telecharge chaque image en pleine taille dans backend/data/uploads/
 * - remplace les car_images de la voiture correspondante (match marque +
 *   modele + kilometrage) et fixe image_url sur la premiere photo
 *
 * Idempotent : relancer le script re-telecharge et re-remplace proprement.
 * Usage : node backend/scripts/fetch-2ememain-photos.js
 */
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { getDb } = require("../db/connection");

const uploadsDir = path.join(process.cwd(), "backend", "data", "uploads");
const SIZE_RULE = "ecg_mp_eps$_86.jpg"; // la plus grande taille servie par le CDN
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";

const listings = [
  { brand: "Volkswagen", model: "Polo", mileage: 131000, url: "https://www.2ememain.be/v/autos/volkswagen/m2436092204-volkswagen-polo-1-2essence-airco-131000km-5-portes" },
  { brand: "Skoda", model: "Fabia", mileage: 140000, url: "https://www.2ememain.be/v/autos/skoda/m2436085204-skoda-fabia-1-2-tsi-essence-2010-euro-5a-140000km-carnet-ful" },
  { brand: "Nissan", model: "Micra", mileage: 129000, url: "https://www.2ememain.be/v/autos/nissan/m2436081093-nissan-micra-1-2-essence-airco-129000km" },
  { brand: "Ford", model: "Fusion", mileage: 122000, url: "https://www.2ememain.be/v/autos/ford/m2434784041-ford-fusion-1-4-essence-automatique-122000km-airco-5portes" },
  { brand: "Chevrolet", model: "Spark", mileage: 113000, url: "https://www.2ememain.be/v/autos/chevrolet/m2434718867-chevrolet-spark-1-2-essence-1ermain-09-2013-113000km-airco" },
  { brand: "Toyota", model: "Yaris", mileage: 226000, url: "https://www.2ememain.be/v/autos/toyota/m2434582166-toyota-yaris-1-5-essence-airco-10-2018-euro-6c-bluetooth" },
  { brand: "Mazda", model: "2", mileage: 95000, url: "https://www.2ememain.be/v/autos/mazda/m2434555902-mazda-2-1-4-essence-airco-95000km-roule-super" },
  { brand: "Ford", model: "Fiesta", mileage: 130000, url: "https://www.2ememain.be/v/autos/ford/m2433451848-ford-fiesta-1-25-essence-airco-2011-130000km-euro-5a-5portes" },
  { brand: "Suzuki", model: "Splash", mileage: 144000, url: "https://www.2ememain.be/v/autos/suzuki/m2432209419-suzuki-splash-1-0-essence-airco-1ermain-new-embrayage" },
  { brand: "Hyundai", model: "i10", mileage: 130000, url: "https://www.2ememain.be/v/autos/ford/m2432206873-hyundai-i10-1-0-essence-airco-130000km-5-portes" },
  { brand: "Fiat", model: "Punto", mileage: 118000, url: "https://www.2ememain.be/v/autos/fiat/m2432205743-fiat-punto-1-2-essence-2014-euro-6-118000km-distribution-ok" },
  { brand: "Volkswagen", model: "Golf Plus", mileage: 124000, url: "https://www.2ememain.be/v/autos/volkswagen/m2432202255-volkswagen-golf-6-plus-1-2tsi-11-2011-5-124000km-carnet-ful" },
  { brand: "Opel", model: "Corsa", mileage: 173000, url: "https://www.2ememain.be/v/autos/opel/m2432198711-opel-corsa-1-2-essence-euro-5-12-2010-5portes-sieges-chauffa" },
  { brand: "Kia", model: "Picanto", mileage: 144000, url: "https://www.2ememain.be/v/autos/kia/m2432197771-kia-picanto-1-1-essence-airco-2010-144000km-distribution-ok" },
  { brand: "Renault", model: "Twingo", mileage: 154000, url: "https://www.2ememain.be/v/autos/renault/m2432195116-renault-twingo-1-2-essence-airco-distribution-fait" },
];

const EXT_BY_TYPE = { "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp" };

function sniff(buf) {
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "image/jpeg";
  if (buf.length >= 8 && buf.toString("latin1", 0, 8) === "\x89PNG\r\n\x1a\n") return "image/png";
  if (buf.length >= 12 && buf.toString("latin1", 0, 4) === "RIFF" && buf.toString("latin1", 8, 12) === "WEBP")
    return "image/webp";
  return null;
}

function imageUrlsFromHtml(html) {
  // Premier tableau "imageUrls":[...] du bloc __NEXT_DATA__ = la galerie de
  // l'annonce (les annonces "similaires" utilisent d'autres cles).
  const m = html.match(/"imageUrls"\s*:\s*\[([^\]]*)\]/);
  if (!m) return [];
  let arr;
  try {
    arr = JSON.parse("[" + m[1] + "]");
  } catch {
    return [];
  }
  const seen = new Set();
  const out = [];
  for (let s of arr) {
    if (typeof s !== "string") continue;
    s = s.replace(/\\u002F/gi, "/").replace(/\\\//g, "/");
    s = s.replace(/rule=ecg_mp_eps\$_#\.jpg/i, "rule=" + SIZE_RULE);
    if (s.startsWith("//")) s = "https:" + s;
    if (!/^https?:\/\//i.test(s)) continue;
    const key = s.split("?")[0];
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(s);
  }
  return out;
}

async function fetchText(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA, "Accept-Language": "fr-BE,fr;q=0.9" } });
  if (!res.ok) throw new Error("HTTP " + res.status);
  return res.text();
}

async function download(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA, Referer: "https://www.2ememain.be/" } });
  if (!res.ok) throw new Error("HTTP " + res.status);
  const buf = Buffer.from(await res.arrayBuffer());
  const type = sniff(buf);
  if (!type || !EXT_BY_TYPE[type]) throw new Error("type inconnu (" + buf.length + " o)");
  const name = crypto.randomUUID() + EXT_BY_TYPE[type];
  fs.writeFileSync(path.join(uploadsDir, name), buf);
  return { url: `/uploads/${name}`, bytes: buf.length };
}

async function run() {
  const db = getDb();
  fs.mkdirSync(uploadsDir, { recursive: true });

  const findCar = db.prepare(
    "SELECT id, reference FROM cars WHERE lower(brand) = lower(?) AND lower(model) = lower(?) AND mileage = ? ORDER BY id DESC LIMIT 1"
  );
  const clearImages = db.prepare("DELETE FROM car_images WHERE car_id = ?");
  const insertImage = db.prepare("INSERT INTO car_images (car_id, url, position) VALUES (?, ?, ?)");
  const setCover = db.prepare("UPDATE cars SET image_url = ?, updated_at = ? WHERE id = ?");

  let okCars = 0;
  let totalPhotos = 0;

  for (const item of listings) {
    const car = findCar.get(item.brand, item.model, item.mileage);
    if (!car) {
      console.warn(`- ${item.brand} ${item.model} : fiche introuvable en base, ignoree`);
      continue;
    }

    let urls = [];
    try {
      urls = imageUrlsFromHtml(await fetchText(item.url));
    } catch (err) {
      console.warn(`- ${car.reference} ${item.brand} ${item.model} : page KO (${err.message})`);
      continue;
    }
    if (urls.length === 0) {
      console.warn(`- ${car.reference} ${item.brand} ${item.model} : aucune photo trouvee`);
      continue;
    }

    const saved = [];
    for (const u of urls) {
      try {
        const r = await download(u);
        saved.push(r.url);
        totalPhotos += 1;
      } catch (err) {
        console.warn(`    photo KO (${err.message}) ${u}`);
      }
    }
    if (saved.length === 0) {
      console.warn(`- ${car.reference} ${item.brand} ${item.model} : 0 photo telechargee`);
      continue;
    }

    const now = new Date().toISOString();
    clearImages.run(car.id);
    saved.forEach((url, i) => insertImage.run(car.id, url, i));
    setCover.run(saved[0], now, car.id);
    okCars += 1;
    console.log(`- ${car.reference} ${item.brand} ${item.model} : ${saved.length} photo(s)`);
  }

  console.log(`Termine : ${okCars} voiture(s) illustree(s), ${totalPhotos} photo(s) au total.`);
}

run();
