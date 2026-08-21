import Image from "next/image";
import { formatPrice, formatKm, statusLabel, carImage } from "../lib/format";

export default function CarCard({ car }) {
  const reserved = car.status === "reserved";
  const sold = car.status === "sold";
  const photoCount = car.images?.length || 0;
  const createdAt = car.createdAt ? new Date(car.createdAt).getTime() : 0;
  const isNew = createdAt && Date.now() - createdAt < 1000 * 60 * 60 * 24 * 14;
  const lowMileage = Number(car.mileage) > 0 && Number(car.mileage) <= 75000;
  const specs = [car.fuel, formatKm(car.mileage), car.year, car.gearbox].filter(Boolean);

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
        {sold && <span className="sold-ribbon">Vendu</span>}
        {photoCount > 1 && <span className="photo-count">1/{photoCount}</span>}
        <div className="stock-card-badges">
          <span className={`status ${car.status}`}>{statusLabel(car.status)}</span>
          {isNew && <span className="status info">Nouveau</span>}
          {lowMileage && <span className="status info">Faible km</span>}
        </div>
      </div>

      <div className="stock-card-body">
        <span className="stock-card-reference">{car.reference}</span>
        <h3 className="stock-card-title">
          {car.brand} {car.model}
        </h3>
        <p className="stock-card-subtitle">
          {car.description
            ? car.description.slice(0, 90) + (car.description.length > 90 ? "..." : "")
            : "Contactez-nous pour plus d'informations."}
        </p>
        <div className="stock-card-specs" aria-label="Caracteristiques principales">
          {specs.map((spec) => (
            <span key={spec}>{spec}</span>
          ))}
        </div>

        <div className="stock-card-footer">
          <span className="stock-card-price">{formatPrice(car.price)}</span>
          <span className="stock-card-cta">Voir la fiche</span>
        </div>
      </div>
    </a>
  );
}

