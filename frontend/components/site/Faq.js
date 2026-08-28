"use client";

import { useState } from "react";
import { ChevronDownIcon, PhoneIcon, CalendarIcon, ShieldIcon, MailIcon } from "../home/icons";
import SectionEyebrow from "../home/SectionEyebrow";
import Reveal from "../home/Reveal";

const FAQ_ITEMS = [
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
  { title: "Visite sur rendez-vous", text: "Simple et calme", icon: CalendarIcon },
  { title: "Vehicules controles", text: "Informations claires", icon: ShieldIcon },
  { title: "Equipe a votre ecoute", text: "Conseils et accompagnement", icon: MailIcon },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Reveal>
            <SectionEyebrow>FAQ</SectionEyebrow>
            <h1 className="mt-2 text-3xl font-bold text-ink sm:text-4xl">Questions frequentes</h1>
            <p className="mt-3 text-[15px] text-body">
              Retrouvez ici les reponses aux questions les plus courantes avant de venir voir une voiture.
            </p>
          </Reveal>

          <Reveal delay={100} className="mt-8 rounded-2xl border border-line bg-white p-6">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-pastel text-brand">
              <MailIcon className="h-6 w-6" />
            </span>
            <h2 className="mt-4 text-[16px] font-bold text-ink">Une autre question ?</h2>
            <p className="mt-1 text-[14px] text-body">
              Notre equipe est disponible pour vous repondre rapidement.
            </p>
            <a
              href="tel:+32483208801"
              className="mt-4 inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-cta px-4 text-[14px] font-semibold uppercase tracking-wider text-white transition-colors hover:bg-cta-dark"
            >
              <PhoneIcon className="h-4 w-4" />
              Nous contacter
            </a>
          </Reveal>

          <div className="mt-6 flex flex-col gap-4">
            {TRUST_ITEMS.map(({ title, text, icon: Icon }, index) => (
              <Reveal key={title} delay={200 + index * 100} className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-pastel text-brand">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="flex flex-col">
                  <strong className="text-[14px] font-bold text-ink">{title}</strong>
                  <span className="text-[13px] text-subtle">{text}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:col-span-2" aria-label="Questions frequentes Auto BHJ">
          {FAQ_ITEMS.map((item, index) => {
            const open = openIndex === index;
            const panelId = `faq-panel-${index}`;
            const triggerId = `faq-trigger-${index}`;

            return (
              <div key={item.question} className="rounded-2xl border border-line bg-white">
                <button
                  id={triggerId}
                  type="button"
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex(open ? -1 : index)}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 p-5 text-left"
                >
                  <span className="text-[16px] font-bold text-ink">{item.question}</span>
                  <ChevronDownIcon
                    className={`h-4 w-4 shrink-0 text-subtle transition-transform ${open ? "rotate-180" : ""}`}
                  />
                </button>
                {open && (
                  <div id={panelId} role="region" aria-labelledby={triggerId} className="px-5 pb-5">
                    <p className="text-[15px] leading-relaxed text-body">{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
