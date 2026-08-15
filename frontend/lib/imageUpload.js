import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

// Stored under backend/data (not frontend/public) so uploaded photos live on
// the same persistent volume as the SQLite database in production - the
// public/ folder is baked into the build and isn't writable/persistent there.
const uploadsDir = path.join(process.cwd(), "backend", "data", "uploads");

const extensionByType = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

const MAX_SIZE = 8_000_000;

export async function saveUploadedImage(file) {
  if (!file || typeof file === "string" || !file.size) return null;

  if (!extensionByType[file.type]) {
    throw new Error("Image invalide. Formats acceptes: JPG, PNG, WEBP.");
  }

  if (file.size > MAX_SIZE) {
    throw new Error("Fichier trop lourd. Maximum 8 Mo.");
  }

  await mkdir(uploadsDir, { recursive: true });

  const filename = `${randomUUID()}${extensionByType[file.type]}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadsDir, filename), buffer);

  return `/uploads/${filename}`;
}
