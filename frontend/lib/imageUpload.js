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

// The Content-Type on an upload is set by the client and is trivially
// spoofable, so decide the real type from the file's first bytes instead.
function sniffImageType(buffer) {
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "image/jpeg";
  }
  if (
    buffer.length >= 8 &&
    buffer.toString("latin1", 0, 8) === "\x89PNG\r\n\x1a\n"
  ) {
    return "image/png";
  }
  if (
    buffer.length >= 12 &&
    buffer.toString("latin1", 0, 4) === "RIFF" &&
    buffer.toString("latin1", 8, 12) === "WEBP"
  ) {
    return "image/webp";
  }
  return null;
}

export async function saveUploadedImage(file) {
  if (!file || typeof file === "string" || !file.size) return null;

  if (file.size > MAX_SIZE) {
    throw new Error("Fichier trop lourd. Maximum 8 Mo.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const type = sniffImageType(buffer);
  if (!type || !extensionByType[type]) {
    throw new Error("Image invalide. Formats acceptes: JPG, PNG, WEBP.");
  }

  await mkdir(uploadsDir, { recursive: true });

  const filename = `${randomUUID()}${extensionByType[type]}`;
  await writeFile(path.join(uploadsDir, filename), buffer);

  return `/uploads/${filename}`;
}

export async function saveUploadedImages(files) {
  const urls = [];
  for (const file of files) {
    const url = await saveUploadedImage(file);
    if (url) urls.push(url);
  }
  return urls;
}
