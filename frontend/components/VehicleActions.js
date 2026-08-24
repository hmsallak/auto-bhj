"use client";

import OfficialIcon from "./OfficialIcon";

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

export default function VehicleActions({ reference, variant = "detail" }) {
  const contactHref = `/?ref=${reference}&intent=visit#contact`;
  const homeVariant = variant === "home";

  return (
    <div className={homeVariant ? "vehicle-actions home-vehicle-actions" : "vehicle-actions"}>
      {!homeVariant && (
        <a
          className="button navy icon-button"
          href={contactHref}
          onClick={() => track("contact", reference)}
        >
          <OfficialIcon name="contact" width={18} height={18} />
          Contacter
        </a>
      )}
      <a
        className="button neutral icon-button"
        href={`tel:${PHONE_TEL}`}
        onClick={() => track("call", reference)}
      >
        <OfficialIcon name="phone" width={18} height={18} />
        {PHONE_DISPLAY}
      </a>
      <a
        className="button whatsapp-banner icon-button"
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
        <OfficialIcon name="whatsapp" width={20} height={20} />
        WhatsApp
      </a>
      <a
        className="button neutral"
        href={contactHref}
        onClick={() => track("visit_request", reference)}
      >
        {homeVariant ? "Visite" : "Demander une visite"}
      </a>
    </div>
  );
}
