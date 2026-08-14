import { formatKm } from "../lib/format";
import {
  GaugeIcon,
  GearboxIcon,
  FuelIcon,
  PaintDropIcon,
  CloudIcon,
  SeatIcon,
  PistonIcon,
  BoltIcon,
  DoorIcon,
  CarBodyIcon,
  OwnersIcon,
  ChevronDownIcon,
} from "./CarSpecIcons";

function SpecCell({ Icon, label, value }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="spec-cell">
      <span className="spec-cell-icon">
        <Icon />
      </span>
      <div>
        <span className="spec-cell-label">{label}</span>
        <strong className="spec-cell-value">{value}</strong>
      </div>
    </div>
  );
}

export default function CarSpecSheet({ car }) {
  const power = car.powerKw && car.powerCh ? `${car.powerKw} kW (${car.powerCh} ch)` : null;
  const cells = [
    <SpecCell key="km" Icon={GaugeIcon} label="Kilometrage" value={formatKm(car.mileage)} />,
    <SpecCell key="gearbox" Icon={GearboxIcon} label="Transmission" value={car.gearbox} />,
    <SpecCell key="fuel" Icon={FuelIcon} label="Carburant" value={car.fuel} />,
    <SpecCell key="ext" Icon={PaintDropIcon} label="Couleur exterieure" value={car.exteriorColor} />,
    <SpecCell key="emission" Icon={CloudIcon} label="Classe d'emission" value={car.emissionClass} />,
    <SpecCell key="seats" Icon={SeatIcon} label="Nombre de sieges" value={car.seats} />,
    <SpecCell
      key="engine"
      Icon={PistonIcon}
      label="Cylindree"
      value={car.engineCc ? `${car.engineCc} cm3` : null}
    />,
    <SpecCell key="power" Icon={BoltIcon} label="Puissance" value={power} />,
    <SpecCell key="int" Icon={PaintDropIcon} label="Couleur interieure" value={car.interiorColor} />,
    <SpecCell key="doors" Icon={DoorIcon} label="Portes" value={car.doors} />,
    <SpecCell key="body" Icon={CarBodyIcon} label="Carrosserie" value={car.bodyType} />,
    <SpecCell key="owners" Icon={OwnersIcon} label="Proprietaires precedents" value={car.previousOwners} />,
  ].filter((cell) => cell.props.value !== null && cell.props.value !== undefined && cell.props.value !== "");

  return (
    <div className="spec-sheet">
      {cells.length > 0 && (
        <details className="spec-block" open>
          <summary>
            <h3>Caracteristiques</h3>
            <ChevronDownIcon />
          </summary>
          <div className="spec-icon-grid">{cells}</div>
          {car.consumption && (
            <p className="spec-footnote">Consommation : {car.consumption}</p>
          )}
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
