"use client";

import { useEffect, useState } from "react";
import { useT } from "../lib/i18n";
import { OPEN_SETTINGS_EVENT, readConsent, writeConsent } from "../lib/consent";

function CookieGlyph({ className = "" }) {
  // Cookie facon Lucide : contour avec "bouchee" + pepites (petits traits ronds).
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
      <path d="M8.5 8.5v.01" />
      <path d="M16 15.5v.01" />
      <path d="M12 12v.01" />
      <path d="M11 17v.01" />
      <path d="M7 14v.01" />
    </svg>
  );
}

// Bandeau de consentement cookies : barre collee en bas, pleine largeur, qui
// remonte a l'ouverture. Aujourd'hui aucun cookie non essentiel n'est pose ;
// la mecanique est prete pour le jour ou un outil d'analyse/pub serait ajoute.
export default function CookieBanner() {
  const t = useT();
  const [mounted, setMounted] = useState(false); // present dans le DOM
  const [shown, setShown] = useState(false); // classe d'entree (slide-up) active
  const [showDetails, setShowDetails] = useState(false);
  const [prefs, setPrefs] = useState({ analytics: false, marketing: false });

  useEffect(() => {
    function reveal({ details }) {
      const current = readConsent();
      setPrefs({ analytics: !!current?.analytics, marketing: !!current?.marketing });
      setShowDetails(!!details);
      setMounted(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)));
    }

    if (!readConsent()) reveal({ details: false });

    const onOpen = () => reveal({ details: true });
    window.addEventListener(OPEN_SETTINGS_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_SETTINGS_EVENT, onOpen);
  }, []);

  function finish(choices) {
    writeConsent(choices);
    setShown(false);
    setShowDetails(false);
    window.setTimeout(() => setMounted(false), 320);
  }

  if (!mounted) return null;

  const rows = [
    { key: "necessary", title: t("cookie.necessary"), desc: t("cookie.necessaryDesc"), locked: true },
    { key: "analytics", title: t("cookie.analytics"), desc: t("cookie.analyticsDesc") },
    { key: "marketing", title: t("cookie.marketing"), desc: t("cookie.marketingDesc") },
  ];

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label={t("cookie.title")}
      className={`fixed inset-x-0 bottom-0 z-[70] border-t border-line bg-white shadow-[0_-6px_24px_rgba(15,14,12,0.10)] transition-transform duration-300 ease-out motion-reduce:transition-none ${
        shown ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] md:px-10 xl:px-16">
        <div className="flex items-start gap-3.5">
          <span className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-pastel text-brand sm:flex">
            <CookieGlyph className="h-6 w-6" />
          </span>
          <div className="min-w-0">
            <p className="flex items-center gap-2 text-[13px] font-bold text-ink sm:text-[14px]">
              <CookieGlyph className="h-4 w-4 text-brand sm:hidden" />
              {t("cookie.title")}
            </p>
            <p className="mt-1 text-[12.5px] leading-relaxed text-body">
              {t("cookie.text")}{" "}
              <a
                href="/politique-cookies"
                className="font-medium text-brand underline underline-offset-2 hover:text-brand-dark"
              >
                {t("cookie.more")}
              </a>
            </p>
          </div>
        </div>

        {showDetails && (
          <div className="flex flex-col divide-y divide-line border-y border-line">
            {rows.map((row) => (
              <label
                key={row.key}
                className="flex items-start justify-between gap-3 py-2.5 text-[12.5px]"
              >
                <span className="flex flex-col">
                  <span className="font-semibold text-ink">{row.title}</span>
                  <span className="mt-0.5 leading-relaxed text-subtle">{row.desc}</span>
                </span>
                {row.locked ? (
                  <span className="mt-0.5 shrink-0 text-[11px] font-medium uppercase tracking-wide text-subtle">
                    {t("cookie.alwaysOn")}
                  </span>
                ) : (
                  <input
                    type="checkbox"
                    className="mt-0.5 h-4 w-4 shrink-0 accent-brand"
                    checked={prefs[row.key]}
                    onChange={(e) => setPrefs((p) => ({ ...p, [row.key]: e.target.checked }))}
                  />
                )}
              </label>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-2 sm:justify-end">
          {showDetails ? (
            <button
              type="button"
              onClick={() => finish(prefs)}
              className="rounded-full border border-line px-5 py-2 text-[12px] font-semibold uppercase tracking-wider text-ink transition-colors hover:bg-surface"
            >
              {t("cookie.save")}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowDetails(true)}
              className="rounded-full px-5 py-2 text-[12px] font-semibold uppercase tracking-wider text-brand underline underline-offset-2"
            >
              {t("cookie.customize")}
            </button>
          )}
          <button
            type="button"
            onClick={() => finish({ analytics: false, marketing: false })}
            className="rounded-full border border-line px-5 py-2 text-[12px] font-semibold uppercase tracking-wider text-ink transition-colors hover:bg-surface"
          >
            {t("cookie.rejectAll")}
          </button>
          <button
            type="button"
            onClick={() => finish({ analytics: true, marketing: true })}
            className="rounded-full bg-cta px-5 py-2 text-[12px] font-semibold uppercase tracking-wider text-white transition-colors hover:bg-cta-dark"
          >
            {t("cookie.acceptAll")}
          </button>
        </div>
      </div>
    </div>
  );
}
