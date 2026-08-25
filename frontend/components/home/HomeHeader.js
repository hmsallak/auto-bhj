"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { MenuIcon, CloseIcon } from "../site/icons";
import { PhoneIcon } from "./icons";

const LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/stock", label: "Nos véhicules" },
  { href: "/faq", label: "FAQ" },
  { href: "/#contact", label: "Contact" },
];

export default function HomeHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 768) setOpen(false);
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
    <header
      className={`sticky top-0 z-50 bg-sage transition-shadow ${
        scrolled ? "shadow-md" : "border-b border-white/10"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
        <a href="/" className="shrink-0">
          <Image src="/logo-auto-bhj.png" alt="Auto BHJ" width={350} height={200} priority className="h-16 w-auto" />
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[15px] font-medium text-white transition-colors hover:text-ink"
            >
              {link.label}
            </a>
          ))}
          <a
            href="tel:+32483208801"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-brand px-5 text-[14px] font-semibold text-white transition-colors hover:bg-brand-dark"
          >
            <PhoneIcon className="h-4 w-4" />
            0483 20 88 01
          </a>
        </nav>

        <button
          type="button"
          className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg text-white hover:bg-white/10 md:hidden"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <CloseIcon width="22" height="22" /> : <MenuIcon width="22" height="22" />}
        </button>
      </div>

      {open ? (
        <nav className="border-t border-white/10 bg-sage px-6 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-[15px] font-medium text-white hover:bg-white/10 hover:text-ink"
              >
                {link.label}
              </a>
            ))}
            <a
              href="tel:+32483208801"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex min-h-[44px] w-fit items-center justify-center gap-2 self-start rounded-lg bg-brand px-4 text-[14px] font-semibold text-white hover:bg-brand-dark"
            >
              <PhoneIcon className="h-4 w-4" />
              0483 20 88 01
            </a>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
