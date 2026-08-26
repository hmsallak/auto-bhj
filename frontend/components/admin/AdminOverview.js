import { carPriceLabel, statusLabel, carImage } from "../../lib/format";

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

const ACTION_LABELS = {
  car_created: "Vehicule publie",
  car_updated: "Vehicule modifie",
  car_deleted: "Vehicule supprime",
  message_received: "Nouvelle demande recue",
  message_deleted: "Message supprime",
  user_created: "Membre cree",
  user_permissions_updated: "Permissions modifiees",
  user_deleted: "Membre supprime",
};

export default function AdminOverview({
  cars,
  messages = [],
  activity = [],
  onGoToStock,
}) {
  const total = cars.length;
  const available = cars.filter((car) => car.status === "available").length;
  const reserved = cars.filter((car) => car.status === "reserved").length;
  const sold = cars.filter((car) => car.status === "sold").length;
  const unread = messages.filter((msg) => !msg.isRead).length;

  const recent = [...cars]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 4);

  const recentActivity = activity.slice(0, 4);

  const tiles = [
    { label: "Stock", value: total, meta: `${available} disponibles` },
    { label: "Messages", value: messages.length, meta: `${unread} non lus`, tone: unread ? "warning" : "positive" },
    { label: "Reservees", value: reserved, meta: "A suivre", tone: reserved ? "warning" : "" },
    { label: "Vendues", value: sold, meta: "Archive", tone: "sold" },
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
            <span className="kpi-meta">{tile.meta}</span>
          </div>
        ))}
      </div>

      <div className="dash-overview-grid">
        <section className="panel dash-panel dash-recent-panel">
          <div className="dash-panel-head">
            <div>
              <h2>Vehicules recents</h2>
              <p>Dernieres annonces modifiees.</p>
            </div>
            <button className="button neutral small" type="button" onClick={onGoToStock}>
              Voir tout
            </button>
          </div>

          {recent.length ? (
            <div className="recent-vehicles">
              {recent.map((car) => (
                <article className="recent-vehicle" key={car.id}>
                  <img src={carImage(car)} alt="" />
                  <div>
                    <strong>
                      {car.brand} {car.model}
                    </strong>
                    <span>
                      {car.year} - {car.fuel} - {car.mileage.toLocaleString("fr-BE")} km
                    </span>
                  </div>
                  {carPriceLabel(car) && <b>{carPriceLabel(car)}</b>}
                  <span className={`status ${car.status}`}>{statusLabel(car.status)}</span>
                </article>
              ))}
            </div>
          ) : (
            <p className="empty">Aucune voiture pour le moment.</p>
          )}
        </section>
      </div>

      <section className="panel dash-panel">
        <div className="dash-panel-head">
          <div>
            <h2>Activites recentes</h2>
            <p>Dernieres actions dans l'administration.</p>
          </div>
        </div>

        {recentActivity.length ? (
          <div className="recent-table">
            {recentActivity.map((entry) => (
              <div className="recent-row recent-activity-row" key={entry.id}>
                <span className="recent-ref">{entry.actor}</span>
                <span>{ACTION_LABELS[entry.action] || entry.action}</span>
                <span>{entry.target || "-"}</span>
                <span className="recent-time">{relativeTime(entry.createdAt)}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty">Aucune activite disponible pour le moment.</p>
        )}
      </section>
    </div>
  );
}
