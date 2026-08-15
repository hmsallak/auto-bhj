"use client";

import { useState } from "react";

const PERMISSIONS = [
  { key: "stock", label: "Stock" },
  { key: "messages", label: "Messages" },
];

const ACTION_LABELS = {
  car_created: "Voiture ajoutee",
  car_updated: "Voiture modifiee",
  car_deleted: "Voiture supprimee",
  message_received: "Message recu",
  message_deleted: "Message supprime",
  user_created: "Membre cree",
  user_permissions_updated: "Permissions modifiees",
  user_deleted: "Membre supprime",
};

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

export default function AdminUsers({
  users,
  activity,
  onCreateUser,
  onUpdatePermissions,
  onDeleteUser,
}) {
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleCreate(event) {
    event.preventDefault();
    setMessage("");
    setIsError(false);

    const formData = new FormData(event.target);
    const permissions = PERMISSIONS.filter((p) => formData.get(`permission-${p.key}`)).map(
      (p) => p.key
    );

    setSubmitting(true);
    try {
      await onCreateUser({
        username: formData.get("username"),
        password: formData.get("password"),
        permissions,
      });
      setMessage("Membre cree.");
      event.target.reset();
    } catch (error) {
      setMessage(error.message);
      setIsError(true);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleTogglePermission(user, key) {
    const has = user.permissions.includes(key);
    const next = has ? user.permissions.filter((p) => p !== key) : [...user.permissions, key];

    try {
      await onUpdatePermissions(user.id, next);
    } catch (error) {
      setMessage(error.message);
      setIsError(true);
    }
  }

  async function handleDelete(user) {
    if (!window.confirm(`Supprimer le membre ${user.username} ? Cette action est irreversible.`)) {
      return;
    }

    try {
      await onDeleteUser(user.id);
    } catch (error) {
      setMessage(error.message);
      setIsError(true);
    }
  }

  return (
    <div>
      <div className="panel dash-panel">
        <p className="eyebrow">Equipe</p>
        <h2>Ajouter un membre</h2>
        <form className="form" onSubmit={handleCreate}>
          <div className="two-cols">
            <label>
              Identifiant
              <input name="username" type="text" minLength={3} required />
            </label>
            <label>
              Mot de passe
              <input name="password" type="password" autoComplete="new-password" minLength={8} required />
            </label>
          </div>
          <div className="member-permissions">
            {PERMISSIONS.map((p) => (
              <label key={p.key}>
                <input type="checkbox" name={`permission-${p.key}`} /> {p.label}
              </label>
            ))}
          </div>
          <div className="form-actions">
            <button className="button primary" type="submit" disabled={submitting}>
              {submitting ? "Creation..." : "Creer le membre"}
            </button>
          </div>
        </form>
        {message && <p className={`message ${isError ? "error" : ""}`}>{message}</p>}
      </div>

      <div className="panel dash-panel">
        <div className="dash-panel-head">
          <h2>Membres ({users.length})</h2>
        </div>

        {users.length ? (
          <div className="member-list">
            {users.map((user) => (
              <div className="member-item" key={user.id}>
                <header>
                  <span>
                    {user.username} {user.role === "owner" && <span className="recent-ref">Proprietaire</span>}
                  </span>
                </header>

                {user.role === "owner" ? (
                  <p className="empty">Acces complet, non modifiable.</p>
                ) : (
                  <div className="member-item-body">
                    <div className="member-permissions">
                      {PERMISSIONS.map((p) => (
                        <label key={p.key}>
                          <input
                            type="checkbox"
                            checked={user.permissions.includes(p.key)}
                            onChange={() => handleTogglePermission(user, p.key)}
                          />
                          {p.label}
                        </label>
                      ))}
                    </div>
                    <button className="danger" type="button" onClick={() => handleDelete(user)}>
                      Supprimer
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="empty">Aucun membre pour le moment.</p>
        )}
      </div>

      <div className="panel dash-panel">
        <div className="dash-panel-head">
          <h2>Activite recente</h2>
        </div>

        {activity.length ? (
          <div className="member-list">
            {activity.map((entry) => (
              <div className="member-item" key={entry.id}>
                <header>
                  <span>
                    <span className="recent-ref">{entry.actor}</span> —{" "}
                    {ACTION_LABELS[entry.action] || entry.action}
                    {entry.target && ` : ${entry.target}`}
                  </span>
                  <span className="recent-time">{relativeTime(entry.createdAt)}</span>
                </header>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty">Aucune activite pour le moment.</p>
        )}
      </div>
    </div>
  );
}
