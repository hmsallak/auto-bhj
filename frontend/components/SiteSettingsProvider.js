"use client";

import { createContext, useContext } from "react";

// Fallback used if a component reads the context without a provider above it
// (or before the server value is wired). Kept in sync with the model's
// DEFAULTS.
export const SITE_SETTINGS_FALLBACK = {
  phone: "0483 20 88 01",
  phoneTel: "+32483208801",
  whatsapp: "32483208801",
  email: "contact@autobhj.be",
};

const SiteSettingsContext = createContext(SITE_SETTINGS_FALLBACK);

export function SiteSettingsProvider({ value, children }) {
  return (
    <SiteSettingsContext.Provider value={value || SITE_SETTINGS_FALLBACK}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}
