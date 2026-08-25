import Image from "next/image";
import { PinIcon, PhoneIcon, MailIcon } from "./icons";

export default function HomeFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-ink">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-3">
          <a href="/" className="w-fit">
            <Image src="/logo-auto-bhj-footer.png" alt="Auto BHJ" width={350} height={200} className="h-16 w-auto" />
          </a>
          <p className="text-[15px] text-white">
            Véhicules d&apos;occasion contrôlés, à Sint-Pieters-Leeuw.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="text-[15px] font-bold text-white">Navigation</h4>
          <a href="/" className="text-[15px] text-white transition-colors hover:text-brand-accent">
            Accueil
          </a>
          <a href="/#stock" className="text-[15px] text-white transition-colors hover:text-brand-accent">
            Stock
          </a>
          <a href="/faq" className="text-[15px] text-white transition-colors hover:text-brand-accent">
            FAQ
          </a>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="text-[15px] font-bold text-white">Contact</h4>
          <span className="inline-flex items-center gap-2 text-[15px] text-white">
            <PinIcon className="h-4 w-4 shrink-0 text-brand-accent" /> Mekingenweg 99, 1600 Sint-Pieters-Leeuw
          </span>
          <span className="inline-flex items-center gap-2 text-[15px] text-white">
            <PhoneIcon className="h-4 w-4 shrink-0 text-brand-accent" /> +32 483 20 88 01
          </span>
          <span className="inline-flex items-center gap-2 text-[15px] text-white">
            <MailIcon className="h-4 w-4 shrink-0 text-brand-accent" /> contact@autobhj.be
          </span>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="text-[15px] font-bold text-white">Informations légales</h4>
          <a href="/mentions-legales" className="text-[15px] text-white transition-colors hover:text-brand-accent">
            Mentions légales
          </a>
          <a
            href="/politique-confidentialite"
            className="text-[15px] text-white transition-colors hover:text-brand-accent"
          >
            Politique de confidentialité
          </a>
          <a href="/politique-cookies" className="text-[15px] text-white transition-colors hover:text-brand-accent">
            Politique cookies
          </a>
          <a
            href="/conditions-generales"
            className="text-[15px] text-white transition-colors hover:text-brand-accent"
          >
            Conditions générales
          </a>
          <span className="text-[15px] text-white">Auto BHJ SRL - TVA BE 0801.303.538</span>
        </div>
      </div>

      <div className="border-t border-white/10 px-6 py-5">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 text-[13px] text-white sm:flex-row sm:items-center sm:justify-between">
          <span>&copy; {year} Auto BHJ SRL. Tous droits réservés.</span>
          <span>TVA BE 0801.303.538</span>
        </div>
      </div>
    </footer>
  );
}
