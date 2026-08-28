import Image from "next/image";
import { BudgetIcon, SchoolIcon, CheckCircleIcon } from "../home/icons";
import SectionEyebrow from "../home/SectionEyebrow";
import Reveal from "../home/Reveal";

const BENEFITS = [
  {
    title: "Budget accessible",
    text: "Des vehicules adaptes a un premier achat.",
    icon: BudgetIcon,
  },
  {
    title: "Pratique au quotidien",
    text: "Ecole, travail, formation ou petits deplacements.",
    icon: SchoolIcon,
  },
  {
    title: "Vehicules revises",
    text: "Pour commencer a conduire avec plus de serenite.",
    icon: CheckCircleIcon,
  },
];

export default function YoungDrivers() {
  return (
    <section className="relative overflow-hidden bg-white py-14 sm:py-16 lg:py-20">
      <div className="absolute inset-y-10 right-6 hidden w-[38%] max-w-[440px] overflow-hidden rounded-2xl lg:block xl:right-12 2xl:right-24">
        <Image
          src="/jeune-conducteur.png"
          alt="Jeune conducteur souriant appuye sur sa premiere voiture, plaque d'apprentissage L sur le toit"
          fill
          sizes="40vw"
          className="object-cover object-[15%_38%]"
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 md:px-10 xl:px-16">
        <div className="max-w-xl lg:pr-[6%]">
          <Reveal>
            <SectionEyebrow>Jeune conducteur</SectionEyebrow>
            <h2 className="mt-2 text-2xl font-bold text-ink">
              Votre premiere voiture, sans exploser votre budget.
            </h2>
            <p className="mt-3 text-[15px] text-body">
              Permis en poche ou encore en apprentissage ? Decouvrez nos petites voitures
              d&apos;occasion selectionnees pour vos premiers kilometres et vos trajets du
              quotidien.
            </p>
          </Reveal>

          {/* Photo : mobile uniquement, entre le texte et les avantages
              (sur desktop, c'est l'image en fond a droite qui joue ce role). */}
          <div className="relative mt-6 aspect-[16/10] overflow-hidden rounded-2xl lg:hidden">
            <Image
              src="/jeune-conducteur.png"
              alt="Jeune conducteur souriant appuye sur sa premiere voiture, plaque d'apprentissage L sur le toit"
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>

          <div className="mt-8 flex flex-col gap-4">
            {BENEFITS.map(({ title, text, icon: Icon }, index) => (
              <Reveal key={title} delay={index * 100} className="flex items-center gap-3">
                <Icon className="h-5 w-5 shrink-0 text-brand" />
                <p className="text-[15px] text-ink">
                  <span className="font-bold">{title}</span>
                  <span className="text-body"> — {text}</span>
                </p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={300} className="mt-8 flex flex-wrap items-center justify-center gap-6 sm:justify-start">
            <a
              href="/stock?price_max=8000"
              className="hidden items-center justify-center rounded-full bg-cta px-10 py-4 text-[14px] font-semibold uppercase tracking-wider text-white transition-colors hover:bg-cta-dark sm:inline-flex"
            >
              Voir les voitures petit budget
            </a>
            <a href="/stock" className="text-[14px] font-semibold text-brand hover:underline">
              Decouvrir notre catalogue
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
