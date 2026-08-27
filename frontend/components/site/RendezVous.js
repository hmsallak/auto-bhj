"use client";

import { MailIcon, PhoneIcon, PinIcon, WhatsAppIcon } from "../home/icons";
import SectionEyebrow from "../home/SectionEyebrow";
import Reveal from "../home/Reveal";
import { useSiteSettings } from "../SiteSettingsProvider";

const ADDRESS = "Mekingenweg 99, 1600 Sint-Pieters-Leeuw";
const MAPS_HREF = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`;

export default function RendezVous() {
  const { phone, phoneTel, whatsapp, email } = useSiteSettings();

  const contacts = [
    {
      icon: WhatsAppIcon,
      label: "WhatsApp",
      text: "Message rapide",
      href: `https://wa.me/${whatsapp}?text=${encodeURIComponent(
        "Bonjour Auto BHJ, je souhaite prendre rendez-vous pour une voiture."
      )}`,
      external: true,
      accent: "bg-[#25d366]/10 text-[#1fb958]",
    },
    {
      icon: PhoneIcon,
      label: phone,
      text: "Appel direct",
      href: `tel:${phoneTel}`,
      accent: "bg-brand-pastel text-brand",
    },
    {
      icon: MailIcon,
      label: email,
      text: "Par e-mail",
      href: `mailto:${email}`,
      accent: "bg-brand-pastel text-brand",
    },
    {
      icon: PinIcon,
      label: "Sint-Pieters-Leeuw",
      text: "Sur rendez-vous",
      href: MAPS_HREF,
      external: true,
      accent: "bg-brand-pastel text-brand",
    },
  ];

  return (
    <section className="py-16" aria-label="Nous contacter" id="contact">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <SectionEyebrow>Une question, une voiture qui vous plait ?</SectionEyebrow>
          <h2 className="mt-2 text-2xl font-bold text-ink">Contactez-nous, on repond vite</h2>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {contacts.map((contact, index) => {
            const Icon = contact.icon;
            return (
              <Reveal key={contact.label} delay={index * 100}>
                <a
                  href={contact.href}
                  {...(contact.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group flex items-center gap-3"
                >
                  <span
                    className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${contact.accent}`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="flex flex-col">
                    <strong className="text-[15px] font-bold text-ink transition-colors group-hover:text-brand">
                      {contact.label}
                    </strong>
                    <span className="text-[13px] text-subtle">{contact.text}</span>
                  </span>
                </a>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
