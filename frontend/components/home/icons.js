/* Set d'icones officiel du site (source: auto_bhj_svg_icons). Toutes les
   icones "produit" viennent de ce set exclusivement. Seules ChevronDownIcon,
   SearchIcon, SlidersIcon, MenuIcon et CloseIcon restent dessinees a la main :
   ce sont des icones d'interface pures (chevron, loupe, filtre, menu, fermer)
   sans equivalent dans le set fourni. */

function Svg(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    />
  );
}

export function AbsIcon(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="7" />
      <path d="M3 8l2 1M3 16l2-1M21 8l-2 1M21 16l-2-1" />
      <path d="M8 15l2-6 2 6M9 13h2M14 9v6h2a2 2 0 0 0 0-4h-2" />
    </Svg>
  );
}

export function AirbagIcon(props) {
  return (
    <Svg {...props}>
      <circle cx="9" cy="7" r="3" />
      <path d="M5 21v-6a4 4 0 0 1 4-4h2M15 10a5 5 0 1 1 0 10" />
    </Svg>
  );
}

export function OwnerIcon(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M5 21a7 7 0 0 1 14 0" />
    </Svg>
  );
}

export function InsuranceIcon(props) {
  return (
    <Svg {...props}>
      <path d="M12 3l8 4v5c0 5-3.4 8-8 9-4.6-1-8-4-8-9V7z" />
      <path d="M12 8v8M8 12h8" />
    </Svg>
  );
}

export function BatteryIcon(props) {
  return (
    <Svg {...props}>
      <rect x="4" y="7" width="16" height="12" rx="2" />
      <path d="M8 4v3M16 4v3M10 10l-2 4h3l-1 4 5-6h-3l2-2" />
    </Svg>
  );
}

export function BluetoothIcon(props) {
  return (
    <Svg {...props}>
      <path d="M12 3v18l6-5-12-8 12-5-6 18" />
    </Svg>
  );
}

export function AutoGearboxIcon(props) {
  return (
    <Svg {...props}>
      <rect x="6" y="3" width="12" height="18" rx="6" />
      <path d="M12 6v12M9 8h6M9 12h6M9 16h6" />
    </Svg>
  );
}

export function BudgetIcon(props) {
  return (
    <Svg {...props}>
      <rect x="3" y="6" width="18" height="13" rx="2" />
      <path d="M16 10h5v5h-5a2.5 2.5 0 0 1 0-5z" />
      <circle cx="16.5" cy="12.5" r=".7" />
    </Svg>
  );
}

export function CalendarIcon(props) {
  return (
    <Svg {...props}>
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M8 3v4M16 3v4M4 10h16" />
    </Svg>
  );
}

export function CameraIcon(props) {
  return (
    <Svg {...props}>
      <rect x="3" y="7" width="18" height="12" rx="2" />
      <circle cx="12" cy="13" r="4" />
      <path d="M8 7l2-3h4l2 3" />
    </Svg>
  );
}

export function FuelIcon(props) {
  return (
    <Svg {...props}>
      <path d="M6 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16" />
      <path d="M4 21h14M8 7h6v5H8zM16 8h2l2 2v6a2 2 0 0 1-4 0" />
    </Svg>
  );
}

export function CheckCircleIcon(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12l3 3 5-6" />
    </Svg>
  );
}

export function KeyIcon(props) {
  return (
    <Svg {...props}>
      <circle cx="8" cy="15" r="4" />
      <path d="M11 12l8-8M16 7l2 2M18 5l2 2" />
    </Svg>
  );
}

export function AcIcon(props) {
  return (
    <Svg {...props}>
      <path d="M12 2v20M4 6l16 12M20 6L4 18M9 4l3 3 3-3M9 20l3-3 3 3" />
    </Svg>
  );
}

export function TrunkIcon(props) {
  return (
    <Svg {...props}>
      <path d="M4 12h16v7H4zM6 12l2-5h8l2 5" />
      <path d="M8 15h8" />
    </Svg>
  );
}

export function ShieldIcon(props) {
  return (
    <Svg {...props}>
      <path d="M12 3l8 4v5c0 5-3.4 8-8 9-4.6-1-8-4-8-9V7z" />
      <path d="M8.5 12l2.2 2.2L16 9" />
    </Svg>
  );
}

export function DocumentIcon(props) {
  return (
    <Svg {...props}>
      <path d="M6 3h9l4 4v14H6z" />
      <path d="M15 3v5h4M9 12h6M9 16h6" />
    </Svg>
  );
}

export function SchoolIcon(props) {
  return (
    <Svg {...props}>
      <path d="M3 10l9-6 9 6-9 6z" />
      <path d="M7 13v5c3 2 7 2 10 0v-5M21 10v6" />
    </Svg>
  );
}

export function MailIcon(props) {
  return (
    <Svg {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M4 7l8 6 8-6" />
    </Svg>
  );
}

export function MaintenanceIcon(props) {
  return (
    <Svg {...props}>
      <path d="M14 6a4 4 0 0 0-5 5L3 17l4 4 6-6a4 4 0 0 0 5-5l-3 3-3-3z" />
    </Svg>
  );
}

export function SteeringWheelIcon(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 9V3M9.5 13.5L5 17M14.5 13.5L19 17" />
    </Svg>
  );
}

export function EuroIcon(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M16 8a5 5 0 1 0 0 8M7 11h7M7 14h7" />
    </Svg>
  );
}

export function FamilyIcon(props) {
  return (
    <Svg {...props}>
      <circle cx="9" cy="8" r="3" />
      <circle cx="16" cy="9" r="2.5" />
      <path d="M3 20a6 6 0 0 1 12 0M13 20a5 5 0 0 1 9 0" />
    </Svg>
  );
}

export function WarrantyIcon(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="8" />
      <path d="M8.5 12l2.2 2.2L16 9" />
    </Svg>
  );
}

export function InfoIcon(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v6M12 7h.01" />
    </Svg>
  );
}

export function YoungDriverIcon(props) {
  return (
    <Svg {...props}>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M9 7v10h7" />
    </Svg>
  );
}

export function MileageIcon(props) {
  return (
    <Svg {...props}>
      <path d="M4 17a8 8 0 1 1 16 0" />
      <path d="M12 13l4-4" />
      <circle cx="12" cy="13" r="1" />
    </Svg>
  );
}

export function PinIcon(props) {
  return (
    <Svg {...props}>
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0z" />
      <circle cx="12" cy="10" r="2.5" />
    </Svg>
  );
}

export function HomeIcon(props) {
  return (
    <Svg {...props}>
      <path d="M3 11l9-8 9 8" />
      <path d="M5 10v11h14V10M10 21v-6h4v6" />
    </Svg>
  );
}

export function CompassIcon(props) {
  return (
    <Svg {...props}>
      <path d="M3 11l18-8-8 18-2-8z" />
    </Svg>
  );
}

export function ParkingIcon(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M10 17V7h4a3 3 0 0 1 0 6h-4M10 13h4" />
    </Svg>
  );
}

export function TireIcon(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v5M12 16v5M3 12h5M16 12h5" />
    </Svg>
  );
}

export function DoorIcon(props) {
  return (
    <Svg {...props}>
      <path d="M6 21V4h12v17M9 12h.01" />
    </Svg>
  );
}

export function RegistrationIcon(props) {
  return (
    <Svg {...props}>
      <rect x="5" y="7" width="14" height="12" rx="2" />
      <path d="M8 3v4M16 3v4M5 11h14" />
    </Svg>
  );
}

export function TagIcon(props) {
  return (
    <Svg {...props}>
      <path d="M20 13l-7 7-9-9V4h7z" />
      <circle cx="8" cy="8" r="1" />
      <path d="M13 8h5M12 11h5" />
    </Svg>
  );
}

export function PowerIcon(props) {
  return (
    <Svg {...props}>
      <path d="M7 7h9l2 3h2v7h-3l-2 3H8l-2-3H4V9h3z" />
      <path d="M9 4h5M10 4v3M3 11H1M3 15H1" />
    </Svg>
  );
}

export function RoadIcon(props) {
  return (
    <Svg {...props}>
      <path d="M9 21l2-18M15 21L13 3M12 6v3M12 12v3M12 18v2" />
    </Svg>
  );
}

export function SeatIcon(props) {
  return (
    <Svg {...props}>
      <path d="M7 4v8a4 4 0 0 0 4 4h6v5M7 9h5a3 3 0 0 1 3 3v4" />
    </Svg>
  );
}

export function PhoneIcon(props) {
  return (
    <Svg {...props}>
      <path d="M6 3h4l2 5-3 2a15 15 0 0 0 5 5l2-3 5 2v4c0 2-2 3-4 3C9 20 4 15 3 7c0-2 1-4 3-4z" />
    </Svg>
  );
}

export function GearboxIcon(props) {
  return (
    <Svg {...props}>
      <path d="M7 4v16M17 4v16M7 8h10M7 16h10" />
      <circle cx="7" cy="4" r="1.5" />
      <circle cx="17" cy="4" r="1.5" />
      <circle cx="7" cy="20" r="1.5" />
      <circle cx="17" cy="20" r="1.5" />
    </Svg>
  );
}

export function CarIcon(props) {
  return (
    <Svg {...props}>
      <path d="M5 11l2-5h10l2 5" />
      <rect x="3" y="11" width="18" height="7" rx="2" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
    </Svg>
  );
}

/* Icones d'interface sans equivalent dans le set produit. */

export function ChevronDownIcon(props) {
  return (
    <Svg {...props}>
      <path d="M6 9l6 6 6-6" />
    </Svg>
  );
}

export function SearchIcon(props) {
  return (
    <Svg {...props}>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M20 20l-4.3-4.3" />
    </Svg>
  );
}

export function SlidersIcon(props) {
  return (
    <Svg {...props}>
      <path d="M4 7h10M17 7h3M4 17h3M10 17h10" />
      <circle cx="14" cy="7" r="2" />
      <circle cx="7" cy="17" r="2" />
    </Svg>
  );
}

export function MenuIcon(props) {
  return (
    <Svg {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </Svg>
  );
}

export function CloseIcon(props) {
  return (
    <Svg {...props}>
      <path d="M6 6l12 12M18 6L6 18" />
    </Svg>
  );
}

export function WhatsAppIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.198.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12.05 21.785h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884zm8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}
