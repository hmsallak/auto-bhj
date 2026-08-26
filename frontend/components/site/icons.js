import OfficialIcon from "../OfficialIcon";

function UtilityTextIcon({ children, className, ...props }) {
  return (
    <span className={className} aria-hidden="true" {...props}>
      {children}
    </span>
  );
}

function InterfaceSvg(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    />
  );
}

export function ShieldIcon(props) {
  return <OfficialIcon name="warranty" {...props} />;
}

export function TagIcon(props) {
  return <OfficialIcon name="price" {...props} />;
}

export function RefreshIcon(props) {
  return <OfficialIcon name="inspection" {...props} />;
}

export function HeadsetIcon(props) {
  return <OfficialIcon name="contact" {...props} />;
}

export function SearchIcon(props) {
  return <OfficialIcon name="filters" {...props} />;
}

export function MessageIcon(props) {
  return <OfficialIcon name="contact" {...props} />;
}

export function DocumentIcon(props) {
  return <OfficialIcon name="inspection" {...props} />;
}

export function CalendarCheckIcon(props) {
  return <OfficialIcon name="appointment" {...props} />;
}

export function KeyIcon(props) {
  return <OfficialIcon name="available" {...props} />;
}

export function StarIcon(props) {
  return <OfficialIcon name="favorite" {...props} />;
}

export function PinIcon(props) {
  return <OfficialIcon name="address" {...props} />;
}

export function PhoneIcon(props) {
  return <OfficialIcon name="phone" {...props} />;
}

export function ClockIcon(props) {
  return <OfficialIcon name="appointment" {...props} />;
}

export function MailIcon(props) {
  return <OfficialIcon name="contact" {...props} />;
}

export function ChevronLeftIcon(props) {
  return (
    <InterfaceSvg {...props}>
      <path d="M15 6l-6 6 6 6" />
    </InterfaceSvg>
  );
}

export function ChevronRightIcon(props) {
  return (
    <InterfaceSvg {...props}>
      <path d="M9 6l6 6-6 6" />
    </InterfaceSvg>
  );
}

export function ChevronDownIcon(props) {
  return (
    <InterfaceSvg {...props}>
      <path d="M6 9l6 6 6-6" />
    </InterfaceSvg>
  );
}

export function MenuIcon(props) {
  return (
    <InterfaceSvg {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </InterfaceSvg>
  );
}

export function CloseIcon(props) {
  return (
    <InterfaceSvg {...props}>
      <path d="M6 6l12 12M18 6L6 18" />
    </InterfaceSvg>
  );
}

export function WhatsAppIcon(props) {
  return <OfficialIcon name="whatsapp" {...props} />;
}
