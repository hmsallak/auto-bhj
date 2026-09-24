"use client";

import { useEffect, useMemo, useState } from "react";
import AdminCarList from "../AdminCarList";
import { SPECIAL_FILTERS, STOCK_FILTER_ALL } from "../../lib/stock";

const PAGE_SIZE = 6;

const STATUS_TABS = [
  ["all", "Toutes"],
  ["available", "Disponibles"],
  ["reserved", "Reservees"],
  ["sold", "Vendues"],
];

export default function AdminStock({
  cars,
  onEdit,
  onDelete,
  onStatusChange,
  filter = STOCK_FILTER_ALL,
  onFilterChange = () => {},
  onCreate,
  canEdit = true,
  canDelete = true,
  canCreate = true,
}) {
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("updated");
  const [page, setPage] = useState(1);

  const special = SPECIAL_FILTERS[filter.special] || null;

  const statusCounts = useMemo(() => {
    const counts = { all: cars.length, available: 0, reserved: 0, sold: 0 };
    for (const car of cars) counts[car.status] = (counts[car.status] || 0) + 1;
    return counts;
  }, [cars]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();

    const result = cars.filter((car) => {
      if (filter.status !== "all" && car.status !== filter.status) return false;
      if (special && !special.test(car)) return false;
      if (!term) return true;
      return `${car.reference} ${car.brand} ${car.model} ${car.fuel} ${car.gearbox}`
        .toLowerCase()
        .includes(term);
    });

    return [...result].sort((a, b) => {
      // Stale list: longest on sale first, whatever the sort toggle says.
      if (filter.special === "stale") return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === "oldest") return new Date(a.updatedAt) - new Date(b.updatedAt);
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });
  }, [cars, query, sortBy, filter.status, filter.special, special]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visibleCars = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [query, sortBy, filter.status, filter.special]);

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
          <button
            type="button"
            className="stock-sort-toggle"
            aria-label={`Tri : ${sortBy === "oldest" ? "plus ancien" : "plus recent"} d'abord. Inverser`}
            onClick={() => setSortBy(sortBy === "oldest" ? "updated" : "oldest")}
          >
            <svg
              className={sortBy === "oldest" ? "is-flipped" : ""}
              viewBox="0 0 24 24"
              width="16"
              height="16"
              aria-hidden="true"
            >
              <path
                d="M7 4v16M3 16l4 4 4-4M14 6h7M14 11h5M14 16h3"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {sortBy === "oldest" ? "Plus ancien" : "Plus recent"}
          </button>
        </div>
      </details>

      <div className="stock-status-tabs" role="group" aria-label="Filtrer par statut">
        {STATUS_TABS.map(([value, label]) => (
          <button
            key={value}
            type="button"
            aria-pressed={filter.status === value}
            onClick={() => onFilterChange({ ...filter, status: value })}
          >
            {label}
            <span className="stock-status-count">{statusCounts[value] || 0}</span>
          </button>
        ))}
      </div>

      {special && (
        <div className="stock-special-filter">
          <span>{special.label}</span>
          <button
            type="button"
            aria-label={`Retirer le filtre ${special.label}`}
            onClick={() => onFilterChange({ ...filter, special: null })}
          >
            <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      )}

      <AdminCarList
        cars={visibleCars}
        onEdit={onEdit}
        onDelete={onDelete}
        onStatusChange={onStatusChange}
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
