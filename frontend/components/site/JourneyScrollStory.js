"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useT } from "../../lib/i18n";

// "Comment ca se passe" : carrousel du parcours d'achat (texte a gauche,
// photo a droite). Plus de scroll-jacking : la section a une hauteur normale,
// les etapes tournent seules et restent pilotables a la main (fleches,
// points, glisser horizontal, molette horizontale). La page defile toujours
// librement a la verticale. Textes : dictionnaire i18n (journey.steps[]).
const STEP_IMAGES = [
  "/story-1-catalogue.png",
  "/comment-2-visite.jpg",
  "/comment-3-controle.png",
  "/comment-4-cles.png",
];

const AUTOPLAY_MS = 5000;
const SWIPE_THRESHOLD = 50;
const WHEEL_THRESHOLD = 30;
const WHEEL_COOLDOWN_MS = 600;

const GRID_PATTERN = {
  "--g": "rgba(28,28,26,0.07)",
  backgroundImage:
    "linear-gradient(to right, var(--g) 1px, transparent 1px), linear-gradient(to bottom, var(--g) 1px, transparent 1px)",
  backgroundSize: "3.5rem 3.5rem",
};

function Arrow({ direction }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path
        d={direction === "prev" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function JourneyScrollStory() {
  const t = useT();
  const count = STEP_IMAGES.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [inView, setInView] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const sectionRef = useRef(null);
  const pointerStart = useRef(null);
  const lastWheel = useRef(0);

  const STEPS = STEP_IMAGES.map((image, i) => ({
    image,
    title: t(`journey.steps.${i}.title`),
    description: t(`journey.steps.${i}.description`),
  }));

  const goTo = useCallback((i) => setActiveIndex(((i % count) + count) % count), [count]);
  const next = useCallback(() => setActiveIndex((i) => (i + 1) % count), [count]);
  const prev = useCallback(() => setActiveIndex((i) => (i - 1 + count) % count), [count]);

  // Only turn while it can be seen, and never for reduced-motion users.
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => setReducedMotion(media.matches);
    syncMotion();
    media.addEventListener("change", syncMotion);

    const syncVisibility = () => setPageVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", syncVisibility);

    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.35,
    });
    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => {
      media.removeEventListener("change", syncMotion);
      document.removeEventListener("visibilitychange", syncVisibility);
      observer.disconnect();
    };
  }, []);

  const playing = !reducedMotion && !userPaused && !hovered && !focused && inView && pageVisible;

  // One timer per slide: any change of slide (auto or manual) restarts the
  // countdown, so a manual choice gets its full 5 seconds before moving on.
  useEffect(() => {
    if (!playing) return undefined;
    const timer = window.setTimeout(next, AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [playing, activeIndex, next]);

  // Horizontal swipe / drag. touch-action: pan-y keeps vertical page scroll native.
  function onPointerDown(event) {
    pointerStart.current = { x: event.clientX, y: event.clientY };
  }

  function onPointerUp(event) {
    const start = pointerStart.current;
    pointerStart.current = null;
    if (!start) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) next();
      else prev();
    }
  }

  // Trackpad / horizontal wheel only; vertical wheel is left to the page.
  function onWheel(event) {
    if (Math.abs(event.deltaX) <= Math.abs(event.deltaY) || Math.abs(event.deltaX) < WHEEL_THRESHOLD) return;
    const now = Date.now();
    if (now - lastWheel.current < WHEEL_COOLDOWN_MS) return;
    lastWheel.current = now;
    if (event.deltaX > 0) next();
    else prev();
  }

  function onKeyDown(event) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      next();
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      prev();
    }
  }

  const swipeProps = {
    onPointerDown,
    onPointerUp,
    onPointerCancel: () => {
      pointerStart.current = null;
    },
    onWheel,
    style: { touchAction: "pan-y" },
  };

  return (
    <section
      ref={sectionRef}
      className="bg-offwhite text-ink"
      aria-labelledby="journey-title"
      aria-roledescription="carrousel"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
      }}
      onKeyDown={onKeyDown}
    >
      <div className="mx-auto w-full max-w-6xl px-8 pt-10 md:px-14 md:pt-14">
        <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-brand">{t("journey.eyebrow")}</p>
        <h2
          id="journey-title"
          className="mt-1 font-extrabold text-ink"
          style={{ fontSize: "clamp(20px, 3vw, 34px)", lineHeight: 1.2, maxWidth: "none" }}
        >
          {t("journey.title")}
        </h2>
      </div>

      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 pb-10 md:grid-cols-2 md:pb-14">
        {/* Gauche : pagination + controles, photo (mobile), texte, bouton. */}
        <div className="flex flex-col justify-center px-6 py-6 md:border-r md:border-line md:px-14">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex items-center gap-2">
              {STEPS.map((s, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`${t("journey.stepAria")} ${i + 1}`}
                  aria-current={i === activeIndex ? "step" : undefined}
                  className="flex h-11 items-center"
                >
                  <span
                    className={`relative block h-1 overflow-hidden rounded-full transition-all duration-500 ease-in-out ${
                      i === activeIndex ? "w-10 bg-cta/25" : "w-5 bg-ink/15"
                    }`}
                  >
                    {i === activeIndex && (
                      // Fills over the slide's 5 s; full and still when autoplay is off.
                      <span
                        key={`${activeIndex}-${playing}`}
                        className={`absolute inset-0 origin-left bg-cta ${
                          reducedMotion || userPaused ? "" : "journey-progress"
                        }`}
                        style={{
                          animationDuration: `${AUTOPLAY_MS}ms`,
                          animationPlayState: playing ? "running" : "paused",
                        }}
                      />
                    )}
                  </span>
                </button>
              ))}
            </div>

            <div className="ml-auto flex items-center gap-1">
              {!reducedMotion && (
                <button
                  type="button"
                  onClick={() => setUserPaused((value) => !value)}
                  aria-label={userPaused ? t("journey.play") : t("journey.pause")}
                  className="grid h-11 w-11 place-items-center rounded-full text-ink/60 transition-colors hover:bg-ink/5 hover:text-ink"
                >
                  {userPaused ? (
                    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                      <path d="M8 5v14l11-7z" fill="currentColor" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                      <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor" />
                    </svg>
                  )}
                </button>
              )}
              <button
                type="button"
                onClick={prev}
                aria-label={t("journey.prev")}
                className="grid h-11 w-11 place-items-center rounded-full border border-line text-ink transition-colors hover:border-ink/30 hover:bg-white"
              >
                <Arrow direction="prev" />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label={t("journey.next")}
                className="grid h-11 w-11 place-items-center rounded-full border border-line text-ink transition-colors hover:border-ink/30 hover:bg-white"
              >
                <Arrow direction="next" />
              </button>
            </div>
          </div>

          {/* Photo : mobile uniquement, glissable. */}
          <div
            className="relative mb-4 aspect-[16/10] w-full select-none overflow-hidden rounded-xl md:hidden"
            {...swipeProps}
          >
            {STEPS.map((s, i) => (
              <img
                key={i}
                src={s.image}
                alt={i === activeIndex ? s.title : ""}
                draggable={false}
                className={`absolute inset-0 h-full w-full transition-opacity duration-500 ${
                  i === 0 ? "object-contain" : "object-cover"
                } ${i === activeIndex ? "opacity-100" : "opacity-0"}`}
              />
            ))}
          </div>

          {/* Texte : annonce l'etape seulement quand l'utilisateur la change
              (pas de lecture en boucle pendant la rotation automatique). */}
          <div
            className="relative h-[124px] select-none sm:h-[150px] md:h-[176px]"
            aria-live={playing ? "off" : "polite"}
            {...swipeProps}
          >
            {STEPS.map((s, i) => (
              <div
                key={i}
                aria-hidden={i !== activeIndex}
                className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                  i === activeIndex ? "translate-x-0 opacity-100" : "pointer-events-none translate-x-6 opacity-0"
                }`}
              >
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

          <div className="mt-7 text-center md:text-left">
            <a
              href="/stock"
              className="inline-block rounded-full bg-cta px-7 py-3 text-[13px] font-semibold uppercase tracking-wider text-white transition-colors hover:bg-cta-dark md:px-10 md:py-4"
            >
              {t("journey.cta")}
            </a>
          </div>
        </div>

        {/* Droite : photos en bande horizontale, glissable. */}
        <div className="hidden items-center justify-center p-6 md:flex lg:p-8" style={GRID_PATTERN}>
          <div
            className="relative aspect-[4/3] w-[94%] max-w-[640px] cursor-grab select-none overflow-hidden active:cursor-grabbing"
            {...swipeProps}
          >
            <div
              className="flex h-full w-full transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {STEPS.map((s, i) => (
                <div
                  key={i}
                  className="flex h-full w-full shrink-0 items-center justify-center"
                  aria-hidden={i !== activeIndex}
                >
                  {i === 0 ? (
                    <img src={s.image} alt={s.title} draggable={false} className="h-full w-full object-contain" />
                  ) : (
                    <div className="h-full w-full overflow-hidden rounded-xl border border-line bg-ink shadow-xl">
                      <img src={s.image} alt={s.title} draggable={false} className="h-full w-full object-cover" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
