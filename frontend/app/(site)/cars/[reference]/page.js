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
      availability: reserved ? "https://schema.org/PreOrder" : "https://schema.org/InStock",
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

      <div className="detail-header">
        <div className="detail-header-title">
          <h1>
            {car.brand} {car.model}
          </h1>
          <p className="detail-reference">Reference {car.reference}</p>
        </div>
        <div className="detail-header-price">
          <div>
            <p className="car-price">{formatPrice(car.price)}</p>
            <span className={`status ${reserved ? "reserved" : "available"}`}>
              {statusLabel(car.status)}
            </span>
          </div>
          <div className="detail-header-actions">
            <a className="button navy" href={`/?ref=${car.reference}&intent=visit#contact`}>
              Contacter
            </a>
            <a className="button neutral" href="tel:+32000000000">
              Appeler
            </a>
          </div>
        </div>
      </div>

      <PhotoGallery images={car.images} alt={`${car.brand} ${car.model}`} status={car.status} />

      <SpecHighlights car={car} />

      <div className="decision-proof" aria-label="Informations importantes">
        <span>Controle avant vente</span>
        <span>Essai sur rendez-vous</span>
        <span>Prix affiche sans frais caches</span>
        <span>FR/NL: visite sur rendez-vous / bezoek op afspraak</span>
      </div>

      <div className="detail-lower">
        <div className="panel">
          <CarSpecSheet car={car} />
        </div>

        <div className="panel detail-contact-panel">
          <VehicleActions reference={car.reference} />
        </div>
      </div>

      <div className="mobile-sticky-actions">
        <VehicleActions reference={car.reference} compact />
      </div>
    </section>
  );
}
