export default function LegalPage({ eyebrow, title, intro, updatedAt, sections }) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <p className="text-[13px] font-bold uppercase tracking-wide text-brand">{eyebrow}</p>
      <h1 className="mt-2 text-3xl font-bold text-ink sm:text-4xl">{title}</h1>
      <p className="mt-3 text-[15px] text-body">{intro}</p>
      <p className="mt-2 text-[13px] text-subtle">Derniere mise a jour : {updatedAt}</p>

      <div className="mt-10 flex flex-col gap-10">
        {sections.map((section) => (
          <div key={section.title}>
            <h2 className="text-lg font-bold text-ink">{section.title}</h2>
            <div className="mt-2 flex flex-col gap-3">
              {section.body.map((paragraph) => (
                <p key={paragraph} className="text-[15px] leading-relaxed text-body">
                  {paragraph}
                </p>
              ))}
            </div>
            {section.items ? (
              <ul className="mt-3 flex flex-col gap-1.5">
                {section.items.map((item) => (
                  <li key={item} className="flex gap-2 text-[15px] text-body">
                    <span className="text-brand">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
