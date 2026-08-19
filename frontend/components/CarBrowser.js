"use client";

import { useEffect, useMemo, useState } from "react";
import CarGrid from "./CarGrid";

export default function CarBrowser() {
  const [cars, setCars] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/cars")
      .then((response) => response.json())
      .then(setCars)
      .catch(() => setCars([]))
      .finally(() => setLoading(false));
  }, []);

  const visibleCars = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return cars;

    return cars.filter((car) =>
      `${car.reference} ${car.brand} ${car.model} ${car.fuel} ${car.gearbox}`
        .toLowerCase()
        .includes(term)
    );
  }, [cars, query]);

  return (
    <div className="stock-browser">
      <div className="section-head">
        <div>
          <p className="eyebrow">Catalogue</p>
          <h2>Voitures disponibles</h2>
          <p className="section-lead">
            Filtrez le stock par reference, marque, modele, carburant ou boite.
            Chaque annonce affiche les informations essentielles avant la visite.
          </p>
        </div>
        <div className="stock-summary" aria-live="polite">
          <strong>{visibleCars.length}</strong>
          <span>{visibleCars.length > 1 ? "resultats" : "resultat"}</span>
        </div>
      </div>

      <label className="search stock-search">
        Rechercher dans le stock
        <input
          type="search"
          placeholder="Ex: AB-000123, BMW, Diesel"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </label>

      {loading ? <p className="empty">Chargement du stock...</p> : <CarGrid cars={visibleCars} />}
    </div>
  );
}
