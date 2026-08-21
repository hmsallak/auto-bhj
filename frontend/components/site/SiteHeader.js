"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { MenuIcon, CloseIcon } from "./icons";

const LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/#stock", label: "Vehicules" },
  { href: "/faq", label: "FAQ" },
  { href: "/#contact", label: "Contact" },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 860) setOpen(false);
    }
    function handleScroll() {
      setScrolled(window.scrollY > 8);
    }
    handleScroll();
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className={`site-header-v2${scrolled ? " is-scrolled" : ""}`}>
      <div className="site-header-v2-inner">
        <a className="header-v2-brand" href="/">
          <Image src="/logo.png" alt="Auto BHJ" width={2048} height={768} priority />
        </a>

        <nav className={`header-v2-nav${open ? " is-open" : ""}`}>
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
          <a
            className="header-v2-nav-cta"
            href="tel:+32483208801"
            onClick={() => setOpen(false)}
          >
            0483 20 88 01
          </a>
        </nav>

        <div className="header-v2-actions">
          <button
            type="button"
            className="header-v2-toggle"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <CloseIcon width="20" height="20" /> : <MenuIcon width="20" height="20" />}
          </button>
        </div>
      </div>
    </header>
  );
}
