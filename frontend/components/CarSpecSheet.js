"use client";

import { useEffect, useState } from "react";
import { formatKm } from "../lib/format";
import {
  GearboxIcon,
  FuelIcon,
  GaugeIcon,
  CalendarIcon,
  CloudIcon,
  ChevronDownIcon,
  PaintDropIcon,
  SeatIcon,
  PistonIcon,
  BoltIcon,
  DoorIcon,
  CarBodyIcon,
  OwnersIcon,
} from "./CarSpecIcons";

function InfoIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5" />
      <circle cx="12" cy="8" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function EquipmentIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M10.5 4.5 6 9v9a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V9l-4.5-4.5" />
      <path d="M9 13l2 2 4-4" />
    </svg>
  );
}

function DocSpecIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M7 3.5h6.5L18 8v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-15a1 1 0 0 1 1-1Z" />
      <path d="M13.5 3.5V8H18" />
      <path d="M9 13h6M9 16h6" />
    </svg>
  );
}

function RowIcon({ type }) {
  const icons = {
    brand: CarBodyIcon,
    body: CarBodyIcon,
    seats: SeatIcon,
    doors: DoorIcon,
    gearbox: GearboxIcon,
    engine: PistonIcon,
    power: BoltIcon,
    color: PaintDropIcon,
    material: SeatIcon,
    owner: OwnersIcon,
    consumption: FuelIcon,
  };

  const Icon = icons[type] || CarBodyIcon;
  return <Icon width="16" height="16" aria-hidden="true" />;
}

function iconTypeForLabel(label) {
  const text = label.toLowerCase();
  if (text.includes("carrosserie")) return "body";
  if (text.includes("siege")) return "seats";
  if (text.includes("porte")) return "doors";
  if (text.includes("vitesse")) return "gearbox";
  if (text.includes("cylindre") || text.includes("cylindree")) return "engine";
  if (text.includes("puissance")) return "power";
  if (text.includes("couleur") || text.includes("peinture")) return "color";
  if (text.includes("materiau")) return "material";
  if (text.includes("proprietaire")) return "owner";
  if (text.includes("consommation")) return "consumption";
  return "brand";
}

export function SpecHighlights({ car }) {
  const cells = [
    { Icon: GaugeIcon, label: "Kilometrage", value: formatKm(car.mileage) },
    { Icon: CalendarIcon, label: "1ere immat.", value: car.year },
    { Icon: FuelIcon, label: "Carburant", value: car.fuel },
    { Icon: GearboxIcon, label: "Transmission", value: car.gearbox },
    { Icon: CloudIcon, label: "Classe d'emission", value: car.emissionClass || "Non communique" },
  ];

  return (
    <div className="spec-highlights">
      {cells.map(({ Icon, label, value }) => (
        <div className="spec-highlight" key={label}>
          <span className="spec-highlight-icon">
            <Icon aria-hidden="true" />
          </span>
          <div>
            <span className="spec-highlight-label">{label}</span>
            <strong className="spec-highlight-value">{value}</strong>
          </div>
        </div>
      ))}
    </div>
  );
}

function DataRow({ label, value }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="data-row">
      <span className="data-row-icon">
        <RowIcon type={iconTypeForLabel(label)} />
      </span>
      <span className="data-row-label">{label}</span>
      <span className="data-row-value">{value}</span>
    </div>
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
  const rows = [
    <DataRow key="brand" label="Marque" value={car.brand} />,
    <DataRow key="model" label="Modele" value={car.model} />,
    <DataRow key="body" label="Type de carrosserie" value={car.bodyType} />,
    <DataRow key="seats" label="Sieges" value={car.seats} />,
    <DataRow key="doors" label="Portes" value={car.doors} />,
    <DataRow key="gears" label="Vitesses" value={car.gears} />,
    <DataRow key="cylinders" label="Cylindres" value={car.cylinders} />,
    <DataRow key="engine" label="Cylindree" value={car.engineCc ? `${car.engineCc} cm3` : null} />,
    <DataRow key="power" label="Puissance" value={power} />,
    <DataRow key="ext" label="Couleur exterieure" value={car.exteriorColor} />,
    <DataRow key="paint" label="Type de peinture" value={car.paintType} />,
    <DataRow key="int" label="Couleur interieure" value={car.interiorColor} />,
    <DataRow key="material" label="Materiau interieur" value={car.interiorMaterial} />,
    <DataRow key="owners" label="Proprietaires precedents" value={car.previousOwners} />,
    <DataRow key="consumption" label="Consommation" value={car.consumption} />,
  ].filter((row) => row.props.value !== null && row.props.value !== undefined && row.props.value !== "");

  return (
    <div className="spec-sheet">
      {rows.length > 0 && (
        <details
          className="spec-block"
          open={generalOpen}
          onToggle={(event) => setGeneralOpen(event.target.open)}
        >
          <summary>
            <span className="spec-block-title">
              <InfoIcon className="spec-block-icon" />
              <h3>Donnees generales</h3>
            </span>
            <ChevronDownIcon className="spec-block-chevron" />
          </summary>
          <div className="data-grid">{rows}</div>
        </details>
      )}

      {car.equipment && (
        <details
          className="spec-block"
          open={equipmentOpen}
          onToggle={(event) => setEquipmentOpen(event.target.open)}
        >
          <summary>
            <span className="spec-block-title">
              <EquipmentIcon className="spec-block-icon" />
              <h3>Equipement</h3>
            </span>
            <ChevronDownIcon className="spec-block-chevron" />
          </summary>
          <div className="equipment-columns">
            {Object.entries(car.equipment).map(([category, items]) => (
              <div key={category} className="equipment-category">
                <h4>{category}</h4>
                <ul>
                  {items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </details>
      )}

      <details
        className="spec-block"
        open={infoOpen}
        onToggle={(event) => setInfoOpen(event.target.open)}
      >
        <summary>
          <span className="spec-block-title">
            <DocSpecIcon className="spec-block-icon" />
            <h3>Info supplementaire</h3>
          </span>
          <ChevronDownIcon className="spec-block-chevron" />
        </summary>
        <p className="car-description">
          {car.description || "Contactez-nous pour plus d'informations."}
        </p>
      </details>
    </div>
  );
}
