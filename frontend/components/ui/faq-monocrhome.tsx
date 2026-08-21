"use client";

import { useEffect, useMemo, useState } from "react";

type FaqItem = {
  question: string;
  answer: string;
  meta?: string;
};

type FAQMonochromeProps = {
  items?: FaqItem[];
  eyebrow?: string;
  title?: string;
  description?: string;
};

const INTRO_STYLE_ID = "auto-bhj-faq-monochrome";

const defaultFaqs: FaqItem[] = [
  {
    question: "Comment se passe la visite d'un vehicule ?",
    answer:
      "Vous prenez rendez-vous par telephone ou WhatsApp, vous venez voir la voiture sur place et vous pouvez l'essayer avant de vous decider. Ce que vous voyez en ligne correspond au vehicule presente sur place.",
    meta: "Visite",
  },
  {
    question: "Le prix affiche est-il negociable ?",
    answer:
      "Le prix affiche sur chaque fiche est le prix demande. Nous preferons annoncer un prix clair des le depart plutot que d'ajouter une marge de negociation artificielle.",
    meta: "Prix",
  },
  {
    question: "Puis-je faire un essai routier ?",
    answer:
      "Oui, un essai est possible sur rendez-vous, muni de votre permis de conduire. Cela permet de verifier tranquillement si le vehicule vous convient.",
    meta: "Essai",
  },
  {
    question: "Les vehicules sont-ils controles ?",
    answer:
      "Chaque vehicule est inspecte avant sa mise en ligne : etat general, coherence du kilometrage et documents en ordre. Nous regardons la voiture avant de vous la presenter.",
    meta: "Controle",
  },
  {
    question: "Proposez-vous une garantie ?",
    answer:
      "Les conditions de garantie dependent du vehicule concerne. Nous les precisons directement avec vous avant l'achat, pour que tout soit clair par ecrit.",
    meta: "Garantie",
  },
  {
    question: "Puis-je reprendre mon ancien vehicule ?",
    answer:
      "C'est possible selon les cas. Envoyez-nous la marque, le modele, le kilometrage et l'etat general de votre vehicule actuel, puis nous etudierons une proposition de reprise.",
    meta: "Reprise",
  },
  {
    question: "Un financement est-il possible ?",
    answer:
      "Nous pouvons discuter des options de financement adaptees a votre situation lors de votre visite. Vous pouvez aussi nous appeler avant de vous deplacer.",
    meta: "Financement",
  },
  {
    question: "Comment vous contacter rapidement ?",
    answer:
      "Le plus simple est de nous appeler ou de nous envoyer un message WhatsApp au 0483 20 88 01. Nous repondons rapidement aux demandes de rendez-vous.",
    meta: "Contact",
  },
];

const palette = {
  surface: "bg-[var(--carbon)] text-[var(--carbon-text)]",
  panel: "bg-white/[0.045]",
  border: "border-white/10",
  heading: "text-[var(--carbon-text)]",
  muted: "text-[var(--carbon-text-dim)]",
  iconRing: "border-white/15",
  iconSurface: "bg-white/[0.055]",
  icon: "text-white",
  glow: "rgba(225, 29, 46, 0.16)",
  aurora:
    "radial-gradient(ellipse 55% 70% at 12% 0%, rgba(225, 29, 46, 0.18), transparent 64%), radial-gradient(ellipse 45% 60% at 88% 20%, rgba(255, 255, 255, 0.08), transparent 62%), var(--carbon)",
  shadow: "shadow-[0_36px_120px_-70px_rgba(0,0,0,0.9)]",
  overlay: "linear-gradient(130deg, rgba(255,255,255,0.045) 0%, transparent 65%)",
};

function FAQMonochrome({
  items = defaultFaqs,
  eyebrow = "Questions frequentes",
  title = "Des reponses claires avant de venir.",
  description = "Visite, essai, documents, reprise ou financement : les points importants sont regroupes ici pour vous aider a avancer sans surprise.",
}: FAQMonochromeProps) {
  const [introReady, setIntroReady] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    if (typeof document === "undefined" || document.getElementById(INTRO_STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = INTRO_STYLE_ID;
    style.innerHTML = `
      @keyframes auto-bhj-faq-fade-up {
        0% { transform: translate3d(0, 20px, 0); opacity: 0; filter: blur(8px); }
        100% { transform: translate3d(0, 0, 0); opacity: 1; filter: blur(0); }
      }
      @keyframes auto-bhj-faq-beam-spin {
        0% { transform: rotate(0deg) scale(1); }
        100% { transform: rotate(360deg) scale(1); }
      }
      @keyframes auto-bhj-faq-meter {
        0%, 20% { transform: scaleX(0); transform-origin: left; }
        45%, 60% { transform: scaleX(1); transform-origin: left; }
        80%, 100% { transform: scaleX(0); transform-origin: right; }
      }
      .auto-bhj-faq-intro {
        position: relative;
        display: flex;
        align-items: center;
        gap: 0.85rem;
        width: 100%;
        max-width: 24rem;
        margin: 0 auto;
        padding: 0.85rem 1.2rem;
        overflow: hidden;
        isolation: isolate;
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 9999px;
        background: rgba(12, 12, 12, 0.44);
        color: rgba(248, 250, 252, 0.92);
        text-transform: uppercase;
        font-size: 0.65rem;
        opacity: 0;
        transform: translate3d(0, 12px, 0);
        filter: blur(8px);
        transition: opacity 720ms ease, transform 720ms ease, filter 720ms ease;
      }
      .auto-bhj-faq-intro--active {
        opacity: 1;
        transform: translate3d(0, 0, 0);
        filter: blur(0);
      }
      .auto-bhj-faq-intro__beam {
        position: absolute;
        inset: -110%;
        pointer-events: none;
        border-radius: 50%;
        background: conic-gradient(from 160deg, rgba(255,255,255,0.25), transparent 32%, rgba(225,29,46,0.26) 58%, transparent 78%, rgba(255,255,255,0.16));
        animation: auto-bhj-faq-beam-spin 18s linear infinite;
        opacity: 0.55;
      }
      .auto-bhj-faq-intro__label {
        position: relative;
        z-index: 1;
        font-weight: 700;
        letter-spacing: 0.32em;
        white-space: nowrap;
      }
      .auto-bhj-faq-intro__meter {
        position: relative;
        z-index: 1;
        flex: 1 1 auto;
        height: 1px;
        background: linear-gradient(90deg, transparent, currentColor 35%, transparent 85%);
        transform: scaleX(0);
        transform-origin: left;
        animation: auto-bhj-faq-meter 5.8s ease-in-out infinite;
        opacity: 0.7;
      }
      .auto-bhj-faq-fade {
        opacity: 0;
        transform: translate3d(0, 24px, 0);
        filter: blur(12px);
      }
      .auto-bhj-faq-fade--ready {
        animation: auto-bhj-faq-fade-up 760ms cubic-bezier(0.22, 0.68, 0, 1) forwards;
      }
      @media (prefers-reduced-motion: reduce) {
        .auto-bhj-faq-intro,
        .auto-bhj-faq-intro__beam,
        .auto-bhj-faq-intro__meter,
        .auto-bhj-faq-fade,
        .auto-bhj-faq-fade--ready {
          animation: none !important;
          transition: none !important;
          transform: none !important;
          filter: none !important;
          opacity: 1 !important;
        }
      }
    `;

    document.head.appendChild(style);

    return () => {
      style.remove();
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      setIntroReady(true);
      setHasEntered(true);
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      setIntroReady(true);
      setHasEntered(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  const renderedItems = useMemo(() => items, [items]);

  const setCardGlow = (event: React.MouseEvent<HTMLLIElement>) => {
    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();
    target.style.setProperty("--faq-x", `${event.clientX - rect.left}px`);
    target.style.setProperty("--faq-y", `${event.clientY - rect.top}px`);
  };

  const clearCardGlow = (event: React.MouseEvent<HTMLLIElement>) => {
    const target = event.currentTarget;
    target.style.removeProperty("--faq-x");
    target.style.removeProperty("--faq-y");
  };

  return (
    <section
      className={`relative w-full overflow-hidden transition-colors duration-700 ${palette.surface}`}
      style={{ fontFamily: "var(--font-template), ui-sans-serif, system-ui, sans-serif" }}
    >
      <div className="absolute inset-0 z-0" style={{ background: palette.aurora }} />
      <div className="pointer-events-none absolute inset-0 z-0 opacity-80" style={{ background: palette.overlay }} />

      <div
        className={`relative z-10 mx-auto flex max-w-5xl flex-col gap-10 px-5 py-24 sm:px-8 lg:px-12 ${
          hasEntered ? "auto-bhj-faq-fade--ready" : "auto-bhj-faq-fade"
        }`}
      >
        <div className={`auto-bhj-faq-intro ${introReady ? "auto-bhj-faq-intro--active" : ""}`}>
          <span className="auto-bhj-faq-intro__beam" aria-hidden="true" />
          <span className="auto-bhj-faq-intro__label">Auto BHJ FAQ</span>
          <span className="auto-bhj-faq-intro__meter" aria-hidden="true" />
        </div>

        <header className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="space-y-4">
            <p className={`text-xs font-semibold uppercase tracking-[0.28em] ${palette.muted}`}>{eyebrow}</p>
            <h1
              className={`max-w-2xl text-4xl font-semibold leading-tight md:text-5xl ${palette.heading}`}
              style={{ fontFamily: "inherit", letterSpacing: "0" }}
            >
              {title}
            </h1>
            <p className={`max-w-xl text-base leading-7 ${palette.muted}`}>{description}</p>
          </div>
          <a
            href="tel:+32483208801"
            className="inline-flex min-h-11 w-fit items-center justify-center rounded-full border border-white/15 bg-white/10 px-5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/60"
          >
            0483 20 88 01
          </a>
        </header>

        <ul className="space-y-4">
          {renderedItems.map((item, index) => {
            const open = activeIndex === index;
            const panelId = `auto-bhj-faq-panel-${index}`;
            const buttonId = `auto-bhj-faq-trigger-${index}`;

            return (
              <li
                key={item.question}
                className={`group relative overflow-hidden rounded-[16px] border backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 focus-within:-translate-y-0.5 ${palette.border} ${palette.panel} ${palette.shadow}`}
                onMouseMove={setCardGlow}
                onMouseLeave={clearCardGlow}
              >
                <div
                  className={`pointer-events-none absolute inset-0 transition-opacity duration-300 ${
                    open ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  }`}
                  style={{
                    background: `radial-gradient(240px circle at var(--faq-x, 50%) var(--faq-y, 50%), ${palette.glow}, transparent 70%)`,
                  }}
                />

                <button
                  type="button"
                  id={buttonId}
                  aria-controls={panelId}
                  aria-expanded={open}
                  onClick={() => setActiveIndex((current) => (current === index ? -1 : index))}
                  className="relative flex w-full cursor-pointer items-start gap-4 px-5 py-5 text-left transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/40 sm:gap-6 sm:px-8 sm:py-7"
                >
                  <span
                    className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-all duration-300 group-hover:scale-105 ${palette.iconRing} ${palette.iconSurface}`}
                    aria-hidden="true"
                  >
                    <svg
                      className={`relative h-5 w-5 transition-transform duration-300 ${palette.icon} ${open ? "rotate-45" : ""}`}
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 5v14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M5 12h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </span>

                  <span className="flex min-w-0 flex-1 flex-col gap-4">
                    <span className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                      <span className={`text-lg font-semibold leading-tight sm:text-xl ${palette.heading}`}>
                        {item.question}
                      </span>
                      {item.meta ? (
                        <span
                          className={`inline-flex w-fit items-center rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] sm:ml-auto ${palette.border} ${palette.muted}`}
                        >
                          {item.meta}
                        </span>
                      ) : null}
                    </span>

                    <span
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      className={`grid overflow-hidden text-sm leading-7 transition-[grid-template-rows,opacity] duration-300 ease-out ${
                        open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      } ${palette.muted}`}
                    >
                      <span className="min-h-0 overflow-hidden pr-2">{item.answer}</span>
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export default FAQMonochrome;
export { FAQMonochrome };
