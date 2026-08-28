import CarBrowser from "../../../components/CarBrowser";

const SITE_URL = "https://www.autobhj.be";

export const metadata = {
  title: "Nos voitures d'occasion en stock",
  description:
    "Toutes les voitures d'occasion disponibles chez Auto BHJ a Sint-Pieters-Leeuw, avec recherche, filtres, prix affiches, photos et kilometrage.",
  alternates: { canonical: "/stock" },
  openGraph: {
    title: "Nos voitures d'occasion en stock - Auto BHJ",
    description:
      "Recherche et filtres, prix affiches et photos. Voitures d'occasion controlees pres de Bruxelles.",
    url: `${SITE_URL}/stock`,
    type: "website",
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Accueil", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Nos vehicules", item: `${SITE_URL}/stock` },
  ],
};

export default function StockPage() {
  const jsonLd = JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c");
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <CarBrowser />
    </>
  );
}
