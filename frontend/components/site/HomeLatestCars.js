"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import CarGrid from "../CarGrid";
import OfficialIcon from "../OfficialIcon";

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
    <div className="stock-browser home-latest-cars">
      <section className="stock-catalog-hero" aria-labelledby="stock-catalog-title">
        <div className="stock-catalog-hero-copy">
          <p className="stock-catalog-pill">
            <OfficialIcon name="car" width={18} height={18} />
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
            <OfficialIcon name="warranty" width={42} height={42} />
            <strong>Vehicules</strong>
            <span>controles</span>
          </motion.div>
          <motion.div className="stock-catalog-proof-item" variants={proofItem}>
            <OfficialIcon name="quality" width={42} height={42} />
            <strong>Garantie</strong>
            <span>incluse</span>
          </motion.div>
          <motion.div className="stock-catalog-proof-item" variants={proofItem}>
            <OfficialIcon name="commitment" width={42} height={42} />
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
