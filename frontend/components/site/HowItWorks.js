import { SearchIcon, SteeringWheelIcon, DocumentCheckIcon, KeyIcon } from "../home/icons";
import SectionEyebrow from "../home/SectionEyebrow";
import Reveal from "../home/Reveal";

const STEPS = [
  {
    number: "01",
    icon: SearchIcon,
    title: "Découvrez le véhicule",
    text: "Consultez les informations du véhicule sur notre site puis contactez-nous pour organiser une visite.",
  },
  {
    number: "02",
    icon: SteeringWheelIcon,
    title: "Visitez & essayez",
    text: "Examinez tranquillement le véhicule et effectuez un essai, sans pression commerciale.",
    cta: { label: "Planifier une visite", href: "/#contact" },
  },
  {
    number: "03",
    icon: DocumentCheckIcon,
    title: "Contrôle technique",
    text: "Le véhicule suit les formalités nécessaires et passe au controle technique avant la vente.",
  },
  {
    number: "04",
    icon: KeyIcon,
    title: "Votre voiture est prête",
    text: "Documents prépares, remise des clés : il ne reste plus qu'à prendre la route.",
  },
];

function StepMarker({ icon: Icon }) {
  return (
    <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center bg-white">
      <Icon className="h-7 w-7 text-brand" />
    </div>
  );
}

export default function HowItWorks() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="max-w-2xl">
          <SectionEyebrow>Le parcours</SectionEyebrow>
          <h2 className="mt-2 text-2xl font-bold text-ink">Comment ça se passe ?</h2>
        </Reveal>

        <div className="relative mt-14 hidden lg:grid lg:grid-cols-4 lg:gap-8">
          <div className="absolute left-7 right-7 top-7 h-px bg-line" aria-hidden="true" />
          {STEPS.map(({ number, icon, title, text, cta }, index) => (
            <Reveal key={number} delay={index * 100} className="relative flex flex-col items-start">
              <StepMarker icon={icon} />
              <span className="mt-4 text-[13px] font-bold text-brand">{number}</span>
              <h3 className="mt-1 text-[16px] font-bold text-ink">{title}</h3>
              <p className="mt-1.5 text-[14px] text-body">{text}</p>
              {cta && (
                <a href={cta.href} className="mt-3 text-[13px] font-semibold text-brand hover:underline">
                  {cta.label}
                </a>
              )}
            </Reveal>
          ))}
        </div>

        <div className="relative mt-10 flex flex-col gap-8 lg:hidden">
          <div className="absolute bottom-7 left-7 top-7 w-px bg-line" aria-hidden="true" />
          {STEPS.map(({ number, icon, title, text, cta }, index) => (
            <Reveal key={number} delay={index * 100} className="relative flex gap-4">
              <StepMarker icon={icon} />
              <div className="pt-1">
                <span className="text-[13px] font-bold text-brand">{number}</span>
                <h3 className="mt-0.5 text-[16px] font-bold text-ink">{title}</h3>
                <p className="mt-1.5 text-[14px] text-body">{text}</p>
                {cta && (
                  <a href={cta.href} className="mt-3 inline-block text-[13px] font-semibold text-brand hover:underline">
                    {cta.label}
                  </a>
                )}
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-14 flex flex-col items-center gap-6 text-center">
          <p className="max-w-xl text-[15px] text-body">
            De la première visite à la remise des clés, nous vous accompagnons simplement et en
            toute transparence.
          </p>
          <a
            href="/stock"
            className="inline-flex min-h-[48px] items-center justify-center rounded-lg bg-brand px-8 text-[14px] font-semibold text-white transition-colors hover:bg-brand-dark"
          >
            Découvrir nos véhicules
          </a>
        </Reveal>
      </div>
    </section>
  );
}
