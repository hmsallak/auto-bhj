"use client";

import { useEffect, useState } from "react";
import { USER_PERMISSIONS } from "./userPermissions";

function accessLabel(user) {
  if (user?.role === "owner") return "Acces complet";
  const hasEverything = USER_PERMISSIONS.every((permission) =>
    user?.permissions?.includes(permission.key)
  );
  return hasEverything ? "Acces complet" : "Acces limite";
}

export default function AdminProfile({ user, onChangePassword, onUpdateEmail, onLogout }) {
  const [message, setMessage] = useState("");
  const [toast, setToast] = useState("");
  const [submitting, setSubmitting] = useState(false);
  // Bumping this remounts the form, so every field falls back to its
  // defaultValue - used by Cancel and after a successful save.
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 3200);
    return () => clearTimeout(timer);
  }, [toast]);

  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ");
  const roleLabel = user?.role === "owner" ? "Proprietaire" : "Membre";
  const activePermissions =
    user?.role === "owner"
      ? USER_PERMISSIONS
      : USER_PERMISSIONS.filter((permission) => user?.permissions?.includes(permission.key));

  function resetForm() {
    setMessage("");
    setFormKey((key) => key + 1);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const email = String(data.get("email") || "").trim();
    const currentPassword = String(data.get("currentPassword") || "");
    const newPassword = String(data.get("newPassword") || "");
    const confirmPassword = String(data.get("confirmPassword") || "");
    setMessage("");

    const wantsPasswordChange = Boolean(newPassword || confirmPassword);

    if (wantsPasswordChange && newPassword !== confirmPassword) {
      setMessage("Les deux mots de passe ne correspondent pas.");
      return;
    }
    if (wantsPasswordChange && !currentPassword) {
      setMessage("Saisis ton mot de passe actuel pour le changer.");
      return;
    }

    setSubmitting(true);
    try {
      const changed = [];
      if (email !== (user?.email || "")) {
        await onUpdateEmail(email);
        changed.push("E-mail");
      }
      if (wantsPasswordChange) {
        await onChangePassword({ currentPassword, newPassword });
        changed.push("Mot de passe");
      }

      if (changed.length) {
        setToast(`${changed.join(" et ")} modifie${changed.length > 1 ? "s" : ""} avec succes.`);
        setFormKey((key) => key + 1);
      } else {
        setMessage("Aucune modification a enregistrer.");
      }
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="profile-page" aria-labelledby="profile-title">
      {toast && (
        <div className="admin-toast" role="status">
          <span aria-hidden="true">&#10003;</span>
          {toast}
        </div>
      )}

      <div className="profile-head">
        <div className="profile-avatar" aria-hidden="true">
          {(fullName || user?.username || "AB").slice(0, 2).toUpperCase()}
        </div>
        <div>
          <p className="eyebrow">Parametres du compte</p>
          <h2 id="profile-title">{fullName || user?.email || user?.username}</h2>
          <p>
            {user?.email || user?.username} &middot; {roleLabel}
          </p>
        </div>
      </div>

      <section className="profile-section" aria-labelledby="profile-account-title">
        <h3 id="profile-account-title">Compte</h3>
        <div className="profile-lines">
          <div>
            <span>Identifiant</span>
            <strong>{user?.email || user?.username}</strong>
          </div>
          <div>
            <span>Role</span>
            <strong>{roleLabel}</strong>
          </div>
          <div>
            <span>Acces</span>
            <strong>{accessLabel(user)}</strong>
          </div>
          <div>
            <span>Autorisations</span>
            <strong>
              {activePermissions.length
                ? activePermissions.map((permission) => permission.label).join(", ")
                : "Aucune"}
            </strong>
          </div>
        </div>
      </section>

      <form className="profile-form" key={formKey} onSubmit={handleSubmit}>
        <section className="profile-section" aria-labelledby="profile-email-title">
          <h3 id="profile-email-title">Email de recuperation</h3>
          <p>Utilise pour reinitialiser ton mot de passe en cas d&apos;oubli.</p>
          <label>
            Adresse e-mail
            <input
              name="email"
              type="email"
              defaultValue={user?.email || ""}
              autoComplete="email"
              placeholder="prenom@exemple.com"
            />
          </label>
        </section>

        <section className="profile-section" aria-labelledby="profile-password-title">
          <h3 id="profile-password-title">Changer le mot de passe</h3>
          <p>Laisse ces champs vides pour ne pas le modifier.</p>
          <div className="profile-password-fields">
            <label>
              Mot de passe actuel
              <input name="currentPassword" type="password" autoComplete="current-password" />
            </label>
            <label>
              Nouveau mot de passe
              <input name="newPassword" type="password" autoComplete="new-password" minLength={8} />
            </label>
            <label>
              Confirmation
              <input
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                minLength={8}
              />
            </label>
          </div>
        </section>

        {message && <p className="message error">{message}</p>}

        <div className="profile-form-actions">
          <button
            type="button"
            className="button neutral small"
            onClick={resetForm}
            disabled={submitting}
          >
            Annuler
          </button>
          <button type="submit" className="button primary small" disabled={submitting}>
            {submitting ? "Enregistrement..." : "Sauvegarder"}
          </button>
        </div>
      </form>

      <div className="profile-session-actions">
        <button className="button neutral small" type="button" onClick={onLogout}>
          Se deconnecter
        </button>
      </div>
    </section>
  );
}
