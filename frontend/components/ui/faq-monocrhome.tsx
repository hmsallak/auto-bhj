"use client";

import { useState } from "react";

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
    icon: "clock",
  },
  {
    title: "Vehicules controles",
    text: "Informations claires",
    icon: "shield",
  },
  {
    title: "Equipe a votre ecoute",
    text: "Conseils et accompagnement",
    icon: "headset",
  },
];

function Icon({ name }: { name: string }) {
  if (name === "question") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 17h.01" />
        <path d="M9.2 9a3 3 0 1 1 5.1 2.1c-.9.8-1.6 1.3-1.8 2.7" />
        <path d="M21 11.5a8.5 8.5 0 0 1-12.3 7.6L3 21l1.9-5.5A8.5 8.5 0 1 1 21 11.5Z" />
      </svg>
    );
  }

  if (name === "phone") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 5c0 8.8 6.2 15 15 15l2-3.5-5-2-2 2c-2-1-4-3-5-5l2-2-2-5L5 4Z" />
      </svg>
    );
  }

  if (name === "shield") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    );
  }

  if (name === "headset") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 13v-1a8 8 0 0 1 16 0v1" />
        <rect x="3" y="13" width="4" height="6" rx="1.5" />
        <rect x="17" y="13" width="4" height="6" rx="1.5" />
        <path d="M19 19a5 5 0 0 1-5 3h-2" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  );
}

function PlusIcon({ open }: { open: boolean }) {
  return (
    <span className={`faq-red-plus${open ? " is-open" : ""}`} aria-hidden="true">
      <svg viewBox="0 0 24 24">
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </svg>
    </span>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <span className={`faq-red-chevron${open ? " is-open" : ""}`} aria-hidden="true">
      <svg viewBox="0 0 24 24">
        <path d="M6 9l6 6 6-6" />
      </svg>
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
