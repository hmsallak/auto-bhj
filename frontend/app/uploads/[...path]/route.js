import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

const uploadsDir = path.join(process.cwd(), "backend", "data", "uploads");

const contentTypeByExt = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

export async function GET(request, { params }) {
  const { path: segments } = await params;
  const filename = (segments || []).join("/");
  const resolved = path.join(uploadsDir, filename);

  if (!resolved.startsWith(uploadsDir)) {
    return NextResponse.json({ error: "Invalid path." }, { status: 400 });
  }

  const contentType = contentTypeByExt[path.extname(resolved).toLowerCase()];
  if (!contentType) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  try {
    const file = await readFile(resolved);
    return new NextResponse(file, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }
}
