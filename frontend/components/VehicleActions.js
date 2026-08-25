"use client";

import { MailIcon, PhoneIcon, WhatsAppIcon } from "./home/icons";

const PHONE_TEL = "+32483208801";
const PHONE_DISPLAY = "0483 20 88 01";
const WHATSAPP_NUMBER = "32483208801";

function track(action, reference) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("autobhj:conversion", {
      detail: { action, reference, at: new Date().toISOString() },
    })
  );
  window.dataLayer?.push?.({ event: "autobhj_conversion", action, reference });
}

function whatsappHref(reference) {
  const message = reference
    ? `Bonjour Auto BHJ, je suis interesse par le vehicule ${reference}.`
    : "Bonjour Auto BHJ, je souhaite des informations sur une voiture.";

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

const BUTTON_BASE =
  "inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-lg px-4 text-[14px] font-semibold transition-colors";

export default function VehicleActions({ reference, variant = "detail" }) {
  const contactHref = `/?ref=${reference}&intent=visit#contact`;
  const homeVariant = variant === "home";

  return (
    <div className="flex flex-col gap-3">
      {!homeVariant && (
        <a
          className={`${BUTTON_BASE} border border-line bg-white text-ink hover:bg-surface`}
          href={contactHref}
          onClick={() => track("contact", reference)}
        >
          <MailIcon className="h-[18px] w-[18px]" />
          Contacter
        </a>
      )}
      <a
        className={`${BUTTON_BASE} border border-line bg-white text-ink hover:bg-surface`}
        href={`tel:${PHONE_TEL}`}
        onClick={() => track("call", reference)}
      >
        <PhoneIcon className="h-[18px] w-[18px]" />
        {PHONE_DISPLAY}
      </a>
      <a
        className={`${BUTTON_BASE} bg-[#25d366] text-white hover:bg-[#1fb958]`}
        href={whatsappHref(reference)}
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
      <a
        className={`${BUTTON_BASE} bg-brand text-white hover:bg-brand-dark`}
        href={contactHref}
        onClick={() => track("visit_request", reference)}
      >
        {homeVariant ? "Visite" : "Demander une visite"}
      </a>
    </div>
  );
}
