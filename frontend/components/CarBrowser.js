"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import CarGrid from "./CarGrid";

const DEFAULT_FILTERS = {
  brand: "",
  model: "",
  fuel: "",
  gearbox: "",
  bodyType: "",
  status: "",
  yearMin: "",
  mileageMax: "",
  priceMin: "",
  priceMax: "",
  sort: "recommended",
};

const PAGE_SIZE = 6;

const URL_KEYS = {
  q: "q",
  brand: "brand",
  model: "model",
  fuel: "fuel",
  gearbox: "gearbox",
  bodyType: "body",
  status: "status",
  yearMin: "year_min",
  mileageMax: "km_max",
  priceMin: "price_min",
  priceMax: "price_max",
  sort: "sort",
};

const STATUS_LABELS = {
  available: "Disponible",
  reserved: "Reserve",
  sold: "Vendu",
};

const MARKET_BRANDS = [
  "Audi",
  "BMW",
  "Citroen",
  "Dacia",
  "Fiat",
  "Ford",
  "Hyundai",
  "Kia",
  "Mercedes-Benz",
  "MINI",
  "Nissan",
  "Opel",
  "Peugeot",
  "Renault",
  "SEAT",
  "Skoda",
  "Toyota",
  "Volkswagen",
  "Volvo",
];

const MARKET_MODELS_BY_BRAND = {
  Audi: ["A1", "A3", "A4", "Q2", "Q3", "Q5"],
  BMW: ["Serie 1", "Serie 3", "Serie 5", "X1", "X3"],
  Citroen: ["C1", "C3", "C4", "C5 Aircross", "Berlingo"],
  Dacia: ["Sandero", "Duster", "Logan", "Jogger"],
  Fiat: ["500", "Panda", "Tipo", "Doblo"],
  Ford: ["Fiesta", "Focus", "Puma", "Kuga", "Transit"],
  Hyundai: ["i10", "i20", "i30", "Kona", "Tucson"],
  Kia: ["Picanto", "Rio", "Ceed", "Sportage", "Niro"],
  "Mercedes-Benz": ["Classe A", "Classe B", "Classe C", "CLA", "GLA"],
  MINI: ["Cooper", "Countryman", "Clubman"],
  Nissan: ["Micra", "Juke", "Qashqai", "X-Trail"],
  Opel: ["Corsa", "Astra", "Mokka", "Crossland", "Insignia"],
  Peugeot: ["108", "208", "308", "2008", "3008", "5008"],
  Renault: ["Clio", "Megane", "Captur", "Kadjar", "Scenic"],
  SEAT: ["Ibiza", "Leon", "Arona", "Ateca"],
  Skoda: ["Fabia", "Octavia", "Scala", "Kamiq", "Karoq"],
  Toyota: ["Aygo", "Yaris", "Corolla", "C-HR", "RAV4"],
  Volkswagen: ["Polo", "Golf", "Golf Plus", "Passat", "Tiguan", "Touran"],
  Volvo: ["V40", "V60", "XC40", "XC60"],
};

const MARKET_FUELS = [
  "Essence",
  "Diesel",
  "Hybride",
  "Hybride - Essence",
  "Hybride - Diesel",
  "Electrique",
  "GPL",
  "CNG",
];

const MARKET_GEARBOXES = ["Manuelle", "Automatique", "Semi-automatique"];

const MARKET_BODY_TYPES = [
  "Citadine",
  "Berline",
  "Break",
  "SUV",
  "Monospace",
  "Coupe",
  "Cabriolet",
  "Utilitaire",
];

const MARKET_YEARS = ["2026", "2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016", "2015", "2014", "2013", "2012", "2011", "2010"];

function numberValue(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function formatEuro(value) {
  return new Intl.NumberFormat("fr-BE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

function ChoiceGroup({
  label,
  value,
  onChange,
  options,
  className = "",
  defaultOpen = false,
  resetVersion = 0,
}) {
  const selected = options.find((option) => option.value === value) || options[0];
  const detailsRef = useRef(null);

  useEffect(() => {
    if (!detailsRef.current) return;
    detailsRef.current.open = defaultOpen;
  }, [defaultOpen, resetVersion]);

  return (
    <details
      ref={detailsRef}
      className={`stock-choice-group ${className}`}
      {...(defaultOpen ? { open: true } : {})}
    >
      <summary>
        <span>{label}</span>
        <strong>{selected?.label || "Tous"}</strong>
      </summary>
      <div className="stock-choice-options">
        {options.map((option) => (
          <button
            key={`${label}-${option.value || "all"}`}
            type="button"
            className={`stock-choice-option ${option.value === value ? "is-selected" : ""}`}
            aria-pressed={option.value === value}
            onClick={() => onChange(option.value)}
          >
            <span className="stock-choice-box" aria-hidden="true" />
            <span>{option.label}</span>
            {option.count !== undefined && <em>{option.count}</em>}
          </button>
        ))}
      </div>
    </details>
  );
}

export default function CarBrowser() {
  const [cars, setCars] = useState([]);
  const [query, setQuery] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [resetVersion, setResetVersion] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [urlReady, setUrlReady] = useState(false);
  const resultsRef = useRef(null);

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 980px)");

    function syncFilterPanel(eventOrQuery = mobileQuery) {
      setFiltersOpen(!eventOrQuery.matches);
    }

    syncFilterPanel(mobileQuery);
    mobileQuery.addEventListener("change", syncFilterPanel);
    return () => mobileQuery.removeEventListener("change", syncFilterPanel);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const nextFilters = { ...DEFAULT_FILTERS };

    Object.entries(URL_KEYS).forEach(([key, urlKey]) => {
      if (key === "q") return;
      const value = params.get(urlKey);
      if (value !== null && key in nextFilters) nextFilters[key] = value;
    });

    setQuery(params.get(URL_KEYS.q) || "");
    setFilters(nextFilters);
    setUrlReady(true);
  }, []);

  useEffect(() => {
    fetch("/api/cars")
      .then((response) => response.json())
      .then(setCars)
      .catch(() => setCars([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!urlReady) return;

    const params = new URLSearchParams();
    if (query.trim()) params.set(URL_KEYS.q, query.trim());

    Object.entries(filters).forEach(([key, value]) => {
      if (!value || value === DEFAULT_FILTERS[key]) return;
      params.set(URL_KEYS[key], value);
    });

    const pathname = window.location.pathname || "/";
    const nextUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    window.history.replaceState(null, "", nextUrl);
  }, [filters, query, urlReady]);

  const options = useMemo(() => {
    function stockCounts(key, source = cars) {
      return source.reduce((map, car) => {
        const value = car[key];
        if (!value) return map;
        map.set(String(value), (map.get(String(value)) || 0) + 1);
        return map;
      }, new Map());
    }

    function mergeChoices(baseValues, counts) {
      const values = [...baseValues, ...counts.keys()];
      return [...new Set(values.filter(Boolean))]
        .sort((a, b) => String(a).localeCompare(String(b), "fr"))
        .map((value) => ({
          value,
          label: String(value),
          count: counts.get(String(value)) || 0,
        }));
    }

    function choices(key, baseValues, source = cars) {
      return mergeChoices(baseValues, stockCounts(key, source));
    }

    function yearChoices() {
      const counts = cars.reduce((map, car) => {
        const year = numberValue(car.year);
        if (!year) return map;
        MARKET_YEARS.forEach((value) => {
          if (year >= Number(value)) map.set(value, (map.get(value) || 0) + 1);
        });
        return map;
      }, new Map());

      return MARKET_YEARS.map((value) => ({ value, label: value, count: counts.get(value) || 0 }));
    }

    function stockModelChoices(source = cars) {
      const counts = source.reduce((map, car) => {
        const value = car.model;
        if (!value) return map;
        map.set(String(value), (map.get(String(value)) || 0) + 1);
        return map;
      }, new Map());

      return counts;
    }

    const carsForModel = filters.brand
      ? cars.filter((car) => car.brand === filters.brand)
      : cars;
    const modelBase = filters.brand
      ? MARKET_MODELS_BY_BRAND[filters.brand] || []
      : Object.values(MARKET_MODELS_BY_BRAND).flat();

    return {
      brands: choices("brand", MARKET_BRANDS),
      models: mergeChoices(modelBase, stockModelChoices(carsForModel)),
      fuels: choices("fuel", MARKET_FUELS),
      gearboxes: choices("gearbox", MARKET_GEARBOXES),
      bodyTypes: choices("bodyType", MARKET_BODY_TYPES),
      years: yearChoices(),
    };
  }, [cars, filters.brand]);

  const visibleCars = useMemo(() => {
    const term = query.trim().toLowerCase();

    const filtered = cars.filter((car) => {
      const matchesSearch =
        !term ||
        `${car.reference} ${car.brand} ${car.model} ${car.fuel} ${car.gearbox} ${car.bodyType || ""} ${car.description || ""}`
          .toLowerCase()
          .includes(term);

      const matchesBrand = !filters.brand || car.brand === filters.brand;
      const matchesModel = !filters.model || car.model === filters.model;
      const matchesFuel = !filters.fuel || car.fuel === filters.fuel;
      const matchesGearbox = !filters.gearbox || car.gearbox === filters.gearbox;
      const matchesBodyType = !filters.bodyType || car.bodyType === filters.bodyType;
      const matchesStatus = !filters.status || car.status === filters.status;
      const matchesYear = !filters.yearMin || numberValue(car.year) >= numberValue(filters.yearMin);
      const matchesMileage =
        !filters.mileageMax || numberValue(car.mileage) <= numberValue(filters.mileageMax);
      const matchesPriceMin =
        !filters.priceMin || numberValue(car.price) >= numberValue(filters.priceMin);
      const matchesPriceMax =
        !filters.priceMax || numberValue(car.price) <= numberValue(filters.priceMax);

      return (
        matchesSearch &&
        matchesBrand &&
        matchesModel &&
        matchesFuel &&
        matchesGearbox &&
        matchesBodyType &&
        matchesStatus &&
        matchesYear &&
        matchesMileage &&
        matchesPriceMin &&
        matchesPriceMax
      );
    });

    return filtered.toSorted((a, b) => {
      if (filters.sort === "price_asc") return numberValue(a.price) - numberValue(b.price);
      if (filters.sort === "price_desc") return numberValue(b.price) - numberValue(a.price);
      if (filters.sort === "km_asc") return numberValue(a.mileage) - numberValue(b.mileage);
      if (filters.sort === "year_desc") return numberValue(b.year) - numberValue(a.year);
      if (filters.sort === "newest") {
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      }

      const statusRank = { available: 0, reserved: 1, sold: 2 };
      return (statusRank[a.status] ?? 3) - (statusRank[b.status] ?? 3);
    });
  }, [cars, filters, query]);

  const availableCars = cars.filter((car) => car.status !== "sold").length;
  const entryPrice = cars
    .filter((car) => car.status !== "sold" && numberValue(car.price) > 0)
    .reduce((min, car) => Math.min(min, numberValue(car.price)), Infinity);
  const shownEntryPrice = Number.isFinite(entryPrice) ? formatEuro(entryPrice) : "-";

  const activeFilterLabels = [
    query.trim() ? `Recherche: ${query.trim()}` : null,
    filters.brand ? `Marque: ${filters.brand}` : null,
    filters.model ? `Modele: ${filters.model}` : null,
    filters.bodyType ? `Carrosserie: ${filters.bodyType}` : null,
    filters.status ? `Disponibilite: ${STATUS_LABELS[filters.status] || filters.status}` : null,
    filters.priceMin ? `Min: ${filters.priceMin} EUR` : null,
    filters.priceMax ? `Max: ${filters.priceMax} EUR` : null,
    filters.mileageMax ? `Max: ${filters.mileageMax} km` : null,
    filters.yearMin ? `Depuis: ${filters.yearMin}` : null,
    filters.fuel ? `Carburant: ${filters.fuel}` : null,
    filters.gearbox ? `Boite: ${filters.gearbox}` : null,
  ].filter(Boolean);

  const activeFilters =
    activeFilterLabels.length + (filters.sort !== DEFAULT_FILTERS.sort ? 1 : 0);
  const pageCount = Math.max(1, Math.ceil(visibleCars.length / PAGE_SIZE));
  const paginatedCars = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return visibleCars.slice(start, start + PAGE_SIZE);
  }, [currentPage, visibleCars]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, query]);

  useEffect(() => {
    if (currentPage > pageCount) setCurrentPage(pageCount);
  }, [currentPage, pageCount]);

  function updateFilter(key, value) {
    setFilters((current) => {
      const next = { ...current, [key]: value };
      if (key === "brand") next.model = "";
      return next;
    });
    window.dataLayer?.push?.({ event: "autobhj_filter", filter: key, value });
  }

  function resetFilters() {
    setQuery("");
    setFilters(DEFAULT_FILTERS);
    setCurrentPage(1);
    setResetVersion((version) => version + 1);
  }

  function scrollToResults() {
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function goToPage(page) {
    setCurrentPage(page);
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="stock-browser">
      <div className="section-head">
        <div>
          <p className="eyebrow">Catalogue</p>
          <h2>Voitures disponibles</h2>
          <p className="section-lead">
            Filtrez le stock par reference, marque, budget, kilometrage et
            criteres essentiels. Les choix sont conserves dans l'adresse de la page.
          </p>
        </div>
        <div className="stock-hero-metrics" aria-label="Resume du stock">
          <span>
            <strong>{availableCars}</strong>
            en stock
          </span>
          <span>
            <strong>{shownEntryPrice}</strong>
            prix d'entree
          </span>
        </div>
      </div>

      <div className="stock-layout">
        <aside className="stock-sidebar">
          <label className="search stock-search">
            Recherche
            <input
              type="search"
              placeholder="Reference, marque, modele, carburant..."
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

          <div className={`stock-filters-panel ${filtersOpen ? "open" : ""}`}>
            <div className="stock-filter-scroll">
              <div className="stock-filter-head">
                <span>Affiner</span>
                <strong>{visibleCars.length}</strong>
              </div>

              <ChoiceGroup
                label="Marque"
                value={filters.brand}
                onChange={(value) => updateFilter("brand", value)}
                resetVersion={resetVersion}
                options={[
                  { value: "", label: "Toutes les marques" },
                  ...options.brands,
                ]}
              />
              <ChoiceGroup
                label="Modele"
                value={filters.model}
                onChange={(value) => updateFilter("model", value)}
                resetVersion={resetVersion}
                options={[
                  { value: "", label: "Tous les modeles" },
                  ...options.models,
                ]}
              />
              <ChoiceGroup
                label="Carrosserie"
                value={filters.bodyType}
                onChange={(value) => updateFilter("bodyType", value)}
                resetVersion={resetVersion}
                options={[
                  { value: "", label: "Toutes" },
                  ...options.bodyTypes,
                ]}
              />
              <ChoiceGroup
                label="Disponibilite"
                value={filters.status}
                onChange={(value) => updateFilter("status", value)}
                resetVersion={resetVersion}
                options={[
                  { value: "", label: "Tous les statuts" },
                  {
                    value: "available",
                    label: "Disponible",
                    count: cars.filter((car) => car.status === "available").length,
                  },
                  {
                    value: "reserved",
                    label: "Reserve",
                    count: cars.filter((car) => car.status === "reserved").length,
                  },
                  {
                    value: "sold",
                    label: "Vendu",
                    count: cars.filter((car) => car.status === "sold").length,
                  },
                ]}
              />
              <div className="stock-filter-pair">
                <label>
                  Prix min.
                  <input
                    type="number"
                    min="0"
                    inputMode="numeric"
                    placeholder="0"
                    value={filters.priceMin}
                    onChange={(event) => updateFilter("priceMin", event.target.value)}
                  />
                </label>
                <label>
                  Prix max.
                  <input
                    type="number"
                    min="0"
                    inputMode="numeric"
                    placeholder="15000"
                    value={filters.priceMax}
                    onChange={(event) => updateFilter("priceMax", event.target.value)}
                  />
                </label>
              </div>
              <ChoiceGroup
                label="Annee minimum"
                value={filters.yearMin}
                onChange={(value) => updateFilter("yearMin", value)}
                resetVersion={resetVersion}
                options={[
                  { value: "", label: "Toutes" },
                  ...options.years.map((option) => ({
                    value: String(option.value),
                    label: `${option.value} et plus`,
                    count: option.count,
                  })),
                ]}
              />
              <label>
                Kilometrage maximum
                <input
                  type="number"
                  min="0"
                  inputMode="numeric"
                  placeholder="100000"
                  value={filters.mileageMax}
                  onChange={(event) => updateFilter("mileageMax", event.target.value)}
                />
              </label>
              <ChoiceGroup
                label="Carburant"
                value={filters.fuel}
                onChange={(value) => updateFilter("fuel", value)}
                resetVersion={resetVersion}
                options={[
                  { value: "", label: "Tous" },
                  ...options.fuels,
                ]}
              />
              <ChoiceGroup
                label="Boite"
                value={filters.gearbox}
                onChange={(value) => updateFilter("gearbox", value)}
                resetVersion={resetVersion}
                options={[
                  { value: "", label: "Toutes" },
                  ...options.gearboxes,
                ]}
              />
            </div>

          </div>

          {filtersOpen && (
            <div className="stock-filter-actions">
              <button className="button ghost" type="button" onClick={resetFilters}>
                Effacer les filtres
              </button>
              <button className="button primary stock-show-results" type="button" onClick={scrollToResults}>
                Voir {visibleCars.length} {visibleCars.length > 1 ? "resultats" : "resultat"}
              </button>
            </div>
          )}
        </aside>

        <div className="stock-results" ref={resultsRef}>
          <div className="stock-results-head">
            <ChoiceGroup
              className="stock-sort"
              label="Trier"
              value={filters.sort}
              onChange={(value) => updateFilter("sort", value)}
              defaultOpen
              options={[
                { value: "recommended", label: "Recommande" },
                { value: "newest", label: "Plus recents" },
                { value: "price_asc", label: "Prix croissant" },
                { value: "price_desc", label: "Prix decroissant" },
                { value: "km_asc", label: "Kilometrage bas" },
                { value: "year_desc", label: "Annee recente" },
              ]}
            />
            {activeFilters > 0 && (
              <button
                className="button ghost stock-reset-inline"
                type="button"
                onClick={resetFilters}
                aria-label="Reinitialiser les filtres"
                title="Reinitialiser les filtres"
              >
                x
              </button>
            )}
          </div>

          {activeFilterLabels.length > 0 && (
            <div className="stock-active-filters" aria-label="Filtres actifs">
              {activeFilterLabels.map((label) => (
                <span key={label}>{label}</span>
              ))}
            </div>
          )}

          {loading ? <p className="empty">Chargement du stock...</p> : <CarGrid cars={paginatedCars} />}

          {!loading && pageCount > 1 && (
            <nav className="stock-pagination" aria-label="Pagination du stock">
              {Array.from({ length: pageCount }, (_, index) => index + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  className={page === currentPage ? "is-active" : ""}
                  aria-current={page === currentPage ? "page" : undefined}
                  onClick={() => goToPage(page)}
                >
                  {page}
                </button>
              ))}
              {currentPage < pageCount && (
                <button type="button" className="stock-pagination-next" onClick={() => goToPage(currentPage + 1)}>
                  Page suivante
                </button>
              )}
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}
