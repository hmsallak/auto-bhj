"use client";

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

const BUTTON_BASE =
  "inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-lg px-4 text-[14px] font-semibold transition-colors";

export default function VehicleActions({ reference, variant = "detail" }) {
  const homeVariant = variant === "home";
  const { phone, phoneTel, whatsapp, email } = useSiteSettings();

  return (
    <div className="flex flex-col gap-3">
      {!homeVariant && (
        <a
          className={`${BUTTON_BASE} border border-line bg-white text-ink hover:bg-surface`}
          href={mailtoHref(email, reference)}
          onClick={() => track("contact", reference)}
        >
          <MailIcon className="h-[18px] w-[18px]" />
          Contacter
        </a>
      )}
      <a
        className={`${BUTTON_BASE} border border-line bg-white text-ink hover:bg-surface`}
        href={`tel:${phoneTel}`}
        onClick={() => track("call", reference)}
      >
        <PhoneIcon className="h-[18px] w-[18px]" />
        {phone}
      </a>
      <a
        className={`${BUTTON_BASE} bg-[#25d366] text-white hover:bg-[#1fb958]`}
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
  );
}
