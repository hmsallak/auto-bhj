import { Montserrat, Plus_Jakarta_Sans, Poppins } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-template",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-admin",
  display: "swap",
});

const SITE_URL = "https://www.autobhj.be";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Auto BHJ - Voitures d'occasion a Sint-Pieters-Leeuw (Bruxelles)",
    template: "%s | Auto BHJ",
  },
  description:
    "Auto BHJ, vendeur de voitures d'occasion controlees pres de Bruxelles. Prix affiches, photos et kilometrage consultables en ligne. Visite et essai sur rendez-vous a Sint-Pieters-Leeuw.",
  applicationName: "Auto BHJ",
  keywords: [
    "voiture d'occasion",
    "voiture occasion Bruxelles",
    "voiture occasion Sint-Pieters-Leeuw",
    "garage occasion Belgique",
    "vehicule d'occasion controle",
    "petite voiture jeune conducteur",
    "Auto BHJ",
  ],
  authors: [{ name: "Auto BHJ" }],
  creator: "Auto BHJ",
  publisher: "Auto BHJ SRL",
  formatDetection: { telephone: true, address: true, email: true },
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/logo-static.png",
    shortcut: "/logo-static.png",
    apple: "/logo-static.png",
  },
  openGraph: {
    type: "website",
    locale: "fr_BE",
    alternateLocale: "nl_BE",
    siteName: "Auto BHJ",
    url: SITE_URL,
    title: "Auto BHJ - Voitures d'occasion a Sint-Pieters-Leeuw",
    description:
      "Voitures d'occasion controlees pres de Bruxelles, avec prix affiches et photos consultables en ligne.",
    images: [
      { url: "/hero-jeunes-conducteurs.png", width: 1200, height: 630, alt: "Auto BHJ" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Auto BHJ - Voitures d'occasion a Sint-Pieters-Leeuw",
    description: "Voitures d'occasion controlees pres de Bruxelles.",
    images: ["/hero-jeunes-conducteurs.png"],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2d6b76",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={`${jakarta.variable} ${montserrat.variable} ${poppins.variable}`}>
      <head>
      </head>
      <body>{children}</body>
    </html>
  );
}
