"use client";

import { motion, useReducedMotion } from "framer-motion";
import { MailIcon, PhoneIcon, PinIcon, WhatsAppIcon } from "./icons";

const ADDRESS = "Mekingenweg 99, 1600 Sint-Pieters-Leeuw";
const MAPS_HREF = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`;
const WHATSAPP_HREF = `https://wa.me/32483208801?text=${encodeURIComponent(
  "Bonjour Auto BHJ, je souhaite prendre rendez-vous pour une voiture."
)}`;

const EASE = [0.16, 1, 0.3, 1];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

const CONTACTS = [
  {
    icon: WhatsAppIcon,
    label: "WhatsApp",
    text: "Message rapide",
    href: WHATSAPP_HREF,
    external: true,
    variant: "whatsapp",
  },
  {
    icon: PhoneIcon,
    label: "0483 20 88 01",
    text: "Appel direct",
    href: "tel:+32483208801",
  },
  {
    icon: MailIcon,
    label: "contact@autobhj.be",
    text: "Par e-mail",
    href: "mailto:contact@autobhj.be",
  },
  {
    icon: PinIcon,
    label: "Sint-Pieters-Leeuw",
    text: "Sur rendez-vous",
    href: MAPS_HREF,
    external: true,
  },
];

export default function RendezVous() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="contact-simple-section" aria-label="Nous contacter" id="contact">
      <motion.div
        className="contact-simple-shell"
        variants={container}
        initial={prefersReducedMotion ? "show" : "hidden"}
        whileInView="show"
        viewport={{ once: false, amount: 0.3 }}
      >
        <motion.p className="contact-simple-kicker" variants={item}>
          Une question, une voiture qui vous plait ?
        </motion.p>
        <motion.h2 className="contact-simple-title" variants={item}>
          Contactez-nous, on repond vite.
        </motion.h2>

        <div className="contact-simple-grid">
          {CONTACTS.map((contact) => {
            const Icon = contact.icon;
            return (
              <motion.a
                className="contact-simple-card"
                key={contact.label}
                href={contact.href}
                variants={item}
                {...(contact.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                <span
                  className={`contact-simple-icon${contact.variant ? ` contact-simple-icon-${contact.variant}` : ""}`}
                  aria-hidden="true"
                >
                  <Icon width="26" height="26" />
                </span>
                <span className="contact-simple-text">
                  <strong>{contact.label}</strong>
                  <small>{contact.text}</small>
                </span>
              </motion.a>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
