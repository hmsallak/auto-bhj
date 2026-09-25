import { headers } from "next/headers";

// Public base URL for links sent by e-mail: APP_URL when set; in production
// without it, the canonical site; in local dev, the host of the request.
const CANONICAL_URL = "https://www.autobhj.be";

export async function resolveBaseUrl(request) {
  if (process.env.APP_URL) return process.env.APP_URL.replace(/\/$/, "");
  // The Host header is client-controlled: in production a forged one could
  // put an attacker's domain into password-reset links. Use the real site.
  if (process.env.NODE_ENV === "production") return CANONICAL_URL;

  const store = await headers();
  const host = store.get("x-forwarded-host") || store.get("host");
  const proto = store.get("x-forwarded-proto") || "https";
  if (host) return `${proto}://${host}`;

  return new URL(request.url).origin;
}
