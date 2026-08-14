import { formatPrice, statusLabel } from "../../lib/format";

function relativeTime(iso) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.round(diffMs / 60000);
  if (minutes < 1) return "a l'instant";
  if (minutes < 60) return `il y a ${minutes} min`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `il y a ${hours} h`;
  const days = Math.round(hours / 24);
  return `il y a ${days} j`;
}

export default function AdminOverview({ cars, onGoToForm }) {
  const total = cars.length;
  const available = cars.filter((car) => car.status === "available").length;
  const reserved = cars.filter((car) => car.status === "reserved").length;
  const stockValue = cars
    .filter((car) => car.status === "available")
    .reduce((sum, car) => sum + car.price, 0);
  const avgPrice = total ? Math.round(cars.reduce((sum, car) => sum + car.price, 0) / total) : 0;

  const recent = [...cars]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 6);

  const tiles = [
    { label: "Voitures en stock", value: total },
    { label: "Disponibles", value: available, tone: "positive" },
    { label: "Reservees", value: reserved, tone: "warning" },
    { label: "Valeur du stock", value: formatPrice(stockValue) },
    { label: "Prix moyen", value: total ? formatPrice(avgPrice) : "-" },
  ];

  return (
    <div>
      <div className="kpi-grid">
        {tiles.map((tile) => (
          <div className="kpi-tile" key={tile.label}>
            <span className="kpi-label">{tile.label}</span>
            <span className={`kpi-value ${tile.tone || ""}`}>{tile.value}</span>
          </div>
        ))}
      </div>

      <div className="panel dash-panel">
        <div className="dash-panel-head">
          <h2>Activite recente</h2>
          <button className="button primary small" type="button" onClick={onGoToForm}>
            Ajouter une voiture
          </button>
        </div>

        {recent.length ? (
          <div className="recent-table">
            {recent.map((car) => (
              <div className="recent-row" key={car.id}>
                <span className="recent-ref">{car.reference}</span>
                <span>
                  {car.brand} {car.model}
                </span>
                <span>{formatPrice(car.price)}</span>
                <span className={`status ${car.status === "reserved" ? "reserved" : "available"}`}>
                  {statusLabel(car.status)}
                </span>
                <span className="recent-time">{relativeTime(car.updatedAt)}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty">Aucune voiture pour le moment.</p>
        )}
      </div>
    </div>
  );
}
