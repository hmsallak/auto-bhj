"use client";

const PHONE_TEL = "+32483208801";
const PHONE_DISPLAY = "0483 20 88 01";
const WHATSAPP_NUMBER = "32483208801";

function MailIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3.5 6.5 12 13l8.5-6.5" />
    </svg>
  );
}

function PhoneIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.3 1.2.4 2.5.6 3.8.6.6 0 1 .5 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.6.6 3.8.1.4 0 .8-.3 1.1L6.6 10.8Z" />
    </svg>
  );
}

function WhatsAppIcon(props) {
  return (
    <svg viewBox="0 0 32 32" width="20" height="20" fill="currentColor" {...props}>
      <path d="M16.01 3C9.38 3 4 8.37 4 15c0 2.23.62 4.32 1.7 6.11L4 29l8.1-1.66A11.9 11.9 0 0 0 16.01 27C22.63 27 28 21.63 28 15S22.63 3 16.01 3Zm0 21.7c-1.86 0-3.6-.5-5.1-1.38l-.37-.22-4.8.98.99-4.68-.24-.38A9.62 9.62 0 0 1 6.3 15c0-5.35 4.36-9.7 9.71-9.7 5.34 0 9.7 4.35 9.7 9.7s-4.36 9.7-9.7 9.7Zm5.34-7.28c-.29-.15-1.73-.86-2-.95-.27-.1-.46-.15-.66.15-.2.29-.76.95-.93 1.14-.17.2-.34.22-.63.07-.29-.15-1.22-.45-2.33-1.44-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.51.15-.17.2-.29.29-.49.1-.2.05-.37-.02-.51-.07-.15-.66-1.59-.9-2.18-.24-.57-.48-.49-.66-.5h-.56c-.2 0-.51.07-.78.37-.27.29-1.02 1-1.02 2.44s1.05 2.83 1.19 3.02c.15.2 2.07 3.16 5.02 4.43.7.3 1.25.48 1.68.62.7.22 1.34.19 1.85.12.56-.08 1.73-.71 1.98-1.39.24-.68.24-1.27.17-1.39-.07-.13-.26-.2-.55-.35Z" />
    </svg>
  );
}

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
          <MailIcon />
          Contacter
        </a>
      )}
      <a
        className="button neutral icon-button"
        href={`tel:${PHONE_TEL}`}
        onClick={() => track("call", reference)}
      >
        <PhoneIcon />
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
        <WhatsAppIcon />
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
