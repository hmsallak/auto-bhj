"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import HomeCarGrid from "../home/HomeCarGrid";
import SectionEyebrow from "../home/SectionEyebrow";
import Reveal from "../home/Reveal";

const PREVIEW_COUNT = 6;

const PRIX_MAX_OPTIONS = ["4000", "5000", "6000", "7000", "8000", "10000"];
const KM_MAX_OPTIONS = ["50000", "75000", "100000", "125000", "150000", "200000"];

const EASE = [0.16, 1, 0.3, 1];

const DEFAULT_FILTERS = { brand: "", priceMax: "", kmMax: "" };

function FilterSelect({ id, name, label, value, onChange, options, formatLabel, defaultOptionLabel }) {
  return (
    <div className="flex min-w-[160px] flex-1 flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-medium uppercase tracking-wide text-subtle">
        {label}
      </label>
      <select
        id={id}
        name={name}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-[48px] cursor-pointer rounded-lg border border-line bg-white px-3 text-[15px] font-medium text-ink focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        <option value="">{defaultOptionLabel}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {formatLabel(option)}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function HomeLatestCars() {
  const prefersReducedMotion = useReducedMotion();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  useEffect(() => {
    fetch("/api/cars")
      .then((response) => response.json())
      .then((data) => setCars(Array.isArray(data) ? data : []))
      .catch(() => setCars([]))
      .finally(() => setLoading(false));
  }, []);

  const brands = useMemo(
    () => [...new Set(cars.map((car) => car.brand).filter(Boolean))].sort((a, b) => a.localeCompare(b)),
    [cars]
  );

  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      if (filters.brand && car.brand !== filters.brand) return false;
      if (filters.priceMax && Number(car.price) > Number(filters.priceMax)) return false;
      if (filters.kmMax && Number(car.mileage) > Number(filters.kmMax)) return false;
      return true;
    });
  }, [cars, filters]);

  const isFiltered = filters.brand || filters.priceMax || filters.kmMax;
  const visibleCars = isFiltered ? filteredCars : filteredCars.slice(0, PREVIEW_COUNT);

  const stockHref = useMemo(() => {
    const params = new URLSearchParams();
    if (filters.brand) params.set("brand", filters.brand);
    if (filters.priceMax) params.set("price_max", filters.priceMax);
    if (filters.kmMax) params.set("km_max", filters.kmMax);
    const query = params.toString();
    return query ? `/stock?${query}` : "/stock";
  }, [filters]);

  function updateFilter(key, value) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  return (
    <div className="mx-auto max-w-6xl px-6">
      <Reveal>
        <SectionEyebrow>Notre stock</SectionEyebrow>
        <h2 className="mt-2 text-2xl font-bold text-ink">Nos dernieres voitures arrivees</h2>
        <p className="mt-3 max-w-2xl text-[15px] text-body">
          Un apercu des vehicules recemment mis en ligne. Filtrez ci-dessous ou decouvrez tout notre stock sur
          la page catalogue complete.
        </p>
      </Reveal>

      <motion.form
        aria-label="Filtrer les vehicules"
        className="mx-auto mt-6 flex max-w-4xl flex-col gap-4 rounded-2xl border border-line bg-white p-5 shadow-sm sm:flex-row sm:items-end sm:p-6"
        initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        onSubmit={(event) => event.preventDefault()}
      >
        <FilterSelect
          id="stock-brand"
          name="brand"
          label="Marque"
          value={filters.brand}
          onChange={(value) => updateFilter("brand", value)}
          options={brands}
          formatLabel={(value) => value}
          defaultOptionLabel="Toutes marques"
        />
        <FilterSelect
          id="stock-price"
          name="price_max"
          label="Prix Max"
          value={filters.priceMax}
          onChange={(value) => updateFilter("priceMax", value)}
          options={PRIX_MAX_OPTIONS}
          formatLabel={(value) => `${Number(value).toLocaleString("fr-FR")} €`}
          defaultOptionLabel="Prix max"
        />
        <FilterSelect
          id="stock-km"
          name="km_max"
          label="Kilométrage Max"
          value={filters.kmMax}
          onChange={(value) => updateFilter("kmMax", value)}
          options={KM_MAX_OPTIONS}
          formatLabel={(value) => `${Number(value).toLocaleString("fr-FR")} km`}
          defaultOptionLabel="Kilométrage max"
        />

        <button
          type="submit"
          className="inline-flex min-h-[48px] cursor-pointer items-center justify-center rounded-lg bg-brand px-8 text-[15px] font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-brand sm:min-w-[160px]"
        >
          Rechercher
        </button>
      </motion.form>

      <div className="mt-8">
        {loading ? (
          <p className="py-10 text-center text-[15px] text-body">Chargement du stock...</p>
        ) : (
          <HomeCarGrid cars={visibleCars} />
        )}
      </div>

      <div className="mt-8 flex justify-center">
        <a
          href={stockHref}
          className="inline-flex min-h-[48px] items-center justify-center rounded-lg border border-sage bg-white px-8 text-[15px] font-semibold text-sage transition-colors hover:bg-brand-pastel"
        >
          Voir plus
        </a>
      </div>
    </div>
  );
}
