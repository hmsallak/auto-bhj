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
    <section className="detail-shell">
      <VehicleViewTracker reference={car.reference} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <nav className="breadcrumb" aria-label="Fil d'Ariane">
        <a href="/">Accueil</a>
        <span>/</span>
        <a href="/stock">Stock</a>
        <span>/</span>
        <span className="breadcrumb-current">
          {car.brand} {car.model}
        </span>
      </nav>

      <div className="detail-market-layout">
        <div className="detail-market-main">
          <div className="detail-header">
            <div className="detail-header-title">
              <h1>
                {car.brand} {car.model}
              </h1>
              <p className="detail-reference">Reference {car.reference}</p>
            </div>
          </div>

          <div className="detail-mobile-summary" aria-label="Resume du vehicule">
            <div className="detail-mobile-price">
              <span>Prix</span>
              <strong>{formatPrice(car.price)}</strong>
            </div>
            <div className="detail-mobile-status">
              <span>Etat</span>
              <strong className={`status ${car.status}`}>{statusLabel(car.status)}</strong>
            </div>
          </div>

          <PhotoGallery images={car.images} alt={`${car.brand} ${car.model}`} status={car.status} />

          <SpecHighlights car={car} />
        </div>

        <aside className="detail-market-sidebar" aria-label="Prix et contact">
          <div className="detail-price-card">
            <span className="detail-price-label">Prix affiche</span>
            <p className="car-price">{formatPrice(car.price)}</p>
            <span className={`status ${car.status}`}>{statusLabel(car.status)}</span>
          </div>

          <div className="detail-seller-card">
            <span className="detail-seller-kicker">Vendeur</span>
            <h2>Auto BHJ</h2>
            <p>Mekingenweg 99, 1600 Sint-Pieters-Leeuw</p>
            <div className="detail-seller-badges">
              <span>Visite sur rendez-vous</span>
              <span>FR / NL</span>
            </div>
          </div>

          <div className="panel detail-contact-panel">
            <VehicleActions reference={car.reference} />
          </div>
        </aside>
      </div>

      <div className="detail-lower">
        <div className="panel detail-spec-panel">
          <CarSpecSheet car={car} />
        </div>
      </div>
    </section>
  );
}
