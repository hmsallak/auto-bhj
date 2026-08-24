import OfficialIcon from "../OfficialIcon";

function UtilityTextIcon({ children, className, ...props }) {
  return (
    <span className={className} aria-hidden="true" {...props}>
      {children}
    </span>
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
  return <UtilityTextIcon {...props}>‹</UtilityTextIcon>;
}

export function ChevronRightIcon(props) {
  return <UtilityTextIcon {...props}>›</UtilityTextIcon>;
}

export function ChevronDownIcon(props) {
  return <UtilityTextIcon {...props}>⌄</UtilityTextIcon>;
}

export function MenuIcon(props) {
  return <UtilityTextIcon {...props}>☰</UtilityTextIcon>;
}

export function CloseIcon(props) {
  return <UtilityTextIcon {...props}>×</UtilityTextIcon>;
}

export function WhatsAppIcon(props) {
  return <OfficialIcon name="whatsapp" {...props} />;
}
