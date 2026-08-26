"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import HomeCarGrid from "./home/HomeCarGrid";
import { SearchIcon, ChevronDownIcon } from "./home/icons";
import SectionEyebrow from "./home/SectionEyebrow";

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

function FilterSelect({ id, label, value, onChange, options, defaultOptionLabel }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-medium uppercase tracking-wide text-subtle">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-[44px] cursor-pointer rounded-lg border border-line bg-white px-3 text-[14px] font-normal text-ink focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        <option value="">{defaultOptionLabel}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.count !== undefined ? `${option.label} (${option.count})` : option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function PillSelect({ id, value, onChange, options, defaultOptionLabel }) {
  return (
    <select
      id={id}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-11 w-auto cursor-pointer rounded-full border border-line bg-white px-4 text-[14px] font-normal text-ink focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-brand"
    >
      <option value="">{defaultOptionLabel}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.count !== undefined ? `${option.label} (${option.count})` : option.label}
        </option>
      ))}
    </select>
  );
}

function PricePopover({ minValue, maxValue, onMinChange, onMaxChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const label =
    minValue || maxValue
      ? `${minValue ? `${Number(minValue).toLocaleString("fr-BE")} EUR` : "0 EUR"} - ${
          maxValue ? `${Number(maxValue).toLocaleString("fr-BE")} EUR` : "..."
        }`
      : "Prix";

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex h-11 w-auto cursor-pointer items-center gap-1.5 rounded-full border border-line bg-white px-4 text-[14px] font-medium text-ink focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        {label}
        <ChevronDownIcon className={`h-4 w-4 text-subtle transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute left-0 top-[calc(100%+8px)] z-20 flex max-w-[calc(100vw-2rem)] flex-col gap-3 rounded-2xl border border-line bg-white p-4 shadow-lg sm:flex-row">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-subtle">Min</span>
            <input
              type="number"
              min="0"
              inputMode="numeric"
              value={minValue}
              onChange={(event) => onMinChange(event.target.value)}
              className="h-11 w-full rounded-lg border border-line bg-white px-3 text-[14px] font-medium text-ink outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-brand [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none sm:w-[130px]"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-subtle">Max</span>
            <input
              type="number"
              min="0"
              inputMode="numeric"
              value={maxValue}
              onChange={(event) => onMaxChange(event.target.value)}
              className="h-11 w-full rounded-lg border border-line bg-white px-3 text-[14px] font-medium text-ink outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-brand [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none sm:w-[130px]"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function CarBrowser() {
  const [cars, setCars] = useState([]);
  const [query, setQuery] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [urlReady, setUrlReady] = useState(false);
  const resultsRef = useRef(null);

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
        .map((value) => ({ value, label: String(value), count: counts.get(value) || 0 }));
    }

    function choices(key, source = cars) {
      return choicesFromCounts(stockCounts(key, source));
    }

    const carsForModel = filters.brand ? cars.filter((car) => car.brand === filters.brand) : cars;

    return {
      brands: choices("brand"),
      models: choices("model", carsForModel),
      fuels: choices("fuel"),
      gearboxes: choices("gearbox"),
      bodyTypes: choices("bodyType"),
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
    filters.mileageMax ? `Max: ${Number(filters.mileageMax).toLocaleString("fr-BE")} km` : null,
    filters.yearMin ? `Depuis: ${filters.yearMin}` : null,
    filters.fuel ? `Carburant: ${filters.fuel}` : null,
    filters.gearbox ? `Boite: ${filters.gearbox}` : null,
  ].filter(Boolean);

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
  }

  function resetFilters() {
    setQuery("");
    setFilters(DEFAULT_FILTERS);
    setCurrentPage(1);
  }

  function goToPage(page) {
    setCurrentPage(page);
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const resultsCountLabel = `${visibleCars.length} ${visibleCars.length > 1 ? "resultats" : "resultat"}`;

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8">
        <SectionEyebrow>Catalogue</SectionEyebrow>
        <h1 className="mt-2 text-3xl font-bold text-brand-dark sm:text-4xl">Trouvez la voiture ideale</h1>
        <p className="mt-3 max-w-2xl text-[15px] text-body">
          Des occasions soigneusement selectionnees, pretes a prendre la route, avec des prix clairs et un
          accompagnement simple du premier contact a la remise des cles.
        </p>
      </div>

      <div className="relative mb-6">
        <SearchIcon className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-subtle" />
        <input
          type="search"
          placeholder="Reference, marque, modele, carburant..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="min-h-[48px] w-full rounded-lg border border-line bg-white pl-4 pr-11 text-[15px] text-ink focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-brand"
        />
      </div>

      <div className="mb-8">
        <div className="flex gap-3 lg:hidden">
          <button
            type="button"
            onClick={() => {
              setFiltersOpen((value) => !value);
              setSortOpen(false);
            }}
            className="flex h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-full border border-line bg-white px-4 text-[14px] font-medium text-ink"
          >
            Filtre{activeFilterLabels.length > 0 ? ` (${activeFilterLabels.length})` : ""}
          </button>
          <button
            type="button"
            onClick={() => {
              setSortOpen((value) => !value);
              setFiltersOpen(false);
            }}
            className="flex h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-full border border-line bg-white px-4 text-[14px] font-medium text-ink"
          >
            Trier: {SORT_LABELS[filters.sort]}
          </button>
        </div>

        {sortOpen && (
          <div className="mt-3 flex flex-col gap-1 rounded-2xl border border-line bg-white p-2 lg:hidden">
            {Object.entries(SORT_LABELS).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => {
                  updateFilter("sort", value);
                  setSortOpen(false);
                }}
                className={`cursor-pointer rounded-lg px-3 py-2.5 text-left text-[14px] font-normal ${
                  filters.sort === value ? "bg-brand-pastel text-brand" : "text-ink hover:bg-surface"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        <div className="hidden flex-wrap items-center gap-3 lg:flex">
          <PillSelect
            id="filter-brand"
            value={filters.brand}
            onChange={(value) => updateFilter("brand", value)}
            options={options.brands}
            defaultOptionLabel="Marque"
          />
          <PillSelect
            id="filter-gearbox"
            value={filters.gearbox}
            onChange={(value) => updateFilter("gearbox", value)}
            options={options.gearboxes}
            defaultOptionLabel="Boite de vitesse"
          />
          <PillSelect
            id="filter-fuel"
            value={filters.fuel}
            onChange={(value) => updateFilter("fuel", value)}
            options={options.fuels}
            defaultOptionLabel="Carburant"
          />
          <PillSelect
            id="filter-km"
            value={filters.mileageMax}
            onChange={(value) => updateFilter("mileageMax", value)}
            options={MILEAGE_LIMITS.map((limit) => ({ value: limit, label: `${Number(limit).toLocaleString("fr-BE")} km` }))}
            defaultOptionLabel="Kilometres"
          />
          <PricePopover
            minValue={filters.priceMin}
            maxValue={filters.priceMax}
            onMinChange={(value) => updateFilter("priceMin", value)}
            onMaxChange={(value) => updateFilter("priceMax", value)}
          />

          <button
            type="button"
            onClick={() => setFiltersOpen((value) => !value)}
            className="cursor-pointer text-[14px] font-semibold text-brand underline"
          >
            Tous les filtres{activeFilterLabels.length > 0 ? ` (${activeFilterLabels.length})` : ""}
          </button>

          {activeFilterLabels.length > 0 && (
            <button
              type="button"
              onClick={resetFilters}
              className="cursor-pointer text-[13px] font-medium text-sage underline"
            >
              Effacer filtre
            </button>
          )}

          <div className="ml-auto">
            <PillSelect
              id="filter-sort"
              value={filters.sort}
              onChange={(value) => updateFilter("sort", value)}
              options={Object.entries(SORT_LABELS)
                .filter(([value]) => value !== "recommended")
                .map(([value, label]) => ({ value, label }))}
              defaultOptionLabel={`Trier: ${SORT_LABELS.recommended}`}
            />
          </div>
        </div>

        {filtersOpen && (
          <div className="mt-3 flex flex-col gap-3 rounded-2xl border border-line bg-white p-4 lg:mt-4 lg:flex lg:flex-row lg:flex-wrap lg:p-5">
            <div className="flex flex-col gap-3 lg:hidden">
              <FilterSelect
                id="m-filter-brand"
                label="Marque"
                value={filters.brand}
                onChange={(value) => updateFilter("brand", value)}
                options={options.brands}
                defaultOptionLabel="Toutes les marques"
              />
              <FilterSelect
                id="m-filter-gearbox"
                label="Boite"
                value={filters.gearbox}
                onChange={(value) => updateFilter("gearbox", value)}
                options={options.gearboxes}
                defaultOptionLabel="Toutes"
              />
              <FilterSelect
                id="m-filter-fuel"
                label="Carburant"
                value={filters.fuel}
                onChange={(value) => updateFilter("fuel", value)}
                options={options.fuels}
                defaultOptionLabel="Tous"
              />
              <FilterSelect
                id="m-filter-km"
                label="Kilometrage max"
                value={filters.mileageMax}
                onChange={(value) => updateFilter("mileageMax", value)}
                options={MILEAGE_LIMITS.map((limit) => ({ value: limit, label: `${Number(limit).toLocaleString("fr-BE")} km` }))}
                defaultOptionLabel="Tous les km"
              />
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium uppercase tracking-wide text-subtle">Budget min</span>
                  <input
                    type="number"
                    min="0"
                    inputMode="numeric"
                    placeholder="Min"
                    value={filters.priceMin}
                    onChange={(event) => updateFilter("priceMin", event.target.value)}
                    className="min-h-[44px] rounded-lg border border-line bg-white px-3 text-[14px] font-medium text-ink outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-brand [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium uppercase tracking-wide text-subtle">Budget max</span>
                  <input
                    type="number"
                    min="0"
                    inputMode="numeric"
                    placeholder="Max"
                    value={filters.priceMax}
                    onChange={(event) => updateFilter("priceMax", event.target.value)}
                    className="min-h-[44px] rounded-lg border border-line bg-white px-3 text-[14px] font-medium text-ink outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-brand [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                </div>
              </div>
            </div>

            <div className="min-w-[150px] flex-1">
              <FilterSelect
                id="filter-model"
                label="Modele"
                value={filters.model}
                onChange={(value) => updateFilter("model", value)}
                options={options.models}
                defaultOptionLabel="Tous les modeles"
              />
            </div>
            <div className="min-w-[150px] flex-1">
              <FilterSelect
                id="filter-body"
                label="Carrosserie"
                value={filters.bodyType}
                onChange={(value) => updateFilter("bodyType", value)}
                options={options.bodyTypes}
                defaultOptionLabel="Toutes"
              />
            </div>
            <div className="min-w-[150px] flex-1">
              <FilterSelect
                id="filter-status"
                label="Disponibilite"
                value={filters.status}
                onChange={(value) => updateFilter("status", value)}
                options={[
                  { value: "available", label: "Disponible", count: cars.filter((c) => c.status === "available").length },
                  { value: "reserved", label: "Reserve", count: cars.filter((c) => c.status === "reserved").length },
                  { value: "sold", label: "Vendu", count: cars.filter((c) => c.status === "sold").length },
                ]}
                defaultOptionLabel="Tous les statuts"
              />
            </div>
            <div className="min-w-[150px] flex-1">
              <FilterSelect
                id="filter-year"
                label="Annee minimum"
                value={filters.yearMin}
                onChange={(value) => updateFilter("yearMin", value)}
                options={MARKET_YEARS.map((year) => ({ value: year, label: `${year} et plus` }))}
                defaultOptionLabel="Toutes"
              />
            </div>

            {activeFilterLabels.length > 0 && (
              <button
                type="button"
                onClick={resetFilters}
                className="cursor-pointer self-start text-[13px] font-medium text-sage underline lg:hidden"
              >
                Effacer filtre
              </button>
            )}
          </div>
        )}
      </div>

      <div ref={resultsRef}>
          <div className="mb-4">
            <span className="text-[14px] text-body">{resultsCountLabel}</span>
          </div>

          {activeFilterLabels.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2" aria-label="Filtres actifs">
              {activeFilterLabels.map((label) => (
                <span key={label} className="rounded-full bg-brand-pastel px-3 py-1 text-[13px] font-medium text-brand">
                  {label}
                </span>
              ))}
            </div>
          )}

          {loading ? (
            <p className="py-10 text-center text-[15px] text-body">Chargement du stock...</p>
          ) : (
            <HomeCarGrid cars={paginatedCars} />
          )}

          {!loading && pageCount > 1 && (
            <nav className="mt-8 flex flex-wrap items-center justify-center gap-2" aria-label="Pagination du stock">
              {Array.from({ length: pageCount }, (_, index) => index + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  aria-current={page === currentPage ? "page" : undefined}
                  onClick={() => goToPage(page)}
                  className={`inline-flex h-10 min-w-[40px] cursor-pointer items-center justify-center rounded-lg px-3 text-[14px] font-semibold transition-colors ${
                    page === currentPage
                      ? "bg-brand text-white"
                      : "border border-line bg-white text-ink hover:bg-surface"
                  }`}
                >
                  {page}
                </button>
              ))}
              {currentPage < pageCount && (
                <button
                  type="button"
                  onClick={() => goToPage(currentPage + 1)}
                  className="inline-flex h-10 cursor-pointer items-center justify-center rounded-lg border border-line bg-white px-4 text-[14px] font-semibold text-ink hover:bg-surface"
                >
                  Page suivante
                </button>
              )}
            </nav>
          )}
      </div>
    </div>
  );
}
