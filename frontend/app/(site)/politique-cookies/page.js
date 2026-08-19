import LegalPage from "../../../components/site/LegalPage";

export const metadata = {
  title: "Politique cookies - Auto BHJ",
  description: "Informations sur les cookies et technologies similaires du site Auto BHJ.",
};

const sections = [
  {
    title: "Qu'est-ce qu'un cookie ?",
    body: [
      "Un cookie est un petit fichier enregistre sur votre appareil lorsqu'un site web est consulte. Il peut servir au fonctionnement technique du site, a la securite ou a la mesure d'audience.",
    ],
  },
  {
    title: "Cookies utilises par le site",
    body: [
      "Le site public d'Auto BHJ utilise uniquement les cookies et donnees techniques necessaires a son bon fonctionnement, sauf activation ulterieure d'outils de mesure d'audience ou de publicite.",
      "L'espace admin peut utiliser un cookie de session pour maintenir la connexion d'un administrateur autorise.",
    ],
  },
  {
    title: "Mesure d'audience et suivi",
    body: [
      "Certaines actions du site peuvent preparer des evenements de conversion cote navigateur, par exemple une demande de contact, un appel ou un clic WhatsApp. Ces evenements ne doivent etre transmis a un outil externe d'analyse ou de publicite que si la configuration du site le prevoit.",
      "Si des cookies analytiques, publicitaires, pixels ou autres traceurs non strictement necessaires sont ajoutes, le site devra demander un consentement prealable, libre, specifique, informe et actif, avec une possibilite de refus et de retrait aussi simple que l'acceptation.",
    ],
  },
  {
    title: "Gestion des cookies",
    body: [
      "Vous pouvez bloquer ou supprimer les cookies depuis les parametres de votre navigateur. Le blocage de certains cookies techniques peut limiter l'acces a certaines fonctions, notamment l'administration du site.",
    ],
  },
  {
    title: "Evolution de cette politique",
    body: [
      "Cette politique sera mise a jour si de nouveaux outils de suivi, de publicite, de mesure d'audience ou d'integration externe sont ajoutes au site.",
    ],
  },
];

export default function PolitiqueCookiesPage() {
  return (
    <LegalPage
      eyebrow="Cookies"
      title="Politique cookies"
      intro="Cette page decrit l'utilisation des cookies et technologies similaires sur le site Auto BHJ."
      updatedAt="19 aout 2026"
      sections={sections}
    />
  );
}
