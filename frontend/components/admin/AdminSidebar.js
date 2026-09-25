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
  { id: "messages", label: "Messages", Icon: MessagesIcon, permission: "messages_read" },
  { id: "appointments", label: "Mes rendez-vous", Icon: CalendarIcon, permission: APPOINTMENT_VIEW_PERMISSIONS },
  { id: "app", label: "Parametres", Icon: AppIcon },
  { id: "users", label: "Utilisateurs", Icon: UsersIcon, adminOnly: true },
];

function canSeeTab(tab, user) {
  if (tab.ownerOnly) return user?.role === "owner";
  if (tab.adminOnly) return Boolean(user?.isAdmin);
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
  unreadCount,
}) {
  const visibleTabs = TABS.filter((tab) => canSeeTab(tab, user));
  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ");
  const roleLabel = user?.role === "owner" ? "Proprietaire" : user?.isAdmin ? "Administrateur" : "Membre";

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
            <span>
              {label}
              {/* Only one alert in the menu: unread messages, as a small red
                  "(n)" right after the word (inside the label, so it never
                  gets stretched like a separate flex item). */}
              {id === "messages" && unreadCount > 0 && (
                <span className="dash-nav-dot" aria-label={`${unreadCount} message${unreadCount > 1 ? "s" : ""} non lu${unreadCount > 1 ? "s" : ""}`}>
                  {" "}({unreadCount > 9 ? "9+" : unreadCount})
                </span>
              )}
            </span>
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
