"use client";

import { useEffect, useState } from "react";
import HomeCarGrid from "../home/HomeCarGrid";
import SectionEyebrow from "../home/SectionEyebrow";
import Reveal from "../home/Reveal";

const PREVIEW_COUNT = 4;

export default function HomeLatestCars() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/cars")
      .then((response) => response.json())
      .then((data) => setCars(Array.isArray(data) ? data : []))
      .catch(() => setCars([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-6">
      <Reveal>
        <SectionEyebrow>Notre stock</SectionEyebrow>
        <h2 className="mt-2 text-2xl font-bold text-ink">Nos dernieres voitures arrivees</h2>
        <p className="mt-3 max-w-2xl text-[15px] text-body">
          Un apercu des vehicules recemment mis en ligne. Retrouvez tout le stock, avec les
          filtres, sur la page catalogue.
        </p>
      </Reveal>

      <div className="mt-8">
        {loading ? (
          <p className="py-10 text-center text-[15px] text-body">Chargement du stock...</p>
        ) : (
          <HomeCarGrid cars={cars.slice(0, PREVIEW_COUNT)} />
        )}
      </div>

      <div className="mt-10 flex justify-center">
        <a
          href="/stock"
          className="inline-flex min-h-[52px] items-center justify-center rounded-lg bg-brand px-8 text-[15px] font-semibold text-white transition-colors hover:bg-brand-dark"
        >
          Voir toutes nos voitures
        </a>
      </div>
    </div>
  );
}
