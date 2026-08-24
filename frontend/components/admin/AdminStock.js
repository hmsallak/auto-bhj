"use client";

import { useEffect, useMemo, useState } from "react";
import AdminCarList from "../AdminCarList";

const PAGE_SIZE = 6;

export default function AdminStock({
  cars,
  onEdit,
  onDelete,
  onCreate,
  canEdit = true,
  canDelete = true,
  canCreate = true,
}) {
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("updated");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();

    const result = cars.filter((car) => {
      if (!term) return true;
      return `${car.reference} ${car.brand} ${car.model} ${car.fuel} ${car.gearbox}`
        .toLowerCase()
        .includes(term);
    });

    return [...result].sort((a, b) => {
      if (sortBy === "oldest") return new Date(a.updatedAt) - new Date(b.updatedAt);
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });
  }, [cars, query, sortBy]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visibleCars = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [query, sortBy]);

  useEffect(() => {
    setPage((current) => Math.min(current, pageCount));
  }, [pageCount]);

  return (
    <div className="panel dash-panel">
      <div className="dash-panel-head stock-admin-head">
        <div>
          <h2>Vehicules ({filtered.length})</h2>
          <p>Gestion compacte du stock publie sur le site.</p>
        </div>
        {canCreate && (
          <button className="button primary small stock-create-button" type="button" onClick={onCreate}>
            Ajouter un vehicule
          </button>
        )}
      </div>

      <details className="stock-mobile-filter-drawer" open>
        <summary>
          <span>Rechercher et filtrer</span>
          <strong>{filtered.length}</strong>
        </summary>
        <div className="stock-filters">
          <input
            type="search"
            placeholder="Reference, marque, modele..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <div className="stock-sort-segment" role="group" aria-label="Tri des vehicules">
            <button
              type="button"
              className={sortBy === "updated" ? "active" : ""}
              aria-pressed={sortBy === "updated"}
              onClick={() => setSortBy("updated")}
            >
              Plus recent
            </button>
            <button
              type="button"
              className={sortBy === "oldest" ? "active" : ""}
              aria-pressed={sortBy === "oldest"}
              onClick={() => setSortBy("oldest")}
            >
              Plus ancien
            </button>
          </div>
        </div>
      </details>

      <AdminCarList
        cars={visibleCars}
        onEdit={onEdit}
        onDelete={onDelete}
        canEdit={canEdit}
        canDelete={canDelete}
      />

      {pageCount > 1 && (
        <nav className="stock-pagination" aria-label="Pagination des vehicules">
          <button
            className="button neutral small"
            type="button"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={page === 1}
          >
            Precedent
          </button>
          <span>
            Page {page} / {pageCount}
          </span>
          <button
            className="button neutral small"
            type="button"
            onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
            disabled={page === pageCount}
          >
            Suivant
          </button>
        </nav>
      )}
    </div>
  );
}
