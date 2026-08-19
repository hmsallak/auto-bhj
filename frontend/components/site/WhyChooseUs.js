import { ShieldIcon, TagIcon, SearchIcon, HeadsetIcon } from "./icons";

const POINTS = [
  {
    Icon: ShieldIcon,
    title: "Vehicules controles",
    text: "Chaque voiture est verifiee avant publication : etat mecanique, carrosserie et carnet d'entretien.",
  },
  {
    Icon: TagIcon,
    title: "Prix transparent",
    text: "Le prix, la reference et les informations principales sont affiches clairement sur chaque annonce.",
  },
  {
    Icon: SearchIcon,
    title: "Stock facile a comparer",
    text: "Filtres, recherche par reference et fiches detaillees vous aident a trouver rapidement la bonne voiture.",
  },
  {
    Icon: HeadsetIcon,
    title: "Accompagnement",
    text: "Visite, essai, controle technique et formalites de vente : nous vous guidons jusqu'a la remise des cles.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="section reveal" id="pourquoi">
      <div className="section-head">
        <div>
          <p className="eyebrow">Pourquoi Auto BHJ</p>
          <h2>Une confiance construite vehicule par vehicule</h2>
          <p className="section-lead">
            Acheter une voiture d'occasion demande de la confiance. Chez Auto BHJ,
            chaque annonce publiee correspond a un vehicule reellement disponible
            en stock, avec ses caracteristiques exactes et son prix final.
          </p>
        </div>
      </div>

      <div className="value-grid">
        {POINTS.map(({ Icon, title, text }) => (
          <div className="value-card reveal-card" key={title}>
            <span className="value-icon">
              <Icon />
            </span>
            <h3>{title}</h3>
            <p>{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
