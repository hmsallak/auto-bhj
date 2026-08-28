import HomeHeader from "../../components/home/HomeHeader";
import HomeFooter from "../../components/home/HomeFooter";
import WhatsAppFab from "../../components/home/WhatsAppFab";
import { SiteSettingsProvider } from "../../components/SiteSettingsProvider";
import { getSiteSettings } from "../../../backend/models/siteSettings";

export const dynamic = "force-dynamic";

export default function HomeLayout({ children }) {
  const siteSettings = getSiteSettings();

  return (
    <SiteSettingsProvider value={siteSettings}>
      {/* Police : titres Montserrat (--font-display), corps Plus Jakarta Sans
          (--font-template via globals.css), comme le reste du site. */}
      <div className="min-h-screen overflow-x-clip bg-offwhite text-ink">
        <HomeHeader />
        <main>{children}</main>
        <HomeFooter />
        <WhatsAppFab />
      </div>
    </SiteSettingsProvider>
  );
}
