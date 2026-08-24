"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import CarGrid from "../CarGrid";

const PREVIEW_COUNT = 6;
const EASE = [0.16, 1, 0.3, 1];

const proofContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const proofItem = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

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

export default function HomeLatestCars() {
  const prefersReducedMotion = useReducedMotion();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/cars")
      .then((response) => response.json())
      .then((data) => setCars(Array.isArray(data) ? data.slice(0, PREVIEW_COUNT) : []))
      .catch(() => setCars([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="stock-browser">
      <section className="stock-catalog-hero" aria-labelledby="stock-catalog-title">
        <div className="stock-catalog-hero-copy">
          <p className="stock-catalog-pill">
            <CarLineIcon aria-hidden="true" />
            <span>Dernieres arrivees</span>
          </p>
          <h2 id="stock-catalog-title">
            Nos dernieres voitures <span className="stock-catalog-accent">arrivees</span>
          </h2>
          <span className="stock-catalog-mark" aria-hidden="true" />
          <p>
            Un apercu des vehicules recemment mis en ligne. Decouvrez tout notre
            stock, avec recherche et filtres, sur la page catalogue complete.
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

      {loading ? <p className="empty">Chargement du stock...</p> : <CarGrid cars={cars} />}

      <div className="stock-catalog-more">
        <a className="stock-catalog-more-button" href="/stock">
          Voir plus
        </a>
      </div>
    </div>
  );
}
