import Faq from "../../../components/site/Faq";
import { DICT } from "../../../lib/i18n/dict";

export const metadata = {
  title: "FAQ - Questions frequentes sur nos voitures d'occasion",
  description:
    "Les reponses aux questions les plus frequentes sur l'achat d'un vehicule d'occasion chez Auto BHJ : visite, essai, controle, prix, garantie, contact.",
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "FAQ - Auto BHJ",
    description: "Visite, essai, controle, prix, garantie : les reponses avant de venir voir une voiture.",
    url: "https://www.autobhj.be/faq",
    type: "website",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: DICT.fr.faqPage.items.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

export default function FaqPage() {
  const jsonLd = JSON.stringify(faqSchema).replace(/</g, "\\u003c");
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <Faq />
    </>
  );
}
