"use client";

import { useEffect, useState } from "react";
import { MailIcon, PhoneIcon, WhatsAppIcon } from "./home/icons";
import { useSiteSettings } from "./SiteSettingsProvider";

function track(action, reference) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("autobhj:conversion", {
      detail: { action, reference, at: new Date().toISOString() },
    })
  );
  window.dataLayer?.push?.({ event: "autobhj_conversion", action, reference });
}

function whatsappHref(number, reference) {
  const message = reference
    ? `Bonjour Auto BHJ, je suis interesse par le vehicule ${reference}.`
    : "Bonjour Auto BHJ, je souhaite des informations sur une voiture.";

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

function mailtoHref(email, reference) {
  const subject = reference ? `Vehicule ${reference}` : "Demande d'information";
  const body = reference
    ? `Bonjour Auto BHJ, je suis interesse par le vehicule ${reference}.`
    : "Bonjour Auto BHJ, je souhaite des informations sur une voiture.";

  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

const CELL =
  "inline-flex min-h-[46px] items-center justify-center gap-2 whitespace-nowrap rounded-full px-3 text-[13px] font-semibold uppercase tracking-wider transition-colors";

// Barre d'action collee en bas, uniquement sur mobile (l'aside de droite
// tient ce role sur desktop).
export default function VehicleStickyBar({ reference }) {
  const { phone, phoneTel, whatsapp, email } = useSiteSettings();
  const [hiddenByFooter, setHiddenByFooter] = useState(false);

  // Une fois le footer a l'ecran, la barre s'efface en douceur pour ne pas
  // le recouvrir (fondu + leger glissement, volontairement discret).
  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer || typeof IntersectionObserver === "undefined") return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => setHiddenByFooter(entry.isIntersecting),
      { root: null, rootMargin: "0px 0px -80px 0px", threshold: 0 }
    );

    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Reserve la place de la barre dans le flux ; se resorbe quand la barre
          disparait au footer, pour ne pas laisser un grand vide. */}
      <div
        aria-hidden="true"
        className={`overflow-hidden transition-[height] duration-500 ease-out lg:hidden ${
          hiddenByFooter ? "h-0" : "h-[calc(9rem+env(safe-area-inset-bottom))]"
        }`}
      />
      <div
        aria-hidden={hiddenByFooter}
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white px-4 pt-2.5 pb-[calc(env(safe-area-inset-bottom)+0.625rem)] shadow-[0_-2px_10px_rgba(0,0,0,0.06)] transition-[opacity,transform] duration-500 ease-out lg:hidden ${
          hiddenByFooter ? "pointer-events-none translate-y-2 opacity-0" : "translate-y-0 opacity-100"
        }`}
      >
      <div className="mx-auto flex max-w-md flex-col gap-2">
        <a
          className={`${CELL} w-full bg-cta-dark text-white hover:bg-cta`}
          href={`tel:${phoneTel}`}
          onClick={() => track("call", reference)}
        >
          <PhoneIcon className="h-[18px] w-[18px]" />
          Appeler
        </a>
        <div className="grid grid-cols-2 gap-2">
          <a
            className={`${CELL} border border-line bg-white text-ink hover:bg-surface`}
            href={mailtoHref(email, reference)}
            onClick={() => track("contact", reference)}
          >
            <MailIcon className="h-[18px] w-[18px]" />
            Contacter
          </a>
          <a
            className={`${CELL} bg-[#25d366] text-white hover:bg-[#1fb958]`}
            href={whatsappHref(whatsapp, reference)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={
              reference
                ? `Ecrire sur WhatsApp au sujet du vehicule ${reference}`
                : "Ecrire sur WhatsApp a Auto BHJ"
            }
            onClick={() => track("whatsapp", reference)}
          >
            <WhatsAppIcon className="h-5 w-5" />
            WhatsApp
          </a>
        </div>
      </div>
      </div>
    </>
  );
}
