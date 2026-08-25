import Image from "next/image";

export default function Hero() {
  return (
    <section
      className="relative flex min-h-[420px] items-center justify-center overflow-hidden px-6 py-20 sm:min-h-[480px]"
      aria-label="Auto BHJ"
    >
      <Image
        src="/hero-jeunes-conducteurs.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-[center_28%]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-black/50" aria-hidden="true" />

      <div className="relative mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-white [text-shadow:0_2px_20px_rgba(0,0,0,0.35)]">
          Votre voiture d&apos;occasion
          <br />
          au <span className="text-brand-accent">juste prix</span>
        </h1>
        <p className="mt-4 text-[15px] font-normal text-offwhite">
          Des véhicules fiables et révisés pour les jeunes conducteurs, les familles et tous ceux
          qui cherchent une voiture pratique sans dépasser leur budget.
        </p>
      </div>
    </section>
  );
}
