import { notFound } from "next/navigation";
import { getCarByReference } from "../../../../../backend/models/cars";
import { formatKm, carPriceLabel } from "../../../../lib/format";
import CarDetail from "../../../../components/site/CarDetail";

const SITE_URL = "https://www.autobhj.be";

// A car's status/price/description can change (or the car can be sold and
// removed) at any time from the admin, so always fetch fresh data.
export const dynamic = "force-dynamic";

function titleFor(car) {
  const price = carPriceLabel(car);
  const suffix = price ? ` - ${price}` : "";
  return `${car.brand} ${car.model} ${car.year} ${car.fuel} a vendre${suffix} - Auto BHJ`;
}

export async function generateMetadata({ params }) {
  const { reference } = await params;
  const car = getCarByReference(reference);
  if (!car) return {};

  const title = titleFor(car);
  const description = `${car.brand} ${car.model} ${car.year}, ${formatKm(car.mileage)}, ${car.fuel}, ${car.gearbox}, reference ${car.reference}. En vente chez Auto BHJ a Sint-Pieters-Leeuw, pres de Bruxelles.`;
  const path = `/cars/${car.reference}`;
  const images = car.images?.length
    ? car.images.slice(0, 4)
    : car.imageUrl
      ? [car.imageUrl]
      : [];

  return {
    title: { absolute: title },
    description,
    keywords: [
      `${car.brand} ${car.model}`,
      `${car.brand} ${car.model} occasion`,
      `${car.brand} ${car.model} ${car.year}`,
      "voiture d'occasion Bruxelles",
      "Auto BHJ",
    ],
    alternates: { canonical: path },
    robots:
      car.status === "sold"
        ? { index: false, follow: true }
        : { index: true, follow: true },
    openGraph: {
      type: "website",
      url: `${SITE_URL}${path}`,
      siteName: "Auto BHJ",
      locale: "fr_BE",
      title,
      description,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images,
    },
  };
}

export default async function CarDetailPage({ params }) {
  const { reference } = await params;
  const car = getCarByReference(reference);
  if (!car) notFound();

  const reserved = car.status === "reserved";
  const sold = car.status === "sold";
  const availability = sold
    ? "https://schema.org/SoldOut"
    : reserved
      ? "https://schema.org/PreOrder"
      : "https://schema.org/InStock";

  const vehicleSchema = {
    "@context": "https://schema.org",
    "@type": "Vehicle",
    name: `${car.brand} ${car.model}`,
    brand: { "@type": "Brand", name: car.brand },
    model: car.model,
    vehicleModelDate: String(car.year),
    vehicleIdentificationNumber: car.reference,
    mileageFromOdometer: {
      "@type": "QuantitativeValue",
      value: car.mileage,
      unitCode: "KMT",
    },
    fuelType: car.fuel,
    vehicleTransmission: car.gearbox,
    ...(car.bodyType ? { bodyType: car.bodyType } : {}),
    ...(car.doors ? { numberOfDoors: car.doors } : {}),
    ...(car.powerKw
      ? {
          vehicleEngine: {
            "@type": "EngineSpecification",
            enginePower: { "@type": "QuantitativeValue", value: car.powerKw, unitCode: "KWT" },
            ...(car.engineCc
              ? {
                  engineDisplacement: {
                    "@type": "QuantitativeValue",
                    value: car.engineCc,
                    unitCode: "CMQ",
                  },
                }
              : {}),
          },
        }
      : {}),
    ...(car.emissionClass ? { emissionsCO2: car.emissionClass } : {}),
    image: car.images?.length ? car.images : car.imageUrl ? [car.imageUrl] : undefined,
    ...(car.description ? { description: car.description } : {}),
    // Sold vehicles have no price left to advertise - omit the offer's
    // price entirely rather than publish 0 as if it were real data.
    offers: {
      "@type": "Offer",
      ...(sold ? {} : { price: car.price }),
      priceCurrency: "EUR",
      availability,
      itemCondition: "https://schema.org/UsedCondition",
      url: `${SITE_URL}/cars/${car.reference}`,
      seller: { "@id": `${SITE_URL}/#business` },
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Nos vehicules", item: `${SITE_URL}/stock` },
      {
        "@type": "ListItem",
        position: 3,
        name: `${car.brand} ${car.model}`,
        item: `${SITE_URL}/cars/${car.reference}`,
      },
    ],
  };

  // Escape "<" so an admin-entered field (e.g. a description containing
  // "</script>") can't break out of this inline <script> tag.
  const jsonLd = JSON.stringify([vehicleSchema, breadcrumbSchema]).replace(/</g, "\\u003c");

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <CarDetail car={car} />
    </>
  );
}
