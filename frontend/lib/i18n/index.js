"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { CAR_ENUMS, DEFAULT_LANG, LANG_COOKIE, LANGS, lookup } from "./dict";

export { LANGS, DEFAULT_LANG, LANG_COOKIE };

const LangContext = createContext({ lang: DEFAULT_LANG, setLang: () => {} });

export function LanguageProvider({ initialLang, children }) {
  const [lang, setLangState] = useState(
    LANGS.includes(initialLang) ? initialLang : DEFAULT_LANG
  );

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  const setLang = useCallback((next) => {
    if (!LANGS.includes(next)) return;
    setLangState(next);
    if (typeof document !== "undefined") {
      // 1 an, tout le site, pas de reload : le contexte re-rend a la volee.
      document.cookie = `${LANG_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    }
  }, []);

  return (
    <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}

// t("hero.title1") -> chaine dans la langue courante (repli FR puis cle brute).
export function useT() {
  const { lang } = useContext(LangContext);
  return useCallback((key) => lookup(lang, key), [lang]);
}

// Libelles des valeurs "enum" d'une voiture (carburant, boite, carrosserie,
// statut) + unites. Repli sur la valeur brute si non traduite.
export function useCarEnums() {
  const { lang } = useContext(LangContext);
  return useMemo(() => {
    const e = CAR_ENUMS[lang] || CAR_ENUMS[DEFAULT_LANG];
    const map = (table) => (value) => {
      if (value == null || value === "") return value;
      return table[String(value).toLowerCase()] ?? value;
    };
    const nf = new Intl.NumberFormat(lang === "nl" ? "nl-BE" : "fr-BE");
    return {
      lang,
      status: (s) => e.status[s] ?? e.status.available,
      fuel: map(e.fuel),
      gearbox: map(e.gearbox),
      body: map(e.body),
      powerUnit: e.powerUnit,
      power: (ch) => (ch ? `${ch} ${e.powerUnit}` : null),
      km: (n) => `${nf.format(n)} ${e.kmSuffix}`,
    };
  }, [lang]);
}
