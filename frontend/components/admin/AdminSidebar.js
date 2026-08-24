import Image from "next/image";
import {
  OverviewIcon,
  StockIcon,
  MessagesIcon,
  UsersIcon,
  ProfileIcon,
  SettingsIcon,
} from "./icons";

export const TABS = [
  { id: "overview", label: "Tableau de bord", Icon: OverviewIcon },
  { id: "stock", label: "Vehicules", Icon: StockIcon, permission: "stock_read" },
  { id: "messages", label: "Demandes", Icon: MessagesIcon, permission: "messages_read" },
  { id: "users", label: "Equipe", Icon: UsersIcon, ownerOnly: true },
  { id: "profile", label: "Mon profil", Icon: ProfileIcon },
  { id: "settings", label: "Parametres", Icon: SettingsIcon, ownerOnly: true },
];

function canSeeTab(tab, user) {
  if (tab.ownerOnly) return user?.role === "owner";
  if (!tab.permission) return true;
  if (user?.role === "owner") return true;
  return Boolean(user?.permissions?.includes(tab.permission));
}

export default function AdminSidebar({
  activeTab,
  onSelect,
  onClose,
  onLogout,
  isOpen = false,
  user,
  stockCount,
  unreadCount,
}) {
  const visibleTabs = TABS.filter((tab) => canSeeTab(tab, user));

  return (
    <aside className={`dash-sidebar ${isOpen ? "open" : ""}`} aria-label="Navigation admin">
      <div className="dash-brand">
        <Image className="dash-logo" src="/logo.png" alt="Auto BHJ" width={2048} height={768} priority />
        <span className="dash-brand-sub">Administration</span>
        <button className="dash-mobile-menu-close" type="button" aria-label="Fermer le menu" onClick={onClose}>
          x
        </button>
      </div>

      <nav className="dash-nav">
        {visibleTabs.map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            className={`dash-nav-item ${activeTab === id ? "active" : ""}`}
            onClick={() => onSelect(id)}
          >
            <Icon />
            <span>{label}</span>
            {id === "stock" && <span className="dash-nav-badge">{stockCount}</span>}
            {id === "messages" && unreadCount > 0 && (
              <span className="dash-nav-badge unread">{unreadCount}</span>
            )}
          </button>
        ))}
      </nav>

      <div className="dash-sidebar-footer">
        <span className="dash-user">{user?.username}</span>
        <span className="dash-role">{user?.role === "owner" ? "Proprietaire" : "Membre"}</span>
        <button className="dash-sidebar-logout" type="button" onClick={onLogout}>
          Deconnexion
        </button>
        <a href="/">Voir le site public</a>
      </div>
    </aside>
  );
}
