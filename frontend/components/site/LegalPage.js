"use client";

import { useLang, useT } from "../../lib/i18n";

// content = { updatedAt, fr: { eyebrow, title, intro, sections }, nl: { ... } }
// sections[] = { title, body: string[], items?: string[] }
export default function LegalPage({ content }) {
  const { lang } = useLang();
  const t = useT();
  const c = content[lang] || content.fr;

  return (
    <div className="mx-auto max-w-2xl px-6 py-10 sm:py-14">
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand">{c.eyebrow}</p>
      <h1
        className="mt-1.5 text-ink"
        style={{ fontSize: "clamp(19px, 2.2vw, 23px)", fontWeight: 700, lineHeight: 1.25, maxWidth: "none" }}
      >
        {c.title}
      </h1>
      <p className="mt-2 max-w-prose text-[13px] leading-relaxed text-body">{c.intro}</p>
      <p className="mt-1.5 text-[11px] text-subtle">
        {t("legal.updated")} {content.updatedAt}
      </p>

      <div className="mt-8 flex flex-col gap-6">
        {c.sections.map((section, index) => (
          <section key={section.title} className={index > 0 ? "border-t border-line pt-6" : ""}>
            <h2
              className="text-ink"
              style={{ fontSize: "13.5px", fontWeight: 700, lineHeight: 1.35, maxWidth: "none" }}
            >
              {section.title}
            </h2>
            <div className="mt-1.5 flex flex-col gap-2 text-[13px] leading-relaxed text-body">
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            {section.items ? (
              <ul className="mt-2 flex flex-col gap-1 text-[13px] leading-relaxed text-body">
                {section.items.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span
                      className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-brand"
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </div>
    </div>
  );
}
