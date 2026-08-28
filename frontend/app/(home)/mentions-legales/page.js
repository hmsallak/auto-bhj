import LegalPage from "../../../components/site/LegalPage";

export const metadata = {
  title: "Mentions legales",
  description: "Informations legales et coordonnees officielles de Auto BHJ SRL.",
  alternates: { canonical: "/mentions-legales" },
};

const content = {
  updatedAt: "19 aout 2026",
  fr: {
    eyebrow: "Cadre legal",
    title: "Mentions legales",
    intro:
      "Les informations essentielles pour identifier Auto BHJ et comprendre les conditions d'utilisation du site.",
    sections: [
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
          "Telephone : +32 483 20 88 01",
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
        body: ["Le site est heberge par Railway Corporation."],
        items: [
          "Hebergeur : Railway Corporation",
          "Adresse : 548 Market St Suite 68956, San Francisco, California 94104, Etats-Unis",
          "E-mail : team@railway.com",
          "Telephone : +1 415 707 7675",
          "Site web : railway.com",
        ],
      },
    ],
  },
  nl: {
    eyebrow: "Wettelijk kader",
    title: "Wettelijke vermeldingen",
    intro:
      "De essentiele informatie om Auto BHJ te identificeren en de gebruiksvoorwaarden van de site te begrijpen.",
    sections: [
      {
        title: "Uitgever van de site",
        body: [
          "De site autobhj.be wordt uitgegeven door Auto BHJ SRL, verkoper van tweedehandswagens gevestigd in Belgie.",
        ],
        items: [
          "Benaming: Auto BHJ SRL",
          "Adres: Mekingenweg 99, 1600 Sint-Pieters-Leeuw, Belgie",
          "KBO-nummer: 0801.303.538",
          "Btw-nummer: BE 0801.303.538",
          "E-mail: contact@autobhj.be",
          "Telefoon: +32 483 20 88 01",
        ],
      },
      {
        title: "Activiteit",
        body: [
          "Auto BHJ toont een aanbod tweedehandswagens. De op de site gepubliceerde informatie helpt de bezoeker om een contactaanvraag, een bezoek of een proefrit voor te bereiden.",
          "Beschikbaarheid, kenmerken, prijzen en voorwaarden van elke wagen worden bevestigd voor elke definitieve overeenkomst.",
        ],
      },
      {
        title: "Aansprakelijkheid",
        body: [
          "Auto BHJ streeft ernaar de informatie op de site correct en actueel te houden. Toch kunnen invoerfouten, wijzigingen in het aanbod of verschillen met de werkelijke staat van de wagen voorkomen.",
          "De getoonde foto's, beschrijvingen en prijzen vormen geen definitief contractueel aanbod. De bezoeker wordt gevraagd de belangrijke informatie rechtstreeks bij Auto BHJ te controleren.",
        ],
      },
      {
        title: "Intellectuele eigendom",
        body: [
          "De teksten, beelden, interfaces, logo's, merken en grafische elementen op deze site zijn beschermd. Elke reproductie of hergebruik zonder voorafgaande schriftelijke toestemming is verboden, behoudens wettelijke uitzonderingen.",
        ],
      },
      {
        title: "Hosting",
        body: ["De site wordt gehost door Railway Corporation."],
        items: [
          "Host: Railway Corporation",
          "Adres: 548 Market St Suite 68956, San Francisco, California 94104, Verenigde Staten",
          "E-mail: team@railway.com",
          "Telefoon: +1 415 707 7675",
          "Website: railway.com",
        ],
      },
    ],
  },
};

export default function MentionsLegalesPage() {
  return <LegalPage content={content} />;
}
