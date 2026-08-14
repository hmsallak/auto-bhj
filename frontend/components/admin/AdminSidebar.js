import { OverviewIcon, StockIcon, AddIcon, MessagesIcon, SettingsIcon } from "./icons";

export const TABS = [
  { id: "overview", label: "Vue d'ensemble", Icon: OverviewIcon },
  { id: "stock", label: "Stock", Icon: StockIcon },
  { id: "form", label: "Ajouter / Modifier", Icon: AddIcon },
  { id: "messages", label: "Messages", Icon: MessagesIcon },
  { id: "settings", label: "Parametres", Icon: SettingsIcon },
];

export default function AdminSidebar({ activeTab, onSelect, username, stockCount, unreadCount }) {
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
        {TABS.map(({ id, label, Icon }) => (
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
        <span className="dash-user">{username}</span>
        <a href="/">Voir le site public</a>
      </div>
    </aside>
  );
}
