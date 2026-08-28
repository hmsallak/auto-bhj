import Hero from "../../components/site/Hero";
import JourneyScrollStory from "../../components/site/JourneyScrollStory";
import YoungDrivers from "../../components/site/YoungDrivers";
import HomeLatestCars from "../../components/site/HomeLatestCars";
import AboutUs from "../../components/site/AboutUs";
import RendezVous from "../../components/site/RendezVous";

export const dynamic = "force-dynamic";

const SITE_URL = "https://www.autobhj.be";

export const metadata = {
  title: {
    absolute: "Auto BHJ - Voitures d'occasion a Sint-Pieters-Leeuw pres de Bruxelles",
  },
  description:
    "Stock de voitures d'occasion controlees pres de Bruxelles. Photos, prix affiches et kilometrage consultables en ligne. Visite et essai sur rendez-vous a Sint-Pieters-Leeuw.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Auto BHJ - Voitures d'occasion a Sint-Pieters-Leeuw",
    description:
      "Stock de voitures d'occasion controlees pres de Bruxelles, avec prix affiches et photos consultables en ligne.",
    url: SITE_URL,
    siteName: "Auto BHJ",
    locale: "fr_BE",
    type: "website",
  },
};

const businessSchema = {
  "@context": "https://schema.org",
  "@type": "AutomotiveBusiness",
  "@id": `${SITE_URL}/#business`,
  name: "Auto BHJ",
  legalName: "Auto BHJ SRL",
  url: SITE_URL,
  logo: `${SITE_URL}/logo-auto-bhj.png`,
  image: `${SITE_URL}/hero-jeunes-conducteurs.png`,
  telephone: "+32483208801",
  email: "contact@autobhj.be",
  vatID: "BE0801303538",
  priceRange: "€€",
  currenciesAccepted: "EUR",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Mekingenweg 99",
    postalCode: "1600",
    addressLocality: "Sint-Pieters-Leeuw",
    addressRegion: "Brabant flamand",
    addressCountry: "BE",
  },
  areaServed: [
    { "@type": "City", name: "Sint-Pieters-Leeuw" },
    { "@type": "City", name: "Bruxelles" },
    { "@type": "Country", name: "Belgique" },
  ],
  availableLanguage: ["fr", "nl"],
  knowsLanguage: ["fr", "nl"],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: "Auto BHJ",
  inLanguage: "fr-BE",
  publisher: { "@id": `${SITE_URL}/#business` },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/stock?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export default function HomePage() {
  const jsonLd = JSON.stringify([businessSchema, websiteSchema]).replace(/</g, "\\u003c");

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <Hero />
      <section className="py-14 sm:py-16 lg:py-20" id="stock">
        <HomeLatestCars />
      </section>
      <JourneyScrollStory />
      <YoungDrivers />
      <AboutUs />
      <RendezVous />
    </>
  );
}
