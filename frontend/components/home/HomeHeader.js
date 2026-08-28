"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import OfficialIcon from "../OfficialIcon";
import LangToggle from "../LangToggle";
import { MenuIcon, CloseIcon } from "./icons";
import { useSiteSettings } from "../SiteSettingsProvider";
import { useT } from "../../lib/i18n";

const LINKS = [
  { href: "/", key: "home" },
  { href: "/stock", key: "stock" },
  { href: "/faq", key: "faq" },
  { href: "/#contact", key: "contact" },
];

export default function HomeHeader() {
  const { phone, phoneTel } = useSiteSettings();
  const t = useT();
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
      className={`sticky top-0 z-50 bg-[#2d6b76] transition-shadow ${
        scrolled ? "shadow-md" : "border-b border-white/10"
      }`}
    >
      <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-6 md:px-10 xl:px-16">
        <a href="/" className="shrink-0">
          <Image src="/logo-auto-bhj-header.png" alt="Auto BHJ" width={1050} height={600} priority className="h-[66px] w-auto" />
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[15px] font-medium text-white transition-colors hover:text-ink"
            >
              {t(`nav.${link.key}`)}
            </a>
          ))}
          <LangToggle />
          <a
            href={`tel:${phoneTel}`}
            className="inline-flex min-h-[44px] items-center gap-2 whitespace-nowrap rounded-full bg-cta px-5 text-[14px] font-semibold uppercase tracking-wider text-white transition-colors hover:bg-cta-dark"
          >
            <OfficialIcon name="phone" width={16} height={16} />
            {phone}
          </a>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <LangToggle />
          <button
            type="button"
            className="inline-flex h-12 w-12 cursor-pointer items-center justify-center rounded-lg text-white hover:bg-white/10"
            aria-label={open ? t("nav.closeMenu") : t("nav.openMenu")}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <CloseIcon width="30" height="30" /> : <MenuIcon width="30" height="30" />}
          </button>
        </div>
      </div>

      {open ? (
        <nav className="border-t border-white/10 bg-[#2d6b76] px-6 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-[15px] font-medium text-white hover:bg-white/10 hover:text-ink"
              >
                {t(`nav.${link.key}`)}
              </a>
            ))}
            <a
              href={`tel:${phoneTel}`}
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex min-h-[44px] w-fit items-center justify-center gap-2 self-start rounded-full bg-cta px-4 text-[14px] font-semibold uppercase tracking-wider text-white hover:bg-cta-dark"
            >
              <OfficialIcon name="phone" width={16} height={16} />
              {phone}
            </a>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
