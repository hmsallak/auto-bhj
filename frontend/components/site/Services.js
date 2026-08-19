import { MessageIcon, TagIcon, ShieldIcon, HeadsetIcon } from "./icons";

const SERVICES = [
  {
    Icon: MessageIcon,
    title: "Visite sur rendez-vous",
    text: "Indiquez la reference de la voiture qui vous interesse et nous organisons une visite au garage avec le vehicule disponible.",
  },
  {
    Icon: ShieldIcon,
    title: "Garantie et controle technique",
    text: "Les vehicules sont dedouanes et prepares en vue du passage au controle technique. Une garantie peut etre proposee selon le modele : les conditions sont precisees lors du contact.",
  },
  {
    Icon: TagIcon,
    title: "Prix affiche clairement",
    text: "Chaque annonce indique son prix, sa reference et ses caracteristiques essentielles afin de comparer sans surprise.",
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
            Auto BHJ vous accompagne avant la visite, pendant l'achat et apres
            la remise des cles avec un interlocuteur direct.
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
