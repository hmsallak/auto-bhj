import LegalPage from "../../../components/site/LegalPage";

export const metadata = {
  title: "Conditions generales - Auto BHJ",
  description: "Conditions generales applicables aux demandes et ventes de vehicules Auto BHJ.",
};

const sections = [
  {
    title: "Objet",
    body: [
      "Les presentes conditions generales encadrent l'utilisation du site Auto BHJ et les demandes relatives aux vehicules d'occasion presentes en ligne.",
      "Elles ne remplacent pas les documents contractuels remis lors d'une vente effective.",
    ],
  },
  {
    title: "Informations vehicules",
    body: [
      "Auto BHJ met en ligne des informations sur les vehicules disponibles : prix, photos, kilometrage, annee, motorisation, equipements et etat de disponibilite.",
      "Ces informations sont fournies avec soin mais doivent toujours etre confirmees avant toute decision d'achat. Le stock peut evoluer rapidement.",
    ],
  },
  {
    title: "Prix",
    body: [
      "Les prix affiches sont indiques en euros. Sauf mention contraire sur la fiche du vehicule ou dans un document contractuel, ils ne constituent pas une offre definitive et peuvent etre corriges en cas d'erreur manifeste.",
    ],
  },
  {
    title: "Reservation, acompte et paiement",
    body: [
      "Lorsqu'une reservation ou un acompte est propose, ses conditions sont confirmees par ecrit avant paiement : vehicule concerne, montant, duree de validite, consequences d'une annulation et mode de paiement accepte.",
      "Aucun paiement ne doit etre considere comme definitif sans confirmation ecrite de Auto BHJ.",
    ],
  },
  {
    title: "Visite et essai",
    body: [
      "Les visites et essais se font sur rendez-vous. Auto BHJ peut demander une confirmation d'identite et un permis de conduire valide avant un essai.",
    ],
  },
  {
    title: "Enlevement ou livraison",
    body: [
      "Les modalites d'enlevement du vehicule, de remise des documents et, le cas echeant, de livraison sont precisees avant la conclusion de la vente.",
    ],
  },
  {
    title: "Garantie et conformite",
    body: [
      "Les garanties applicables dependent du vehicule, de son usage, du statut de l'acheteur et des documents conclus lors de la vente.",
      "Les conditions de garantie sont precisees avant la conclusion de la vente et indiquees dans les documents contractuels lorsque cela s'applique.",
    ],
  },
  {
    title: "Droit de retractation",
    body: [
      "Le site ne permet pas d'acheter directement un vehicule en ligne. Si un contrat a distance devait etre conclu avec un consommateur, les informations precontractuelles et les regles applicables au droit de retractation seraient communiquees avant la conclusion du contrat.",
    ],
  },
  {
    title: "Droit applicable",
    body: [
      "Le site et les relations avec Auto BHJ sont soumis au droit belge, sous reserve des dispositions imperatives applicables aux consommateurs.",
    ],
  },
  {
    title: "Litiges consommateurs",
    body: [
      "En cas de question ou de reclamation, le client est invite a contacter Auto BHJ en priorite afin de rechercher une solution amiable. Les droits imperatifs du consommateur restent applicables.",
    ],
  },
  {
    title: "Contact",
    body: [
      "Pour toute question relative aux presentes conditions, contactez Auto BHJ a l'adresse contact@autobhj.be.",
    ],
  },
];

export default function ConditionsGeneralesPage() {
  return (
    <LegalPage
      eyebrow="Conditions"
      title="Conditions generales"
      intro="Les conditions applicables a l'utilisation du site et aux demandes concernant les vehicules presentes par Auto BHJ."
      updatedAt="19 aout 2026"
      sections={sections}
    />
  );
}
