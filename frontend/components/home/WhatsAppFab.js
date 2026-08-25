import { WhatsAppIcon } from "./icons";

const WHATSAPP_HREF = `https://wa.me/32483208801?text=${encodeURIComponent(
  "Bonjour Auto BHJ, je souhaite des informations sur une voiture."
)}`;

export default function WhatsAppFab() {
  return (
    <a
      href={WHATSAPP_HREF}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Ecrire sur WhatsApp a Auto BHJ"
      className="fixed bottom-5 right-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-lg transition-colors hover:bg-[#1fb958] lg:hidden"
    >
      <span
        className="absolute inset-0 rounded-full bg-[#25d366] motion-safe:animate-ping motion-reduce:hidden"
        aria-hidden="true"
      />
      <WhatsAppIcon className="relative z-10 h-7 w-7" />
    </a>
  );
}
