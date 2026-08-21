"use client";

import { useEffect } from "react";

export default function ScrollReveal() {
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const elements = document.querySelectorAll(".reveal, .reveal-card");
    elements.forEach((el) => el.classList.add("reveal-init"));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("reveal-visible");
          entry.target.classList.remove("reveal-init");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.15 }
    );

    elements.forEach((el) => observer.observe(el));

    // Hero parallax: the background image (.hero::before) drifts slower
    // than the page scrolls, read through --hero-parallax. Only the homepage
    // has a .hero, so this is a no-op elsewhere.
    const hero = document.querySelector(".hero");
    let ticking = false;

    function updateParallax() {
      ticking = false;
      const rect = hero.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      hero.style.setProperty("--hero-parallax", `${rect.top * -0.18}px`);
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(updateParallax);
    }

    if (hero) {
      updateParallax();
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    return () => {
      observer.disconnect();
      if (hero) window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return null;
}
