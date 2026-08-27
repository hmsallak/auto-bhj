import Image from "next/image";
import { CloseIcon } from "../home/icons";
import AdminUserMenu from "./AdminUserMenu";
import { OverviewIcon, StockIcon, MessagesIcon, UsersIcon } from "./icons";

// "profile" (the account settings page) is reachable only from the
// top-right account menu, not the sidebar.
export const TABS = [
  { id: "overview", label: "Tableau de bord", Icon: OverviewIcon },
  { id: "stock", label: "Vehicules", Icon: StockIcon, permission: "stock_read" },
  { id: "messages", label: "Demandes", Icon: MessagesIcon, permission: "messages_read" },
  { id: "users", label: "Equipe", Icon: UsersIcon, ownerOnly: true },
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
  pendingUserCount = 0,
}) {
  const visibleTabs = TABS.filter((tab) => canSeeTab(tab, user));
  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ");
  const roleLabel = user?.role === "owner" ? "Proprietaire" : "Membre";

  return (
    <aside className={`dash-sidebar ${isOpen ? "open" : ""}`} aria-label="Navigation admin">
      <div className="dash-brand">
        <AdminUserMenu
          user={user}
          onGoToProfile={() => onSelect("profile")}
          onLogout={onLogout}
        />
        <div className="dash-brand-identity">
          <strong>{fullName || roleLabel}</strong>
          <span>{user?.email || user?.username}</span>
        </div>
        <button
          className="dash-mobile-menu-close"
          type="button"
          aria-label="Fermer le menu"
          onClick={onClose}
        >
          <CloseIcon aria-hidden="true" />
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
            {id === "users" && pendingUserCount > 0 && (
              <span className="dash-nav-badge unread">{pendingUserCount}</span>
            )}
          </button>
        ))}
      </nav>

      <div className="dash-sidebar-logo">
        <Image
          className="dash-logo"
          src="/logo-auto-bhj.png"
          alt="Auto BHJ"
          width={350}
          height={200}
          priority
        />
      </div>

      <div className="dash-sidebar-footer">
        <button className="dash-sidebar-logout" type="button" onClick={onLogout}>
          Deconnexion
        </button>
        <a href="/">Voir le site public</a>
      </div>
    </aside>
  );
}
