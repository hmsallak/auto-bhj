"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { PhoneIcon, MailIcon, CompassIcon, WhatsAppIcon } from "../home/icons";

const EASE = [0.16, 1, 0.3, 1];

const WHATSAPP_HREF = `https://wa.me/32483208801?text=${encodeURIComponent(
  "Bonjour Auto BHJ, je vous contacte depuis le QR code."
)}`;

const LINKS = [
  {
    href: "https://www.autobhj.be",
    label: "Notre site web",
    hint: "Voir tout le stock en ligne",
    icon: CompassIcon,
    primary: false,
  },
  {
    href: WHATSAPP_HREF,
    label: "Ecrivez-nous sur WhatsApp",
    hint: "Reponse rapide",
    icon: WhatsAppIcon,
    primary: true,
  },
  {
    href: "tel:+32483208801",
    label: "Appelez-nous",
    hint: "+32 483 20 88 01",
    icon: PhoneIcon,
    primary: false,
  },
  {
    href: "mailto:contact@autobhj.be",
    label: "Envoyez un email",
    hint: "contact@autobhj.be",
    icon: MailIcon,
    primary: false,
  },

  // Pret a activer des que les liens existent - decommenter et remplacer
  // l'URL, aucune autre modification necessaire.
  // {
  //   href: "https://www.facebook.com/...",
  //   label: "Suivez-nous sur Facebook",
  //   hint: "Actus et nouvelles arrivees",
  //   icon: FacebookIcon,
  //   primary: false,
  // },
  // {
  //   href: "https://www.instagram.com/...",
  //   label: "Suivez-nous sur Instagram",
  //   hint: "Photos du stock",
  //   icon: InstagramIcon,
  //   primary: false,
  // },
  // {
  //   href: "https://g.page/r/.../review",
  //   label: "Donnez votre avis Google",
  //   hint: "Ca nous aide beaucoup",
  //   icon: StarIcon,
  //   primary: false,
  // },
];

export default function QrLanding() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-offwhite px-6 py-14">
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="flex w-full max-w-sm flex-col items-center text-center"
      >
        <Image
          src="/logo-auto-bhj.png"
          alt="Auto BHJ"
          width={350}
          height={200}
          priority
          className="h-16 w-auto"
        />
        <h1 className="mt-5 text-2xl font-bold text-ink">Auto BHJ</h1>
        <p className="mt-2 text-[15px] text-body">
          Vehicules d&apos;occasion controles a Sint-Pieters-Leeuw.
        </p>

        <nav className="mt-8 flex w-full flex-col gap-3" aria-label="Nous retrouver">
          {LINKS.map((link, index) => (
            <motion.a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: EASE, delay: prefersReducedMotion ? 0 : 0.08 * index }}
              className={`flex items-center gap-4 rounded-2xl border px-5 py-4 text-left shadow-sm transition-transform duration-150 hover:-translate-y-0.5 ${
                link.primary
                  ? "border-brand bg-brand text-white hover:bg-brand-dark"
                  : "border-line bg-white text-ink hover:border-sage"
              }`}
            >
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                  link.primary ? "bg-white/15" : "bg-brand-pastel text-brand"
                }`}
              >
                <link.icon className="h-5 w-5" />
              </span>
              <span className="flex flex-col">
                <span className="text-[15px] font-semibold">{link.label}</span>
                <span className={`text-[13px] ${link.primary ? "text-white/80" : "text-subtle"}`}>
                  {link.hint}
                </span>
              </span>
            </motion.a>
          ))}
        </nav>

        <p className="mt-10 text-[13px] text-subtle">
          Mekingenweg 99, 1600 Sint-Pieters-Leeuw · Auto BHJ SRL
        </p>
      </motion.div>
    </main>
  );
}
