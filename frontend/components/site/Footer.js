import Image from "next/image";
import { PinIcon, PhoneIcon, MailIcon } from "./icons";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <a className="brand" href="/">
            <Image className="brand-logo" src="/logo.png" alt="Auto BHJ" width={2048} height={768} />
          </a>
          <p>Vehicules d'occasion controles, a Sint-Pieters-Leeuw.</p>
        </div>

        <div className="footer-col">
          <h4>Navigation</h4>
          <a href="/stock">Stock</a>
          <a href="/#a-propos">A propos</a>
          <a href="/#pourquoi">Pourquoi nous choisir</a>
          <a href="/#services">Services</a>
          <a href="/#faq">Questions frequentes</a>
          <a href="/#contact">Contact</a>
        </div>

        <div className="footer-col">
          <h4>Contact</h4>
          <span className="contact-line">
            <PinIcon /> Mekingenweg 99, 1600 Sint-Pieters-Leeuw
          </span>
          <span className="contact-line">
            <PhoneIcon /> +32 000 00 00 00
          </span>
          <span className="contact-line">
            <MailIcon /> contact@autobhj.be
          </span>
        </div>

        <div className="footer-col">
          <h4>Informations legales</h4>
          <a href="/mentions-legales">Mentions legales</a>
          <a href="/politique-confidentialite">Politique de confidentialite</a>
          <a href="/politique-cookies">Politique cookies</a>
          <a href="/conditions-generales">Conditions generales</a>
          <span>Auto BHJ SRL - TVA BE 0801.303.538</span>
          <span>Mekingenweg 99, 1600 Sint-Pieters-Leeuw</span>
        </div>
      </div>

      <div className="footer-bottom">
        <span>&copy; {year} Auto BHJ SRL. Tous droits reserves.</span>
        <span>TVA BE 0801.303.538</span>
      </div>
    </footer>
  );
}
