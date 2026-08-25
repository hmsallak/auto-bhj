import { Inter } from "next/font/google";
import HomeHeader from "../../components/home/HomeHeader";
import HomeFooter from "../../components/home/HomeFooter";
import WhatsAppFab from "../../components/home/WhatsAppFab";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  display: "swap",
});

export default function HomeLayout({ children }) {
  return (
    <div className={`${inter.className} min-h-screen bg-offwhite text-ink`}>
      <HomeHeader />
      <main>{children}</main>
      <HomeFooter />
      <WhatsAppFab />
    </div>
  );
}
