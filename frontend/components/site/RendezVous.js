"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  CalendarCheckIcon,
  ClockIcon,
  DocumentIcon,
  MessageIcon,
  PhoneIcon,
  PinIcon,
  ShieldIcon,
  WhatsAppIcon,
} from "./icons";

const ADDRESS = "Mekingenweg 99, 1600 Sint-Pieters-Leeuw";
const MAPS_HREF = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`;
const WHATSAPP_HREF = `https://wa.me/32483208801?text=${encodeURIComponent(
  "Bonjour Auto BHJ, je souhaite prendre rendez-vous pour une voiture."
)}`;

const EASE = [0.16, 1, 0.3, 1];

const PROOFS = [
  { icon: ShieldIcon, label: "Visite calme", text: "Sans pression" },
  { icon: DocumentIcon, label: "Infos claires", text: "Transparence totale" },
  { icon: CalendarCheckIcon, label: "Essai possible", text: "Sur rendez-vous" },
];

const DETAILS = [
  { icon: PinIcon, label: "Adresse", value: ADDRESS, href: MAPS_HREF, external: true },
  { icon: ClockIcon, label: "Horaires", value: "Uniquement sur rendez-vous" },
  { icon: MessageIcon, label: "Reponse", value: "Rapide par telephone ou WhatsApp", href: WHATSAPP_HREF, external: true },
];

export default function RendezVous() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="rv-section" aria-label="Prendre rendez-vous" id="contact">
      <motion.div
        className="rv-shell"
        initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <div className="rv-copy">
          <div className="rv-eyebrow">
            <span className="rv-eyebrow-line" />
            Contact
          </div>

          <h2 className="rv-title">
            Venez voir la voiture sur <span>rendez-vous.</span>
          </h2>

          <p className="rv-lede">
            Appelez-nous ou envoyez-nous un message WhatsApp. On confirme le creneau,
            la voiture disponible, et vous venez la voir sans attente.
          </p>

          <div className="rv-proof" aria-label="Avantages du rendez-vous">
            {PROOFS.map((item) => {
              const Icon = item.icon;
              return (
                <span className="rv-proof-item" key={item.label}>
                  <span className="rv-proof-icon" aria-hidden="true">
                    <Icon width="26" height="26" />
                  </span>
                  <span className="rv-proof-text">
                    <strong>{item.label}</strong>
                    <small>{item.text}</small>
                  </span>
                </span>
              );
            })}
          </div>
        </div>

        <div className="rv-card">
          <div className="rv-card-head">
            <span className="rv-card-icon" aria-hidden="true">
              <PhoneIcon width="34" height="34" />
            </span>
            <span className="rv-card-kicker">Contact direct</span>
            <p>Le plus simple : un appel. Sinon, WhatsApp reste ouvert.</p>
          </div>

          <div className="rv-actions">
            <a className="rv-action rv-action-primary" href="tel:+32483208801">
              <PhoneIcon width="20" height="20" />
              <span>0483 20 88 01</span>
            </a>
            <a className="rv-action rv-action-secondary rv-action-whatsapp" href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon width="20" height="20" />
              <span>WhatsApp</span>
            </a>
          </div>

          <div className="rv-info-grid">
            {DETAILS.map((item) => {
              const Icon = item.icon;
              const content = (
                <>
                  <span className="rv-info-icon">
                    <Icon width="24" height="24" />
                  </span>
                  <span className="rv-info-text">
                    <span className="rv-info-label">{item.label}</span>
                    <span className="rv-info-value">{item.value}</span>
                  </span>
                </>
              );

              return item.href ? (
                <a
                  key={item.label}
                  className="rv-info-tile rv-info-link"
                  href={item.href}
                  {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  {content}
                </a>
              ) : (
                <div key={item.label} className="rv-info-tile">
                  {content}
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
