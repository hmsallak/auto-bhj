function AdminNavIcon({ file }) {
  return <img src={`/icons/${file}`} alt="" width={18} height={18} aria-hidden="true" />;
}

export function OverviewIcon() {
  return <AdminNavIcon file="info.svg" />;
}

export function StockIcon() {
  return <AdminNavIcon file="voiture.svg" />;
}

export function AddIcon() {
  return <AdminNavIcon file="cle.svg" />;
}

export function MessagesIcon() {
  return <AdminNavIcon file="email.svg" />;
}

export function UsersIcon() {
  return <AdminNavIcon file="famille.svg" />;
}

export function ProfileIcon() {
  return <AdminNavIcon file="anciens_proprietaires.svg" />;
}

export function SettingsIcon() {
  return <AdminNavIcon file="entretien.svg" />;
}
