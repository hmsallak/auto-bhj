import { headers } from "next/headers";

// Public base URL for links sent by e-mail: APP_URL when set (production),
// otherwise the host the request came through (proxy headers first).
export async function resolveBaseUrl(request) {
  if (process.env.APP_URL) return process.env.APP_URL.replace(/\/$/, "");

  const store = await headers();
  const host = store.get("x-forwarded-host") || store.get("host");
  const proto = store.get("x-forwarded-proto") || "https";
  if (host) return `${proto}://${host}`;

  return new URL(request.url).origin;
}
