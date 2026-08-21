import { ClockIcon, ShieldIcon, TagIcon } from "./icons";

const ITEMS = [
  {
    title: "Vehicules controles",
    text: "Chaque voiture est verifiee avant la mise en ligne.",
    Icon: ShieldIcon,
  },
  {
    title: "Prix affiches",
    text: "Budget clair, kilometrage visible, informations utiles.",
    Icon: TagIcon,
  },
  {
    title: "Visite sur rendez-vous",
    text: "Vous choisissez le vehicule, on prepare la visite.",
    Icon: ClockIcon,
  },
];

export default function HomeTrustCards() {
  return (
    <section className="home-trust" aria-labelledby="home-trust-title">
      <div className="home-trust-inner">
        <header className="home-trust-copy">
          <p className="eyebrow">Simple et clair</p>
          <h2 id="home-trust-title">Tout ce qu'il faut avant de choisir</h2>
        </header>

        <div className="home-trust-grid">
          {ITEMS.map(({ title, text, Icon }, index) => (
            <article className="home-trust-card" key={title} style={{ "--delay": `${index * 90}ms` }}>
              <span className="home-trust-icon" aria-hidden="true">
                <Icon width="25" height="25" />
              </span>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
