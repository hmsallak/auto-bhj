"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  CalendarCheckIcon,
  DocumentIcon,
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

const CONTACTS = [
  { icon: PhoneIcon, label: "0483 20 88 01", text: "Appel direct", href: "tel:+32483208801" },
  { icon: WhatsAppIcon, label: "WhatsApp", text: "Message rapide", href: WHATSAPP_HREF, external: true },
  { icon: PinIcon, label: ADDRESS, text: "Sur rendez-vous", href: MAPS_HREF, external: true },
];

const PROOFS = [
  { icon: ShieldIcon, label: "Visite calme", text: "Sans pression" },
  { icon: DocumentIcon, label: "Infos claires", text: "Transparence totale" },
  { icon: CalendarCheckIcon, label: "Essai possible", text: "Sur rendez-vous" },
];

function ProofRow({ items, ariaLabel }) {
  return (
    <div className="rv-proof" aria-label={ariaLabel}>
      {items.map((item) => {
        const Icon = item.icon;
        const Tag = item.href ? "a" : "span";
        return (
          <Tag
            className="rv-proof-item"
            key={item.label}
            href={item.href}
            {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            <span className="rv-proof-icon" aria-hidden="true">
              <Icon width="26" height="26" />
            </span>
            <span className="rv-proof-text">
              <strong>{item.label}</strong>
              <small>{item.text}</small>
            </span>
          </Tag>
        );
      })}
    </div>
  );
}

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

          <ProofRow items={CONTACTS} ariaLabel="Nous contacter" />

          <div className="rv-proof-divider" aria-hidden="true" />

          <ProofRow items={PROOFS} ariaLabel="Avantages du rendez-vous" />
        </div>
      </motion.div>
    </section>
  );
}
