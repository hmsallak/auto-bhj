"use client";

// Building blocks shared by the phone-style admin pages (Parametres,
// Utilisateurs): pill tabs, unfolding rows, the on/off pill and line icons.

const ICON_PATHS = {
  site: "M3 10.5 12 4l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.5Z",
  version: "M12 3v4m0 10v4M3 12h4m10 0h4M6 6l2.5 2.5m7 7L18 18M6 18l2.5-2.5m7-7L18 6",
  device: "M8 3h8a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm3 15h2",
  requests: "M4 5h16v11H8l-4 4V5Zm4 5h8",
  reminders: "M12 8v4l3 2M12 21a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM5 4 3 6m16-2 2 2",
  digest: "M12 3v2m0 14v2M4.2 7l1.7 1M18.1 16l1.7 1M3 12h2m14 0h2M4.2 17l1.7-1M18.1 8l1.7-1M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z",
  access: "M15 19v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1M9 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm9-2v6m3-3h-6",
  password: "M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3",
  email: "M4 6h16v12H4zM4 7l8 6 8-6",
};

export function RowIcon({ name }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path d={ICON_PATHS[name]} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Chevron({ up }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path d={up ? "M6 15l6-6 6 6" : "M6 9l6 6 6-6"} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Pill tabs at the top of a settings page. tabs: [{ id, label, count? }]
export function PillTabs({ tabs, active, onSelect, label, small = false }) {
  return (
    <div className={`set-tabs ${small ? "is-small" : ""}`} role="tablist" aria-label={label}>
      {tabs.map((item) => (
        <button
          key={item.id}
          type="button"
          role="tab"
          aria-selected={active === item.id}
          className={active === item.id ? "is-active" : ""}
          onClick={() => onSelect(item.id)}
        >
          {item.label}
          {item.count > 0 && <span className="set-tab-count">{item.count}</span>}
        </button>
      ))}
    </div>
  );
}

// On/off pill: a round icon knob slides right (on) / left (off) and turns,
// adapted from the "button with icon" component to the project's plain CSS.
export function PillToggle({ checked, disabled, labelledBy, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-labelledby={labelledBy}
      disabled={disabled}
      className={`pill-toggle ${checked ? "is-on" : ""}`}
      onClick={() => onChange(!checked)}
    >
      <span className="pill-toggle-text">{checked ? "Active" : "Desactive"}</span>
      <span className="pill-toggle-knob" aria-hidden="true">
        {checked ? (
          <svg viewBox="0 0 24 24" width="14" height="14">
            <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="14" height="14">
            <path d="M7 7l10 10M17 7L7 17" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
          </svg>
        )}
      </span>
    </button>
  );
}

// One settings line: leading icon (or `leading` node, e.g. an avatar),
// title, current value and a chevron that unfolds the controls in place
// (points up when open). The parent keeps one row open.
export function SettingRow({ id, icon, leading, title, value, open, onToggle, children }) {
  return (
    <li className={`set-row ${open ? "is-open" : ""}`}>
      <button type="button" className="set-row-head" aria-expanded={open} aria-controls={`set-${id}`} onClick={onToggle}>
        <span className="set-row-icon">{leading || <RowIcon name={icon} />}</span>
        <span className="set-row-text">
          <strong id={`set-title-${id}`}>{title}</strong>
          {value && !open && <span>{value}</span>}
        </span>
        <span className="set-row-action">
          <Chevron up={open} />
        </span>
      </button>
      {open && (
        <div className="set-row-body" id={`set-${id}`} role="region" aria-labelledby={`set-title-${id}`}>
          {children}
        </div>
      )}
    </li>
  );
}
