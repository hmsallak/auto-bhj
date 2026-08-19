"use client";

import { useEffect, useMemo, useState } from "react";
import CarGrid from "./CarGrid";

export default function CarBrowser() {
  const [cars, setCars] = useState([]);
  const [query, setQuery] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    brand: "",
    model: "",
    fuel: "",
    gearbox: "",
    status: "",
    priceMax: "",
    yearMin: "",
    mileageMax: "",
  });
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

    return cars.filter((car) => {
      const matchesSearch =
        !term ||
        `${car.reference} ${car.brand} ${car.model} ${car.fuel} ${car.gearbox} ${car.description}`
          .toLowerCase()
          .includes(term);

      const matchesBrand = !filters.brand || car.brand === filters.brand;
      const matchesModel = !filters.model || car.model === filters.model;
      const matchesFuel = !filters.fuel || car.fuel === filters.fuel;
      const matchesGearbox = !filters.gearbox || car.gearbox === filters.gearbox;
      const matchesStatus = !filters.status || car.status === filters.status;
      const matchesPrice =
        !filters.priceMax || Number(car.price) <= Number(filters.priceMax);
      const matchesYear =
        !filters.yearMin || Number(car.year) >= Number(filters.yearMin);
      const matchesMileage =
        !filters.mileageMax || Number(car.mileage) <= Number(filters.mileageMax);

      return (
        matchesSearch &&
        matchesBrand &&
        matchesModel &&
        matchesFuel &&
        matchesGearbox &&
        matchesStatus &&
        matchesPrice &&
        matchesYear &&
        matchesMileage
      );
    });
  }, [cars, filters, query]);

  const options = useMemo(() => {
    function unique(key) {
      return [...new Set(cars.map((car) => car[key]).filter(Boolean))].sort((a, b) =>
        String(a).localeCompare(String(b), "fr")
      );
    }

    return {
      brands: unique("brand"),
      models: unique("model"),
      fuels: unique("fuel"),
      gearboxes: unique("gearbox"),
    };
  }, [cars]);

  const activeFilters = Object.values(filters).filter(Boolean).length + (query.trim() ? 1 : 0);

  function updateFilter(key, value) {
    setFilters((current) => ({ ...current, [key]: value }));
    if (typeof window !== "undefined") {
      window.dataLayer?.push?.({ event: "autobhj_filter", filter: key, value });
    }
  }

  function resetFilters() {
    setQuery("");
    setFilters({
      brand: "",
      model: "",
      fuel: "",
      gearbox: "",
      status: "",
      priceMax: "",
      yearMin: "",
      mileageMax: "",
    });
  }

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

      <div className="stock-tools">
        <label className="search stock-search">
          Rechercher dans le stock
          <input
            type="search"
            placeholder="Ex: AB-000123, BMW, Diesel"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <button
          className="button neutral filter-toggle"
          type="button"
          aria-expanded={filtersOpen}
          onClick={() => setFiltersOpen((value) => !value)}
        >
          Filtres {activeFilters ? `(${activeFilters})` : ""}
        </button>
      </div>

      <div className={`stock-filters-panel ${filtersOpen ? "open" : ""}`}>
        <label>
          Marque
          <select value={filters.brand} onChange={(event) => updateFilter("brand", event.target.value)}>
            <option value="">Toutes les marques</option>
            {options.brands.map((brand) => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </label>
        <label>
          Modele
          <select value={filters.model} onChange={(event) => updateFilter("model", event.target.value)}>
            <option value="">Tous les modeles</option>
            {options.models.map((model) => (
              <option key={model} value={model}>{model}</option>
            ))}
          </select>
        </label>
        <label>
          Prix maximum
          <input
            type="number"
            min="0"
            inputMode="numeric"
            placeholder="Ex: 15000"
            value={filters.priceMax}
            onChange={(event) => updateFilter("priceMax", event.target.value)}
          />
        </label>
        <label>
          Annee min.
          <input
            type="number"
            min="1980"
            max="2035"
            inputMode="numeric"
            placeholder="Ex: 2018"
            value={filters.yearMin}
            onChange={(event) => updateFilter("yearMin", event.target.value)}
          />
        </label>
        <label>
          Kilometrage max.
          <input
            type="number"
            min="0"
            inputMode="numeric"
            placeholder="Ex: 100000"
            value={filters.mileageMax}
            onChange={(event) => updateFilter("mileageMax", event.target.value)}
          />
        </label>
        <label>
          Carburant
          <select value={filters.fuel} onChange={(event) => updateFilter("fuel", event.target.value)}>
            <option value="">Tous</option>
            {options.fuels.map((fuel) => (
              <option key={fuel} value={fuel}>{fuel}</option>
            ))}
          </select>
        </label>
        <label>
          Boite
          <select value={filters.gearbox} onChange={(event) => updateFilter("gearbox", event.target.value)}>
            <option value="">Toutes</option>
            {options.gearboxes.map((gearbox) => (
              <option key={gearbox} value={gearbox}>{gearbox}</option>
            ))}
          </select>
        </label>
        <label>
          Statut
          <select value={filters.status} onChange={(event) => updateFilter("status", event.target.value)}>
            <option value="">Tous</option>
            <option value="available">Disponible</option>
            <option value="reserved">Reserve</option>
          </select>
        </label>
        <button className="button ghost" type="button" onClick={resetFilters}>
          Effacer les filtres
        </button>
      </div>

      {loading ? <p className="empty">Chargement du stock...</p> : <CarGrid cars={visibleCars} />}
    </div>
  );
}
