"use client";

import { useState } from "react";
import OfficialIcon from "@/components/OfficialIcon";

type FaqItem = {
  question: string;
  answer: string;
};

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Comment se passe la visite d'un vehicule ?",
    answer:
      "Vous prenez rendez-vous par telephone ou WhatsApp. On confirme la disponibilite du vehicule, puis vous venez le voir tranquillement sur place.",
  },
  {
    question: "Puis-je faire un essai routier ?",
    answer:
      "Oui, un essai est possible sur rendez-vous avec votre permis de conduire. L'objectif est de vous laisser verifier la voiture sans pression.",
  },
  {
    question: "Les vehicules sont-ils controles ?",
    answer:
      "Chaque vehicule est verifie avant la mise en vente : etat general, documents, kilometrage et points importants visibles avant la visite.",
  },
  {
    question: "Le prix affiche est-il clair ?",
    answer:
      "Oui. Nous affichons un prix simple et lisible pour que vous puissiez comparer rapidement et avancer sans mauvaise surprise.",
  },
  {
    question: "Proposez-vous une garantie ?",
    answer:
      "Les conditions de garantie dependent du vehicule. Elles sont expliquees clairement avant l'achat afin que tout soit compris par ecrit.",
  },
  {
    question: "Comment vous contacter rapidement ?",
    answer:
      "Le plus simple est de nous appeler au 0483 20 88 01 ou de nous envoyer un message WhatsApp. Nous repondons rapidement aux demandes.",
  },
];

const TRUST_ITEMS = [
  {
    title: "Visite sur rendez-vous",
    text: "Simple et calme",
    icon: "appointment",
  },
  {
    title: "Vehicules controles",
    text: "Informations claires",
    icon: "inspection",
  },
  {
    title: "Equipe a votre ecoute",
    text: "Conseils et accompagnement",
    icon: "contact",
  },
];

function Icon({ name }: { name: string }) {
  const icons: Record<string, string> = {
    question: "contact",
    phone: "phone",
  };

  return <OfficialIcon name={icons[name] || name} width={28} height={28} />;
}

function PlusIcon({ open }: { open: boolean }) {
  return (
    <span className={`faq-red-plus${open ? " is-open" : ""}`} aria-hidden="true">
      +
    </span>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <span className={`faq-red-chevron${open ? " is-open" : ""}`} aria-hidden="true">
      ⌄
    </span>
  );
}

function FAQMonochrome() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="faq-red-section" aria-labelledby="faq-red-title">
      <div className="faq-red-shell">
        <div className="faq-red-copy">
          <p className="faq-red-eyebrow">
            <span />
            FAQ
          </p>
          <h1 id="faq-red-title">
            Questions <span>frequentes</span>
          </h1>
          <p className="faq-red-lede">
            Retrouvez ici les reponses aux questions les plus courantes avant de venir
            voir une voiture.
          </p>

          <aside className="faq-red-contact" aria-label="Contact FAQ">
            <span className="faq-red-contact-icon">
              <Icon name="question" />
            </span>
            <div>
              <h2>Une autre question ?</h2>
              <p>Notre equipe est disponible pour vous repondre rapidement.</p>
            </div>
            <a href="tel:+32483208801" className="faq-red-contact-button">
              <Icon name="phone" />
              Nous contacter
            </a>
          </aside>
        </div>

        <div className="faq-red-list" aria-label="Questions frequentes Auto BHJ">
          {FAQ_ITEMS.map((item, index) => {
            const open = openIndex === index;
            const panelId = `faq-red-panel-${index}`;
            const triggerId = `faq-red-trigger-${index}`;

            return (
              <article className={`faq-red-item${open ? " is-open" : ""}`} key={item.question}>
                <button
                  id={triggerId}
                  type="button"
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex(open ? -1 : index)}
                  className="faq-red-trigger"
                >
                  <PlusIcon open={open} />
                  <span>{item.question}</span>
                  <ChevronIcon open={open} />
                </button>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={triggerId}
                  className="faq-red-panel"
                  hidden={!open}
                >
                  <p>{item.answer}</p>
                </div>
              </article>
            );
          })}
        </div>

        <div className="faq-red-trust" aria-label="Garanties Auto BHJ">
          {TRUST_ITEMS.map((item) => (
            <div className="faq-red-trust-item" key={item.title}>
              <span className="faq-red-trust-icon">
                <Icon name={item.icon} />
              </span>
              <div>
                <strong>{item.title}</strong>
                <span>{item.text}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FAQMonochrome;
export { FAQMonochrome };
