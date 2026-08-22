"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1];

const introContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const introItem = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

const featuresContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.1 } },
};

const featureItem = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

const featureIconItem = {
  hidden: { opacity: 0, scale: 0.82, y: 8 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

const FEATURES = [
  {
    title: "Notre histoire",
    text:
      "Nee d'une passion commune pour l'automobile, Auto BHJ a ete creee il y a 5 ans par une famille, avec une vision claire : proposer des vehicules de qualite en toute confiance.",
    icon: "people",
  },
  {
    title: "Notre approche",
    text:
      "Transparence, ecoute et conseils personnalises. Nous prenons le temps de comprendre vos besoins pour vous proposer le vehicule qui vous correspond.",
    icon: "target",
  },
  {
    title: "Notre engagement",
    text:
      "Un accompagnement honnete, du premier contact jusqu'a la remise des cles et meme apres. Votre satisfaction est notre meilleure recompense.",
    icon: "handshake",
  },
];

function AboutIcon({ name }) {
  if (name === "people") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="9" cy="8" r="4" />
        <path d="M2.5 21a6.5 6.5 0 0 1 13 0" />
        <circle cx="17" cy="9" r="3" />
        <path d="M17 15.5a5 5 0 0 1 4.5 5.5" />
      </svg>
    );
  }

  if (name === "target") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="7" />
        <path d="M12 2v4" />
        <path d="M12 18v4" />
        <path d="M2 12h4" />
        <path d="M18 12h4" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 11l3-3 3 3 2-2" />
      <path d="M3 12l4 4 3-3" />
      <path d="M21 12l-4 4-3-3" />
      <path d="M8 17l2 2a2 2 0 0 0 3 0l3-3" />
      <path d="M3 8l4-3 3 3" />
      <path d="M21 8l-4-3-3 3" />
    </svg>
  );
}

export default function AboutUs() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="about-bhj-section" aria-labelledby="about-bhj-title">
      <div className="about-bhj-shell">
        <div className="about-bhj-image" aria-hidden="true">
          <Image
            src="/header-hero.png"
            alt=""
            fill
            sizes="(max-width: 980px) 100vw, 44vw"
            className="about-bhj-photo"
          />
        </div>

        <div className="about-bhj-content">
          <motion.div
            variants={introContainer}
            initial={prefersReducedMotion ? "show" : "hidden"}
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.p className="about-bhj-eyebrow" variants={introItem}>
              <span />
              A propos de nous
            </motion.p>

            <motion.h2 id="about-bhj-title" variants={introItem}>
              Une entreprise familiale, depuis <span>5 ans.</span>
            </motion.h2>

            <motion.div className="about-bhj-divider" variants={introItem} aria-hidden="true" />
          </motion.div>

          <motion.div
            className="about-bhj-features"
            variants={featuresContainer}
            initial={prefersReducedMotion ? "show" : "hidden"}
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            {FEATURES.map((item) => (
              <motion.article className="about-bhj-feature" key={item.title} variants={featureItem}>
                <motion.span className="about-bhj-feature-icon" variants={featureIconItem}>
                  <AboutIcon name={item.icon} />
                </motion.span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
