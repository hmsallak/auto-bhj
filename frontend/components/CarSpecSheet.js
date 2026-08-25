"use client";

import { useEffect, useState } from "react";
import { formatKm } from "../lib/format";
import {
  MileageIcon,
  FuelIcon,
  GearboxIcon,
  RegistrationIcon,
  CarIcon,
  SeatIcon,
  DoorIcon,
  PowerIcon,
  OwnerIcon,
  DocumentIcon,
  SlidersIcon,
  ChevronDownIcon,
  CheckCircleIcon,
} from "./home/icons";

export function SpecHighlights({ car }) {
  const cells = [
    { icon: MileageIcon, label: "Kilometrage", value: formatKm(car.mileage) },
    { icon: RegistrationIcon, label: "Annee d'immatriculation", value: car.year },
    { icon: FuelIcon, label: "Carburant", value: car.fuel },
    { icon: GearboxIcon, label: "Transmission", value: car.gearbox },
    { icon: PowerIcon, label: "Puissance", value: car.powerCh ? `${car.powerCh} ch` : "-" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {cells.map(({ icon: Icon, label, value }) => (
        <div key={label} className="flex min-w-0 flex-col gap-2 rounded-xl bg-sage/10 p-4">
          <Icon className="h-6 w-6 shrink-0 text-brand" />
          <div className="flex min-w-0 flex-col">
            <span className="text-[13px] text-subtle">{label}</span>
            <strong className="break-words text-[15px] font-bold text-ink">{value}</strong>
          </div>
        </div>
      ))}
    </div>
  );
}

function DataRow({ icon: Icon, label, value, valueClassName = "text-ink" }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="flex items-center gap-2.5 py-2.5">
      <Icon className="h-4 w-4 shrink-0 text-subtle" />
      <span className="flex-1 text-[14px] text-body">{label}</span>
      <span className={`text-[14px] font-semibold ${valueClassName}`}>{value}</span>
    </div>
  );
}

function SpecSection({ icon: Icon, title, rows }) {
  const visible = rows.filter((row) => row.value !== null && row.value !== undefined && row.value !== "");
  if (!visible.length) return null;

  return (
    <div>
      <h4 className="mb-1 flex items-center gap-2 text-[13px] font-bold uppercase tracking-wide text-subtle">
        <Icon className="h-4 w-4 text-brand" />
        {title}
      </h4>
      <div className="divide-y divide-line">
        {visible.map((row) => (
          <DataRow key={row.label} icon={row.icon} label={row.label} value={row.value} valueClassName={row.valueClassName} />
        ))}
      </div>
    </div>
  );
}

function Block({ icon: Icon, title, open, onToggle, children }) {
  return (
    <details className="group" open={open} onToggle={(event) => onToggle(event.target.open)}>
      <summary className="flex w-full cursor-pointer list-none items-center justify-between py-5 [-webkit-tap-highlight-color:transparent] [touch-action:manipulation] [&::-webkit-details-marker]:hidden [&::marker]:hidden">
        <span className="flex items-center gap-2.5">
          <Icon className="h-5 w-5 text-brand" />
          <h3 className="text-[18px] font-bold text-ink">{title}</h3>
        </span>
        <ChevronDownIcon className="h-4 w-4 text-subtle transition-transform group-open:rotate-180" />
      </summary>
      <div className="pb-6">{children}</div>
    </details>
  );
}

export default function CarSpecSheet({ car }) {
  const [generalOpen, setGeneralOpen] = useState(true);
  const [equipmentOpen, setEquipmentOpen] = useState(true);
  const [infoOpen, setInfoOpen] = useState(true);

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 820px)");

    function syncAccordionState(eventOrQuery = mobileQuery) {
      const openByDefault = !eventOrQuery.matches;
      setGeneralOpen(openByDefault);
      setEquipmentOpen(openByDefault);
      setInfoOpen(openByDefault);
    }

    syncAccordionState(mobileQuery);
    mobileQuery.addEventListener("change", syncAccordionState);
    return () => mobileQuery.removeEventListener("change", syncAccordionState);
  }, []);

  const power = car.powerKw && car.powerCh ? `${car.powerKw} kW (${car.powerCh} ch)` : null;

  const sections = [
    {
      icon: CarIcon,
      title: "Identite & carrosserie",
      rows: [
        { icon: CarIcon, label: "Marque", value: car.brand },
        { icon: CarIcon, label: "Modele", value: car.model, valueClassName: "text-sage" },
        { icon: CarIcon, label: "Type de carrosserie", value: car.bodyType },
        { icon: DoorIcon, label: "Portes", value: car.doors },
        { icon: SeatIcon, label: "Sieges", value: car.seats },
      ],
    },
    {
      icon: PowerIcon,
      title: "Motorisation & performance",
      rows: [
        { icon: FuelIcon, label: "Carburant", value: car.fuel },
        { icon: GearboxIcon, label: "Boite de vitesses", value: car.gearbox },
        { icon: GearboxIcon, label: "Nombre de vitesses", value: car.gears },
        { icon: PowerIcon, label: "Cylindres", value: car.cylinders },
        { icon: PowerIcon, label: "Cylindree", value: car.engineCc ? `${car.engineCc} cm3` : null },
        { icon: PowerIcon, label: "Puissance", value: power },
        { icon: FuelIcon, label: "Consommation", value: car.consumption },
      ],
    },
    {
      icon: CarIcon,
      title: "Exterieur & interieur",
      rows: [
        { icon: CarIcon, label: "Couleur exterieure", value: car.exteriorColor },
        { icon: CarIcon, label: "Type de peinture", value: car.paintType },
        { icon: CarIcon, label: "Couleur interieure", value: car.interiorColor },
        { icon: CarIcon, label: "Materiau interieur", value: car.interiorMaterial },
      ],
    },
    {
      icon: OwnerIcon,
      title: "Historique",
      rows: [{ icon: OwnerIcon, label: "Proprietaires precedents", value: car.previousOwners }],
    },
  ];

  const hasAnyData = sections.some((section) =>
    section.rows.some((row) => row.value !== null && row.value !== undefined && row.value !== "")
  );

  return (
    <div className="flex flex-col divide-y divide-sage border-b border-sage">
      {hasAnyData && (
        <Block icon={SlidersIcon} title="Caracteristiques techniques" open={generalOpen} onToggle={setGeneralOpen}>
          <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
            {sections.map((section) => (
              <SpecSection key={section.title} icon={section.icon} title={section.title} rows={section.rows} />
            ))}
          </div>
        </Block>
      )}

      {car.equipment && (
        <Block icon={CheckCircleIcon} title="Equipements" open={equipmentOpen} onToggle={setEquipmentOpen}>
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

      <Block icon={DocumentIcon} title="Description" open={infoOpen} onToggle={setInfoOpen}>
        <p className="text-[15px] leading-relaxed text-body">
          {car.description || "Contactez-nous pour plus d'informations."}
        </p>
      </Block>
    </div>
  );
}
