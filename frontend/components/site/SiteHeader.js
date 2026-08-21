"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { MenuIcon, CloseIcon, PhoneIcon } from "./icons";

const LINKS = [
  { href: "/stock", label: "Stock" },
  { href: "/#a-propos", label: "A propos" },
  { href: "/#services", label: "Services" },
  { href: "/#faq", label: "FAQ" },
  { href: "/#contact", label: "Contact" },
];

const PHONE_DISPLAY = "+32 000 00 00 00";
const PHONE_HREF = "tel:+32000000000";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close the mobile menu on desktop resize so it never gets stuck open
  // behind a layout that no longer renders a toggle button. Threshold
  // matches the header's own 1080px breakpoint (wider than the site's
  // general 820px breakpoint since the header also fits a phone link
  // and a CTA button next to the nav links).
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 1080) setOpen(false);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className="site-header">
      <a className="brand" href="/">
        <Image className="brand-logo" src="/logo.png" alt="Auto BHJ" width={2048} height={768} priority />
      </a>

      <div className="header-right">
        <nav className={open ? "open" : ""}>
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}

          <div className="nav-actions">
            <a className="header-phone" href={PHONE_HREF} onClick={() => setOpen(false)}>
              <PhoneIcon width="18" height="18" aria-hidden="true" />
              <span>{PHONE_DISPLAY}</span>
            </a>
            <a className="button primary small" href="/#contact" onClick={() => setOpen(false)}>
              Planifier une visite
            </a>
          </div>
        </nav>

        <button
          type="button"
          className="nav-toggle"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <CloseIcon width="22" height="22" /> : <MenuIcon width="22" height="22" />}
        </button>
      </div>
    </header>
  );
}
