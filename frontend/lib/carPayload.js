import { saveUploadedImages } from "./imageUpload";

export async function readCarPayload(request) {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.startsWith("multipart/form-data")) {
    const formData = await request.formData();
    const payload = {};
    const skipKeys = new Set(["imageFiles", "existingImages", "imageOrder"]);

    for (const [key, value] of formData.entries()) {
      if (skipKeys.has(key)) continue;
      payload[key] = value;
    }

    const existingImages = formData.getAll("existingImages");
    const uploadedImages = await saveUploadedImages(formData.getAll("imageFiles"));

    let order = [];
    try {
      order = JSON.parse(formData.get("imageOrder") || "[]");
    } catch {
      order = [];
    }

    payload.images = order
      .map((token) => {
        const [kind, indexText] = String(token).split(":");
        const index = Number(indexText);
        if (kind === "existing") return existingImages[index];
        if (kind === "new") return uploadedImages[index];
        return null;
      })
      .filter(Boolean);

    // FormData values are always strings, but the model expects equipment
    // as a real object (or null when the admin left it empty).
    if (typeof payload.equipment === "string") {
      try {
        payload.equipment = JSON.parse(payload.equipment);
      } catch {
        payload.equipment = null;
      }
    }

    return payload;
  }

  return request.json();
}
