function Svg({ children, ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {children}
    </svg>
  );
}

export function GaugeIcon(props) {
  return (
    <Svg {...props}>
      <path d="M4 15a8 8 0 1 1 16 0" />
      <path d="M12 15l4-5" />
      <path d="M12 15h.01" />
    </Svg>
  );
}

export function GearboxIcon(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v3M12 18v3M4.2 7.5l2.6 1.5M17.2 15l2.6 1.5M4.2 16.5l2.6-1.5M17.2 9l2.6-1.5" />
    </Svg>
  );
}

export function FuelIcon(props) {
  return (
    <Svg {...props}>
      <path d="M4 21V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v15" />
      <path d="M4 11h8" />
      <path d="M14 8l3 2v6a1.5 1.5 0 0 0 3 0V9l-3-3" />
    </Svg>
  );
}

export function PaintDropIcon(props) {
  return (
    <Svg {...props}>
      <path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z" />
    </Svg>
  );
}

export function CloudIcon(props) {
  return (
    <Svg {...props}>
      <path d="M7 18a4 4 0 1 1 .7-7.94A5.5 5.5 0 0 1 18 12.5 3.5 3.5 0 0 1 17.5 18H7Z" />
    </Svg>
  );
}

export function SeatIcon(props) {
  return (
    <Svg {...props}>
      <path d="M7 4v9a2 2 0 0 0 2 2h6" />
      <path d="M7 13H5.5A1.5 1.5 0 0 0 4 14.5v3A1.5 1.5 0 0 0 5.5 19h11a1.5 1.5 0 0 0 1.5-1.5V16" />
      <path d="M15 15v-3a2 2 0 0 1 2-2h1" />
    </Svg>
  );
}

export function PistonIcon(props) {
  return (
    <Svg {...props}>
      <rect x="9" y="3" width="6" height="7" rx="1" />
      <path d="M12 10v4" />
      <path d="M8 14h8v3a1 1 0 0 1-1 1h-1l-1 3h-2l-1-3H9a1 1 0 0 1-1-1v-3Z" />
    </Svg>
  );
}

export function BoltIcon(props) {
  return (
    <Svg {...props}>
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
    </Svg>
  );
}

export function DoorIcon(props) {
  return (
    <Svg {...props}>
      <rect x="5" y="3" width="14" height="18" rx="1.5" />
      <path d="M14 12h.01" />
    </Svg>
  );
}

export function CarBodyIcon(props) {
  return (
    <Svg {...props}>
      <path d="M3 16v-3l2.2-4.4A2 2 0 0 1 7 7.4h10a2 2 0 0 1 1.8 1.1L21 13v3" />
      <path d="M3 16h18" />
      <circle cx="7.5" cy="17.5" r="1.5" />
      <circle cx="16.5" cy="17.5" r="1.5" />
    </Svg>
  );
}

export function CalendarIcon(props) {
  return (
    <Svg {...props}>
      <rect x="4" y="5" width="16" height="16" rx="2" />
      <path d="M4 10h16M8 3v4M16 3v4" />
    </Svg>
  );
}

export function ChevronDownIcon(props) {
  return (
    <Svg {...props}>
      <path d="M6 9l6 6 6-6" />
    </Svg>
  );
}

export function OwnersIcon(props) {
  return (
    <Svg {...props}>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20a6 6 0 0 1 12 0" />
      <circle cx="18" cy="9" r="2.2" />
      <path d="M15.5 20a5 5 0 0 1 6-4.9" />
    </Svg>
  );
}
