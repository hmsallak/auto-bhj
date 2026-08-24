"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { ChevronRightIcon } from "./icons";
import ActionButton from "./ActionButton";

const EASE = [0.16, 1, 0.3, 1];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

const TITLE = "Trouvez la voiture d'occasion qui vous correspond.";

export default function Hero() {
  const prefersReducedMotion = useReducedMotion();
  const titleRef = useRef(null);

  // Split-text entrance (ui-ux-pro-max motion preset #9, "Stagger List /
  // text reveal, split text"): each character tumbles in with a slight 3D
  // rotation on load, then settles into place -- a one-time reveal, no
  // looping animation afterward. Skipped entirely under
  // prefers-reduced-motion so the heading renders as plain, immediately
  // readable text for low-motion users and screen readers.
  useEffect(() => {
    if (prefersReducedMotion || !titleRef.current) return;

    gsap.registerPlugin(SplitText);
    // Splitting by "words, chars" (not just "chars") wraps each word in its
    // own non-breaking box before splitting it into characters -- without
    // the word layer, every character becomes an independent break
    // opportunity and the browser wraps lines mid-word.
    const split = new SplitText(titleRef.current, {
      type: "words, chars",
      wordsClass: "hero-v2-title-word",
      charsClass: "hero-v2-title-char",
    });

    const tween = gsap.from(split.chars, {
      opacity: 0,
      y: 20,
      rotateX: -40,
      duration: 0.6,
      stagger: 0.015,
      delay: 0.25,
      ease: "expo.out",
    });

    return () => {
      tween.kill();
      split.revert();
    };
  }, [prefersReducedMotion]);

  return (
    <section className="hero-v2" aria-label="Auto BHJ">
      <motion.div
        className="hero-v2-media"
        initial={prefersReducedMotion ? false : { opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: EASE }}
      >
        <img src="/header-hero.png" alt="Le garage Auto BHJ a Sint-Pieters-Leeuw" />
      </motion.div>

      <motion.div
        className="hero-v2-copy"
        variants={container}
        initial={prefersReducedMotion ? "show" : "hidden"}
        animate="show"
      >
        <motion.div className="hero-v2-eyebrow" variants={item}>
          <span className="hero-v2-eyebrow-dot" aria-hidden="true" />
          Vehicules d&apos;occasion controles
        </motion.div>

        <h1 className="hero-v2-title" aria-label={TITLE}>
          <span ref={titleRef} aria-hidden="true">
            <span>Trouvez la voiture</span>
            <span>d&apos;occasion</span>
            <span className="hero-v2-title-accent">qui vous correspond.</span>
          </span>
        </h1>

        <motion.span className="hero-v2-rule" variants={item} aria-hidden="true" />

        <motion.p className="hero-v2-subtitle" variants={item}>
          Des vehicules selectionnes avec exigence, a des prix justes,
          et un accompagnement simple du premier contact a la remise des cles.
        </motion.p>

        <motion.div className="hero-v2-actions" variants={item}>
          <ActionButton className="hero-v2-cta-primary" href="/stock">
            Voir nos vehicules
            <ChevronRightIcon width="16" height="16" />
          </ActionButton>
          <a className="hero-v2-contact-link" href="#contact">
            Nous contacter
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
