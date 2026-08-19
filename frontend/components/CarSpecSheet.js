import { formatKm, statusLabel } from "../lib/format";
import { ShieldIcon } from "./site/icons";
import {
  GaugeIcon,
  GearboxIcon,
  FuelIcon,
  CloudIcon,
  CalendarIcon,
  ChevronDownIcon,
} from "./CarSpecIcons";

export function SpecHighlights({ car }) {
  const cells = [
    { Icon: ShieldIcon, label: "Etat", value: statusLabel(car.status) },
    { Icon: GaugeIcon, label: "Kilometrage", value: formatKm(car.mileage) },
    { Icon: CalendarIcon, label: "1ere immat.", value: car.year },
    { Icon: FuelIcon, label: "Carburant", value: car.fuel },
    { Icon: GearboxIcon, label: "Boite de vitesse", value: car.gearbox },
    { Icon: CloudIcon, label: "Classe d'emission", value: car.emissionClass || "Non communique" },
  ];

  return (
    <div className="spec-highlights">
      {cells.map(({ Icon, label, value }) => (
        <div className="spec-highlight" key={label}>
          <span className="spec-highlight-icon">
            <Icon />
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
      <span className="data-row-label">{label}</span>
      <span className="data-row-value">{value}</span>
    </div>
  );
}

export default function CarSpecSheet({ car }) {
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
      <details className="spec-block" open>
        <summary>
          <h3>Description</h3>
          <ChevronDownIcon />
        </summary>
        <p className="car-description">
          {car.description || "Contactez-nous pour plus d'informations."}
        </p>
      </details>

      {rows.length > 0 && (
        <details className="spec-block" open>
          <summary>
            <h3>Donnees generales</h3>
            <ChevronDownIcon />
          </summary>
          <div className="data-grid">{rows}</div>
        </details>
      )}

      {car.equipment && (
        <details className="spec-block" open>
          <summary>
            <h3>Equipement</h3>
            <ChevronDownIcon />
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
    </div>
  );
}
