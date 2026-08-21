"use client";

import { useMemo, useState } from "react";
import AdminCarList from "../AdminCarList";

export default function AdminStock({ cars, onEdit, onDelete }) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();

    return cars.filter((car) => {
      if (statusFilter !== "all" && car.status !== statusFilter) return false;
      if (!term) return true;
      return `${car.reference} ${car.brand} ${car.model} ${car.fuel} ${car.gearbox}`
        .toLowerCase()
        .includes(term);
    });
  }, [cars, query, statusFilter]);

  return (
    <div className="panel dash-panel">
      <div className="dash-panel-head">
        <h2>Stock actuel ({filtered.length})</h2>
        <div className="stock-filters">
          <input
            type="search"
            placeholder="Reference, marque, modele..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="all">Tous les statuts</option>
            <option value="available">Disponibles</option>
            <option value="reserved">Reservees</option>
            <option value="sold">Vendues</option>
          </select>
        </div>
      </div>

      <AdminCarList cars={filtered} onEdit={onEdit} onDelete={onDelete} />
    </div>
  );
}
