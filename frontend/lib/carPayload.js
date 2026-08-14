import { saveUploadedImage } from "./imageUpload";

export async function readCarPayload(request) {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.startsWith("multipart/form-data")) {
    const formData = await request.formData();
    const payload = {};

    for (const [key, value] of formData.entries()) {
      if (key === "imageFile") continue;
      payload[key] = value;
    }

    const imageUrl = await saveUploadedImage(formData.get("imageFile"));
    if (imageUrl) payload.imageUrl = imageUrl;

    return payload;
  }

  return request.json();
}
