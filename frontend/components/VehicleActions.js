"use client";

const PHONE_TEL = "+32000000000";
const WHATSAPP_NUMBER = "32000000000";

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

export default function VehicleActions({ reference, compact = false }) {
  const contactHref = `/?ref=${reference}&intent=visit#contact`;

  return (
    <div className={compact ? "vehicle-actions compact" : "vehicle-actions"}>
      <a
        className="button primary"
        href={`tel:${PHONE_TEL}`}
        onClick={() => track("call", reference)}
      >
        Appeler
      </a>
      <a
        className="button whatsapp"
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
        WhatsApp
      </a>
      <a
        className="button neutral"
        href={contactHref}
        onClick={() => track("visit_request", reference)}
      >
        {compact ? "Visite" : "Demander une visite"}
      </a>
      <a
        className="button ghost"
        href={contactHref}
        onClick={() => track("contact", reference)}
      >
        Contact
      </a>
    </div>
  );
}
