"use client";

import { useEffect, useMemo, useState } from "react";
import CarGrid from "./CarGrid";

export default function CarBrowser() {
  const [cars, setCars] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch("/api/cars")
      .then((response) => response.json())
      .then(setCars)
      .catch(() => setCars([]));
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
    <>
      <div className="section-head">
        <div>
          <p className="eyebrow">Catalogue</p>
          <h2>Voitures disponibles</h2>
        </div>
        <label className="search">
          Rechercher (reference, marque, modele...)
          <input
            type="search"
            placeholder="Ex: AB-000123, BMW, Diesel"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
      </div>

      <CarGrid cars={visibleCars} />
    </>
  );
}
