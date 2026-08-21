import { formatPrice, statusLabel, carImage } from "../lib/format";

export default function AdminCarList({ cars, onEdit, onDelete }) {
  if (!cars.length) {
    return <p className="empty">Aucune voiture ne correspond.</p>;
  }

  return (
    <div className="admin-list">
      {cars.map((car) => (
        <article className="admin-item" key={car.id}>
          <img className="admin-item-thumb" src={carImage(car)} alt="" />
          <div className="admin-item-body">
            <header>
              <span>
                {car.reference} - {car.brand} {car.model}
              </span>
              <span>{formatPrice(car.price)}</span>
            </header>
            <span>
              {car.year} - {car.mileage.toLocaleString("fr-BE")} km - {car.fuel} - {car.gearbox}
            </span>
            <span className={`status ${car.status}`}>{statusLabel(car.status)}</span>
          </div>
          <div className="admin-actions">
            <button className="button neutral small" type="button" onClick={() => onEdit(car)}>
              Modifier
            </button>
            <button className="danger" type="button" onClick={() => onDelete(car)}>
              Supprimer
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
