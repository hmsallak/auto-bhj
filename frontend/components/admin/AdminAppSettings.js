"use client";

import { useEffect, useState } from "react";
import usePushDevice from "./usePushDevice";
import { PillTabs, PillToggle, SettingRow } from "./SettingsUI";
import { CHANGELOG, CURRENT_VERSION } from "../../lib/changelog";

const dateFormat = new Intl.DateTimeFormat("fr-BE", { day: "numeric", month: "long", year: "numeric" });

function formatDate(isoDay) {
  const [year, month, day] = isoDay.split("-").map(Number);
  return dateFormat.format(new Date(year, month - 1, day));
}

function FormMessage({ message }) {
  if (!message.text) return null;
  return (
    <p className={`set-form-message ${message.error ? "is-error" : ""}`} role={message.error ? "alert" : "status"}>
      {message.text}
    </p>
  );
}

function PasswordForm({ onChangePassword, onClose }) {
  const [message, setMessage] = useState({ text: "", error: false });
  const [busy, setBusy] = useState(false);
  const [filled, setFilled] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const currentPassword = String(data.get("currentPassword") || "");
    const newPassword = String(data.get("newPassword") || "");
    if (newPassword !== String(data.get("confirmPassword") || "")) {
      setMessage({ text: "Les deux nouveaux mots de passe ne correspondent pas.", error: true });
      return;
    }
    setBusy(true);
    try {
      await onChangePassword({ currentPassword, newPassword });
      form.reset();
      setFilled(false);
      setMessage({ text: "Mot de passe modifie.", error: false });
    } catch (error) {
      setMessage({ text: error.message, error: true });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      className="set-form"
      onSubmit={handleSubmit}
      onInput={(event) => {
        const inputs = [...event.currentTarget.querySelectorAll("input")];
        setFilled(inputs.every((input) => input.value));
      }}
    >
      <p className="set-help">
        Changer regulierement votre mot de passe ameliore votre securite. Evitez d'utiliser le meme mot de passe
        ailleurs.
      </p>
      <input name="currentPassword" type="password" autoComplete="current-password" placeholder="Mot de passe actuel" aria-label="Mot de passe actuel" required />
      <input name="newPassword" type="password" autoComplete="new-password" placeholder="Nouveau mot de passe" aria-label="Nouveau mot de passe" required minLength={8} />
      <input name="confirmPassword" type="password" autoComplete="new-password" placeholder="Confirmer le nouveau mot de passe" aria-label="Confirmer le nouveau mot de passe" required minLength={8} />
      <FormMessage message={message} />
      <div className="set-form-actions">
        <button className="button neutral small" type="button" onClick={onClose}>
          Annuler
        </button>
        <button className="button primary small" type="submit" disabled={busy || !filled}>
          {busy ? "..." : "Enregistrer"}
        </button>
      </div>
    </form>
  );
}

function EmailForm({ currentEmail, onUpdateEmail, onClose }) {
  const [message, setMessage] = useState({ text: "", error: false });
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") || "").trim();
    const currentPassword = String(data.get("currentPassword") || "");
    setBusy(true);
    try {
      await onUpdateEmail(email, currentPassword);
      setMessage({ text: "E-mail enregistre.", error: false });
    } catch (error) {
      setMessage({ text: error.message, error: true });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="set-form" onSubmit={handleSubmit}>
      <p className="set-help">Sert a vous connecter et a recevoir le lien si vous oubliez votre mot de passe.</p>
      <input name="email" type="email" autoComplete="email" placeholder="Adresse e-mail" aria-label="Adresse e-mail" defaultValue={currentEmail || ""} required />
      <input
        name="currentPassword"
        type="password"
        autoComplete="current-password"
        placeholder="Mot de passe actuel"
        aria-label="Mot de passe actuel"
        required
      />
      <FormMessage message={message} />
      <div className="set-form-actions">
        <button className="button neutral small" type="button" onClick={onClose}>
          Annuler
        </button>
        <button className="button primary small" type="submit" disabled={busy}>
          {busy ? "..." : "Enregistrer"}
        </button>
      </div>
    </form>
  );
}

const TABS = [
  { id: "general", label: "General", ownerOnly: true },
  { id: "notifications", label: "Notifications" },
  { id: "security", label: "Securite" },
  { id: "about", label: "A propos" },
];

// Version history (owner only): one line per release, details folded.
function VersionHistory() {
  return (
    <ol className="app-changelog">
      {CHANGELOG.map((release) => (
        <li key={release.version}>
          <details>
            <summary>
              <span className="app-changelog-version">{release.version}</span>
              <span className="app-changelog-title">{release.title}</span>
              <time dateTime={release.date}>{formatDate(release.date)}</time>
            </summary>
            <ul>
              {release.changes.map((change) => (
                <li key={change}>{change}</li>
              ))}
            </ul>
          </details>
        </li>
      ))}
    </ol>
  );
}

// Admin > Parametres, laid out like a phone settings screen: pill tabs,
// then rows that unfold their controls. `children`: owner-only site
// contact form (shown in the "Coordonnees du site" row).
export default function AdminAppSettings({ user, onChangePassword, onUpdateEmail, children }) {
  const push = usePushDevice();
  const isOwner = user?.role === "owner";
  // General only holds owner settings (site contact details).
  const visibleTabs = TABS.filter((item) => !item.ownerOnly || isOwner);
  const [tab, setTab] = useState(visibleTabs[0].id);
  const [openRow, setOpenRow] = useState(null);
  const [prefs, setPrefs] = useState(null);
  const [prefsError, setPrefsError] = useState("");
  const [savingKey, setSavingKey] = useState(null);

  useEffect(() => {
    fetch("/api/admin/notification-prefs", { credentials: "same-origin" })
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then(setPrefs)
      .catch(() => setPrefsError("Impossible de charger vos preferences."));
  }, []);

  async function toggle(key, enabled) {
    setSavingKey(key);
    setPrefsError("");
    // Optimistic: the switch moves at once, and comes back if saving fails.
    setPrefs((current) => current.map((item) => (item.key === key ? { ...item, enabled } : item)));
    try {
      const response = await fetch("/api/admin/notification-prefs", {
        method: "PUT",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [key]: enabled }),
      });
      if (!response.ok) throw new Error();
      setPrefs(await response.json());
    } catch {
      setPrefs((current) => current.map((item) => (item.key === key ? { ...item, enabled: !enabled } : item)));
      setPrefsError("Le changement n'a pas pu etre enregistre.");
    } finally {
      setSavingKey(null);
    }
  }

  const deviceOn = push.state === "on";
  // The device switch only works once the browser allows push at all.
  const deviceSwitchable = push.state === "on" || push.state === "off";
  const closeRow = () => setOpenRow(null);
  const rowProps = (id) => ({
    id,
    open: openRow === id,
    onToggle: () => setOpenRow((current) => (current === id ? null : id)),
  });

  function selectTab(id) {
    setTab(id);
    setOpenRow(null);
  }

  return (
    <div className="panel dash-panel set-page">
      <PillTabs tabs={visibleTabs} active={tab} onSelect={selectTab} label="Sections des parametres" />

      {tab === "general" && (
        <ul className="set-list" role="tabpanel" aria-label="General">
          {children && (
            <SettingRow {...rowProps("site")} icon="site" title="Coordonnees du site" value="Telephone et e-mail affiches sur le site">
              {children}
            </SettingRow>
          )}
        </ul>
      )}

      {tab === "about" && (
        <div className="set-about" role="tabpanel" aria-label="A propos">
          <div className="set-about-head">
            <img src="/admin-icon-192.png" alt="" width={56} height={56} />
            <div>
              <strong>BHJ Admin</strong>
              <span>
                Version {CURRENT_VERSION.version} - mise a jour le {formatDate(CURRENT_VERSION.date)}
              </span>
            </div>
          </div>

          <h3>Nouveautes</h3>
          <ul className="set-about-news">
            {(CURRENT_VERSION.highlights || CURRENT_VERSION.changes.slice(0, 3)).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          {isOwner && (
            <ul className="set-list">
              <SettingRow {...rowProps("history")} icon="version" title="Historique des versions" value={`${CHANGELOG.length} versions`}>
                <VersionHistory />
              </SettingRow>
            </ul>
          )}
        </div>
      )}

      {tab === "notifications" && (
        <ul className="set-list" role="tabpanel" aria-label="Notifications">
          <SettingRow {...rowProps("device")} icon="device" title="Cet appareil" value={deviceOn ? "Active" : push.statusText}>
            <p className="set-help">
              Recevoir les notifications de l'admin sur ce telephone ou cet ordinateur. Desactive, aucune notification
              n'arrive ici, quels que soient les choix ci-dessous.
            </p>
            <div className="set-control">
              <PillToggle
                checked={deviceOn}
                disabled={!deviceSwitchable || push.busy}
                labelledBy="set-device-label"
                onChange={(value) => (value ? push.enable() : push.disable())}
              />
              <span id="set-device-label">Recevoir les notifications ici</span>
            </div>
            {(deviceOn || push.installEvent) && (
              <div className="set-links">
                {deviceOn && (
                  <button className="dash-link" type="button" onClick={push.sendTest} disabled={push.busy}>
                    Envoyer une notification de test
                  </button>
                )}
                {push.installEvent && (
                  <button className="dash-link" type="button" onClick={push.install}>
                    Installer l'app
                  </button>
                )}
              </div>
            )}
            {push.info && (
              <p className="set-form-message" role="status">
                {push.info}
              </p>
            )}
          </SettingRow>

          {prefs?.map((item) => {
            // Device off: every type shows off and locked; the saved choices
            // come back as they were once the device is on again.
            const effective = deviceOn && item.enabled;
            return (
              <SettingRow
                key={item.key}
                {...rowProps(item.key)}
                icon={item.key}
                title={item.label}
                value={deviceOn ? (item.enabled ? "Active" : "Desactive") : "Desactive (appareil)"}
              >
                <p className="set-help">{item.description}</p>
                <div className="set-control">
                  <PillToggle
                    checked={effective}
                    disabled={!deviceOn || savingKey === item.key}
                    labelledBy={`set-pref-${item.key}`}
                    onChange={(value) => toggle(item.key, value)}
                  />
                  <span id={`set-pref-${item.key}`}>Recevoir cette notification</span>
                </div>
                {!deviceOn && <p className="set-help">Activez d'abord « Cet appareil ».</p>}
              </SettingRow>
            );
          })}
          {!prefs && !prefsError && <li className="empty">Chargement...</li>}
          {prefsError && (
            <li className="message error" role="alert">
              {prefsError}
            </li>
          )}
        </ul>
      )}

      {tab === "security" && (
        <ul className="set-list" role="tabpanel" aria-label="Securite">
          <SettingRow {...rowProps("password")} icon="password" title="Modifier le mot de passe">
            <PasswordForm onChangePassword={onChangePassword} onClose={closeRow} />
          </SettingRow>
          <SettingRow {...rowProps("email")} icon="email" title="E-mail de connexion" value={user?.email || "Aucun"}>
            <EmailForm currentEmail={user?.email} onUpdateEmail={onUpdateEmail} onClose={closeRow} />
          </SettingRow>
        </ul>
      )}
    </div>
  );
}
