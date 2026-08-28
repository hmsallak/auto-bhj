"use client";

import { useState } from "react";
import { ChevronDownIcon, PhoneIcon, CalendarIcon, ShieldIcon, MailIcon } from "../home/icons";
import SectionEyebrow from "../home/SectionEyebrow";
import Reveal from "../home/Reveal";
import { useT } from "../../lib/i18n";

const TRUST_ICONS = [CalendarIcon, ShieldIcon, MailIcon];

export default function Faq() {
  const t = useT();
  const [openIndex, setOpenIndex] = useState(0);
  const items = t("faqPage.items");
  const trust = t("faqPage.trust");

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 sm:py-14">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-12">
        <div className="lg:col-span-1">
          <Reveal>
            <SectionEyebrow>{t("faqPage.eyebrow")}</SectionEyebrow>
            <h1
              className="mt-1.5 text-ink"
              style={{ fontSize: "clamp(19px, 2.4vw, 23px)", fontWeight: 700, lineHeight: 1.25, maxWidth: "none" }}
            >
              {t("faqPage.title")}
            </h1>
            <p className="mt-2 text-[13px] leading-relaxed text-body">{t("faqPage.intro")}</p>
          </Reveal>

          <Reveal delay={100} className="mt-7 rounded-xl border border-line bg-white p-5">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-pastel text-brand">
              <MailIcon className="h-[18px] w-[18px]" />
            </span>
            <h2
              className="mt-3 text-ink"
              style={{ fontSize: "13.5px", fontWeight: 700, lineHeight: 1.35, maxWidth: "none" }}
            >
              {t("faqPage.otherQ")}
            </h2>
            <p className="mt-1 text-[12.5px] leading-relaxed text-body">{t("faqPage.otherQText")}</p>
            <a
              href="tel:+32483208801"
              className="mt-4 inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-cta px-4 text-[14px] font-semibold uppercase tracking-wider text-white transition-colors hover:bg-cta-dark"
            >
              <PhoneIcon className="h-4 w-4" />
              {t("faqPage.contactBtn")}
            </a>
          </Reveal>

          <div className="mt-6 flex flex-col gap-3.5">
            {trust.map(({ title, text }, index) => {
              const Icon = TRUST_ICONS[index];
              return (
                <Reveal key={title} delay={200 + index * 100} className="flex items-center gap-3">
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-pastel text-brand">
                    <Icon className="h-[18px] w-[18px]" />
                  </span>
                  <div className="flex flex-col">
                    <strong className="text-[13px] font-bold text-ink">{title}</strong>
                    <span className="text-[12px] text-subtle">{text}</span>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-2.5 lg:col-span-2" aria-label={t("faqPage.listAria")}>
          {items.map((item, index) => {
            const open = openIndex === index;
            const panelId = `faq-panel-${index}`;
            const triggerId = `faq-trigger-${index}`;

            return (
              <div key={item.question} className="rounded-xl border border-line bg-white">
                <button
                  id={triggerId}
                  type="button"
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex(open ? -1 : index)}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 p-4 text-left"
                >
                  <span className="text-[13.5px] font-semibold text-ink">{item.question}</span>
                  <ChevronDownIcon
                    className={`h-4 w-4 shrink-0 text-subtle transition-transform ${open ? "rotate-180" : ""}`}
                  />
                </button>
                {open && (
                  <div id={panelId} role="region" aria-labelledby={triggerId} className="px-4 pb-4">
                    <p className="text-[13px] leading-relaxed text-body">{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
