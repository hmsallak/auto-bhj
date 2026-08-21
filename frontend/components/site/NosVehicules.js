"use client";

import { motion, useReducedMotion } from "framer-motion";
import { formatPrice, formatKm, carImage } from "../../lib/format";
import { ChevronRightIcon } from "./icons";

const EASE = [0.16, 1, 0.3, 1];

export default function NosVehicules({ cars = [] }) {
  const prefersReducedMotion = useReducedMotion();

  if (!cars.length) return null;

  return (
    <section className="nv-section" aria-label="Nos derniers vehicules">
      <div className="nv-narrative">
        <div className="nv-eyebrow">
          <span className="nv-eyebrow-line" />
          La preuve, pas la promesse
        </div>
        <p className="nv-lede">
          Vous avez le prix. Vous avez le kilometrage. Il ne reste plus qu&apos;a
          venir verifier par vous-meme.
        </p>
      </div>

      <div className="nv-head">
        <h2>Nos derniers vehicules</h2>
        <a className="nv-all-link" href="/stock">
          Voir tout le stock
          <ChevronRightIcon width="14" height="14" />
        </a>
      </div>

      <div className="nv-grid">
        {cars.map((car, index) => (
          <motion.a
            key={car.id}
            href={`/cars/${car.reference}`}
            className="nv-card-link"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: EASE, delay: index * 0.08 }}
          >
            <div className="nv-card">
              <div className="nv-card-media">
                <img src={carImage(car)} alt={`${car.brand} ${car.model}`} />
              </div>
              <div className="nv-card-row">
                <h3 className="nv-card-title">
                  {car.brand} {car.model}
                </h3>
                <span className="nv-card-price">{formatPrice(car.price)}</span>
              </div>
              <span className="nv-card-meta">
                {car.year} &middot; {formatKm(car.mileage)}
              </span>
            </div>
          </motion.a>
        ))}
      </div>

      <div className="nv-footer-cta">
        <a className="nv-stock-button" href="/stock">
          Voir tous nos vehicules
          <ChevronRightIcon width="15" height="15" />
        </a>
      </div>
    </section>
  );
}
