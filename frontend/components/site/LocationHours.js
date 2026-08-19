import { PinIcon, PhoneIcon, MailIcon, ClockIcon } from "./icons";
import ContactForm from "./ContactForm";

const WHATSAPP_NUMBER = "32000000000";
const WHATSAPP_MESSAGE =
  "Bonjour Auto BHJ, je souhaite prendre rendez-vous pour une voiture.";
const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  WHATSAPP_MESSAGE
)}`;

export default function LocationHours() {
  return (
    <section className="section contact reveal" id="contact">
      <div>
        <p className="eyebrow">Contact</p>
        <h2>Une voiture vous interesse ?</h2>
        <p>
          Laissez-nous un message ou appelez directement Auto BHJ pour une
          visite ou un essai. Mentionnez la reference de la voiture pour aller
          plus vite.
        </p>

        <ContactForm />
      </div>

      <div className="contact-card">
        <strong>Auto BHJ</strong>
        <span className="contact-line">
          <PinIcon /> Mekingenweg 99, 1600 Sint-Pieters-Leeuw, Belgique
        </span>
        <span className="contact-line">
          <PhoneIcon /> +32 000 00 00 00
        </span>
        <span className="contact-line">
          <MailIcon /> contact@autobhj.be
        </span>
        <span className="contact-line">
          <ClockIcon /> Sur rendez-vous - appelez pour convenir d'un horaire
        </span>
        <a className="button primary" href="tel:+32000000000">
          Appeler Auto BHJ
        </a>
        <a
          className="button whatsapp"
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Ecrire sur WhatsApp a Auto BHJ"
        >
          Ecrire sur WhatsApp
        </a>
      </div>
    </section>
  );
}
