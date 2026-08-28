"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import HomeCarGrid from "./home/HomeCarGrid";
import { SearchIcon, ChevronDownIcon } from "./home/icons";
import SectionEyebrow from "./home/SectionEyebrow";
import { useT, useCarEnums } from "../lib/i18n";

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

const MARKET_YEARS = ["2026", "2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016", "2015", "2014", "2013", "2012", "2011", "2010"];

const MILEAGE_LIMITS = ["50000", "75000", "100000", "125000", "150000", "200000"];

const SORT_KEYS = ["recommended", "newest", "price_asc", "price_desc", "km_asc", "year_desc"];

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
  const t = useT();
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
      : t("stock.price");

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
            <span className="text-xs font-medium uppercase tracking-wide text-subtle">{t("stock.min")}</span>
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
            <span className="text-xs font-medium uppercase tracking-wide text-subtle">{t("stock.max")}</span>
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
  const t = useT();
  const ce = useCarEnums();
  const [cars, setCars] = useState([]);
  const [query, setQuery] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [urlReady, setUrlReady] = useState(false);
  const resultsRef = useRef(null);

  const sortLabel = (key) => t(`stock.sort.${key}`);
  // Traduit le libelle affiche des options (la valeur/cle de filtre reste brute).
  const locOpts = (opts, fn) =>
    fn ? opts.map((o) => ({ ...o, label: fn(o.label) })) : opts;

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
    query.trim() ? `${t("stock.chips.search")}: ${query.trim()}` : null,
    filters.brand ? `${t("stock.chips.brand")}: ${filters.brand}` : null,
    filters.model ? `${t("stock.chips.model")}: ${filters.model}` : null,
    filters.bodyType ? `${t("stock.chips.body")}: ${ce.body(filters.bodyType)}` : null,
    filters.status ? `${t("stock.chips.status")}: ${ce.status(filters.status)}` : null,
    filters.priceMin ? `${t("stock.chips.min")}: ${filters.priceMin} EUR` : null,
    filters.priceMax ? `${t("stock.chips.max")}: ${filters.priceMax} EUR` : null,
    filters.mileageMax ? `${t("stock.chips.max")}: ${ce.km(Number(filters.mileageMax))}` : null,
    filters.yearMin ? `${t("stock.chips.since")}: ${filters.yearMin}` : null,
    filters.fuel ? `${t("stock.chips.fuel")}: ${ce.fuel(filters.fuel)}` : null,
    filters.gearbox ? `${t("stock.chips.gearbox")}: ${ce.gearbox(filters.gearbox)}` : null,
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

  const resultsCountLabel = `${visibleCars.length} ${
    visibleCars.length > 1 ? t("stock.resultMany") : t("stock.resultOne")
  }`;

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8">
        <SectionEyebrow>{t("stock.eyebrow")}</SectionEyebrow>
        <h1 className="mt-2 text-3xl font-bold text-brand-dark sm:text-4xl">{t("stock.h1")}</h1>
        <p className="mt-3 max-w-2xl text-[15px] text-body">{t("stock.intro")}</p>
      </div>

      <div className="relative mb-6">
        <SearchIcon className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-subtle" />
        <input
          type="search"
          placeholder={t("stock.searchPlaceholder")}
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
            aria-expanded={filtersOpen}
            className="flex h-11 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full border border-line bg-white px-4 text-[14px] font-medium text-ink"
          >
            {t("stock.moreFilters")}
            {activeFilterLabels.length > 0 ? ` (${activeFilterLabels.length})` : ""}
            <ChevronDownIcon
              className={`h-4 w-4 transition-transform ${filtersOpen ? "rotate-180" : ""}`}
              aria-hidden="true"
            />
          </button>
          <button
            type="button"
            onClick={() => {
              setSortOpen((value) => !value);
              setFiltersOpen(false);
            }}
            className="flex h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-full border border-line bg-white px-4 text-[14px] font-medium text-ink"
          >
            {t("stock.sortPrefix")}: {sortLabel(filters.sort)}
          </button>
        </div>

        {sortOpen && (
          <div className="mt-3 flex flex-col gap-1 rounded-2xl border border-line bg-white p-2 lg:hidden">
            {SORT_KEYS.map((value) => (
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
                {sortLabel(value)}
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
            defaultOptionLabel={t("stock.defaults.brandShort")}
          />
          <PillSelect
            id="filter-gearbox"
            value={filters.gearbox}
            onChange={(value) => updateFilter("gearbox", value)}
            options={locOpts(options.gearboxes, ce.gearbox)}
            defaultOptionLabel={t("stock.defaults.gearboxShort")}
          />
          <PillSelect
            id="filter-fuel"
            value={filters.fuel}
            onChange={(value) => updateFilter("fuel", value)}
            options={locOpts(options.fuels, ce.fuel)}
            defaultOptionLabel={t("stock.defaults.fuelShort")}
          />
          <PillSelect
            id="filter-km"
            value={filters.mileageMax}
            onChange={(value) => updateFilter("mileageMax", value)}
            options={MILEAGE_LIMITS.map((limit) => ({ value: limit, label: ce.km(Number(limit)) }))}
            defaultOptionLabel={t("stock.defaults.kmShort")}
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
            aria-expanded={filtersOpen}
            className="inline-flex cursor-pointer items-center gap-1.5 text-[14px] font-semibold text-brand"
          >
            {filtersOpen ? t("stock.lessFilters") : t("stock.moreFilters")}
            {activeFilterLabels.length > 0 ? ` (${activeFilterLabels.length})` : ""}
            <ChevronDownIcon
              className={`h-4 w-4 transition-transform ${filtersOpen ? "rotate-180" : ""}`}
              aria-hidden="true"
            />
          </button>

          {activeFilterLabels.length > 0 && (
            <button
              type="button"
              onClick={resetFilters}
              className="cursor-pointer text-[13px] font-medium text-sage underline"
            >
              {t("stock.clearOne")}
            </button>
          )}

          <div className="ml-auto">
            <PillSelect
              id="filter-sort"
              value={filters.sort}
              onChange={(value) => updateFilter("sort", value)}
              options={SORT_KEYS.filter((v) => v !== "recommended").map((value) => ({
                value,
                label: sortLabel(value),
              }))}
              defaultOptionLabel={`${t("stock.sortPrefix")}: ${sortLabel("recommended")}`}
            />
          </div>
        </div>

        {filtersOpen && (
          <div className="mt-3 rounded-2xl border border-line bg-white p-4 lg:mt-4 lg:p-5">
            {/* Tous les filtres, groupes, visibles d'un coup. */}
            <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
              <FilterSelect
                id="pf-brand"
                label={t("stock.labels.brand")}
                value={filters.brand}
                onChange={(value) => updateFilter("brand", value)}
                options={options.brands}
                defaultOptionLabel={t("stock.defaults.brand")}
              />
              <FilterSelect
                id="pf-model"
                label={t("stock.labels.model")}
                value={filters.model}
                onChange={(value) => updateFilter("model", value)}
                options={options.models}
                defaultOptionLabel={t("stock.defaults.model")}
              />
              <FilterSelect
                id="pf-body"
                label={t("stock.labels.body")}
                value={filters.bodyType}
                onChange={(value) => updateFilter("bodyType", value)}
                options={locOpts(options.bodyTypes, ce.body)}
                defaultOptionLabel={t("stock.defaults.body")}
              />
              <FilterSelect
                id="pf-fuel"
                label={t("stock.labels.fuel")}
                value={filters.fuel}
                onChange={(value) => updateFilter("fuel", value)}
                options={locOpts(options.fuels, ce.fuel)}
                defaultOptionLabel={t("stock.defaults.fuel")}
              />
              <FilterSelect
                id="pf-gearbox"
                label={t("stock.labels.gearbox")}
                value={filters.gearbox}
                onChange={(value) => updateFilter("gearbox", value)}
                options={locOpts(options.gearboxes, ce.gearbox)}
                defaultOptionLabel={t("stock.defaults.gearbox")}
              />
              <FilterSelect
                id="pf-status"
                label={t("stock.labels.status")}
                value={filters.status}
                onChange={(value) => updateFilter("status", value)}
                options={[
                  { value: "available", label: ce.status("available"), count: cars.filter((c) => c.status === "available").length },
                  { value: "reserved", label: ce.status("reserved"), count: cars.filter((c) => c.status === "reserved").length },
                  { value: "sold", label: ce.status("sold"), count: cars.filter((c) => c.status === "sold").length },
                ]}
                defaultOptionLabel={t("stock.defaults.status")}
              />
              <FilterSelect
                id="pf-year"
                label={t("stock.labels.yearMin")}
                value={filters.yearMin}
                onChange={(value) => updateFilter("yearMin", value)}
                options={MARKET_YEARS.map((year) => ({ value: year, label: `${year} ${t("stock.yearAndUp")}` }))}
                defaultOptionLabel={t("stock.defaults.year")}
              />
              <FilterSelect
                id="pf-km"
                label={t("stock.labels.kmMax")}
                value={filters.mileageMax}
                onChange={(value) => updateFilter("mileageMax", value)}
                options={MILEAGE_LIMITS.map((limit) => ({ value: limit, label: ce.km(Number(limit)) }))}
                defaultOptionLabel={t("stock.defaults.km")}
              />
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-medium uppercase tracking-wide text-subtle">{t("stock.budget")}</span>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="0"
                    inputMode="numeric"
                    placeholder={t("stock.min")}
                    aria-label={t("stock.budgetMinAria")}
                    value={filters.priceMin}
                    onChange={(event) => updateFilter("priceMin", event.target.value)}
                    className="min-h-[44px] w-full rounded-lg border border-line bg-white px-3 text-[14px] font-medium text-ink outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-brand [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                  <input
                    type="number"
                    min="0"
                    inputMode="numeric"
                    placeholder={t("stock.max")}
                    aria-label={t("stock.budgetMaxAria")}
                    value={filters.priceMax}
                    onChange={(event) => updateFilter("priceMax", event.target.value)}
                    className="min-h-[44px] w-full rounded-lg border border-line bg-white px-3 text-[14px] font-medium text-ink outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-brand [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                </div>
              </div>
            </div>

            {activeFilterLabels.length > 0 && (
              <button
                type="button"
                onClick={resetFilters}
                className="mt-4 cursor-pointer text-[13px] font-medium text-sage underline"
              >
                {t("stock.clearAll")}
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
            <div className="mb-4 flex flex-wrap gap-2" aria-label={t("stock.activeFiltersAria")}>
              {activeFilterLabels.map((label) => (
                <span key={label} className="rounded-full bg-brand-pastel px-3 py-1 text-[13px] font-medium text-brand">
                  {label}
                </span>
              ))}
            </div>
          )}

          {loading ? (
            <p className="py-10 text-center text-[15px] text-body">{t("stock.loading")}</p>
          ) : (
            <HomeCarGrid cars={paginatedCars} cols={3} />
          )}

          {!loading && pageCount > 1 && (
            <nav className="mt-8 flex flex-wrap items-center justify-center gap-2" aria-label={t("stock.paginationAria")}>
              {Array.from({ length: pageCount }, (_, index) => index + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  aria-current={page === currentPage ? "page" : undefined}
                  onClick={() => goToPage(page)}
                  className={`inline-flex h-10 min-w-[40px] cursor-pointer items-center justify-center rounded-lg px-3 text-[14px] font-semibold transition-colors ${
                    page === currentPage
                      ? "bg-cta text-white"
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
                  {t("stock.nextPage")}
                </button>
              )}
            </nav>
          )}
      </div>
    </div>
  );
}
