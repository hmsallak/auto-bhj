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
      <input name="newPassword" type="password" autoComplete="new-password" placeholder="Nouveau mot de passe" aria-label="Nouveau mot de passe" required minLength={10} />
      <input name="confirmPassword" type="password" autoComplete="new-password" placeholder="Confirmer le nouveau mot de passe" aria-label="Confirmer le nouveau mot de passe" required minLength={10} />
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

function EmailForm({ currentEmail, pendingEmail, onUpdateEmail, onClose }) {
  const [message, setMessage] = useState({ text: "", error: false });
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") || "").trim();
    const currentPassword = String(data.get("currentPassword") || "");
    setBusy(true);
    try {
      const result = await onUpdateEmail(email, currentPassword);
      setMessage({
        text: result.pendingEmail
          ? `Un lien de confirmation a ete envoye a ${result.pendingEmail}.`
          : "Adresse e-mail retiree.",
        error: false,
      });
    } catch (error) {
      setMessage({ text: error.message, error: true });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="set-form" onSubmit={handleSubmit}>
      <p className="set-help">Sert a vous connecter et a recevoir le lien si vous oubliez votre mot de passe.</p>
      {pendingEmail && <p className="set-help">Confirmation en attente pour : {pendingEmail}</p>}
      <input name="email" type="email" autoComplete="email" placeholder="Nouvelle adresse e-mail" aria-label="Nouvelle adresse e-mail" defaultValue={currentEmail || ""} required />
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

function AccountSecurity() {
  const [details, setDetails] = useState(null);
  const [message, setMessage] = useState({ text: "", error: false });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch("/api/admin/account-security", { credentials: "same-origin" })
      .then(async (response) => {
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(payload.error || "Impossible de charger vos appareils.");
        setDetails(payload);
      })
      .catch((error) => setMessage({ text: error.message, error: true }));
  }, []);

  async function disconnectOthers(event) {
    event.preventDefault();
    const currentPassword = String(new FormData(event.currentTarget).get("currentPassword") || "");
    setBusy(true);
    setMessage({ text: "", error: false });
    try {
      const response = await fetch("/api/admin/account-security", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || "Impossible de deconnecter les autres sessions.");
      setDetails(payload);
      event.currentTarget.reset();
      setMessage({ text: "Les autres sessions ont ete deconnectees.", error: false });
    } catch (error) {
      setMessage({ text: error.message, error: true });
    } finally {
      setBusy(false);
    }
  }

  if (!details && !message.text) return <p className="set-help">Chargement des appareils...</p>;

  const sessionCount = details?.sessions?.length || 0;
  const deviceCount = details?.notificationDevices?.length || 0;
  return (
    <div className="set-security-devices">
      <p className="set-help">
        {sessionCount} session{sessionCount > 1 ? "s" : ""} active{sessionCount > 1 ? "s" : ""} et {deviceCount} appareil{deviceCount > 1 ? "s" : ""} autorise{deviceCount > 1 ? "s" : ""} pour les notifications.
      </p>
      {details?.sessions?.map((session, index) => (
        <p className="set-device-line" key={`${session.createdAt}-${index}`}>
          {session.current ? "Cet appareil" : "Autre session"} - actif le {new Intl.DateTimeFormat("fr-BE", { dateStyle: "medium", timeStyle: "short" }).format(new Date(session.lastSeenAt))}
        </p>
      ))}
      <form className="set-form" onSubmit={disconnectOthers}>
        <label className="visually-hidden" htmlFor="disconnect-others-password">Mot de passe actuel</label>
        <input id="disconnect-others-password" name="currentPassword" type="password" autoComplete="current-password" placeholder="Mot de passe actuel" required />
        <div className="set-form-actions">
          <button className="button neutral small" type="submit" disabled={busy || sessionCount < 2}>
            {busy ? "..." : "Deconnecter les autres sessions"}
          </button>
        </div>
      </form>
      <FormMessage message={message} />
    </div>
  );
}

const TABS = [
  { id: "general", label: "Site", ownerOnly: true },
  { id: "notifications", label: "Notifications" },
  { id: "activity", label: "Activite" },
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

      {tab === "notifications" && (
        <ul className="set-list" role="tabpanel" aria-label="Notifications">
          <li className="set-group-title">Sur cet appareil</li>
          <SettingRow {...rowProps("device")} icon="device" title="Notifications sur cet appareil" value={deviceOn ? "Activees" : push.statusText}>
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

          <li className="set-group-title">Pour mon compte</li>
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

      {tab === "activity" && (
        <ul className="set-list" role="tabpanel" aria-label="Activite">
          {user?.isAdmin && (
            <SettingRow {...rowProps("sessions")} icon="sessions" title="Sessions et appareils">
              <AccountSecurity />
            </SettingRow>
          )}
          {isOwner && (
            <SettingRow {...rowProps("history")} icon="version" title="Historique des mises a jour" value={`${CHANGELOG.length} versions`}>
              <VersionHistory />
            </SettingRow>
          )}
          {!user?.isAdmin && !isOwner && <li className="empty">Aucune activite disponible.</li>}
        </ul>
      )}
    </div>
  );
}
