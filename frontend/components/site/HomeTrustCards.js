"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ShieldIcon, TagIcon, RefreshIcon } from "./icons";

const ITEMS = [
  {
    title: "Voitures toujours controlees",
    text: "Chaque vehicule est verifie avant la mise en vente pour partir sereinement.",
    Icon: ShieldIcon,
  },
  {
    title: "Prix bas et transparents",
    text: "Des occasions selectionnees avec des prix clairs, sans mauvaise surprise.",
    Icon: TagIcon,
  },
  {
    title: "Vehicules propres",
    text: "Presentation soignee, habitacle propre et informations utiles avant la visite.",
    Icon: RefreshIcon,
  },
];

const EASE = [0.16, 1, 0.3, 1];

const gridContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const cardItem = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

export default function HomeTrustCards() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="reasons-section" aria-labelledby="reasons-title">
      <div className="reasons-intro-canvas">
        <div className="reasons-copy">
          <p className="reasons-kicker">Pourquoi nous choisir</p>
          <h2 id="reasons-title" className="reasons-heading">
            Des voitures pretes a rouler, choisies avec{" "}
            <span className="reasons-accent">serieux.</span>
          </h2>
          <p className="reasons-lede">
            Chez Auto BHJ, on va droit au plus important: des vehicules propres,
            controles et proposes au bon prix pour acheter avec confiance.
          </p>
        </div>
      </div>

      <motion.div
        className="reasons-grid"
        variants={gridContainer}
        initial={prefersReducedMotion ? "show" : "hidden"}
        whileInView="show"
        viewport={{ once: false, amount: 0.25 }}
      >
        {ITEMS.map(({ title, text, Icon }) => (
          <motion.div className="reasons-card" key={title} variants={cardItem}>
            <span className="reasons-icon" aria-hidden="true">
              <Icon width="24" height="24" />
            </span>
            <h3 className="reasons-card-title">{title}</h3>
            <p className="reasons-card-text">{text}</p>
          </motion.div>
        ))}
      </motion.div>

      <div className="reasons-contact">
        <a className="reasons-contact-button" href="tel:+32483208801">
          Nous contacter
        </a>
      </div>
    </section>
  );
}
