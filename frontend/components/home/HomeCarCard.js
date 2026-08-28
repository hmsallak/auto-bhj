import { carPriceLabel, formatKm, carImage, statusLabel } from "../../lib/format";

export default function HomeCarCard({ car, priority, stock = false }) {
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
  // Descriptif de la carte stock : annee, km, carburant, boite, norme Euro.
  const stockSpecs = [...specs, car.emissionClass || null].filter(Boolean);

  const statusBadge = unavailable && (
    <span className="absolute left-2 top-2 rounded-md bg-ink/85 px-2 py-0.5 text-[11px] font-semibold text-white sm:left-2.5 sm:top-2.5 sm:text-[12px]">
      {statusLabel(car.status)}
    </span>
  );

  // Page stock : photo a gauche + descriptif a droite sur mobile, carte
  // verticale classique a partir de `lg` (grille 3 colonnes).
  if (stock) {
    return (
      <a
        href={`/cars/${car.reference}`}
        className="group flex overflow-hidden rounded-xl border border-line bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md lg:flex-col"
      >
        <div className="relative w-[132px] shrink-0 self-stretch sm:w-[176px] lg:w-full lg:self-auto">
          <img
            src={carImage(car)}
            alt={`${car.brand} ${car.model}`}
            width={640}
            height={480}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            className={`h-full w-full object-cover lg:aspect-[4/3] lg:h-auto ${
              unavailable ? "opacity-70" : ""
            }`}
          />
          {statusBadge}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-1 p-3 sm:p-3.5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="truncate text-[14px] font-bold text-ink sm:text-[15.5px]">
              {car.brand} {car.model}
            </h3>
            {price && !sold && (
              <span className="shrink-0 text-[14px] font-extrabold text-brand-dark sm:text-[16px]">
                {price}
              </span>
            )}
          </div>

          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11.5px] text-subtle sm:text-[12px]">
            {stockSpecs.map((spec, index) => (
              <span key={spec} className="flex items-center gap-2">
                {index > 0 && <span className="h-3 w-px bg-line" aria-hidden="true" />}
                {spec}
              </span>
            ))}
          </p>

          {sold && (
            <p className="text-[13px] font-semibold text-subtle">{statusLabel(car.status)}</p>
          )}
        </div>
      </a>
    );
  }

  // Home : sur mobile, carte horizontale compacte (petite photo a gauche, prix
  // a cote de la marque, descriptif technique sur une ligne). A partir de `sm`,
  // carte verticale classique pour la grille.
  return (
    <a
      href={`/cars/${car.reference}`}
      className="group flex overflow-hidden rounded-xl border border-line bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg sm:flex-col"
    >
      <div className="relative w-[126px] shrink-0 self-stretch sm:w-full sm:self-auto">
        <img
          src={carImage(car)}
          alt={`${car.brand} ${car.model}`}
          width={640}
          height={480}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          className={`h-full w-full object-cover sm:aspect-[4/3] sm:h-auto ${
            unavailable ? "opacity-70" : ""
          }`}
        />
        {statusBadge}
        {price && !sold && (
          <span className="absolute bottom-2.5 right-2.5 hidden rounded-lg bg-white px-3 py-1 text-[15px] font-extrabold text-brand-dark shadow-md sm:inline-block">
            {price}
          </span>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1 p-3 sm:p-3.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="truncate text-[14px] font-bold text-ink sm:text-[15px]">
            {car.brand} {car.model}
          </h3>
          {price && !sold && (
            <span className="shrink-0 text-[14px] font-extrabold text-brand-dark sm:hidden">
              {price}
            </span>
          )}
        </div>

        {version && (
          <p className="truncate text-[12px] text-body sm:mt-0.5 sm:text-[12.5px]">{version}</p>
        )}

        <p className="truncate text-[11px] text-subtle sm:mt-1.5 sm:whitespace-normal sm:text-[12px]">
          {stockSpecs.join(" · ")}
        </p>

        {sold && (
          <p className="mt-1 text-[13px] font-semibold text-subtle">{statusLabel(car.status)}</p>
        )}
      </div>
    </a>
  );
}
