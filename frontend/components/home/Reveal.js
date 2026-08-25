"use client";

import { useEffect, useRef, useState } from "react";

export default function Reveal({ children, className = "", delay = 0, y = 20 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [noShift, setNoShift] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setVisible(true);
      return;
    }

    // Les ecrans tactiles n'animent que l'opacite : un deplacement (translateY)
    // pendant qu'on touche l'element decale la cible tactile reelle par
    // rapport a ce que l'oeil voit, d'ou les taps qui ratent leur cible.
    if (window.matchMedia("(pointer: coarse)").matches) {
      setNoShift(true);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const offset = noShift ? 0 : y;

  return (
    <div
      ref={ref}
      style={{
        transitionDelay: visible ? `${delay}ms` : "0ms",
        transform: visible ? "translateY(0)" : `translateY(${offset}px)`,
      }}
      className={`transition-all duration-500 ease-out ${visible ? "opacity-100" : "opacity-0"} ${className}`}
    >
      {children}
    </div>
  );
}
