import LegalPage from "../../../components/site/LegalPage";

export const metadata = {
  title: "Mentions legales - Auto BHJ",
  description: "Informations legales et coordonnees officielles de Auto BHJ.",
};

const sections = [
  {
    title: "Editeur du site",
    body: [
      "Le site autobhj.be est edite par Auto BHJ SRL, vendeur de vehicules d'occasion situe en Belgique.",
    ],
    items: [
      "Denomination : Auto BHJ SRL",
      "Adresse : Mekingenweg 99, 1600 Sint-Pieters-Leeuw, Belgique",
      "Numero BCE : 0801.303.538",
      "Numero de TVA : BE 0801.303.538",
      "E-mail : contact@autobhj.be",
      "Telephone : +32 000 00 00 00",
    ],
  },
  {
    title: "Activite",
    body: [
      "Auto BHJ presente un stock de vehicules d'occasion. Les informations publiees sur le site ont pour objectif d'aider le visiteur a preparer une demande de contact, une visite ou un essai.",
      "Les disponibilites, caracteristiques, prix et conditions liees a chaque vehicule sont confirmees avant tout accord definitif.",
    ],
  },
  {
    title: "Responsabilite",
    body: [
      "Auto BHJ veille a maintenir les informations du site exactes et a jour. Des erreurs de saisie, des changements de stock ou des differences avec l'etat reel du vehicule peuvent toutefois exister.",
      "Les photos, descriptions et prix affiches ne constituent pas une offre contractuelle definitive. Le visiteur est invite a verifier les informations importantes directement avec Auto BHJ.",
    ],
  },
  {
    title: "Propriete intellectuelle",
    body: [
      "Les textes, visuels, interfaces, logos, marques et elements graphiques presents sur ce site sont proteges. Toute reproduction ou reutilisation sans autorisation ecrite prealable est interdite, sauf exceptions prevues par la loi.",
    ],
  },
  {
    title: "Hebergement",
    body: [
      "Le site est heberge par Railway Corporation.",
    ],
    items: [
      "Hebergeur : Railway Corporation",
      "Adresse : 548 Market St Suite 68956, San Francisco, California 94104, Etats-Unis",
      "E-mail : team@railway.com",
      "Telephone : +1 415 707 7675",
      "Site web : railway.com",
    ],
  },
];

export default function MentionsLegalesPage() {
  return (
    <LegalPage
      eyebrow="Cadre legal"
      title="Mentions legales"
      intro="Les informations essentielles pour identifier Auto BHJ et comprendre les conditions d'utilisation du site."
      updatedAt="19 aout 2026"
      sections={sections}
    />
  );
}
