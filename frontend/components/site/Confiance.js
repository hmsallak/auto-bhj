"use client";

import { motion, useReducedMotion } from "framer-motion";
import { DotPattern } from "../ui/dot-pattern";

const EASE = [0.16, 1, 0.3, 1];

const POINTS = [
  {
    step: "01",
    label: "Controle",
    title: "Chaque vehicule est inspecte avant sa mise en ligne",
    text: "Etat general, coherence du kilometrage, documents en ordre. On regarde la voiture avant de vous la presenter.",
  },
  {
    step: "02",
    label: "Prix clair",
    title: "Le prix affiche est le prix final",
    text: "Pas de frais caches, pas de negociation surprise a l'arrivee. Ce que vous voyez ici est ce que vous payez.",
  },
  {
    step: "03",
    label: "Visite reelle",
    title: "Le rendez-vous sert a essayer, pas a decouvrir",
    text: "Vous venez conduire une voiture que vous avez deja comprise, pas verifier si la photo mentait.",
  },
];

export default function Confiance() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="cf-section" aria-label="Pourquoi nous faire confiance" id="confiance">
      <DotPattern className="dot-pattern-dark" />
      <div className="cf-narrative">
        <div className="cf-eyebrow">
          <span className="cf-eyebrow-line" />
          Ce qui se passe avant que vous arriviez
        </div>
        <p className="cf-lede">
          On ne vend pas la voiture la moins chere du marche. On vend celle
          qu&apos;on a vraiment regardee.
        </p>
      </div>

      <div className="cf-list">
        {POINTS.map((point, index) => (
          <motion.div
            key={point.step}
            className="cf-row"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, ease: EASE, delay: index * 0.1 }}
          >
            <span className="cf-row-step">{point.step}</span>
            <div className="cf-row-body">
              <span className="cf-row-label">{point.label}</span>
              <h3 className="cf-row-title">{point.title}</h3>
              <p className="cf-row-text">{point.text}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
