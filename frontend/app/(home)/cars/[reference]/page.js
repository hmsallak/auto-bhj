import { notFound } from "next/navigation";
import { getCarByReference } from "../../../../../backend/models/cars";
import { formatKm, carPriceLabel } from "../../../../lib/format";
import CarDetail from "../../../../components/site/CarDetail";

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
  const description = `${car.brand} ${car.model} ${car.year}, ${formatKm(car.mileage)}, ${car.gearbox}, reference ${car.reference}. Disponible chez Auto BHJ a Sint-Pieters-Leeuw.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: car.imageUrl ? [{ url: car.imageUrl }] : [],
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
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Vehicle",
    name: `${car.brand} ${car.model}`,
    brand: car.brand,
    model: car.model,
    vehicleModelDate: String(car.year),
    mileageFromOdometer: {
      "@type": "QuantitativeValue",
      value: car.mileage,
      unitCode: "KMT",
    },
    fuelType: car.fuel,
    vehicleTransmission: car.gearbox,
    image: car.images?.length ? car.images : car.imageUrl ? [car.imageUrl] : undefined,
    // Sold vehicles have no price left to advertise - omit the offer's
    // price entirely rather than publish 0 as if it were real data.
    offers: {
      "@type": "Offer",
      ...(sold ? {} : { price: car.price }),
      priceCurrency: "EUR",
      availability,
      seller: {
        "@type": "AutoDealer",
        name: "Auto BHJ",
        address: "Mekingenweg 99, 1600 Sint-Pieters-Leeuw, Belgique",
      },
    },
  };

  // Escape "<" so an admin-entered field (e.g. a description containing
  // "</script>") can't break out of this inline <script> tag.
  const jsonLd = JSON.stringify(structuredData).replace(/</g, "\\u003c");

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <CarDetail car={car} />
    </>
  );
}
