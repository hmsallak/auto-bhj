"use client";

// Gestion du consentement cookies. Aujourd'hui le site n'a AUCUN cookie non
// essentiel : ce module est en place pour plus tard. Avant de charger un outil
// tiers (Google Analytics, Meta Pixel, GTM...), verifier hasConsent("analytics")
// ou hasConsent("marketing") et ecouter l'evenement "autobhj:consent-change".

export const CONSENT_COOKIE = "autobhj_consent";
export const CONSENT_VERSION = 1;

// Categories optionnelles (les cookies "necessaires" ne se refusent pas).
export const OPTIONAL_CATEGORIES = ["analytics", "marketing"];

export const CONSENT_EVENT = "autobhj:consent-change";
export const OPEN_SETTINGS_EVENT = "autobhj:open-cookie-settings";

function readCookie(name) {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp("(?:^|; )" + name.replace(/([.$?*|{}()[\]\\/+^])/g, "\\$1") + "=([^;]*)")
  );
  return match ? decodeURIComponent(match[1]) : null;
}

// -> { v, necessary:true, analytics:bool, marketing:bool, t } ou null si pas
// encore de choix enregistre.
export function readConsent() {
  try {
    const raw = readCookie(CONSENT_COOKIE);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.v !== CONSENT_VERSION) return null;
    return {
      v: CONSENT_VERSION,
      necessary: true,
      analytics: !!parsed.analytics,
      marketing: !!parsed.marketing,
      t: parsed.t || null,
    };
  } catch {
    return null;
  }
}

export function writeConsent(choices) {
  const value = {
    v: CONSENT_VERSION,
    analytics: !!choices.analytics,
    marketing: !!choices.marketing,
    t: new Date().toISOString(),
  };
  try {
    document.cookie = `${CONSENT_COOKIE}=${encodeURIComponent(
      JSON.stringify(value)
    )}; path=/; max-age=31536000; samesite=lax`;
  } catch {
    /* stockage indisponible */
  }
  try {
    window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: { ...value, necessary: true } }));
  } catch {
    /* pas de window */
  }
}

export function hasConsent(category) {
  if (category === "necessary") return true;
  const c = readConsent();
  return !!(c && c[category]);
}
