"use client";

import { useMemo, useState } from "react";
import OfficialIcon from "../OfficialIcon";
import { USER_PERMISSIONS } from "./userPermissions";

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

function roleLabel(role) {
  return role === "owner" ? "Proprietaire" : "Membre";
}

function hasFullAccess(user) {
  if (user.role === "owner") return true;
  return USER_PERMISSIONS.every((permission) => user.permissions?.includes(permission.key));
}

export default function AdminUsers({
  users,
  activity,
  onDeleteUser,
  onCreateClick,
  onEditUser,
}) {
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [query, setQuery] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);

  const filteredUsers = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return users;

    return users.filter((user) => {
      const permissions = user.permissions?.join(" ") || "";
      return `${user.username} ${user.role} ${permissions}`.toLowerCase().includes(term);
    });
  }, [query, users]);

  async function handleDelete(user) {
    try {
      await onDeleteUser(user.id);
    } catch (error) {
      setMessage(error.message);
      setIsError(true);
    }
  }

  return (
    <div className="team-page">
      {message && <p className={`message ${isError ? "error" : ""}`}>{message}</p>}

      <div className="team-layout">
        <section className="team-members" aria-labelledby="team-members-title">
          <div className="team-section-head">
            <div>
              <h2 id="team-members-title">Membres</h2>
              <p>{filteredUsers.length} sur {users.length} comptes</p>
            </div>
            <input
              type="search"
              placeholder="Rechercher un membre..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>

          {filteredUsers.length ? (
            <div className="team-table">
              <div className="team-table-head" aria-hidden="true">
                <span>Membre</span>
                <span>Role</span>
                <span>Statut</span>
                <span>Permissions</span>
                <span>Derniere connexion</span>
                <span>Actions</span>
              </div>

              {filteredUsers.map((user) => (
                <article className="team-row" key={user.id}>
                  <div className="team-member-main">
                    <span className="team-avatar">{user.username.slice(0, 2).toUpperCase()}</span>
                    <div>
                      <strong>
                        {[user.firstName, user.lastName].filter(Boolean).join(" ") || user.username}
                      </strong>
                      <small>{user.role === "owner" ? "Acces complet" : "Acces limite"}</small>
                    </div>
                  </div>

                  <div className="team-cell" data-label="Role">
                    <span className={`team-badge ${user.role === "owner" ? "owner" : ""}`}>
                      {roleLabel(user.role)}
                    </span>
                  </div>
                  <div className="team-cell" data-label="Statut">
                    <span className="team-badge success">Actif</span>
                  </div>

                  <div className="team-permission-summary team-cell" data-label="Permissions">
                    {user.role === "owner" ? (
                      <>
                        <span className="team-badge owner">Full acces Admin</span>
                        <span className="team-badge">Protege</span>
                      </>
                    ) : hasFullAccess(user) ? (
                      <span className="team-badge owner">Full acces</span>
                    ) : (
                      <span className="team-badge">Acces limite</span>
                    )}
                  </div>

                  <span className="team-muted team-cell" data-label="Derniere connexion">A connecter</span>

                  <div className="team-actions team-cell" data-label="Actions">
                    {user.role === "owner" ? (
                      <span className="team-muted">Protege</span>
                    ) : (
                      <div className="admin-action-menu">
                        <button
                          className="admin-action-toggle"
                          type="button"
                          aria-label={`Actions pour ${user.username}`}
                          aria-expanded={openMenuId === user.id}
                          onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)}
                        >
                          <OfficialIcon name="edit" width={18} height={18} />
                        </button>
                        {openMenuId === user.id && (
                          <div className="admin-action-dropdown">
                            <button
                              type="button"
                              onClick={() => {
                                setOpenMenuId(null);
                                onEditUser(user);
                              }}
                            >
                              Modifier
                            </button>
                            <button
                              className="danger-text"
                              type="button"
                              onClick={() => {
                                setOpenMenuId(null);
                                handleDelete(user);
                              }}
                            >
                              Supprimer
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="empty">Aucun membre ne correspond a cette recherche.</p>
          )}

          <div className="team-add-row">
            <button className="button primary small" type="button" onClick={onCreateClick}>
              Ajouter un membre
            </button>
          </div>
        </section>

        <aside className="team-activity" aria-labelledby="team-activity-title">
          <div className="team-section-head">
            <div>
              <h2 id="team-activity-title">Activite</h2>
              <p>Dernieres actions enregistrees.</p>
            </div>
          </div>

          {activity.length ? (
            <div className="team-activity-list">
              {activity.slice(0, 8).map((entry) => (
                <article className="team-activity-row" key={entry.id}>
                  <div>
                    <strong>{ACTION_LABELS[entry.action] || entry.action}</strong>
                    <span>
                      {entry.actor}
                      {entry.target ? ` - ${entry.target}` : ""}
                    </span>
                  </div>
                  <time>{relativeTime(entry.createdAt)}</time>
                </article>
              ))}
            </div>
          ) : (
            <p className="empty">Aucune activite pour le moment.</p>
          )}
        </aside>
      </div>
    </div>
  );
}
