import { notFound } from "next/navigation";
import { getCarByReference } from "../../../../../backend/models/cars";
import { formatKm, formatPrice, statusLabel } from "../../../../lib/format";
import PhotoGallery from "../../../../components/PhotoGallery";
import CarSpecSheet from "../../../../components/CarSpecSheet";
import VehicleActions from "../../../../components/VehicleActions";
import VehicleViewTracker from "../../../../components/VehicleViewTracker";
import { ChevronLeftIcon } from "../../../../components/site/icons";

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
  const power = car.powerKw && car.powerCh ? `${car.powerKw} kW / ${car.powerCh} ch` : null;
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
      <a className="back-link" href="/">
        <ChevronLeftIcon width="18" height="18" />
        Retour a l'accueil
      </a>
      <p className="detail-reference">Reference {car.reference}</p>
      <div className="detail-grid">
        <PhotoGallery images={car.images} alt={`${car.brand} ${car.model}`} status={car.status} />

        <div className="panel">
          <p className="eyebrow">{car.brand}</p>
          <h1>{car.model}</h1>
          <div className="detail-price-row">
            <p className="car-price">{formatPrice(car.price)}</p>
            <span className={`status ${reserved ? "reserved" : "available"}`}>
              {statusLabel(car.status)}
            </span>
          </div>
          <div className="car-specs">
            <span>{car.year}</span>
            <span>{formatKm(car.mileage)}</span>
            <span>{car.fuel}</span>
            <span>{car.gearbox}</span>
            {power && <span>{power}</span>}
          </div>

          <div className="decision-proof" aria-label="Informations importantes">
            <span>Controle avant vente</span>
            <span>Essai sur rendez-vous</span>
            <span>Prix affiche sans frais caches</span>
            <span>FR/NL: visite sur rendez-vous / bezoek op afspraak</span>
          </div>

          <VehicleActions reference={car.reference} />
        </div>
      </div>

      <div className="detail-lower">
        <div className="panel">
          <CarSpecSheet car={car} />
        </div>

        <div className="panel">
          <h3>Description</h3>
          <p className="car-description">
            {car.description || "Contactez-nous pour plus d'informations."}
          </p>
          <div className="detail-contact-card">
            <strong>Reference a communiquer : {car.reference}</strong>
            <p>
              Pour une reponse rapide, indiquez cette reference dans votre
              message ou lors de votre appel.
            </p>
          </div>
        </div>
      </div>

      <div className="mobile-sticky-actions">
        <VehicleActions reference={car.reference} compact />
      </div>
    </section>
  );
}
