import { RefreshIcon, ShieldIcon, TagIcon } from "./icons";

const ITEMS = [
  {
    title: "Voitures toujours controlees",
    text: "Chaque vehicule est verifie avant la mise en vente pour partir sereinement.",
    Icon: ShieldIcon,
  },
  {
    title: "Prix bas et transparents",
    text: "Des occasions selectionnees avec des prix clairs, sans mauvaise surprise.",
    Icon: TagIcon,
  },
  {
    title: "Vehicules propres",
    text: "Presentation soignee, habitacle propre et informations utiles avant la visite.",
    Icon: RefreshIcon,
  },
];

export default function HomeTrustCards() {
  return (
    <section className="home-trust" aria-labelledby="home-trust-title">
      <div className="home-trust-inner">
        <div className="home-trust-content">
          <header className="home-trust-copy">
            <p className="eyebrow">Pourquoi nous choisir</p>
            <h2 id="home-trust-title">Des voitures pretes a rouler, choisies avec serieux.</h2>
            <p>
              Chez Auto BHJ, on va droit au plus important: des vehicules propres,
              controles et proposes au bon prix pour acheter avec confiance.
            </p>
          </header>

          <div className="home-trust-grid">
            {ITEMS.map(({ title, text, Icon }, index) => (
              <article className="home-trust-card" key={title} style={{ "--delay": `${index * 90}ms` }}>
                <span className="home-trust-icon" aria-hidden="true">
                  <Icon width="24" height="24" />
                </span>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <figure className="home-trust-media">
          <img
            src="/home-key-handover.png"
            alt="Remise de cles de voiture a un client"
            loading="lazy"
          />
        </figure>
      </div>
    </section>
  );
}
