"use client";

import { carPriceLabel, statusLabel, carImage } from "../lib/format";
import { useState } from "react";
import OfficialIcon from "./OfficialIcon";

export default function AdminCarList({ cars, onEdit, onDelete, canEdit = true, canDelete = true }) {
  const [openMenuId, setOpenMenuId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [password, setPassword] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deleting, setDeleting] = useState(false);

  if (!cars.length) {
    return <p className="empty">Aucune voiture ne correspond.</p>;
  }

  async function handleConfirmDelete(event) {
    event.preventDefault();
    if (!deleteTarget) return;

    setDeleteError("");
    setDeleting(true);
    try {
      await onDelete(deleteTarget, password);
      setDeleteTarget(null);
      setPassword("");
    } catch (error) {
      setDeleteError(error.message);
    } finally {
      setDeleting(false);
    }
  }

  function requestDelete(car) {
    setOpenMenuId(null);
    setDeleteError("");
    setPassword("");
    setDeleteTarget(car);
  }

  return (
    <>
      <div className="admin-list">
        <div className="admin-list-head" aria-hidden="true">
          <span>Photo</span>
          <span>Vehicule</span>
          <span>Annee</span>
          <span>Kilometrage</span>
          <span>Carburant</span>
          <span>Prix</span>
          <span>Statut</span>
          <span>Actions</span>
        </div>
        {cars.map((car) => (
          <article className="admin-item" key={car.id}>
            <img className="admin-item-thumb" src={carImage(car)} alt="" />
            <div className="admin-item-body">
              <header>
                <span>
                  {car.brand} {car.model}
                </span>
              </header>
              <span className="admin-item-ref">{car.reference} - {car.gearbox}</span>
              <span className="admin-item-mobile-meta">
                {car.year} - {car.mileage.toLocaleString("fr-BE")} km - {car.fuel}
              </span>
            </div>
            <span className="admin-item-cell" data-label="Annee">{car.year}</span>
            <span className="admin-item-cell" data-label="Kilometrage">{car.mileage.toLocaleString("fr-BE")} km</span>
            <span className="admin-item-cell" data-label="Carburant">{car.fuel}</span>
            <strong className="admin-item-price" data-label="Prix">{carPriceLabel(car) ?? "—"}</strong>
            <span className={`status ${car.status}`} data-label="Statut">{statusLabel(car.status)}</span>
            <div className="admin-actions" data-label="Actions">
              {canEdit || canDelete ? (
                <div className="admin-action-menu">
                  <button
                    className="admin-action-toggle"
                    type="button"
                    aria-label={`Actions pour ${car.reference}`}
                    aria-expanded={openMenuId === car.id}
                    onClick={() => setOpenMenuId(openMenuId === car.id ? null : car.id)}
                  >
                    <OfficialIcon name="more" width={18} height={18} />
                  </button>
                  {openMenuId === car.id && (
                    <div className="admin-action-dropdown">
                      {canEdit && (
                        <button
                          type="button"
                          onClick={() => {
                            setOpenMenuId(null);
                            onEdit(car);
                          }}
                        >
                          Modifier
                        </button>
                      )}
                      {canDelete && (
                        <button className="danger-text" type="button" onClick={() => requestDelete(car)}>
                          Supprimer
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <span className="team-muted">Lecture seule</span>
              )}
            </div>
            {(canEdit || canDelete) && (
              <div className="admin-mobile-card-actions" aria-label={`Actions rapides pour ${car.reference}`}>
                <div className="admin-mobile-action-menu">
                  <button
                    className="admin-mobile-action-toggle"
                    type="button"
                    aria-label={`Actions pour ${car.reference}`}
                    aria-expanded={openMenuId === car.id}
                    onClick={() => setOpenMenuId(openMenuId === car.id ? null : car.id)}
                  >
                    <OfficialIcon name="more" width={16} height={16} />
                  </button>
                  {openMenuId === car.id && (
                    <div className="admin-mobile-action-dropdown">
                      {canEdit && (
                        <button
                          type="button"
                          onClick={() => {
                            setOpenMenuId(null);
                            onEdit(car);
                          }}
                        >
                          Modifier
                        </button>
                      )}
                      {canDelete && (
                        <button className="danger-text" type="button" onClick={() => requestDelete(car)}>
                          Supprimer
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
            {!canEdit && !canDelete && (
              <div className="admin-mobile-card-actions" aria-label={`Consulter ${car.reference}`}>
                <a className="button neutral small" href={`/cars/${car.reference}`}>
                  Voir
                </a>
              </div>
            )}
          </article>
        ))}
      </div>

      {deleteTarget && (
        <div className="admin-confirm-overlay" role="presentation">
          <form className="admin-confirm-dialog" onSubmit={handleConfirmDelete}>
            <div>
              <p className="eyebrow">Suppression</p>
              <h3>Supprimer cette annonce ?</h3>
              <p>
                {deleteTarget.reference} - {deleteTarget.brand} {deleteTarget.model}
              </p>
            </div>
            <label>
              Mot de passe administrateur
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                autoFocus
              />
            </label>
            {deleteError && <p className="message error">{deleteError}</p>}
            <div className="admin-confirm-actions">
              <button
                className="button neutral small"
                type="button"
                onClick={() => {
                  setDeleteTarget(null);
                  setPassword("");
                  setDeleteError("");
                }}
              >
                Annuler
              </button>
              <button className="danger" type="submit" disabled={deleting}>
                {deleting ? "Suppression..." : "Confirmer"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
