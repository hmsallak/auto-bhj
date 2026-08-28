"use client";

import Image from "next/image";
import { FamilyIcon, ShieldIcon, CompassIcon, CarIcon, CheckCircleIcon } from "../home/icons";
import Reveal from "../home/Reveal";
import { useT } from "../../lib/i18n";

const PILLAR_ICONS = [FamilyIcon, ShieldIcon, CompassIcon, CarIcon];

export default function AboutUs() {
  const t = useT();
  const points = t("about.points");
  const pillars = t("about.pillars");

  return (
    <section className="bg-offwhite py-14 sm:py-16 lg:py-20" aria-labelledby="about-bhj-title">
      <div className="mx-auto max-w-6xl px-6 md:px-10 xl:px-16">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-[13px] font-bold uppercase tracking-[0.16em] text-brand">
            {t("about.eyebrow")}
          </p>
          <span className="mx-auto mt-2 block h-[3px] w-10 rounded-full bg-brand" aria-hidden="true" />
          <h2 id="about-bhj-title" className="mt-3 font-extrabold text-ink sm:mt-4">
            {t("about.title")}
          </h2>
          {/* Redondant avec le 1er paragraphe : masque sur mobile pour raccourcir. */}
          <p className="mt-4 hidden text-[15px] leading-relaxed text-body sm:block">
            {t("about.subtitle")}
          </p>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:mt-10 lg:grid-cols-2 lg:items-center lg:gap-12">
          {/* Photo a gauche, sans bordure ni coins arrondis. Cadrage plus bas
              sur mobile pour reduire le scroll. */}
          <Reveal>
            <Image
              src="/apropos-auto-bhj.jpg"
              alt={t("about.imgAlt")}
              width={1600}
              height={1200}
              sizes="(max-width: 1024px) 100vw, 540px"
              className="aspect-[16/10] w-full object-cover sm:aspect-[4/3] lg:aspect-[5/4]"
            />
          </Reveal>

          {/* Texte a droite, sans cadre ni fond */}
          <Reveal delay={100}>
            <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-brand">
              {t("about.who")}
            </p>
            <h3
              className="mt-2 font-bold text-ink sm:mt-3"
              style={{ fontSize: "clamp(19px, 2.4vw, 26px)", lineHeight: 1.3 }}
            >
              {t("about.h3pre")}
              <span className="text-brand">{t("about.h3strong")}</span>.
            </h3>

            <div className="mt-3 flex flex-col gap-2.5 text-[14px] leading-relaxed text-body sm:mt-4 sm:gap-3 sm:text-[15px]">
              <p>{t("about.p1")}</p>
              <p>
                {t("about.p2pre")}
                <strong className="font-semibold text-ink">{t("about.p2strong")}</strong>.
              </p>
              <p>{t("about.p3")}</p>
            </div>

            {/* Points de reassurance : masques sur mobile pour raccourcir. */}
            <div className="mt-6 hidden gap-3 border-t border-line pt-5 sm:grid sm:grid-cols-3">
              {points.map((point) => (
                <p key={point} className="flex items-start gap-2 text-[13px] text-body">
                  <CheckCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                  {point}
                </p>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Piliers de confiance : 2 colonnes des le mobile pour eviter 4 lignes. */}
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-5 border-t border-line pt-6 sm:mt-12 sm:gap-x-6 sm:gap-y-6 sm:pt-8 lg:grid-cols-4">
          {pillars.map(({ title, text }, index) => {
            const Icon = PILLAR_ICONS[index];
            return (
              <Reveal key={title} delay={index * 80} className="flex items-start gap-2.5 sm:gap-3">
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-brand sm:h-6 sm:w-6" />
                <div>
                  <p className="text-[13px] font-bold text-ink sm:text-[14px]">{title}</p>
                  <p className="mt-0.5 text-[12px] leading-relaxed text-body sm:text-[13px]">{text}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
