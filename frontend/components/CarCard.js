import Image from "next/image";
import { formatPrice, formatKm, carImage } from "../lib/format";
import { CalendarIcon, FuelIcon, GaugeIcon, GearboxIcon } from "./CarSpecIcons";

export default function CarCard({ car }) {
  const reserved = car.status === "reserved";
  const sold = car.status === "sold";
  const photoCount = car.images?.length || 0;
  const specs = [
    { Icon: FuelIcon, value: car.fuel },
    { Icon: GaugeIcon, value: formatKm(car.mileage) },
    { Icon: CalendarIcon, value: car.year },
    { Icon: GearboxIcon, value: car.gearbox },
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
      </div>

      <div className="stock-card-body">
        <h3 className="stock-card-title">
          {car.brand} <span className="stock-card-model">{car.model}</span>
        </h3>
        <p className="stock-card-subtitle">
          {car.description
            ? car.description.slice(0, 90) + (car.description.length > 90 ? "..." : "")
            : "Contactez-nous pour plus d'informations."}
        </p>
        <div className="stock-card-specs" aria-label="Caracteristiques principales">
          {specs.map(({ Icon, value }) => (
            <span key={value}>
              <Icon aria-hidden="true" />
              {value}
            </span>
          ))}
        </div>

        <div className="stock-card-footer">
          <span className="stock-card-price">{formatPrice(car.price)}</span>
          <span className="stock-card-cta">
            Voir plus
            <span aria-hidden="true">→</span>
          </span>
        </div>
      </div>
    </a>
  );
}
