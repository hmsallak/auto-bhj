import { formatPrice } from "../../lib/format";
import { STALE_DAYS, carAgeDays, isForSale, isStale, lacksPhoto } from "../../lib/stock";
import { isPastAppointment, toDateKey } from "../../lib/appointments";

const NEXT_APPOINTMENTS = 3;

// "Aujourd'hui" / "Demain" / "Sam. 26 sept." - the dashboard only needs a glance.
function appointmentDayLabel(startsAt) {
  const day = startsAt.slice(0, 10);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (day === toDateKey(new Date())) return "Aujourd'hui";
  if (day === toDateKey(tomorrow)) return "Demain";
  return new Intl.DateTimeFormat("fr-BE", { weekday: "short", day: "numeric", month: "short" }).format(
    new Date(startsAt)
  );
}

// Status colours: fresh / to watch / to review (past STALE_DAYS). Validated
// with the dataviz checks against the card surface #f1f1ea (all pairs, since
// the ring closes red back onto green); green/red CVD is close, so the legend
// always carries the text label next to each colour.
const AGE_BUCKETS = [
  { label: "0 - 30 j", min: 0, max: 30, color: "#2f8a57" },
  { label: "30 - 60 j", min: 30, max: STALE_DAYS, color: "#c07a12" },
  { label: `${STALE_DAYS} j et +`, min: STALE_DAYS, max: Infinity, color: "#c62828" },
];

const DONUT_RADIUS = 42;
const DONUT_CIRCUMFERENCE = 2 * Math.PI * DONUT_RADIUS;
const DONUT_GAP = 2;

// Donut of the age buckets; the total sits in the hole.
function AgeDonut({ buckets, total }) {
  const filled = buckets.filter((bucket) => bucket.count > 0);
  const gap = filled.length > 1 ? DONUT_GAP : 0;
  let offset = 0;

  return (
    <svg className="age-donut" viewBox="0 0 120 120" role="img" aria-label={`${total} voitures en vente, reparties par anciennete`}>
      <g transform="rotate(-90 60 60)">
        {filled.map((bucket) => {
          const length = (bucket.count / total) * DONUT_CIRCUMFERENCE;
          const segment = (
            <circle
              key={bucket.label}
              cx="60"
              cy="60"
              r={DONUT_RADIUS}
              fill="none"
              stroke={bucket.color}
              strokeWidth="16"
              strokeDasharray={`${Math.max(length - gap, 0.5)} ${DONUT_CIRCUMFERENCE}`}
              strokeDashoffset={-offset}
            >
              <title>{`${bucket.label} : ${bucket.count} voiture${bucket.count > 1 ? "s" : ""}`}</title>
            </circle>
          );
          offset += length;
          return segment;
        })}
      </g>
      <text className="age-donut-total" x="60" y="58" textAnchor="middle">
        {total}
      </text>
      <text className="age-donut-caption" x="60" y="74" textAnchor="middle">
        en vente
      </text>
    </svg>
  );
}

function Chevron() {
  return (
    <svg className="dash-todo-chevron" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Two zones: "Aujourd'hui" (what to do: next appointments + to-do) on the
// left, the stock age on the right. Recent activity lives on the Equipe page.
export default function AdminOverview({
  cars,
  messages = [],
  onGoToStock,
  onGoToMessages,
  canReadMessages = false,
  appointments = [],
  canViewAppointments = false,
  onGoToAppointments,
  onOpenAppointment,
}) {
  // "En vente" = everything not sold yet: a reserved car is still unsold stock.
  const forSale = cars.filter(isForSale);
  const reserved = forSale.filter((car) => car.status === "reserved").length;
  const stockValue = forSale.reduce((sum, car) => sum + (Number(car.price) || 0), 0);
  const ages = forSale.map(carAgeDays);
  const averageAge = ages.length ? Math.round(ages.reduce((sum, age) => sum + age, 0) / ages.length) : 0;
  const staleCount = cars.filter(isStale).length;
  const unread = messages.filter((msg) => !msg.isRead).length;
  const withoutPhoto = cars.filter(lacksPhoto).length;

  // Only rows with something to do are shown; each one opens the page where
  // it gets handled.
  const todos = [
    canReadMessages && unread > 0 && {
      id: "unread",
      label: `${unread} demande${unread > 1 ? "s" : ""} non lue${unread > 1 ? "s" : ""}`,
      onClick: onGoToMessages,
    },
    reserved > 0 && {
      id: "reserved",
      label: `${reserved} voiture${reserved > 1 ? "s" : ""} reservee${reserved > 1 ? "s" : ""}`,
      onClick: () => onGoToStock({ status: "reserved", special: null }),
    },
    withoutPhoto > 0 && {
      id: "photo",
      label: `${withoutPhoto} annonce${withoutPhoto > 1 ? "s" : ""} sans photo`,
      onClick: () => onGoToStock({ status: "all", special: "nophoto" }),
    },
    staleCount > 0 && {
      id: "stale",
      label: `${staleCount} annonce${staleCount > 1 ? "s" : ""} de plus de ${STALE_DAYS} jours`,
      onClick: () => onGoToStock({ status: "all", special: "stale" }),
    },
  ].filter(Boolean);

  const ageBuckets = AGE_BUCKETS.map((bucket) => {
    const inBucket = forSale.filter((_, index) => ages[index] >= bucket.min && ages[index] < bucket.max);
    return {
      label: bucket.label,
      color: bucket.color,
      count: inBucket.length,
      value: inBucket.reduce((sum, car) => sum + (Number(car.price) || 0), 0),
    };
  });

  const carsByReference = new Map(cars.map((car) => [car.reference, car]));
  const upcomingAppointments = appointments
    .filter((item) => !isPastAppointment(item.startsAt))
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  const nextAppointments = upcomingAppointments.slice(0, NEXT_APPOINTMENTS);

  // The line under a figure only shows when it flags something.
  const tiles = [
    { label: "En vente", value: forSale.length },
    { label: "Valeur du stock", value: formatPrice(stockValue) },
    {
      label: "Age moyen",
      value: `${averageAge} j`,
      alert: staleCount ? `${staleCount} a plus de ${STALE_DAYS} j` : "",
      tone: staleCount ? "warning" : "",
    },
    { label: "Non lues", value: unread, tone: unread ? "warning" : "" },
  ];

  return (
    <div className="dash-overview">
      <div className="kpi-grid">
        {tiles.map((tile) => (
          <div className="kpi-tile" key={tile.label}>
            <div>
              <span className="kpi-label">{tile.label}</span>
              <span className={`kpi-value ${tile.tone || ""}`}>{tile.value}</span>
            </div>
            {tile.alert && <span className="kpi-meta warning">{tile.alert}</span>}
          </div>
        ))}
      </div>

      <div className="dash-overview-grid">
        <section className="panel dash-panel" aria-labelledby="dash-today-title">
          <h2 id="dash-today-title" className="dash-zone-title">
            Aujourd'hui
          </h2>

          {canViewAppointments && (
            <div className="dash-subsection">
              <div className="dash-subsection-head">
                <h3>Prochains rendez-vous</h3>
                {onGoToAppointments && upcomingAppointments.length > 0 && (
                  <button className="dash-link" type="button" onClick={onGoToAppointments}>
                    Tout voir ({upcomingAppointments.length})
                  </button>
                )}
              </div>
              {nextAppointments.length ? (
                <ul className="dash-todo-list">
                  {nextAppointments.map((item) => {
                    const car = carsByReference.get(item.carReference);
                    return (
                      <li key={item.id}>
                        <button className="dash-todo dash-agenda" type="button" onClick={() => onOpenAppointment(item)}>
                          <span className="dash-agenda-when">
                            <span>{appointmentDayLabel(item.startsAt)}</span>
                            <strong>{item.startsAt.slice(11, 16)}</strong>
                          </span>
                          <span className="dash-todo-text">
                            <strong>{item.name}</strong>
                            {item.carReference && (
                              <span>{car ? `${car.brand} ${car.model}` : item.carReference}</span>
                            )}
                          </span>
                          <Chevron />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="empty">Aucun rendez-vous a venir.</p>
              )}
            </div>
          )}

          <div className="dash-subsection">
            <div className="dash-subsection-head">
              <h3>A traiter</h3>
            </div>
            {todos.length ? (
              <ul className="dash-todo-list">
                {todos.map((todo) => (
                  <li key={todo.id}>
                    <button className="dash-todo" type="button" onClick={todo.onClick}>
                      <span className="dash-todo-text">
                        <strong>{todo.label}</strong>
                      </span>
                      <Chevron />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="empty">Rien a traiter.</p>
            )}
          </div>
        </section>

        <section className="panel dash-panel" aria-labelledby="dash-age-title">
          <div className="dash-subsection-head">
            <h2 id="dash-age-title" className="dash-zone-title">
              Age du stock
            </h2>
            <button className="dash-link" type="button" onClick={() => onGoToStock({ status: "all", special: null })}>
              Tout voir
            </button>
          </div>

          {forSale.length ? (
            <div className="age-donut-layout">
              <AgeDonut buckets={ageBuckets} total={forSale.length} />
              <ul className="age-legend">
                {ageBuckets.map((bucket) => (
                  <li key={bucket.label} className={bucket.count ? "" : "is-empty"}>
                    <span className="age-swatch" style={{ background: bucket.color }} aria-hidden="true" />
                    <span className="age-legend-label">{bucket.label}</span>
                    <strong>
                      {bucket.count}
                      <span className="visually-hidden"> voiture{bucket.count > 1 ? "s" : ""}</span>
                    </strong>
                    <span className="age-legend-value">{bucket.count ? formatPrice(bucket.value) : ""}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="empty">Aucune voiture en vente.</p>
          )}
        </section>
      </div>
    </div>
  );
}
