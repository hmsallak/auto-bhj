"use client";

import { useEffect, useRef, useState } from "react";
import { useT } from "../../lib/i18n";

// Adaptation "Auto BHJ" du composant scroll-story du registre : image a droite
// (les 4 photos du parcours), texte a gauche (les 4 etapes du site).
// Pilote par le scroll de la PAGE (piste haute + panneau sticky) -- fonctionne
// aussi bien embarque comme section que sur une page dediee.
// Les textes des etapes vivent dans le dictionnaire i18n (journey.steps[]).
const STEP_IMAGES = [
  "/story-1-catalogue.png",
  "/comment-2-visite.jpg",
  "/comment-3-controle.png",
  "/comment-4-cles.png",
];

const GRID_PATTERN = {
  "--g": "rgba(28,28,26,0.07)",
  backgroundImage:
    "linear-gradient(to right, var(--g) 1px, transparent 1px), linear-gradient(to bottom, var(--g) 1px, transparent 1px)",
  backgroundSize: "3.5rem 3.5rem",
};

export default function JourneyScrollStory() {
  const t = useT();
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef(null);

  const STEPS = STEP_IMAGES.map((image, i) => ({
    image,
    title: t(`journey.steps.${i}.title`),
    description: t(`journey.steps.${i}.description`),
  }));

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const onScroll = () => {
      const total = section.offsetHeight - window.innerHeight;
      if (total <= 0) return;
      const scrolled = -section.getBoundingClientRect().top;
      const p = scrolled / total;
      setActiveIndex(
        Math.min(
          STEP_IMAGES.length - 1,
          Math.max(0, Math.floor(p * STEP_IMAGES.length))
        )
      );
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const goTo = (i) => {
    const section = sectionRef.current;
    if (!section) return;
    const step = (section.offsetHeight - window.innerHeight) / STEP_IMAGES.length;
    const top = section.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + step * i + step * 0.5, behavior: "smooth" });
  };

  return (
    <section ref={sectionRef} className="bg-offwhite text-ink" aria-labelledby="journey-title">
      {/* Piste de scroll : ~0,5 ecran par etape (avant : 1 ecran plein = trop long). */}
      <div style={{ height: `${100 + STEP_IMAGES.length * 46}vh` }}>
        {/* Colle SOUS le header du site (h-72) : sinon il recouvre le titre. */}
        <div className="sticky top-[72px] flex h-[calc(100svh-72px)] w-full flex-col overflow-hidden bg-offwhite">
          {/* Titre fixe : reste en haut du panneau pendant tout le scroll. */}
          <div className="mx-auto w-full max-w-6xl shrink-0 px-8 pt-5 md:px-14 md:pt-7">
            <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-brand">
              {t("journey.eyebrow")}
            </p>
            <h2
              id="journey-title"
              className="mt-1 font-extrabold text-ink"
              style={{ fontSize: "clamp(20px, 3vw, 34px)", lineHeight: 1.2, maxWidth: "none" }}
            >
              {t("journey.title")}
            </h2>
          </div>

          <div className="mx-auto grid min-h-0 w-full max-w-6xl flex-1 grid-cols-1 md:grid-cols-2">
            {/* Gauche : texte. Mobile -> pile compacte centree (pagination, photo,
                texte, bouton), pour ne pas laisser un grand vide sous le bouton.
                Desktop -> groupe centre, la photo passe dans la colonne de droite. */}
            <div className="flex h-full flex-col justify-center px-6 py-4 md:border-r md:border-line md:px-14 md:py-6">
              <div className="mb-3 flex gap-2 md:mb-4">
                {STEPS.map((s, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => goTo(i)}
                    aria-label={`${t("journey.stepAria")} ${i + 1}`}
                    className={`h-1 rounded-full transition-all duration-500 ease-in-out ${
                      i === activeIndex ? "w-10 bg-cta" : "w-5 bg-ink/15"
                    }`}
                  />
                ))}
              </div>

              {/* Photo : mobile uniquement, juste sous la pagination (fondu).
                  Sans cadre ni fond : l'etape 1 est en portrait -> les cotes se
                  fondent dans la section au lieu de bandes noires. */}
              <div className="relative mb-4 aspect-[16/10] w-full overflow-hidden rounded-xl md:hidden">
                {STEPS.map((s, i) => (
                  <img
                    key={i}
                    src={s.image}
                    alt={s.title}
                    className={`absolute inset-0 h-full w-full transition-opacity duration-500 ${
                      i === 0 ? "object-contain" : "object-cover"
                    } ${i === activeIndex ? "opacity-100" : "opacity-0"}`}
                  />
                ))}
              </div>

              <div className="relative h-[124px] sm:h-[150px] md:h-[176px]">
                {STEPS.map((s, i) => (
                  <div
                    key={i}
                    className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                      i === activeIndex
                        ? "translate-y-0 opacity-100"
                        : "translate-y-8 opacity-0"
                    }`}
                  >
                    {/* Titre : plancher abaisse pour tenir sur petit ecran. */}
                    <h3
                      className="text-ink"
                      style={{
                        fontSize: "clamp(26px, 4vw, 46px)",
                        fontWeight: 700,
                        letterSpacing: "-0.03em",
                        lineHeight: 1.05,
                        maxWidth: "none",
                      }}
                    >
                      {s.title}
                    </h3>
                    <p className="mt-2 max-w-md text-[14px] leading-relaxed sm:mt-3 sm:text-base md:text-lg">
                      {s.description}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-7 text-center md:mt-7 md:text-left">
                <a
                  href="/stock"
                  className="inline-block rounded-full bg-cta px-7 py-3 text-[13px] font-semibold uppercase tracking-wider text-white transition-colors hover:bg-cta-dark md:px-10 md:py-4"
                >
                  {t("journey.cta")}
                </a>
              </div>
            </div>

            {/* Droite : image */}
            <div
              className="hidden items-center justify-center p-6 md:flex lg:p-8"
              style={GRID_PATTERN}
            >
              <div className="relative aspect-[4/3] w-[94%] max-w-[640px] overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full w-full transition-transform duration-700 ease-in-out"
                  style={{ transform: `translateY(-${activeIndex * 100}%)` }}
                >
                  {STEPS.map((s, i) => (
                    <div key={i} className="flex h-full w-full items-center justify-center">
                      {i === 0 ? (
                        <img
                          src={s.image}
                          alt={s.title}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <div className="h-full w-full overflow-hidden rounded-xl border border-line bg-ink shadow-xl">
                          <img
                            src={s.image}
                            alt={s.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
