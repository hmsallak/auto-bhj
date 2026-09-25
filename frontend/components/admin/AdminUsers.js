"use client";

import { useMemo, useState } from "react";
import { USER_PERMISSIONS } from "./userPermissions";
import { PillTabs, PillToggle, SettingRow } from "./SettingsUI";

const ACTION_LABELS = {
  car_created: "Voiture ajoutee",
  car_updated: "Voiture modifiee",
  car_status_changed: "Statut modifie",
  car_deleted: "Voiture supprimee",
  message_received: "Message recu",
  message_deleted: "Message supprime",
  appointment_created: "Rendez-vous planifie",
  appointment_updated: "Rendez-vous modifie",
  appointment_deleted: "Rendez-vous annule",
  user_created: "Utilisateur cree",
  user_permissions_updated: "Droits modifies",
  user_approved: "Demande approuvee",
  user_rejected: "Demande refusee",
  user_deleted: "Utilisateur supprime",
  site_settings_updated: "Coordonnees du site modifiees",
  journal_cleared: "Journal vide",
};

// Journal sections, by action prefix. Parametres = accounts, rights and
// site settings (this whole page is owner-only).
const JOURNALS = [
  { id: "cars", label: "Voitures", match: (action) => action.startsWith("car_") },
  { id: "messages", label: "Messages", match: (action) => action.startsWith("message_") },
  { id: "appointments", label: "RDV", fullLabel: "Rendez-vous", match: (action) => action.startsWith("appointment_") },
  {
    id: "settings",
    label: "Parametres",
    match: (action) => action.startsWith("user_") || action.startsWith("site_settings") || action.startsWith("journal_"),
  },
];

function relativeTime(iso) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.round(diffMs / 60000);
  if (minutes < 1) return "a l'instant";
  if (minutes < 60) return `il y a ${minutes} min`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `il y a ${hours} h`;
  const days = Math.round(hours / 24);
  return `il y a ${days} j`;
}

function displayName(user) {
  return [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email || user.username;
}

function initials(user) {
  const parts = displayName(user).replace(/@.*/, "").split(/[\s._-]+/).filter(Boolean);
  return ((parts[0]?.[0] || "") + (parts[1]?.[0] || parts[0]?.[1] || "")).toUpperCase();
}

function accessSummary(user) {
  if (user.role === "owner") return "Proprietaire - acces complet";
  const count = USER_PERMISSIONS.filter((permission) => user.permissions?.includes(permission.key)).length;
  if (count === USER_PERMISSIONS.length) return "Membre - acces complet";
  return `Membre - ${count} droit${count > 1 ? "s" : ""} sur ${USER_PERMISSIONS.length}`;
}

function Avatar({ user, owner }) {
  return <span className={`set-avatar ${owner ? "is-owner" : ""}`}>{initials(user)}</span>;
}

// Rights grouped by section ("Vehicules : Lecture, Ecriture").
function PermissionList({ user }) {
  if (user.role === "owner") {
    return <p className="set-help">Acces complet a toute l'administration. Ce compte est protege.</p>;
  }
  const groups = [...new Set(USER_PERMISSIONS.map((permission) => permission.group))];
  return (
    <dl className="set-facts">
      {groups.map((group) => {
        const granted = USER_PERMISSIONS.filter(
          (permission) => permission.group === group && user.permissions?.includes(permission.key)
        );
        return (
          <div key={group}>
            <dt>{group}</dt>
            <dd>{granted.length ? granted.map((permission) => permission.label).join(", ") : "Aucun acces"}</dd>
          </div>
        );
      })}
    </dl>
  );
}

function UserDetails({ user, onEdit, onDelete }) {
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const owner = user.role === "owner";

  async function remove() {
    setBusy(true);
    setError("");
    try {
      await onDelete(user.id);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <>
      <dl className="set-facts">
        <div>
          <dt>E-mail</dt>
          <dd>{user.email || "-"}</dd>
        </div>
        <div>
          <dt>Role</dt>
          <dd>{owner ? "Proprietaire" : "Membre"}</dd>
        </div>
      </dl>
      <PermissionList user={user} />
      {error && (
        <p className="set-form-message is-error" role="alert">
          {error}
        </p>
      )}
      {!owner && (
        <div className="set-form-actions">
          {confirming ? (
            <>
              <span className="set-confirm-text">Supprimer cet utilisateur ?</span>
              <button className="button neutral small" type="button" onClick={() => setConfirming(false)} disabled={busy}>
                Non
              </button>
              <button className="button small set-danger" type="button" onClick={remove} disabled={busy}>
                {busy ? "..." : "Oui, supprimer"}
              </button>
            </>
          ) : (
            <>
              <button className="button small set-danger-outline" type="button" onClick={() => setConfirming(true)}>
                Supprimer
              </button>
              <button className="button primary small" type="button" onClick={() => onEdit(user)}>
                Modifier les droits
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}

function RequestDetails({ request, onApprove, onReject }) {
  const [selected, setSelected] = useState(() => new Set(request.permissions || []));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function toggle(key) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  async function run(action) {
    setBusy(true);
    setError("");
    try {
      if (action === "approve") await onApprove(request.id, [...selected]);
      else await onReject(request.id);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <>
      <p className="set-help">Choisissez ce que cette personne pourra faire, puis approuvez ou refusez sa demande.</p>
      <ul className="set-checks" aria-label="Droits accordes">
        {USER_PERMISSIONS.map((permission) => (
          <li className="perm-line" key={permission.key}>
            <span id={`req-${request.id}-${permission.key}`}>
              <strong>
                {permission.group} - {permission.label}
              </strong>
              <small>{permission.description}</small>
            </span>
            <PillToggle
              checked={selected.has(permission.key)}
              labelledBy={`req-${request.id}-${permission.key}`}
              onChange={() => toggle(permission.key)}
            />
          </li>
        ))}
      </ul>
      {error && (
        <p className="set-form-message is-error" role="alert">
          {error}
        </p>
      )}
      <div className="set-form-actions">
        <button className="button small set-danger-outline" type="button" disabled={busy} onClick={() => run("reject")}>
          Refuser
        </button>
        <button className="button primary small" type="button" disabled={busy} onClick={() => run("approve")}>
          Approuver
        </button>
      </div>
    </>
  );
}

// Admin > Utilisateurs, same phone-style layout as Parametres: pill tabs
// (users / pending requests / activity), rows that unfold their details.
export default function AdminUsers({
  users,
  activity,
  onApproveUser,
  onRejectUser,
  onDeleteUser,
  onCreateClick,
  onEditUser,
  onClearJournal,
}) {
  const [query, setQuery] = useState("");
  const [openRow, setOpenRow] = useState(null);
  const [journal, setJournal] = useState("cars");
  const [clearing, setClearing] = useState(false);
  const [clearBusy, setClearBusy] = useState(false);
  const [clearMessage, setClearMessage] = useState("");

  const pendingRequests = useMemo(() => users.filter((user) => user.status === "pending_approval"), [users]);
  const activeUsers = useMemo(() => users.filter((user) => user.status !== "pending_approval"), [users]);
  const [tab, setTab] = useState(() => (pendingRequests.length ? "requests" : "users"));

  const filteredUsers = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return activeUsers;
    return activeUsers.filter((user) =>
      `${displayName(user)} ${user.email || ""} ${user.username}`.toLowerCase().includes(term)
    );
  }, [query, activeUsers]);

  const tabs = [
    { id: "users", label: "Utilisateurs", count: activeUsers.length },
    ...(pendingRequests.length ? [{ id: "requests", label: "Demandes", count: pendingRequests.length }] : []),
    { id: "activity", label: "Journal" },
  ];
  // The requests tab disappears once the last one is handled.
  const activeTab = tab === "requests" && !pendingRequests.length ? "users" : tab;

  const currentJournal = JOURNALS.find((item) => item.id === journal) || JOURNALS[0];
  const journalAll = activity.filter((entry) => currentJournal.match(entry.action));
  const journalTotal = journalAll.length;
  const journalEntries = journalAll.slice(0, 50);

  async function clearCurrentJournal() {
    setClearBusy(true);
    try {
      const result = await onClearJournal(currentJournal.id);
      setClearMessage(`Journal ${currentJournal.fullLabel || currentJournal.label} vide (${result.deleted} entree${result.deleted > 1 ? "s" : ""}).`);
      setClearing(false);
    } catch (error) {
      setClearMessage(error.message);
    } finally {
      setClearBusy(false);
    }
  }

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
      <PillTabs tabs={tabs} active={activeTab} onSelect={selectTab} label="Sections des utilisateurs" />

      {activeTab === "users" && (
        <>
          <div className="set-toolbar">
            <input
              type="search"
              placeholder="Rechercher un utilisateur..."
              aria-label="Rechercher un utilisateur"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <button className="button primary small" type="button" onClick={onCreateClick}>
              + Ajouter
            </button>
          </div>

          {filteredUsers.length ? (
            <ul className="set-list" role="tabpanel" aria-label="Utilisateurs">
              {filteredUsers.map((user) => (
                <SettingRow
                  key={user.id}
                  {...rowProps(`user-${user.id}`)}
                  leading={<Avatar user={user} owner={user.role === "owner"} />}
                  title={displayName(user)}
                  value={accessSummary(user)}
                >
                  <UserDetails user={user} onEdit={onEditUser} onDelete={onDeleteUser} />
                </SettingRow>
              ))}
            </ul>
          ) : (
            <p className="empty">Aucun utilisateur ne correspond a cette recherche.</p>
          )}
        </>
      )}

      {activeTab === "requests" && (
        <ul className="set-list" role="tabpanel" aria-label="Demandes d'acces">
          {pendingRequests.map((request) => (
            <SettingRow
              key={request.id}
              {...rowProps(`request-${request.id}`)}
              leading={<Avatar user={request} />}
              title={request.email || request.username}
              value={`Demande du ${new Date(request.createdAt).toLocaleDateString("fr-BE")}`}
            >
              <RequestDetails request={request} onApprove={onApproveUser} onReject={onRejectUser} />
            </SettingRow>
          ))}
        </ul>
      )}

      {activeTab === "activity" && (
        // One compact segmented bar (always a single line) instead of four
        // separate pills; the entry count moved to the tools line below.
        <div className="set-segmented" role="tablist" aria-label="Journaux">
          {JOURNALS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={journal === item.id}
              aria-label={item.fullLabel || item.label}
              className={journal === item.id ? "is-active" : ""}
              onClick={() => {
                setJournal(item.id);
                setClearing(false);
                setClearMessage("");
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      {activeTab === "activity" && (
        <div className="set-journal-tools">
          <span className="set-journal-count">
            {journalTotal} entree{journalTotal > 1 ? "s" : ""}
            {journalTotal > journalEntries.length && ` - ${journalEntries.length} plus recentes affichees`}
          </span>
          {clearMessage && (
            <p className="set-form-message" role="status">
              {clearMessage}
            </p>
          )}
          {clearing ? (
            <div className="set-form-actions">
              <span className="set-confirm-text">Supprimer tout le journal {currentJournal.fullLabel || currentJournal.label} ?</span>
              <button className="button neutral small" type="button" onClick={() => setClearing(false)} disabled={clearBusy}>
                Non
              </button>
              <button className="button small set-danger" type="button" onClick={clearCurrentJournal} disabled={clearBusy}>
                {clearBusy ? "..." : "Oui, supprimer"}
              </button>
            </div>
          ) : (
            onClearJournal &&
            journalEntries.length > 0 && (
              <button className="button small set-danger-outline" type="button" onClick={() => setClearing(true)}>
                Vider ce journal
              </button>
            )
          )}
        </div>
      )}

      {activeTab === "activity" &&
        (journalEntries.length ? (
          <ul className="set-list set-activity" role="tabpanel" aria-label={`Journal ${currentJournal.label}`}>
            {journalEntries.map((entry) => (
              <li key={entry.id}>
                <span className="set-row-text">
                  <strong>{ACTION_LABELS[entry.action] || entry.action}</strong>
                  <span>
                    {entry.actor}
                    {entry.target ? ` - ${entry.target}` : ""}
                  </span>
                </span>
                <time dateTime={entry.createdAt}>{relativeTime(entry.createdAt)}</time>
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty">Rien dans ce journal pour le moment.</p>
        ))}
    </div>
  );
}
