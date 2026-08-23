import Image from "next/image";
import { formatPrice, formatKm, statusLabel, carImage } from "../lib/format";

export default function CarCard({ car }) {
  const reserved = car.status === "reserved";
  const sold = car.status === "sold";
  const photoCount = car.images?.length || 0;
  const showStatusBadge = reserved || sold;
  const specs = [
    { icon: "/icons/carburant.png", value: car.fuel },
    { icon: "/icons/kilometrage.png", value: formatKm(car.mileage) },
    { icon: "/icons/annee.png", value: car.year },
    { icon: "/icons/boite-vitesses.png", value: car.gearbox },
  ].filter((spec) => spec.value);

  return (
    <a
      className={`stock-card reveal-card ${reserved ? "is-reserved" : ""} ${sold ? "is-sold" : ""}`}
      href={`/cars/${car.reference}`}
    >
      <div className="stock-card-media">
        <Image
          src={carImage(car)}
          alt={`${car.brand} ${car.model}`}
          width={400}
          height={280}
          sizes="(max-width: 640px) 100vw, (max-width: 960px) 45vw, 300px"
          unoptimized
        />
        {photoCount > 1 && <span className="photo-count">1/{photoCount}</span>}
        {showStatusBadge && (
          <div className="stock-card-badges">
            <span className={`status ${car.status}`}>{statusLabel(car.status)}</span>
          </div>
        )}
      </div>

      <div className="stock-card-body">
        <span className="stock-card-reference">{car.reference}</span>
        <h3 className="stock-card-title">
          {car.brand} <span className="stock-card-model">{car.model}</span>
        </h3>
        <p className="stock-card-subtitle">
          {car.description
            ? car.description.slice(0, 90) + (car.description.length > 90 ? "..." : "")
            : "Contactez-nous pour plus d'informations."}
        </p>
        <div className="stock-card-specs" aria-label="Caracteristiques principales">
          {specs.map(({ icon, value }) => (
            <span key={value}>
              <img src={icon} alt="" width={16} height={16} />
              {value}
            </span>
          ))}
        </div>

        <div className="stock-card-footer">
          <span className="stock-card-price">{formatPrice(car.price)}</span>
          <span className="stock-card-cta">
            <img src="/icons/voir-la-fiche.png" alt="" width={18} height={18} />
            Voir la fiche
          </span>
        </div>
      </div>
    </a>
  );
}

