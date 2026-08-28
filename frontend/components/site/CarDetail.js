"use client";

import { carPriceLabel } from "../../lib/format";
import { useT, useCarEnums } from "../../lib/i18n";
import PhotoGallery from "../PhotoGallery";
import CarSpecSheet, { SpecHighlights } from "../CarSpecSheet";
import VehicleActions from "../VehicleActions";
import VehicleAppointmentForm from "../VehicleAppointmentForm";
import VehicleShareActions from "../VehicleShareActions";
import VehicleStickyBar from "../VehicleStickyBar";
import VehicleViewTracker from "../VehicleViewTracker";
import { InfoIcon, ChevronDownIcon, PinIcon } from "../home/icons";

const GARAGE_ADDRESS = "Mekingenweg 99, 1600 Sint-Pieters-Leeuw";
const GARAGE_MAPS_HREF = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  GARAGE_ADDRESS
)}`;

export default function CarDetail({ car }) {
  const t = useT();
  const ce = useCarEnums();
  const price = carPriceLabel(car);

  // Sous-titre type "1,2 Essence" : cylindree en litres (cm3 / 1000) + carburant.
  const engineLiters = car.engineCc ? (car.engineCc / 1000).toFixed(1).replace(".", ",") : null;
  const subtitle = [engineLiters, ce.fuel(car.fuel)].filter(Boolean).join(" · ");

  return (
    <section className="mx-auto max-w-5xl px-6 py-10 sm:px-8">
      <VehicleViewTracker reference={car.reference} />

      <nav className="text-[14px] text-subtle" aria-label={t("fiche.backAria")}>
        <a
          href="/stock"
          className="inline-flex items-center gap-1.5 font-medium text-ink hover:text-brand"
        >
          <ChevronDownIcon className="h-4 w-4 rotate-90" aria-hidden="true" />
          {t("fiche.back")}
        </a>
      </nav>

      <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="lg:col-start-1 lg:row-start-1">
          <PhotoGallery images={car.images} alt={`${car.brand} ${car.model}`} status={car.status} />
        </div>

        <aside
          className="flex flex-col gap-5 lg:col-start-2 lg:row-start-1"
          aria-label={t("fiche.priceContactAria")}
        >
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <h1
                className="min-w-0 flex-1 text-ink"
                style={{
                  fontSize: "clamp(24px, 6vw, 42px)",
                  fontWeight: 700,
                  lineHeight: 1.2,
                  maxWidth: "none",
                }}
              >
                {car.brand} {car.model}
              </h1>
              <VehicleShareActions title={`${car.brand} ${car.model}`} />
            </div>
            {subtitle && <p className="text-[15px] text-subtle">{subtitle}</p>}
          </div>

          {price && <p className="text-3xl font-extrabold text-brand-dark">{price}</p>}

          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-sage/10 px-3 py-1 text-[13px] font-semibold text-sage">
            <span className="h-2 w-2 rounded-full bg-sage" aria-hidden="true" />
            {ce.status(car.status)}
          </span>

          <div className="hidden flex-col gap-3 lg:flex">
            <VehicleActions reference={car.reference} />
            <p className="flex items-center gap-2 text-[13px] text-subtle">
              <InfoIcon className="h-4 w-4 shrink-0" />
              {t("fiche.respondFast")}
            </p>
            <div className="border-t border-line pt-4 text-[13px] text-subtle">
              <p className="font-semibold text-ink">Auto BHJ</p>
              <p>{GARAGE_ADDRESS}</p>
              <p>{t("fiche.byAppointment")}</p>
            </div>
          </div>
        </aside>

        <div className="lg:col-start-1 lg:row-start-2">
          <SpecHighlights car={car} />
        </div>
      </div>

      <div className="mt-10">
        <CarSpecSheet car={car} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2 lg:items-start">
        <div className="flex items-start gap-2.5 rounded-xl border border-line bg-white p-4 text-[13px] text-body lg:hidden">
          <PinIcon className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
          <div className="leading-relaxed">
            <p className="text-[14px] font-bold text-ink">Auto BHJ</p>
            <p>{GARAGE_ADDRESS}</p>
            <p className="mt-0.5 text-subtle">{t("fiche.byAppointment")}</p>
            <a
              href={GARAGE_MAPS_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1.5 inline-flex items-center gap-1.5 font-semibold text-brand hover:text-brand-dark"
            >
              <PinIcon className="h-4 w-4" />
              {t("fiche.directions")}
            </a>
          </div>
        </div>

        <VehicleAppointmentForm reference={car.reference} carLabel={`${car.brand} ${car.model}`} />

        <aside
          className="hidden overflow-hidden rounded-xl border border-line bg-white lg:block"
          aria-label={t("fiche.locationAria")}
        >
          <a
            href={GARAGE_MAPS_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
            aria-label={t("fiche.openMapAria")}
          >
            <img
              src="/map-auto-bhj.png"
              alt={t("fiche.mapAlt")}
              className="h-64 w-full object-cover"
              loading="lazy"
            />
          </a>
          <div className="flex items-start gap-3 border-t border-line p-5">
            <PinIcon className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
            <div className="text-[13.5px] leading-relaxed text-body">
              <p className="text-[15px] font-bold text-ink">Auto BHJ</p>
              <p>{GARAGE_ADDRESS}</p>
              <p className="mt-1 text-[13px] text-subtle">{t("fiche.byAppointment")}</p>
              <a
                href={GARAGE_MAPS_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1.5 font-semibold text-brand hover:text-brand-dark"
              >
                <PinIcon className="h-4 w-4" />
                {t("fiche.directions")}
              </a>
            </div>
          </div>
        </aside>
      </div>

      <VehicleStickyBar reference={car.reference} />
    </section>
  );
}
