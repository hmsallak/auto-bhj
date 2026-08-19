"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { MenuIcon, CloseIcon } from "./icons";

const LINKS = [
  { href: "/stock", label: "Stock" },
  { href: "/#a-propos", label: "A propos" },
  { href: "/#services", label: "Services" },
  { href: "/#faq", label: "FAQ" },
  { href: "/#contact", label: "Contact" },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  // Close the mobile menu on desktop resize so it never gets stuck open
  // behind a layout that no longer renders a toggle button.
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 820) setOpen(false);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className="site-header">
      <a className="brand" href="/">
        <Image className="brand-logo" src="/logo.png" alt="Auto BHJ" width={2048} height={768} priority />
      </a>

      <button
        type="button"
        className="nav-toggle"
        aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <CloseIcon width="22" height="22" /> : <MenuIcon width="22" height="22" />}
      </button>

      <nav className={open ? "open" : ""}>
        {LINKS.map((link) => (
          <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
