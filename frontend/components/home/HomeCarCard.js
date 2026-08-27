import { carPriceLabel, formatKm, carImage, statusLabel } from "../../lib/format";

export default function HomeCarCard({ car, priority }) {
  const reserved = car.status === "reserved";
  const sold = car.status === "sold";
  const unavailable = reserved || sold;
  const price = carPriceLabel(car);

  const version = [car.bodyType, car.powerCh ? `${car.powerCh} ch` : null]
    .filter(Boolean)
    .join(" · ");
  const specs = [
    car.year ? String(car.year) : null,
    car.mileage ? formatKm(car.mileage) : null,
    car.fuel || null,
    car.gearbox || null,
  ].filter(Boolean);

  return (
    <a
      href={`/cars/${car.reference}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-line bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative">
        <img
          src={carImage(car)}
          alt={`${car.brand} ${car.model}`}
          width={640}
          height={480}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          className={`aspect-[4/3] w-full object-cover ${unavailable ? "opacity-70" : ""}`}
        />
        {unavailable && (
          <span className="absolute left-2.5 top-2.5 rounded-md bg-ink/85 px-2 py-0.5 text-[12px] font-semibold text-white">
            {statusLabel(car.status)}
          </span>
        )}
        {price && !sold && (
          <span className="absolute bottom-2.5 right-2.5 rounded-lg bg-white px-3 py-1 text-[15px] font-extrabold text-brand-dark shadow-md">
            {price}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3.5">
        <h3 className="truncate text-[15px] font-bold text-ink">
          {car.brand} {car.model}
        </h3>
        {version && <p className="mt-0.5 truncate text-[12.5px] text-body">{version}</p>}
        <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-subtle">
          {specs.map((spec, index) => (
            <span key={spec} className="flex items-center gap-2">
              {index > 0 && <span className="h-3 w-px bg-line" aria-hidden="true" />}
              {spec}
            </span>
          ))}
        </p>
        {sold && (
          <p className="mt-2 text-[13px] font-semibold text-subtle">{statusLabel(car.status)}</p>
        )}
      </div>
    </a>
  );
}
