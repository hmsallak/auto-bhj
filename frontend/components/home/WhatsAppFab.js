"use client";

import { useEffect, useState } from "react";
import { WhatsAppIcon } from "./icons";

const WHATSAPP_HREF = `https://wa.me/32483208801?text=${encodeURIComponent(
  "Bonjour Auto BHJ, je souhaite des informations sur une voiture."
)}`;

export default function WhatsAppFab() {
  const [hiddenByFooter, setHiddenByFooter] = useState(false);

  useEffect(() => {
    const footer = document.querySelector("footer");

    if (!footer || typeof IntersectionObserver === "undefined") {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setHiddenByFooter(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: "0px 0px -120px 0px",
        threshold: 0,
      }
    );

    observer.observe(footer);

    return () => observer.disconnect();
  }, []);

  return (
    <a
      href={WHATSAPP_HREF}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Ecrire sur WhatsApp a Auto BHJ"
      aria-hidden={hiddenByFooter}
      tabIndex={hiddenByFooter ? -1 : 0}
      className={`fixed bottom-5 right-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-lg transition-[opacity,transform,background-color] duration-200 hover:bg-[#1fb958] lg:hidden ${
        hiddenByFooter
          ? "pointer-events-none translate-y-3 scale-90 opacity-0"
          : "translate-y-0 scale-100 opacity-100"
      }`}
    >
      <span
        className={`absolute inset-0 rounded-full bg-[#25d366] motion-safe:animate-ping motion-reduce:hidden ${
          hiddenByFooter ? "hidden" : ""
        }`}
        aria-hidden="true"
      />
      <WhatsAppIcon className="relative z-10 h-7 w-7" />
    </a>
  );
}
