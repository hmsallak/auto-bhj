"use client";

import { useState } from "react";
import { useT, useCarEnums } from "../lib/i18n";
import {
  MileageIcon,
  FuelIcon,
  GearboxIcon,
  RegistrationIcon,
  PowerIcon,
  DocumentIcon,
  SlidersIcon,
  ChevronDownIcon,
  CheckCircleIcon,
  LeafIcon,
} from "./home/icons";

export function SpecHighlights({ car }) {
  const t = useT();
  const ce = useCarEnums();
  const cells = [
    { icon: RegistrationIcon, label: t("spec.year"), value: car.year },
    { icon: MileageIcon, label: t("spec.mileage"), value: ce.km(car.mileage) },
    { icon: FuelIcon, label: t("spec.fuel"), value: ce.fuel(car.fuel) },
    { icon: GearboxIcon, label: t("spec.gearbox"), value: ce.gearbox(car.gearbox) },
    { icon: PowerIcon, label: t("spec.power"), value: ce.power(car.powerCh) || "-" },
    { icon: LeafIcon, label: t("spec.euro"), value: car.emissionClass || "-" },
  ];

  return (
    <div className="grid grid-cols-3 gap-x-3 gap-y-4 rounded-xl border border-line bg-white p-4 sm:gap-x-6 sm:p-5">
      {cells.map(({ icon: Icon, label, value }) => (
        <div
          key={label}
          className="flex min-w-0 flex-col gap-1 sm:flex-row sm:items-center sm:gap-3"
        >
          <Icon className="h-5 w-5 shrink-0 text-brand sm:h-6 sm:w-6" />
          <div className="flex min-w-0 flex-col">
            <strong className="break-words text-[13px] font-bold leading-tight text-ink sm:text-[14px]">
              {value}
            </strong>
            <span className="break-words text-[11px] text-subtle sm:text-[12px]">{label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function DataRow({ label, value, valueClassName = "text-ink" }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="flex items-center gap-2.5 py-1.5">
      <span className="flex-1 text-[13.5px] text-body">{label}</span>
      <span className={`text-[13.5px] font-semibold ${valueClassName}`}>{value}</span>
    </div>
  );
}

function SpecSection({ title, rows }) {
  const visible = rows.filter((row) => row.value !== null && row.value !== undefined && row.value !== "");
  if (!visible.length) return null;

  return (
    <div>
      <h4 className="mb-1 text-[13px] font-bold uppercase tracking-wide text-subtle">{title}</h4>
      <div className="divide-y divide-line">
        {visible.map((row) => (
          <DataRow key={row.label} label={row.label} value={row.value} valueClassName={row.valueClassName} />
        ))}
      </div>
    </div>
  );
}

function Block({ icon: Icon, title, open, onToggle, children }) {
  return (
    <details className="group" open={open} onToggle={(event) => onToggle(event.target.open)}>
      <summary className="flex w-full cursor-pointer list-none items-center justify-between py-4 [-webkit-tap-highlight-color:transparent] [touch-action:manipulation] [&::-webkit-details-marker]:hidden [&::marker]:hidden">
        <span className="flex items-center gap-2.5">
          <Icon className="h-5 w-5 text-brand" />
          <h3 className="text-[17px] font-bold text-ink">{title}</h3>
        </span>
        <ChevronDownIcon className="h-4 w-4 text-subtle transition-transform group-open:rotate-180" />
      </summary>
      <div className="pb-5">{children}</div>
    </details>
  );
}

export default function CarSpecSheet({ car }) {
  const t = useT();
  const ce = useCarEnums();
  // Only the first section is open on load; Equipements and Description
  // start collapsed. The user can still toggle any of them.
  const [generalOpen, setGeneralOpen] = useState(true);
  const [equipmentOpen, setEquipmentOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);

  const power =
    car.powerKw && car.powerCh ? `${car.powerKw} kW (${car.powerCh} ${ce.powerUnit})` : null;

  const sections = [
    {
      title: t("spec.sections.identity"),
      rows: [
        { label: t("spec.rows.brand"), value: car.brand },
        { label: t("spec.rows.model"), value: car.model, valueClassName: "text-sage" },
        { label: t("spec.rows.bodyType"), value: ce.body(car.bodyType) },
        { label: t("spec.rows.doors"), value: car.doors },
        { label: t("spec.rows.seats"), value: car.seats },
      ],
    },
    {
      title: t("spec.sections.engine"),
      rows: [
        { label: t("spec.rows.fuel"), value: ce.fuel(car.fuel) },
        { label: t("spec.rows.gearbox"), value: ce.gearbox(car.gearbox) },
        { label: t("spec.rows.gears"), value: car.gears },
        { label: t("spec.rows.cylinders"), value: car.cylinders },
        { label: t("spec.rows.engineCc"), value: car.engineCc ? `${car.engineCc} cm3` : null },
        { label: t("spec.rows.power"), value: power },
        { label: t("spec.rows.consumption"), value: car.consumption },
      ],
    },
    {
      title: t("spec.sections.inout"),
      rows: [
        { label: t("spec.rows.exteriorColor"), value: car.exteriorColor },
        { label: t("spec.rows.paintType"), value: car.paintType },
        { label: t("spec.rows.interiorColor"), value: car.interiorColor },
        { label: t("spec.rows.interiorMaterial"), value: car.interiorMaterial },
      ],
    },
    {
      title: t("spec.sections.history"),
      rows: [{ label: t("spec.rows.previousOwners"), value: car.previousOwners }],
    },
  ];

  const hasAnyData = sections.some((section) =>
    section.rows.some((row) => row.value !== null && row.value !== undefined && row.value !== "")
  );

  return (
    <div className="flex flex-col divide-y divide-sage border-b border-sage">
      {hasAnyData && (
        <Block icon={SlidersIcon} title={t("spec.techTitle")} open={generalOpen} onToggle={setGeneralOpen}>
          <div className="grid grid-cols-1 gap-x-10 gap-y-4 sm:grid-cols-2">
            {sections.map((section) => (
              <SpecSection key={section.title} title={section.title} rows={section.rows} />
            ))}
          </div>
        </Block>
      )}

      {car.equipment && (
        <Block icon={CheckCircleIcon} title={t("spec.equipmentTitle")} open={equipmentOpen} onToggle={setEquipmentOpen}>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(car.equipment).map(([category, items]) => (
              <div key={category}>
                <h4 className="mb-2 text-[14px] font-bold text-ink">{category}</h4>
                <ul className="flex flex-col gap-1.5">
                  {items.map((item) => (
                    <li key={item} className="text-[14px] text-body">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Block>
      )}

      <Block icon={DocumentIcon} title={t("spec.descriptionTitle")} open={infoOpen} onToggle={setInfoOpen}>
        <p className="text-[15px] leading-relaxed text-body">
          {car.description || t("spec.noDescription")}
        </p>
      </Block>
    </div>
  );
}
