import { NextResponse } from "next/server";
import { findByLogin, ensureSeedAdmin } from "../../../../../backend/models/adminUsers";
import { verifyPassword } from "../../../../../backend/auth/passwords";
import { createSessionToken, SESSION_TTL_MS } from "../../../../../backend/auth/sessions";
import { isRateLimited, recordFailedLogin, clearFailedLogins } from "../../../../../backend/auth/rateLimit";
import { getClientIp, SESSION_COOKIE_NAME } from "../../../../lib/adminAuth";
import { apiRoute } from "../../../../lib/apiRoute";

export const POST = apiRoute(async function handleLogin(request) {
  ensureSeedAdmin(process.env.ADMIN_USER || "admin", process.env.ADMIN_PASSWORD || "change-moi");

  const ip = await getClientIp();
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Trop de tentatives. Reessayez plus tard." }, { status: 429 });
  }

  const payload = await request.json().catch(() => ({}));
  const identifier = String(payload.identifier || payload.username || "").trim();
  const password = String(payload.password || "");

  const admin = findByLogin(identifier);
  const validPassword = admin ? verifyPassword(password, admin.password_hash) : false;

  if (!admin || !validPassword) {
    recordFailedLogin(ip);
    return NextResponse.json({ error: "Identifiants incorrects." }, { status: 401 });
  }

  if (admin.status && admin.status !== "active") {
    const messages = {
      pending_email: "Confirme d'abord ton adresse e-mail via le lien recu par mail.",
      pending_approval: "Ton compte attend l'approbation d'un administrateur.",
      rejected: "Ta demande de compte a ete refusee.",
    };
    return NextResponse.json(
      { error: messages[admin.status] || "Ce compte n'est pas actif." },
      { status: 403 }
    );
  }

  clearFailedLogins(ip);

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE_NAME, createSessionToken(admin.username), {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  });

  return response;
});
