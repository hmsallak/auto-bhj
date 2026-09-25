"use client";

import { useMemo, useState } from "react";
import { USER_PERMISSION_GROUPS, USER_PERMISSIONS } from "./userPermissions";
import { Chevron, PillToggle, RowIcon } from "./SettingsUI";

export default function AdminUserForm({ editingUser, onSubmit, onCancel, canManageAdmins }) {
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const isEditing = Boolean(editingUser);
  const [granted, setGranted] = useState(() => new Set(editingUser?.permissions || []));
  const [isAdmin, setIsAdmin] = useState(Boolean(editingUser?.isAdmin));

  function setPermission(key, on) {
    setGranted((current) => {
      const next = new Set(current);
      if (on) next.add(key);
      else next.delete(key);
      return next;
    });
  }

  const permissionsByGroup = useMemo(
    () =>
      USER_PERMISSION_GROUPS.map((group) => ({
        group,
        permissions: USER_PERMISSIONS.filter((permission) => permission.group === group),
      })),
    []
  );

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setIsError(false);

    const formData = new FormData(event.currentTarget);
    const permissions = USER_PERMISSIONS.filter((permission) => granted.has(permission.key)).map(
      (permission) => permission.key
    );

    const payload = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      username: isEditing ? editingUser.username : formData.get("username"),
      permissions,
      isAdmin,
    };

    if (!isEditing) {
      payload.password = formData.get("password");
    }

    setSubmitting(true);
    try {
      await onSubmit(payload);
      setMessage(isEditing ? "Utilisateur mis a jour." : "Utilisateur cree.");
      if (!isEditing) {
        event.currentTarget.reset();
        setGranted(new Set());
        setIsAdmin(false);
      }
    } catch (error) {
      setMessage(error.message);
      setIsError(true);
    } finally {
      setSubmitting(false);
    }
  }

  // "Annuler" drops the unsaved edits (fields back to their saved values,
  // rights back to what the account has) without leaving the form.
  function handleReset(event) {
    event.currentTarget.form?.reset();
    setGranted(new Set(editingUser?.permissions || []));
    setIsAdmin(Boolean(editingUser?.isAdmin));
    setMessage("");
    setIsError(false);
  }

  function handleAllowAll() {
    setGranted(new Set(USER_PERMISSIONS.map((permission) => permission.key)));
  }

  return (
    <section className="team-member-form-page" aria-labelledby="team-member-form-title">
      <div className="team-form-head">
        <div>
          <p className="eyebrow">Utilisateurs</p>
          <h2 id="team-member-form-title">{isEditing ? "Modifier l'utilisateur" : "Creer un utilisateur"}</h2>
          <p>
            {isEditing
              ? "Ajuste les informations et les autorisations de ce compte."
              : "Ajoute un acces propre avec des autorisations precises."}
          </p>
        </div>
      </div>

      <form className="team-member-form" onSubmit={handleSubmit}>
        {/* Accordion: open when creating (required fields must stay
            reachable for validation), folded when editing. */}
        <details className="team-form-section form-accordion" open={!isEditing}>
          <summary>
            <span className="set-row-icon">
              <RowIcon name="access" />
            </span>
            <span className="set-row-text">
              <strong id="team-member-identity-title">Informations</strong>
              <span>
                {isEditing
                  ? [editingUser.firstName, editingUser.lastName].filter(Boolean).join(" ") || editingUser.username
                  : "Identite de l'utilisateur et acces de connexion"}
              </span>
            </span>
            <span className="set-row-action form-accordion-action">
              <Chevron />
            </span>
          </summary>
          <div className="team-form-fields">
            <label>
              Prenom
              <input name="firstName" type="text" defaultValue={editingUser?.firstName || ""} />
            </label>
            <label>
              Nom
              <input name="lastName" type="text" defaultValue={editingUser?.lastName || ""} />
            </label>
            <label>
              Identifiant
              <input
                name="username"
                type="text"
                minLength={3}
                required
                readOnly={isEditing}
                defaultValue={editingUser?.username || ""}
              />
            </label>
            {!isEditing && (
              <label>
                Mot de passe temporaire
                <input name="password" type="password" autoComplete="new-password" minLength={10} required />
              </label>
            )}
          </div>
        </details>

        {canManageAdmins && (
          <section className="team-form-section">
            <div className="perm-line">
              <span id="user-admin-access">
                <strong>Administrateur</strong>
                <small>Peut gerer les utilisateurs et acceder a ses propres sessions et appareils.</small>
              </span>
              <PillToggle checked={isAdmin} labelledBy="user-admin-access" onChange={setIsAdmin} />
            </div>
          </section>
        )}

        {/* Accordion too; open by default since editing rights is why
            people land on this form. */}
        <details className="team-form-section form-accordion" open>
          <summary>
            <span className="set-row-icon">
              <RowIcon name="password" />
            </span>
            <span className="set-row-text">
              <strong id="team-member-permissions-title">Autorisations</strong>
              <span>
                {granted.size === USER_PERMISSIONS.length
                  ? "Acces complet"
                  : `${granted.size} droit${granted.size > 1 ? "s" : ""} sur ${USER_PERMISSIONS.length}`}
              </span>
            </span>
            <span className="set-row-action form-accordion-action">
              <Chevron />
            </span>
          </summary>
          <div className="form-accordion-body">
            <p className="set-help">Les droits d'ecriture ajoutent automatiquement la lecture necessaire.</p>
            <div className="team-permission-tools">
              <button className="button neutral small" type="button" onClick={handleAllowAll}>
                Tout autoriser
              </button>
            </div>
            <div className="team-permission-matrix">
              {permissionsByGroup.map(({ group, permissions }, index) => {
                const grantedCount = permissions.filter((permission) => granted.has(permission.key)).length;
                const rows = permissions.map((permission) => (
                  <div className="team-permission-line perm-line" key={permission.key}>
                    <span id={`perm-${permission.key}`}>
                      <strong>{permission.label}</strong>
                      <small>{permission.description}</small>
                    </span>
                    <PillToggle
                      checked={granted.has(permission.key)}
                      labelledBy={`perm-${permission.key}`}
                      onChange={(on) => setPermission(permission.key, on)}
                    />
                  </div>
                ));

                return (
                  <details
                    className="team-form-section form-accordion permission-accordion"
                    key={group}
                    defaultOpen={index === 0}
                  >
                    <summary>
                      <span className="set-row-icon"><RowIcon name="access" /></span>
                      <span className="set-row-text">
                        <strong>{group}</strong>
                        <span>{grantedCount} droit{grantedCount > 1 ? "s" : ""} sur {permissions.length}</span>
                      </span>
                      <span className="set-row-action form-accordion-action"><Chevron /></span>
                    </summary>
                    <div className="form-accordion-body">
                      <fieldset className="team-permission-group">
                        <legend className="visually-hidden">{group}</legend>
                        {rows}
                      </fieldset>
                    </div>
                  </details>
                );
              })}
            </div>
          </div>
        </details>

        <div className="team-form-actions">
          {message && <p className={`message ${isError ? "error" : ""}`}>{message}</p>}
          <div className="form-bottom-actions">
            <button className="dash-link form-back" type="button" onClick={onCancel}>
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Retour
            </button>
            <button className="button neutral small" type="button" onClick={handleReset}>
              Annuler
            </button>
            <button className="button primary small" type="submit" disabled={submitting}>
              {submitting ? "Enregistrement..." : isEditing ? "Enregistrer" : "Creer l'utilisateur"}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
