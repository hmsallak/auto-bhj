import { notFound } from "next/navigation";
import { getCarByReference } from "../../../../../backend/models/cars";
import { formatPrice } from "../../../../lib/format";
import PhotoGallery from "../../../../components/PhotoGallery";
import CarSpecSheet from "../../../../components/CarSpecSheet";
import { ChevronLeftIcon } from "../../../../components/site/icons";

// A car's status/price/description can change (or the car can be sold and
// removed) at any time from the admin, so always fetch fresh data.
export const dynamic = "force-dynamic";

export default async function CarDetailPage({ params }) {
  const { reference } = await params;
  const car = getCarByReference(reference);
  if (!car) notFound();

  return (
    <section className="detail-shell">
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
          <p className="car-price" style={{ fontSize: 24, fontWeight: 900 }}>
            {formatPrice(car.price)}
          </p>
          <div className="car-specs">
            <span>{car.year}</span>
            <span>{car.mileage.toLocaleString("fr-BE")} km</span>
            <span>{car.fuel}</span>
            <span>{car.gearbox}</span>
          </div>
          <a className="button primary" href={`/?ref=${car.reference}#contact`}>
            Contacter Auto BHJ au sujet de {car.reference}
          </a>
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
        </div>
      </div>
    </section>
  );
}
