import Hero from "../../components/site/Hero";
import JourneyScrollStory from "../../components/site/JourneyScrollStory";
import YoungDrivers from "../../components/site/YoungDrivers";
import HomeLatestCars from "../../components/site/HomeLatestCars";
import AboutUs from "../../components/site/AboutUs";
import RendezVous from "../../components/site/RendezVous";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Auto BHJ - Voitures d'occasion a Sint-Pieters-Leeuw",
  description:
    "Stock de vehicules d'occasion controles pres de Bruxelles. Photos, prix affiches et kilometrage consultables en ligne. Visite sur rendez-vous a Sint-Pieters-Leeuw.",
  openGraph: {
    title: "Auto BHJ - Voitures d'occasion a Sint-Pieters-Leeuw",
    description:
      "Stock de vehicules d'occasion controles pres de Bruxelles, avec prix affiches et photos consultables en ligne.",
    url: "https://www.autobhj.be",
    siteName: "Auto BHJ",
    locale: "fr_BE",
    type: "website",
  },
};

const businessSchema = {
  "@context": "https://schema.org",
  "@type": "AutomotiveBusiness",
  name: "Auto BHJ",
  url: "https://www.autobhj.be",
  telephone: "+32483208801",
  email: "contact@autobhj.be",
  priceRange: "€€",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Mekingenweg 99",
    postalCode: "1600",
    addressLocality: "Sint-Pieters-Leeuw",
    addressCountry: "BE",
  },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(businessSchema).replace(/</g, "\\u003c"),
        }}
      />
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
