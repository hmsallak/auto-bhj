"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import CarGrid from "./CarGrid";

const PROOF_EASE = [0.16, 1, 0.3, 1];

const proofContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const proofItem = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: PROOF_EASE } },
};

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

const MARKET_YEARS = ["2026", "2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016", "2015", "2014", "2013", "2012", "2011", "2010"];

const MILEAGE_LIMITS = ["50000", "75000", "100000", "125000", "150000", "200000"];

const SORT_LABELS = {
  recommended: "Pertinence",
  newest: "Plus recents",
  price_asc: "Prix croissant",
  price_desc: "Prix decroissant",
  km_asc: "Kilometrage bas",
  year_desc: "Annee recente",
};

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

function FilterIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 7h10" />
      <path d="M18 7h2" />
      <path d="M16 5v4" />
      <path d="M4 17h2" />
      <path d="M10 17h10" />
      <path d="M8 15v4" />
    </svg>
  );
}

function SearchIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function SortIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M8 4v16" />
      <path d="M4 8l4-4 4 4" />
      <path d="M16 20V4" />
      <path d="M12 16l4 4 4-4" />
    </svg>
  );
}

function CloseIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...props}>
      <path d="M5 5l14 14M19 5 5 19" />
    </svg>
  );
}

function CarLineIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5 13h14l-1.4-4.1A2 2 0 0 0 15.7 7H8.3a2 2 0 0 0-1.9 1.9L5 13Z" />
      <path d="M4 13v4h2" />
      <path d="M18 17h2v-4" />
      <circle cx="8" cy="17" r="1.5" />
      <circle cx="16" cy="17" r="1.5" />
    </svg>
  );
}

function ShieldCheckIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="42" height="42" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function AwardLineIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="42" height="42" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M8.5 11.5 7 21l5-3 5 3-1.5-9.5" />
      <path d="M10 8l1.3 1.3L14.5 6" />
    </svg>
  );
}

function HandshakeLineIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="42" height="42" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M7 11l3-3 3 3 2-2" />
      <path d="M3 12l4 4 3-3" />
      <path d="M21 12l-4 4-3-3" />
      <path d="M8 17l2 2a2 2 0 0 0 3 0l3-3" />
      <path d="M3 8l4-3 3 3" />
      <path d="M21 8l-4-3-3 3" />
    </svg>
  );
}

function closeSiblingChoiceGroups(currentDetails) {
  const scope = currentDetails.closest(".stock-filter-scroll, .stock-sort-shell, .stock-mobile-sort-panel");
  scope?.querySelectorAll("details.stock-choice-group[open]").forEach((details) => {
    if (details !== currentDetails) details.open = false;
  });
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

  function handleToggle(event) {
    if (event.currentTarget.open) closeSiblingChoiceGroups(event.currentTarget);
  }

  function chooseOption(nextValue) {
    onChange(nextValue);
    if (!defaultOpen && detailsRef.current) detailsRef.current.open = false;
  }

  return (
    <details
      ref={detailsRef}
      className={`stock-choice-group ${className}`}
      onToggle={handleToggle}
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
            onClick={() => chooseOption(option.value)}
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

function MileageFilter({ value, onChange, resetVersion = 0 }) {
  const detailsRef = useRef(null);
  const selectedLabel = value ? `${Number(value).toLocaleString("fr-BE")} km` : "Tous";

  useEffect(() => {
    if (!detailsRef.current) return;
    detailsRef.current.open = false;
  }, [resetVersion]);

  function chooseMileage(nextValue) {
    onChange(nextValue);
    if (detailsRef.current) detailsRef.current.open = false;
  }

  return (
    <details
      ref={detailsRef}
      className="stock-choice-group stock-mileage-menu"
      onToggle={(event) => {
        if (event.currentTarget.open) closeSiblingChoiceGroups(event.currentTarget);
      }}
    >
      <summary>
        <span>Km max</span>
        <strong>{selectedLabel}</strong>
      </summary>
      <div className="stock-choice-options stock-mileage-options">
        <button
          type="button"
          className={`stock-choice-option ${!value ? "is-selected" : ""}`}
          aria-pressed={!value}
          onClick={() => chooseMileage("")}
        >
          <span className="stock-choice-box" aria-hidden="true" />
          <span>Tous les km</span>
        </button>
        {MILEAGE_LIMITS.map((limit) => (
          <button
            key={limit}
            type="button"
            className={`stock-choice-option ${value === limit ? "is-selected" : ""}`}
            aria-pressed={value === limit}
            onClick={() => chooseMileage(limit)}
          >
            <span className="stock-choice-box" aria-hidden="true" />
            <span>{Number(limit).toLocaleString("fr-BE")} km</span>
          </button>
        ))}
        <label className="stock-mileage-custom">
          <span>Valeur personnalisee</span>
          <input
            type="number"
            min="0"
            inputMode="numeric"
            placeholder="Ex. 100000"
            value={value}
            onChange={(event) => onChange(event.target.value)}
          />
        </label>
      </div>
    </details>
  );
}

export default function CarBrowser() {
  const prefersReducedMotion = useReducedMotion();
  const [cars, setCars] = useState([]);
  const [query, setQuery] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [desktopSortOpen, setDesktopSortOpen] = useState(false);
  const [mobileSortOpen, setMobileSortOpen] = useState(false);
  const [desktopFiltersExpanded, setDesktopFiltersExpanded] = useState(false);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [resetVersion, setResetVersion] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [urlReady, setUrlReady] = useState(false);
  const resultsRef = useRef(null);
  const selectedSortLabel = SORT_LABELS[filters.sort] || SORT_LABELS.recommended;

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 980px)");

    function syncMobilePanels(eventOrQuery = mobileQuery) {
      const desktop = !eventOrQuery.matches;
      setFiltersOpen(desktop);
      setDesktopSortOpen(false);
      setMobileSortOpen(false);
    }

    syncMobilePanels(mobileQuery);
    mobileQuery.addEventListener("change", syncMobilePanels);
    return () => mobileQuery.removeEventListener("change", syncMobilePanels);
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

    function choicesFromCounts(counts) {
      return [...counts.keys()]
        .sort((a, b) => String(a).localeCompare(String(b), "fr"))
        .map((value) => ({
          value,
          label: String(value),
          count: counts.get(value) || 0,
        }));
    }

    function choices(key, source = cars) {
      return choicesFromCounts(stockCounts(key, source));
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

    const carsForModel = filters.brand
      ? cars.filter((car) => car.brand === filters.brand)
      : cars;

    return {
      brands: choices("brand"),
      models: choices("model", carsForModel),
      fuels: choices("fuel"),
      gearboxes: choices("gearbox"),
      bodyTypes: choices("bodyType"),
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
  }, [
    query,
    filters.brand,
    filters.model,
    filters.bodyType,
    filters.status,
    filters.priceMin,
    filters.priceMax,
    filters.mileageMax,
    filters.yearMin,
    filters.fuel,
    filters.gearbox,
  ]);

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

  function updateSort(value) {
    updateFilter("sort", value);
    setDesktopSortOpen(false);
    setMobileSortOpen(false);
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

  function applyMobileFilters() {
    setFiltersOpen(false);
    scrollToResults();
  }

  function goToPage(page) {
    setCurrentPage(page);
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="stock-browser">
      <section className="stock-catalog-hero" aria-labelledby="stock-catalog-title">
        <div className="stock-catalog-hero-copy">
          <p className="stock-catalog-pill">
            <CarLineIcon aria-hidden="true" />
            <span>Catalogue</span>
          </p>
          <h2 id="stock-catalog-title">
            Trouvez la voiture <span className="stock-catalog-accent">ideale</span>
          </h2>
          <span className="stock-catalog-mark" aria-hidden="true" />
          <p>
            Des occasions soigneusement selectionnees, pretes a prendre la route,
            avec des prix clairs et un accompagnement simple du premier contact a la remise des cles.
          </p>
        </div>

        <motion.div
          className="stock-catalog-proof"
          aria-label="Garanties Auto BHJ"
          variants={proofContainer}
          initial={prefersReducedMotion ? "show" : "hidden"}
          whileInView="show"
          viewport={{ once: false, amount: 0.3 }}
        >
          <motion.div className="stock-catalog-proof-item" variants={proofItem}>
            <ShieldCheckIcon aria-hidden="true" />
            <strong>Vehicules</strong>
            <span>controles</span>
          </motion.div>
          <motion.div className="stock-catalog-proof-item" variants={proofItem}>
            <AwardLineIcon aria-hidden="true" />
            <strong>Garantie</strong>
            <span>incluse</span>
          </motion.div>
          <motion.div className="stock-catalog-proof-item" variants={proofItem}>
            <HandshakeLineIcon aria-hidden="true" />
            <strong>Suivi</strong>
            <span>personnalise</span>
          </motion.div>
        </motion.div>
      </section>

      <label className="search stock-search stock-search-wide">
        <span className="stock-search-label-text">Recherche</span>
        <span className="stock-search-kind">
          Recherche
        </span>
        <SearchIcon className="stock-search-icon" aria-hidden="true" />
        <input
          type="search"
          placeholder="Reference, marque, modele, carburant..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </label>

      <div className="stock-layout">
        <aside className="stock-sidebar">
          <div className="stock-sort-shell">
            <button
              className={`button neutral stock-desktop-sort-toggle${filters.sort !== DEFAULT_FILTERS.sort ? " is-active" : ""}`}
              type="button"
              aria-expanded={desktopSortOpen}
              onClick={() => setDesktopSortOpen((value) => !value)}
            >
              <span className="stock-sort-prefix">Trier:</span>
              <strong>{selectedSortLabel}</strong>
              <SortIcon aria-hidden="true" />
              {filters.sort !== DEFAULT_FILTERS.sort && (
                <span className="stock-filter-count" aria-label="1 tri applique">
                  1
                </span>
              )}
            </button>
            <div className={`stock-results-head ${desktopSortOpen ? "sort-open" : ""}`}>
              <ChoiceGroup
                className="stock-sort"
                label="Trier"
                value={filters.sort}
                onChange={updateSort}
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
            </div>
          </div>

          <div className="stock-mobile-controls" aria-label="Controle du catalogue">
            <button
              className={`button neutral filter-toggle stock-mobile-action${activeFilterLabels.length > 0 ? " is-active" : ""}`}
              type="button"
              aria-expanded={filtersOpen}
              onClick={() => setFiltersOpen((value) => !value)}
            >
              <span>Filtres</span>
              <FilterIcon aria-hidden="true" />
              {activeFilterLabels.length > 0 && (
                <span className="stock-filter-count" aria-label={`${activeFilterLabels.length} filtres appliques`}>
                  {activeFilterLabels.length}
                </span>
              )}
            </button>

            <button
              className={`button neutral stock-sort-toggle stock-mobile-action${filters.sort !== DEFAULT_FILTERS.sort ? " is-active" : ""}`}
              type="button"
              aria-expanded={mobileSortOpen}
              onClick={() => setMobileSortOpen((value) => !value)}
            >
              <span>Trier par</span>
              <SortIcon aria-hidden="true" />
              {filters.sort !== DEFAULT_FILTERS.sort && (
                <span className="stock-filter-count" aria-label="1 tri applique">
                  1
                </span>
              )}
            </button>
          </div>

          <div className={`stock-mobile-sort-panel ${mobileSortOpen ? "sort-open" : ""}`}>
            <ChoiceGroup
              className="stock-sort"
              label="Trier"
              value={filters.sort}
              onChange={updateSort}
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
          </div>

          <div
            className={`stock-filters-panel ${filtersOpen ? "open" : ""}${desktopFiltersExpanded ? " desktop-expanded" : ""}`}
          >
            <div className="stock-filter-drawer-head">
              <button
                className="stock-filter-clear"
                type="button"
                onClick={resetFilters}
              >
                Réinitialiser les filtres
              </button>
              <strong>Tous les filtres</strong>
              <button
                className="stock-filter-close"
                type="button"
                aria-label="Fermer les filtres"
                onClick={() => setFiltersOpen(false)}
              >
                <CloseIcon aria-hidden="true" />
              </button>
            </div>

            <button
              className="stock-desktop-clear"
              type="button"
              onClick={resetFilters}
            >
              Réinitialiser les filtres
            </button>

            <button
              className={`stock-desktop-more-filters${desktopFiltersExpanded ? " is-active" : ""}`}
              type="button"
              aria-expanded={desktopFiltersExpanded}
              onClick={() => setDesktopFiltersExpanded((value) => !value)}
            >
              <span>Tous les filtres</span>
              <FilterIcon aria-hidden="true" />
            </button>

            <div className="stock-filter-applied">
              <div className="stock-filter-applied-head">
                <span>
                  Filtres appliques
                  {activeFilterLabels.length > 0 && <strong>{activeFilterLabels.length}</strong>}
                </span>
              </div>
              {activeFilterLabels.length > 0 && (
                <div className="stock-filter-applied-chips" aria-label="Filtres appliques">
                  {activeFilterLabels.map((label) => (
                    <span key={label}>{label}</span>
                  ))}
                </div>
              )}
            </div>

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
                className="stock-filter-secondary"
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
                className="stock-filter-secondary"
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
                  <span>Prix min.</span>
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
                  <span>Prix max.</span>
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
                className="stock-filter-secondary"
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
              <MileageFilter
                value={filters.mileageMax}
                onChange={(value) => updateFilter("mileageMax", value)}
                resetVersion={resetVersion}
              />
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

            <div className="stock-filter-drawer-actions">
              <button className="button primary stock-filter-search" type="button" onClick={applyMobileFilters}>
                Voir {visibleCars.length} {visibleCars.length > 1 ? "resultats" : "resultat"}
              </button>
            </div>
          </div>

          {filtersOpen && (
            <div className="stock-filter-actions">
              <button className="button primary stock-show-results" type="button" onClick={scrollToResults}>
                Voir {visibleCars.length} {visibleCars.length > 1 ? "resultats" : "resultat"}
              </button>
            </div>
          )}
        </aside>

        <div className="stock-results" ref={resultsRef}>
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
