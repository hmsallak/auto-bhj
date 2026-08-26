import { carPriceLabel, formatKm, carImage, statusLabel } from "../../lib/format";
import { MileageIcon, FuelIcon, GearboxIcon } from "./icons";

function Badge({ icon: Icon, children }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1 text-[14px] font-medium text-body">
      <Icon className="h-3.5 w-3.5 shrink-0 text-subtle" />
      {children}
    </span>
  );
}

export default function HomeCarCard({ car, priority }) {
  const reserved = car.status === "reserved";
  const sold = car.status === "sold";
  const unavailable = reserved || sold;

  return (
    <a
      href={`/cars/${car.reference}`}
      className="flex flex-col overflow-hidden rounded-lg border border-line bg-white shadow-sm transition-all duration-300 hover:scale-[1.03] hover:shadow-xl"
    >
      <div className="relative">
        <img
          src={carImage(car)}
          alt={`${car.brand} ${car.model}`}
          width={800}
          height={600}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          className={`aspect-[4/3] w-full object-cover ${unavailable ? "opacity-60" : ""}`}
        />
        {unavailable ? (
          <span className="absolute left-3 top-3 rounded-full bg-ink/85 px-3 py-1 text-[13px] font-semibold text-white">
            {statusLabel(car.status)}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="text-lg font-bold text-ink">
          {car.brand} <span className="text-sage">{car.model}</span>{" "}
          <span className="font-bold text-ink-soft">{car.year}</span>
        </h3>

        <div className="flex flex-wrap gap-2">
          {car.mileage ? <Badge icon={MileageIcon}>{formatKm(car.mileage)}</Badge> : null}
          {car.fuel ? <Badge icon={FuelIcon}>{car.fuel}</Badge> : null}
          {car.gearbox ? <Badge icon={GearboxIcon}>{car.gearbox}</Badge> : null}
        </div>

        {!sold && <p className="text-2xl font-extrabold text-brand-dark">{carPriceLabel(car)}</p>}

        <span className="mt-auto inline-flex min-h-[48px] w-full items-center justify-center rounded-lg bg-sage px-4 text-[14px] font-semibold uppercase tracking-wide text-white transition-colors hover:bg-sage-dark">
          Voir le véhicule
        </span>
      </div>
    </a>
  );
}
