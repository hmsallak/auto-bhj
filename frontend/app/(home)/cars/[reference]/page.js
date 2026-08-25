import { notFound } from "next/navigation";
import { getCarByReference } from "../../../../../backend/models/cars";
import { formatKm, formatPrice, statusLabel } from "../../../../lib/format";
import PhotoGallery from "../../../../components/PhotoGallery";
import CarSpecSheet, { SpecHighlights } from "../../../../components/CarSpecSheet";
import VehicleActions from "../../../../components/VehicleActions";
import VehicleViewTracker from "../../../../components/VehicleViewTracker";

// A car's status/price/description can change (or the car can be sold and
// removed) at any time from the admin, so always fetch fresh data.
export const dynamic = "force-dynamic";

function titleFor(car) {
  return `${car.brand} ${car.model} ${car.year} ${car.fuel} a vendre - ${formatPrice(car.price)} - Auto BHJ`;
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
    offers: {
      "@type": "Offer",
      price: car.price,
      priceCurrency: "EUR",
      availability,
      seller: {
        "@type": "AutoDealer",
        name: "Auto BHJ",
        address: "Mekingenweg 99, 1600 Sint-Pieters-Leeuw, Belgique",
      },
    },
  };

  return (
    <section className="mx-auto max-w-6xl px-6 py-10">
      <VehicleViewTracker reference={car.reference} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <nav className="flex items-center gap-2 text-[14px] text-subtle" aria-label="Fil d'Ariane">
        <a href="/" className="hover:text-brand">
          Accueil
        </a>
        <span>/</span>
        <a href="/stock" className="hover:text-brand">
          Stock
        </a>
        <span>/</span>
        <span className="font-medium text-ink">
          {car.brand} {car.model}
        </span>
      </nav>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <h1 className="sr-only">
            {car.brand} {car.model}
          </h1>

          <PhotoGallery images={car.images} alt={`${car.brand} ${car.model}`} status={car.status} />

          <div className="flex flex-col gap-1 lg:hidden">
            <h2 className="text-lg font-bold text-ink">
              {car.brand} <span className="text-sage">{car.model}</span>
            </h2>
            <div className="flex items-center justify-between">
              <strong className="text-2xl font-extrabold text-brand-dark">{formatPrice(car.price)}</strong>
              <span className="text-[14px] font-medium text-sage">{statusLabel(car.status)}</span>
            </div>
          </div>

          <SpecHighlights car={car} />

          <CarSpecSheet car={car} />
        </div>

        <aside
          className="flex flex-col divide-y divide-sage border-y border-sage lg:sticky lg:top-24 lg:self-start"
          aria-label="Prix et contact"
        >
          <div className="hidden flex-col gap-1 py-6 lg:flex">
            <h2 className="text-lg font-bold text-ink">
              {car.brand} <span className="text-sage">{car.model}</span>
            </h2>
            <span className="mt-2 text-[13px] text-subtle">Prix affiche</span>
            <p className="text-2xl font-extrabold text-brand-dark">{formatPrice(car.price)}</p>
            <span className="mt-1 text-[13px] font-medium text-sage">{statusLabel(car.status)}</span>
          </div>

          <div className="flex flex-col gap-1 py-6">
            <span className="text-[13px] font-medium uppercase tracking-wide text-subtle">Vendeur</span>
            <h2 className="text-lg font-bold text-ink">Auto BHJ</h2>
            <p className="text-[14px] text-body">Mekingenweg 99, 1600 Sint-Pieters-Leeuw</p>
            <p className="mt-1 text-[13px] text-subtle">Visite sur rendez-vous &middot; FR / NL</p>
          </div>

          <div className="py-6">
            <VehicleActions reference={car.reference} />
          </div>
        </aside>
      </div>
    </section>
  );
}
