"use client";

import { LANGS, useLang } from "../lib/i18n";

// Petit segment FR / NL pour l'en-tete (fond teal). Sobre, discret.
export default function LangToggle({ className = "" }) {
  const { lang, setLang } = useLang();

  return (
    <div
      className={`inline-flex shrink-0 overflow-hidden rounded-full border border-white/30 text-[12px] font-bold uppercase ${className}`}
      role="group"
      aria-label="Langue / Taal"
    >
      {LANGS.map((code) => (
        <button
          key={code}
          type="button"
          aria-pressed={lang === code}
          onClick={() => setLang(code)}
          className={`px-2.5 py-1 leading-none transition-colors ${
            lang === code
              ? "bg-white text-[#2d6b76]"
              : "text-white/75 hover:text-white"
          }`}
        >
          {code}
        </button>
      ))}
    </div>
  );
}
