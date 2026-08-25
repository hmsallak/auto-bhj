import Image from "next/image";
import { RoadIcon, CompassIcon, WarrantyIcon } from "../home/icons";
import SectionEyebrow from "../home/SectionEyebrow";
import Reveal from "../home/Reveal";

const FEATURES = [
  {
    title: "Notre histoire",
    text: "Nee d'une passion commune pour l'automobile, Auto BHJ a ete creee il y a 10 ans par une famille, avec une vision claire : proposer des vehicules de qualite en toute confiance.",
    icon: RoadIcon,
  },
  {
    title: "Notre approche",
    text: "Transparence, ecoute et conseils personnalises. Nous prenons le temps de comprendre vos besoins pour vous proposer le vehicule qui vous correspond.",
    icon: CompassIcon,
  },
  {
    title: "Notre engagement",
    text: "Un accompagnement honnete, du premier contact jusqu'a la remise des cles et meme apres. Votre satisfaction est notre meilleure recompense.",
    icon: WarrantyIcon,
  },
];

export default function AboutUs() {
  return (
    <section className="bg-white py-16" aria-labelledby="about-bhj-title">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 lg:grid-cols-2 lg:items-center">
        <Reveal
          className="relative aspect-[4/3] lg:aspect-[4/5]"
          style={{ clipPath: "polygon(0 0, 100% 0, 100% 88%, 88% 100%, 0 100%)" }}
        >
          <Image src="/header-hero.png" alt="" fill sizes="(max-width: 1024px) 100vw, 44vw" className="object-cover" />
        </Reveal>

        <div>
          <Reveal>
            <SectionEyebrow>A propos de nous</SectionEyebrow>
            <h2 id="about-bhj-title" className="mt-2 text-2xl font-bold text-ink">
              Une entreprise familiale, depuis 10 ans
            </h2>
          </Reveal>

          <div className="mt-8 flex flex-col gap-6">
            {FEATURES.map(({ title, text, icon: Icon }, index) => (
              <Reveal key={title} delay={index * 100} className="flex gap-4">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-pastel text-brand">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-[16px] font-bold text-ink">{title}</h3>
                  <p className="mt-1 text-[15px] text-body">{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
