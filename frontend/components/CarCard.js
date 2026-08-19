import { formatPrice, formatKm, statusLabel, carImage } from "../lib/format";

function powerLabel(car) {
  if (car.powerKw && car.powerCh) return `${car.powerKw} kW (${car.powerCh} ch)`;
  return "-";
}

export default function CarCard({ car }) {
  const reserved = car.status === "reserved";
  const photoCount = car.images?.length || 0;

  return (
    <a className="listing-row-link" href={`/cars/${car.reference}`}>
      <article className={`listing-row stock-card ${reserved ? "is-reserved" : ""}`}>
        <div className="listing-media">
          <img src={carImage(car)} alt={`${car.brand} ${car.model}`} />
          {photoCount > 1 && <span className="photo-count">1/{photoCount}</span>}
          <span className={`status ${reserved ? "reserved" : "available"}`}>
            {statusLabel(car.status)}
          </span>
        </div>

        <div className="listing-main">
          <div className="listing-title-row">
            <div>
              <span className="listing-reference">{car.reference}</span>
              <h3 className="listing-title">
                {car.brand} {car.model}
              </h3>
            </div>
            <span className="listing-price mobile-price">{formatPrice(car.price)}</span>
          </div>
          <p className="listing-subtitle">
            {car.description
              ? car.description.slice(0, 110) + (car.description.length > 110 ? "..." : "")
              : "Contactez-nous pour plus d'informations."}
          </p>

          <div className="listing-specs">
            <div>
              <span className="listing-spec-label">Kilometrage</span>
              <strong>{formatKm(car.mileage)}</strong>
            </div>
            <div>
              <span className="listing-spec-label">Annee</span>
              <strong>{car.year}</strong>
            </div>
            <div>
              <span className="listing-spec-label">Puissance</span>
              <strong>{powerLabel(car)}</strong>
            </div>
            <div>
              <span className="listing-spec-label">Carburant</span>
              <strong>{car.fuel}</strong>
            </div>
            <div>
              <span className="listing-spec-label">Boite</span>
              <strong>{car.gearbox}</strong>
            </div>
            <div>
              <span className="listing-spec-label">Statut</span>
              <strong>{statusLabel(car.status)}</strong>
            </div>
          </div>
        </div>

        <div className="listing-price-col">
          <span className="listing-price">{formatPrice(car.price)}</span>
          <span className="listing-cta">Voir details</span>
        </div>
      </article>
    </a>
  );
}
