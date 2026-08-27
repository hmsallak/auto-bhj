import { Inter } from "next/font/google";
import HomeHeader from "../../components/home/HomeHeader";
import HomeFooter from "../../components/home/HomeFooter";
import WhatsAppFab from "../../components/home/WhatsAppFab";
import { SiteSettingsProvider } from "../../components/SiteSettingsProvider";
import { getSiteSettings } from "../../../backend/models/siteSettings";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  display: "swap",
});

export const dynamic = "force-dynamic";

export default function HomeLayout({ children }) {
  const siteSettings = getSiteSettings();

  return (
    <SiteSettingsProvider value={siteSettings}>
      <div className={`${inter.className} min-h-screen bg-offwhite text-ink`}>
        <HomeHeader />
        <main>{children}</main>
        <HomeFooter />
        <WhatsAppFab />
      </div>
    </SiteSettingsProvider>
  );
}
