"use client";

import { useState } from "react";
import { ShareIcon, PrinterIcon } from "./home/icons";
import { useT } from "../lib/i18n";

const BTN =
  "h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg text-brand transition-colors hover:bg-surface hover:text-brand-dark";

// Partage (mobile + desktop) et impression (desktop uniquement), a cote du
// titre. Rendu client : navigator.share / clipboard / window.print.
export default function VehicleShareActions({ title }) {
  const t = useT();
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // partage annule : rien a faire
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard indisponible : rien a faire
    }
  }

  return (
    <div className="flex shrink-0 items-center gap-1.5 print:hidden">
      {copied && <span className="text-[12px] text-subtle">{t("share.copied")}</span>}
      <button
        type="button"
        onClick={handleShare}
        className={`${BTN} inline-flex`}
        aria-label={t("share.shareAria")}
      >
        <ShareIcon className="h-6 w-6" />
      </button>
      <button
        type="button"
        onClick={() => window.print()}
        className={`${BTN} hidden lg:inline-flex`}
        aria-label={t("share.printAria")}
      >
        <PrinterIcon className="h-6 w-6" />
      </button>
    </div>
  );
}
