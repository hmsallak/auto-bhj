import { SearchIcon, MessageIcon, ShieldIcon, KeyIcon } from "./icons";

const STEPS = [
  {
    Icon: SearchIcon,
    title: "Parcourez le stock",
    text: "Filtrez par reference, marque ou modele et consultez la fiche complete de chaque voiture.",
  },
  {
    Icon: MessageIcon,
    title: "Contactez-nous",
    text: "Appelez ou ecrivez en mentionnant la reference pour poser vos questions ou fixer un essai.",
  },
  {
    Icon: ShieldIcon,
    title: "Verifiez les informations",
    text: "Photos, prix, kilometrage, controle et equipements sont passes en revue avant votre decision.",
  },
  {
    Icon: KeyIcon,
    title: "Repartez au volant",
    text: "Signature, immatriculation, remise des cles : votre nouvelle voiture est prete.",
  },
];

export default function HowItWorks() {
  return (
    <section className="section reveal" id="comment-ca-marche">
      <div className="section-head">
        <div>
          <p className="eyebrow">Le parcours</p>
          <h2>Comment ca marche</h2>
          <p className="section-lead">
            De la recherche a la remise des cles, l'achat d'une voiture chez
            Auto BHJ se deroule en quatre etapes simples, sans engagement avant
            la visite.
          </p>
        </div>
      </div>

      <ol className="steps-grid">
        {STEPS.map(({ Icon, title, text }, index) => (
          <li className="step-card reveal-card" key={title}>
            <span className="step-number">{String(index + 1).padStart(2, "0")}</span>
            <span className="step-icon">
              <Icon />
            </span>
            <h3>{title}</h3>
            <p>{text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
