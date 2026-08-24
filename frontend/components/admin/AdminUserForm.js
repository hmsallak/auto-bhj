"use client";

import { useMemo, useState } from "react";
import { USER_PERMISSION_GROUPS, USER_PERMISSIONS } from "./userPermissions";

export default function AdminUserForm({ editingUser, onSubmit, onCancel }) {
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const isEditing = Boolean(editingUser);

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
    const permissions = USER_PERMISSIONS.filter((permission) =>
      formData.get(`permission-${permission.key}`)
    ).map((permission) => permission.key);

    const payload = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      username: isEditing ? editingUser.username : formData.get("username"),
      permissions,
    };

    if (!isEditing) {
      payload.password = formData.get("password");
    }

    setSubmitting(true);
    try {
      await onSubmit(payload);
      setMessage(isEditing ? "Membre mis a jour." : "Membre cree.");
      if (!isEditing) event.currentTarget.reset();
    } catch (error) {
      setMessage(error.message);
      setIsError(true);
    } finally {
      setSubmitting(false);
    }
  }

  function handleAllowAll(event) {
    const form = event.currentTarget.form;
    form
      ?.querySelectorAll(".team-permission-line input[type='checkbox']")
      .forEach((input) => {
        input.checked = true;
      });
  }

  return (
    <section className="team-member-form-page" aria-labelledby="team-member-form-title">
      <div className="team-form-head">
        <div>
          <p className="eyebrow">Equipe</p>
          <h2 id="team-member-form-title">{isEditing ? "Modifier le membre" : "Creer un membre"}</h2>
          <p>
            {isEditing
              ? "Ajuste les informations et les autorisations de ce compte."
              : "Ajoute un acces propre avec des autorisations precises."}
          </p>
        </div>
        <button className="button neutral small" type="button" onClick={onCancel}>
          Retour
        </button>
      </div>

      <form className="team-member-form" onSubmit={handleSubmit}>
        <section className="team-form-section" aria-labelledby="team-member-identity-title">
          <div>
            <h3 id="team-member-identity-title">Informations</h3>
            <p>Identite du membre et acces de connexion.</p>
          </div>
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
                <input name="password" type="password" autoComplete="new-password" minLength={8} required />
              </label>
            )}
          </div>
        </section>

        <section className="team-form-section" aria-labelledby="team-member-permissions-title">
          <div>
            <h3 id="team-member-permissions-title">Autorisations</h3>
            <p>Les droits d'ecriture ajoutent automatiquement la lecture necessaire.</p>
          </div>
          <div>
            <div className="team-permission-tools">
              <button className="button neutral small" type="button" onClick={handleAllowAll}>
                Tout autoriser
              </button>
            </div>
            <div className="team-permission-matrix">
              {permissionsByGroup.map(({ group, permissions }) => (
                <fieldset className="team-permission-group" key={group}>
                  <legend>{group}</legend>
                  {permissions.map((permission) => (
                    <label className="team-permission-line" key={permission.key}>
                      <input
                        type="checkbox"
                        name={`permission-${permission.key}`}
                        defaultChecked={editingUser?.permissions?.includes(permission.key)}
                      />
                      <span>
                        <strong>{permission.label}</strong>
                        <small>{permission.description}</small>
                      </span>
                    </label>
                  ))}
                </fieldset>
              ))}
            </div>
          </div>
        </section>

        <div className="team-form-actions">
          {message && <p className={`message ${isError ? "error" : ""}`}>{message}</p>}
          <div>
            <button className="button neutral small" type="button" onClick={onCancel}>
              Annuler
            </button>
            <button className="button primary small" type="submit" disabled={submitting}>
              {submitting ? "Enregistrement..." : isEditing ? "Enregistrer" : "Creer le membre"}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
