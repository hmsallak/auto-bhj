import { ShieldIcon, TagIcon, RefreshIcon, HeadsetIcon } from "./icons";

const POINTS = [
  {
    Icon: ShieldIcon,
    title: "Vehicules controles",
    text: "Chaque voiture est verifiee avant publication : etat mecanique, carrosserie et carnet d'entretien.",
  },
  {
    Icon: TagIcon,
    title: "Prix transparent",
    text: "Le prix affiche est le prix final. Aucune surprise ni frais caches a la reprise du vehicule.",
  },
  {
    Icon: RefreshIcon,
    title: "Reprise possible",
    text: "Votre ancien vehicule peut etre repris et deduit du prix de la nouvelle voiture.",
  },
  {
    Icon: HeadsetIcon,
    title: "Accompagnement",
    text: "Immatriculation, controle technique, conseils de financement : nous vous accompagnons jusqu'au bout.",
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
          <div className="value-card" key={title}>
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
