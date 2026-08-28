import { cookies } from "next/headers";
import HomeHeader from "../../components/home/HomeHeader";
import HomeFooter from "../../components/home/HomeFooter";
import WhatsAppFab from "../../components/home/WhatsAppFab";
import CookieBanner from "../../components/CookieBanner";
import { SiteSettingsProvider } from "../../components/SiteSettingsProvider";
import { LanguageProvider } from "../../lib/i18n";
import { DEFAULT_LANG, LANG_COOKIE, LANGS } from "../../lib/i18n/dict";
import { getSiteSettings } from "../../../backend/models/siteSettings";

export const dynamic = "force-dynamic";

export default async function HomeLayout({ children }) {
  const siteSettings = getSiteSettings();

  // Langue lue cote serveur (cookie) : le rendu SSR est deja dans la bonne
  // langue, pas de clignotement a l'hydratation. Le changement ensuite se
  // fait 100% cote client, sans rechargement, sur la meme page.
  const cookieLang = (await cookies()).get(LANG_COOKIE)?.value;
  const lang = LANGS.includes(cookieLang) ? cookieLang : DEFAULT_LANG;

  return (
    <SiteSettingsProvider value={siteSettings}>
      <LanguageProvider initialLang={lang}>
        {/* Police : titres Montserrat (--font-display), corps Plus Jakarta Sans
            (--font-template via globals.css), comme le reste du site. */}
        <div className="min-h-screen overflow-x-clip bg-offwhite text-ink">
          <HomeHeader />
          <main>{children}</main>
          <HomeFooter />
          <WhatsAppFab />
          <CookieBanner />
        </div>
      </LanguageProvider>
    </SiteSettingsProvider>
  );
}
