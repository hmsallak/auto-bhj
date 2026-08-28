"use client";

import Image from "next/image";
import { PinIcon, PhoneIcon, MailIcon } from "./icons";
import { useSiteSettings } from "../SiteSettingsProvider";
import { useT } from "../../lib/i18n";
import { OPEN_SETTINGS_EVENT } from "../../lib/consent";

export default function HomeFooter() {
  const year = new Date().getFullYear();
  const { phone, phoneTel, email } = useSiteSettings();
  const t = useT();

  return (
    <footer className="border-t border-white/10 bg-ink">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-14 sm:grid-cols-2 md:px-10 lg:grid-cols-4 xl:px-16">
        <div className="flex flex-col gap-3">
          <a href="/" className="w-fit">
            <Image src="/logo-auto-bhj-footer.png" alt="Auto BHJ" width={350} height={200} className="h-16 w-auto" />
          </a>
          <p className="text-[15px] text-white">{t("footer.tagline")}</p>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="text-[15px] font-bold text-white">{t("footer.navTitle")}</h4>
          <a href="/" className="text-[15px] text-white transition-colors hover:text-brand-accent">
            {t("footer.home")}
          </a>
          <a href="/#stock" className="text-[15px] text-white transition-colors hover:text-brand-accent">
            {t("footer.stock")}
          </a>
          <a href="/faq" className="text-[15px] text-white transition-colors hover:text-brand-accent">
            {t("footer.faq")}
          </a>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="text-[15px] font-bold text-white">{t("footer.contactTitle")}</h4>
          <span className="inline-flex items-center gap-2 text-[15px] text-white">
            <PinIcon className="h-4 w-4 shrink-0 text-brand-accent" /> Mekingenweg 99, 1600 Sint-Pieters-Leeuw
          </span>
          <a
            href={`tel:${phoneTel}`}
            className="inline-flex items-center gap-2 text-[15px] text-white transition-colors hover:text-brand-accent"
          >
            <PhoneIcon className="h-4 w-4 shrink-0 text-brand-accent" /> {phone}
          </a>
          <a
            href={`mailto:${email}`}
            className="inline-flex items-center gap-2 text-[15px] text-white transition-colors hover:text-brand-accent"
          >
            <MailIcon className="h-4 w-4 shrink-0 text-brand-accent" /> {email}
          </a>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="text-[15px] font-bold text-white">{t("footer.legalTitle")}</h4>
          <a href="/mentions-legales" className="text-[15px] text-white transition-colors hover:text-brand-accent">
            {t("footer.mentions")}
          </a>
          <a
            href="/politique-confidentialite"
            className="text-[15px] text-white transition-colors hover:text-brand-accent"
          >
            {t("footer.privacy")}
          </a>
          <a href="/politique-cookies" className="text-[15px] text-white transition-colors hover:text-brand-accent">
            {t("footer.cookies")}
          </a>
          <a
            href="/conditions-generales"
            className="text-[15px] text-white transition-colors hover:text-brand-accent"
          >
            {t("footer.terms")}
          </a>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event(OPEN_SETTINGS_EVENT))}
            className="w-fit text-left text-[15px] text-white transition-colors hover:text-brand-accent"
          >
            {t("cookie.manage")}
          </button>
          <span className="text-[15px] text-white">Auto BHJ SRL - TVA BE 0801.303.538</span>
        </div>
      </div>

      <div className="border-t border-white/10 px-6 py-5 md:px-10 xl:px-16">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 text-[13px] text-white sm:flex-row sm:items-center sm:justify-between">
          <span>&copy; {year} Auto BHJ SRL. {t("footer.rights")}</span>
          <span>TVA BE 0801.303.538</span>
        </div>
      </div>
    </footer>
  );
}
