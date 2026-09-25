import Image from "next/image";
import { CloseIcon } from "../home/icons";
import AdminUserMenu from "./AdminUserMenu";
import { APPOINTMENT_VIEW_PERMISSIONS } from "./userPermissions";
import { OverviewIcon, StockIcon, MessagesIcon, CalendarIcon, AppIcon, UsersIcon } from "./icons";

// "profile" (the account settings page) is reachable only from the
// top-right account menu, not the sidebar.
export const TABS = [
  { id: "overview", label: "Tableau de bord", Icon: OverviewIcon },
  { id: "stock", label: "Vehicules", Icon: StockIcon, permission: "stock_read" },
  { id: "messages", label: "Demandes", Icon: MessagesIcon, permission: "messages_read" },
  { id: "appointments", label: "Mes rendez-vous", Icon: CalendarIcon, permission: APPOINTMENT_VIEW_PERMISSIONS },
  { id: "app", label: "Parametres", Icon: AppIcon },
  { id: "users", label: "Utilisateurs", Icon: UsersIcon, ownerOnly: true },
];

function canSeeTab(tab, user) {
  if (tab.ownerOnly) return user?.role === "owner";
  if (!tab.permission) return true;
  if (user?.role === "owner") return true;
  const needed = Array.isArray(tab.permission) ? tab.permission : [tab.permission];
  return needed.some((key) => user?.permissions?.includes(key));
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
  upcomingCount = 0,
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
            {id === "appointments" && upcomingCount > 0 && (
              <span className="dash-nav-badge">{upcomingCount}</span>
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
