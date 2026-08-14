import { RefreshIcon, TagIcon, ShieldIcon, HeadsetIcon } from "./icons";

const SERVICES = [
  {
    Icon: RefreshIcon,
    title: "Reprise de vehicule",
    text: "Vous possedez deja une voiture ? Nous etudions sa reprise et deduisons sa valeur estimee du prix de votre nouvel achat, apres inspection du vehicule sur place.",
  },
  {
    Icon: TagIcon,
    title: "Financement",
    text: "Sur demande, nous vous orientons vers des solutions de financement adaptees a votre budget. Le prix affiche reste toutefois le prix de reference, sans majoration.",
  },
  {
    Icon: ShieldIcon,
    title: "Garantie et controle technique",
    text: "Les vehicules sont dedouanes et prepares en vue du passage au controle technique. Une garantie peut etre proposee selon le modele : les conditions sont precisees lors du contact.",
  },
  {
    Icon: HeadsetIcon,
    title: "Suivi apres-vente",
    text: "Question sur l'entretien, une piece ou une formalite d'immatriculation apres l'achat ? Notre equipe reste joignable pour vous accompagner.",
  },
];

export default function Services() {
  return (
    <section className="section reveal" id="services">
      <div className="section-head">
        <div>
          <p className="eyebrow">Nos services</p>
          <h2>Un accompagnement complet, pas seulement une vente</h2>
          <p className="section-lead">
            Au-dela de la vente du vehicule, Auto BHJ propose plusieurs
            services pour simplifier votre changement de voiture.
          </p>
        </div>
      </div>

      <div className="services-list">
        {SERVICES.map(({ Icon, title, text }) => (
          <div className="service-row" key={title}>
            <span className="value-icon">
              <Icon />
            </span>
            <div>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
