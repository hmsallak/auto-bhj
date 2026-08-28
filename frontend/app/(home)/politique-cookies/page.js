import LegalPage from "../../../components/site/LegalPage";

export const metadata = {
  title: "Politique cookies",
  description: "Informations sur les cookies et technologies similaires utilises par le site Auto BHJ.",
  alternates: { canonical: "/politique-cookies" },
};

const content = {
  updatedAt: "19 aout 2026",
  fr: {
    eyebrow: "Cookies",
    title: "Politique cookies",
    intro:
      "Cette page decrit l'utilisation des cookies et technologies similaires sur le site Auto BHJ.",
    sections: [
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
    ],
  },
  nl: {
    eyebrow: "Cookies",
    title: "Cookiebeleid",
    intro:
      "Deze pagina beschrijft het gebruik van cookies en soortgelijke technologieen op de site van Auto BHJ.",
    sections: [
      {
        title: "Wat is een cookie?",
        body: [
          "Een cookie is een klein bestand dat op uw toestel wordt opgeslagen wanneer u een website bezoekt. Het kan dienen voor de technische werking van de site, de beveiliging of de meting van het bezoek.",
        ],
      },
      {
        title: "Cookies die de site gebruikt",
        body: [
          "De publieke site van Auto BHJ gebruikt uitsluitend de cookies en technische gegevens die nodig zijn voor de goede werking, tenzij later hulpmiddelen voor bezoekmeting of reclame worden geactiveerd.",
          "De adminomgeving kan een sessiecookie gebruiken om de verbinding van een gemachtigde beheerder te behouden.",
        ],
      },
      {
        title: "Bezoekmeting en tracking",
        body: [
          "Bepaalde acties op de site kunnen conversiegebeurtenissen aan de browserzijde voorbereiden, bijvoorbeeld een contactaanvraag, een oproep of een WhatsApp-klik. Die gebeurtenissen worden pas naar een externe analyse- of reclametool doorgestuurd als de configuratie van de site dit voorziet.",
          "Als analytische of reclamecookies, pixels of andere niet strikt noodzakelijke trackers worden toegevoegd, zal de site een voorafgaande, vrije, specifieke, geinformeerde en actieve toestemming vragen, met een mogelijkheid tot weigering en intrekking die even eenvoudig is als de aanvaarding.",
        ],
      },
      {
        title: "Cookies beheren",
        body: [
          "U kunt cookies blokkeren of verwijderen via de instellingen van uw browser. Het blokkeren van bepaalde technische cookies kan de toegang tot sommige functies beperken, met name het beheer van de site.",
        ],
      },
      {
        title: "Wijziging van dit beleid",
        body: [
          "Dit beleid wordt bijgewerkt als nieuwe hulpmiddelen voor tracking, reclame, bezoekmeting of externe integratie aan de site worden toegevoegd.",
        ],
      },
    ],
  },
};

export default function PolitiqueCookiesPage() {
  return <LegalPage content={content} />;
}
