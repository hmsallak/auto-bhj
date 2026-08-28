import Image from "next/image";
import { FamilyIcon, ShieldIcon, CompassIcon, CarIcon, CheckCircleIcon } from "../home/icons";
import Reveal from "../home/Reveal";

const POINTS = [
  "Vehicules selectionnes avec soin",
  "Prix justes et transparents",
  "Conseils honnetes et personnalises",
];

const PILLARS = [
  {
    icon: FamilyIcon,
    title: "Entreprise familiale",
    text: "Une equipe passionnee a votre ecoute.",
  },
  {
    icon: ShieldIcon,
    title: "Confiance & transparence",
    text: "Des informations claires et un accompagnement honnete.",
  },
  {
    icon: CompassIcon,
    title: "Accompagnement",
    text: "Nous vous guidons avant, pendant et apres l'achat.",
  },
  {
    icon: CarIcon,
    title: "Vehicules fiables",
    text: "Controles et prepares pour rouler en toute serenite.",
  },
];

export default function AboutUs() {
  return (
    <section className="bg-offwhite py-14 sm:py-16 lg:py-20" aria-labelledby="about-bhj-title">
      <div className="mx-auto max-w-6xl px-6 md:px-10 xl:px-16">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-[13px] font-bold uppercase tracking-[0.16em] text-brand">
            A propos de nous
          </p>
          <span className="mx-auto mt-2 block h-[3px] w-10 rounded-full bg-brand" aria-hidden="true" />
          <h2 id="about-bhj-title" className="mt-3 font-extrabold text-ink sm:mt-4">
            Auto BHJ, votre partenaire de confiance
          </h2>
          {/* Redondant avec le 1er paragraphe : masque sur mobile pour raccourcir. */}
          <p className="mt-4 hidden text-[15px] leading-relaxed text-body sm:block">
            Une entreprise familiale passionnee par l'automobile et engagee a vous proposer des
            vehicules d'occasion fiables au juste prix.
          </p>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:mt-10 lg:grid-cols-2 lg:items-center lg:gap-12">
          {/* Photo a gauche, sans bordure ni coins arrondis. Cadrage plus bas
              sur mobile pour reduire le scroll. */}
          <Reveal>
            <Image
              src="/apropos-auto-bhj.jpg"
              alt="Le hall d'exposition Auto BHJ"
              width={1600}
              height={1200}
              sizes="(max-width: 1024px) 100vw, 540px"
              className="aspect-[16/10] w-full object-cover sm:aspect-[4/3] lg:aspect-[5/4]"
            />
          </Reveal>

          {/* Texte a droite, sans cadre ni fond */}
          <Reveal delay={100}>
            <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-brand">
              Qui sommes-nous ?
            </p>
            <h3
              className="mt-2 font-bold text-ink sm:mt-3"
              style={{ fontSize: "clamp(19px, 2.4vw, 26px)", lineHeight: 1.3 }}
            >
              Une entreprise familiale a votre service depuis{" "}
              <span className="text-brand">plus de 10 ans</span>.
            </h3>

            <div className="mt-3 flex flex-col gap-2.5 text-[14px] leading-relaxed text-body sm:mt-4 sm:gap-3 sm:text-[15px]">
              <p>
                Chez Auto BHJ, nous croyons qu'acheter une voiture doit rester simple, transparent et
                accessible.
              </p>
              <p>
                C'est pourquoi nous selectionnons avec soin chaque vehicule afin de vous proposer le{" "}
                <strong className="font-semibold text-ink">meilleur rapport qualite/prix</strong>.
              </p>
              <p>
                Que vous soyez jeune conducteur, une famille ou simplement a la recherche d'un
                vehicule fiable pour votre quotidien, nous sommes la pour vous accompagner a chaque
                etape.
              </p>
            </div>

            {/* Points de reassurance : masques sur mobile pour raccourcir. */}
            <div className="mt-6 hidden gap-3 border-t border-line pt-5 sm:grid sm:grid-cols-3">
              {POINTS.map((point) => (
                <p key={point} className="flex items-start gap-2 text-[13px] text-body">
                  <CheckCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                  {point}
                </p>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Piliers de confiance : 2 colonnes des le mobile pour eviter 4 lignes. */}
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-5 border-t border-line pt-6 sm:mt-12 sm:gap-x-6 sm:gap-y-6 sm:pt-8 lg:grid-cols-4">
          {PILLARS.map(({ icon: Icon, title, text }, index) => (
            <Reveal key={title} delay={index * 80} className="flex items-start gap-2.5 sm:gap-3">
              <Icon className="mt-0.5 h-5 w-5 shrink-0 text-brand sm:h-6 sm:w-6" />
              <div>
                <p className="text-[13px] font-bold text-ink sm:text-[14px]">{title}</p>
                <p className="mt-0.5 text-[12px] leading-relaxed text-body sm:text-[13px]">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
