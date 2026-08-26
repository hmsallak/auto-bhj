const ICONS = {
  about: "a-propos.svg",
  address: "adresse.svg",
  year: "annee.svg",
  approach: "approche.svg",
  gearbox: "boite-vitesse.svg",
  fuel: "carburant.svg",
  contact: "contacter.svg",
  inspection: "controle-technique.svg",
  available: "disponible.svg",
  commitment: "engagement.svg",
  favorite: "favoris.svg",
  filters: "filtres.svg",
  warranty: "garantie.svg",
  route: "itineraire.svg",
  mileage: "kilometrage.svg",
  edit: "modifier.svg",
  more: "more.svg",
  share: "partager.svg",
  price: "prix.svg",
  budget: "budget.svg",
  quality: "qualite.svg",
  appointment: "rendez-vous.svg",
  calendar: "calendrier.svg",
  download: "telecharger.svg",
  document: "document.svg",
  email: "email.svg",
  family: "famille.svg",
  info: "info.svg",
  maintenance: "entretien.svg",
  owner: "anciens_proprietaires.svg",
  phone: "telephone.svg",
  view: "voir-fiche.svg",
  car: "voiture.svg",
  key: "cle.svg",
  whatsapp: "whatsapp.svg",
};

export default function OfficialIcon({ name, alt = "", className = "", width = 24, height = 24, ...props }) {
  const file = ICONS[name] || ICONS.car;

  return (
    <img
      src={`/icons/${file}`}
      alt={alt}
      width={width}
      height={height}
      className={className}
      aria-hidden={alt ? undefined : "true"}
      {...props}
    />
  );
}
