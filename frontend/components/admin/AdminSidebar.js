import { OverviewIcon, StockIcon, AddIcon, MessagesIcon, UsersIcon, SettingsIcon } from "./icons";

export const TABS = [
  { id: "overview", label: "Vue d'ensemble", Icon: OverviewIcon },
  { id: "stock", label: "Stock", Icon: StockIcon, permission: "stock" },
  { id: "form", label: "Ajouter / Modifier", Icon: AddIcon, permission: "stock" },
  { id: "messages", label: "Messages", Icon: MessagesIcon, permission: "messages" },
  { id: "users", label: "Equipe", Icon: UsersIcon, ownerOnly: true },
  { id: "settings", label: "Parametres", Icon: SettingsIcon },
];

function canSeeTab(tab, user) {
  if (tab.ownerOnly) return user?.role === "owner";
  if (!tab.permission) return true;
  if (user?.role === "owner") return true;
  return Boolean(user?.permissions?.includes(tab.permission));
}

export default function AdminSidebar({ activeTab, onSelect, user, stockCount, unreadCount }) {
  const visibleTabs = TABS.filter((tab) => canSeeTab(tab, user));

  return (
    <aside className="dash-sidebar">
      <div className="dash-brand">
        <span className="dash-plate">AB</span>
        <div>
          <strong>Auto BHJ</strong>
          <span>Administration</span>
        </div>
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
        <a href="/">Voir le site public</a>
      </div>
    </aside>
  );
}
