"use client";

import Image from "next/image";
import { useT } from "../../lib/i18n";

export default function Hero() {
  const t = useT();

  return (
    <section
      className="relative flex min-h-[420px] items-center justify-center overflow-hidden px-6 py-20 sm:min-h-[480px] md:px-10 xl:px-16"
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
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.45),0_4px_24px_rgba(0,0,0,0.5)]">
          {t("hero.title1")}
          <br />
          {t("hero.title2")}
        </h1>
        <p className="mt-4 text-[15px] font-normal text-offwhite">{t("hero.subtitle")}</p>
      </div>
    </section>
  );
}
