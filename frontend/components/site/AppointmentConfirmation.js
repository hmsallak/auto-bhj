"use client";

import { useLang, useT } from "../../lib/i18n";
import { useSiteSettings } from "../SiteSettingsProvider";
import { CalendarIcon, CarIcon, PhoneIcon, PinIcon } from "../home/icons";

// Wall-clock "YYYY-MM-DDTHH:MM" built from its parts, so server (UTC) and
// browser render the same day and time - no timezone shift, no hydration diff.
function localDate(startsAt) {
  const [datePart, timePart] = startsAt.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);
  return new Date(year, month - 1, day, hour, minute);
}

export default function AppointmentConfirmation({ appointment, car, garage, googleUrl }) {
  const t = useT();
  const { lang } = useLang();
  const { phone, phoneTel } = useSiteSettings();
  const locale = lang === "nl" ? "nl-BE" : "fr-BE";

  const when = localDate(appointment.startsAt);
  const past = when.getTime() < Date.now();
  const firstName = appointment.name.trim().split(/\s+/)[0];
  const dayLabel = new Intl.DateTimeFormat(locale, { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(when);
  const time = appointment.startsAt.slice(11, 16);
  const icsHref = `/api/rdv/${appointment.token}/ics`;

  return (
    <section className="mx-auto max-w-3xl px-6 py-10 sm:px-8 sm:py-14">
      <p className="inline-flex items-center gap-2 rounded-full bg-sage/10 px-3 py-1 text-[13px] font-semibold text-sage">
        <span className="h-2 w-2 rounded-full bg-sage" aria-hidden="true" />
        {past ? t("rdv.pastBadge") : t("rdv.badge")}
      </p>

      <h1
        className="mt-4 text-ink"
        style={{ fontSize: "clamp(26px, 6vw, 40px)", fontWeight: 700, lineHeight: 1.15, maxWidth: "none" }}
      >
        {past ? t("rdv.pastTitle") : `${t("rdv.title")} ${firstName} !`}
      </h1>
      <p className="mt-2 text-[15px] leading-relaxed text-body">{past ? t("rdv.pastIntro") : t("rdv.intro")}</p>

      {/* When: the one thing the customer came here for. */}
      <div className="mt-8 overflow-hidden rounded-2xl border border-line bg-white">
        <div className="flex items-center gap-4 bg-brand px-6 py-5 text-white">
          <CalendarIcon className="h-8 w-8 shrink-0" aria-hidden="true" />
          <div className="min-w-0">
            <p className="text-[15px] font-semibold capitalize opacity-90">{dayLabel}</p>
            <p className="text-[32px] font-extrabold leading-none tabular-nums">{time}</p>
          </div>
        </div>

        <dl className="divide-y divide-line">
          {car && (
            <div className="flex items-center gap-4 px-6 py-4">
              {car.imageUrl ? (
                <img src={car.imageUrl} alt="" className="h-14 w-20 shrink-0 rounded-lg object-cover" />
              ) : (
                <CarIcon className="h-6 w-6 shrink-0 text-brand" aria-hidden="true" />
              )}
              <div className="min-w-0">
                <dt className="text-[12px] font-semibold uppercase tracking-wide text-subtle">{t("rdv.car")}</dt>
                <dd className="mt-0.5 font-semibold text-ink">
                  <a href={`/cars/${car.reference}`} className="hover:text-brand">
                    {car.brand} {car.model}
                  </a>
                  <span className="ml-2 text-[13px] font-normal text-subtle">{car.reference}</span>
                </dd>
              </div>
            </div>
          )}

          {appointment.note && (
            <div className="px-6 py-4">
              <dt className="text-[12px] font-semibold uppercase tracking-wide text-subtle">{t("rdv.note")}</dt>
              <dd className="mt-0.5 text-ink">{appointment.note}</dd>
            </div>
          )}

          <div className="flex items-start gap-4 px-6 py-4">
            <PinIcon className="mt-0.5 h-5 w-5 shrink-0 text-brand" aria-hidden="true" />
            <div className="min-w-0">
              <dt className="text-[12px] font-semibold uppercase tracking-wide text-subtle">{t("rdv.address")}</dt>
              <dd className="mt-0.5 text-ink">{garage.address}</dd>
              <a
                href={garage.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1.5 inline-flex min-h-[44px] items-center gap-1.5 font-semibold text-brand hover:text-brand-dark"
              >
                {t("rdv.directions")}
              </a>
            </div>
          </div>
        </dl>
      </div>

      {/* Add to calendar. */}
      {!past && (
        <div className="mt-6">
          <h2 className="text-[15px] font-bold text-ink">{t("rdv.addTitle")}</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <a
              href={googleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-brand px-5 font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              <CalendarIcon className="h-5 w-5" aria-hidden="true" />
              {t("rdv.google")}
            </a>
            <a
              href={icsHref}
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-brand bg-white px-5 font-semibold text-brand transition-colors hover:bg-brand-pastel focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              <CalendarIcon className="h-5 w-5" aria-hidden="true" />
              {t("rdv.ics")}
            </a>
          </div>
        </div>
      )}

      {/* Read-only page: changes go through a phone call to the garage. */}
      {!past && (
        <div className="mt-8 rounded-2xl border border-line bg-white p-6">
          <h2 className="text-[15px] font-bold text-ink">{t("rdv.contactTitle")}</h2>
          <p className="mt-1 text-[14px] leading-relaxed text-body">{t("rdv.contactText")}</p>
          <a
            href={`tel:${phoneTel}`}
            className="mt-4 inline-flex min-h-[48px] items-center gap-2 rounded-xl border border-brand px-5 font-semibold text-brand transition-colors hover:bg-brand-pastel focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            <PhoneIcon className="h-5 w-5" aria-hidden="true" />
            {phone}
          </a>
        </div>
      )}
    </section>
  );
}
