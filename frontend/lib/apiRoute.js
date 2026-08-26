import { NextResponse } from "next/server";

// Wraps a route handler so any uncaught exception (a DB error, a bad
// assumption, a bug) always returns a proper JSON error instead of
// crashing the request with no usable response. Without this, the
// client's fetch gets an empty/HTML body it can't parse as JSON and
// falls back to a generic, undiagnosable "Une erreur est survenue.".
export function apiRoute(handler) {
  return async (request, context) => {
    try {
      return await handler(request, context);
    } catch (error) {
      console.error("[api]", error);
      return NextResponse.json({ error: "Une erreur est survenue." }, { status: 500 });
    }
  };
}
