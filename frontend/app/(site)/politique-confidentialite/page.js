import LegalPage from "../../../components/site/LegalPage";

export const metadata = {
  title: "Politique de confidentialite - Auto BHJ",
  description: "Traitement des donnees personnelles collectees par Auto BHJ.",
};

const sections = [
  {
    title: "Responsable du traitement",
    body: [
      "Auto BHJ SRL est responsable du traitement des donnees personnelles collectees via ce site.",
    ],
    items: [
      "Adresse : Mekingenweg 99, 1600 Sint-Pieters-Leeuw, Belgique",
      "E-mail : contact@autobhj.be",
      "TVA : BE 0801.303.538",
    ],
  },
  {
    title: "Donnees collectees",
    body: [
      "Lorsque vous utilisez le formulaire de contact, Auto BHJ peut traiter les donnees que vous communiquez volontairement.",
    ],
    items: [
      "Nom et prenom",
      "Adresse e-mail",
      "Numero de telephone",
      "Reference du vehicule concerne",
      "Message et moment souhaite pour une visite",
      "Donnees techniques strictement necessaires au bon fonctionnement du site",
    ],
  },
  {
    title: "Finalites",
    body: [
      "Les donnees sont utilisees pour repondre a vos demandes, organiser une visite ou un essai, assurer le suivi commercial demande et proteger le site contre les abus.",
      "Auto BHJ ne vend pas les donnees personnelles des visiteurs.",
    ],
  },
  {
    title: "Base juridique",
    body: [
      "Le traitement repose principalement sur votre demande de contact, l'interet legitime d'Auto BHJ a gerer ses demandes entrantes et, lorsque cela s'applique, le respect d'obligations legales.",
    ],
  },
  {
    title: "Destinataires et sous-traitants",
    body: [
      "Les donnees sont accessibles uniquement aux personnes qui en ont besoin pour traiter votre demande. Elles peuvent aussi etre traitees par des prestataires techniques intervenant pour l'hebergement, la maintenance, la securite, l'e-mail ou les outils de gestion du site.",
      "L'hebergement technique du site est assure par Railway Corporation.",
      "Ces prestataires agissent selon les instructions de Auto BHJ et dans le respect du RGPD.",
    ],
  },
  {
    title: "Transferts hors Union europeenne",
    body: [
      "Auto BHJ privilegie des prestataires situes dans l'Union europeenne ou offrant des garanties reconnues. Si un transfert hors Union europeenne est necessaire, il doit etre encadre par un mecanisme conforme au RGPD, par exemple une decision d'adequation ou des clauses contractuelles types.",
    ],
  },
  {
    title: "Conservation",
    body: [
      "Les demandes de contact sont conservees pendant la duree necessaire au traitement de la demande et au suivi de la relation commerciale. Les donnees liees a une vente effective peuvent etre conservees plus longtemps lorsque la loi comptable, fiscale ou commerciale l'impose.",
    ],
  },
  {
    title: "Vos droits",
    body: [
      "Conformement au RGPD, vous pouvez demander l'acces, la rectification, l'effacement, la limitation, l'opposition au traitement et la portabilite de vos donnees, dans les limites prevues par la loi.",
      "Lorsque le traitement repose sur votre consentement, vous pouvez le retirer a tout moment sans remettre en cause la legalite du traitement effectue avant ce retrait.",
      "Pour exercer vos droits, contactez Auto BHJ a l'adresse contact@autobhj.be. Vous pouvez egalement introduire une reclamation aupres de l'Autorite de protection des donnees en Belgique.",
    ],
  },
  {
    title: "Caractere obligatoire des informations",
    body: [
      "Les informations demandees dans le formulaire sont necessaires pour comprendre votre demande et vous recontacter. Sans ces informations, Auto BHJ peut ne pas etre en mesure de repondre correctement.",
    ],
  },
];

export default function PolitiqueConfidentialitePage() {
  return (
    <LegalPage
      eyebrow="Donnees personnelles"
      title="Politique de confidentialite"
      intro="Cette page explique quelles donnees sont traitees par Auto BHJ et pour quelles raisons."
      updatedAt="19 aout 2026"
      sections={sections}
    />
  );
}
