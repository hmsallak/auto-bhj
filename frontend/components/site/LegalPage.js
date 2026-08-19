export default function LegalPage({ eyebrow, title, intro, updatedAt, sections }) {
  return (
    <section className="legal-shell">
      <div className="legal-hero">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{intro}</p>
        <span>Derniere mise a jour : {updatedAt}</span>
      </div>

      <div className="legal-content">
        {sections.map((section) => (
          <article className="legal-section" key={section.title}>
            <h2>{section.title}</h2>
            {section.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {section.items ? (
              <ul>
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
