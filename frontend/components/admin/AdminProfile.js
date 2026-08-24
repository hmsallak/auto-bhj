"use client";

import { useState } from "react";
import { USER_PERMISSIONS } from "./userPermissions";

function accessLabel(user) {
  if (user?.role === "owner") return "Full acces Admin";
  const hasEverything = USER_PERMISSIONS.every((permission) =>
    user?.permissions?.includes(permission.key)
  );
  return hasEverything ? "Full acces" : "Acces limite";
}

export default function AdminProfile({ user, onChangePassword, onLogout }) {
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ");
  const activePermissions =
    user?.role === "owner"
      ? USER_PERMISSIONS
      : USER_PERMISSIONS.filter((permission) => user?.permissions?.includes(permission.key));

  async function handlePasswordSubmit(event) {
    event.preventDefault();
    setMessage("");
    setIsError(false);

    const formData = new FormData(event.currentTarget);
    const currentPassword = formData.get("currentPassword");
    const newPassword = formData.get("newPassword");
    const confirmPassword = formData.get("confirmPassword");

    if (newPassword !== confirmPassword) {
      setMessage("Les deux mots de passe ne correspondent pas.");
      setIsError(true);
      return;
    }

    setSubmitting(true);
    try {
      await onChangePassword({ currentPassword, newPassword });
      setMessage("Mot de passe mis a jour.");
      event.currentTarget.reset();
    } catch (error) {
      setMessage(error.message);
      setIsError(true);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="profile-page" aria-labelledby="profile-title">
      <div className="profile-head">
        <div className="profile-avatar" aria-hidden="true">
          {(fullName || user?.username || "AB").slice(0, 2).toUpperCase()}
        </div>
        <div>
          <p className="eyebrow">Mon profil</p>
          <h2 id="profile-title">{fullName || user?.username}</h2>
          <p>{user?.username}</p>
        </div>
      </div>

      <div className="profile-grid">
        <section className="profile-section" aria-labelledby="profile-account-title">
          <h3 id="profile-account-title">Compte</h3>
          <div className="profile-lines">
            <div>
              <span>Role</span>
              <strong>{user?.role === "owner" ? "Proprietaire" : "Membre"}</strong>
            </div>
            <div>
              <span>Niveau d'acces</span>
              <strong>{accessLabel(user)}</strong>
            </div>
            <div>
              <span>Securite</span>
              <strong>Session active</strong>
            </div>
          </div>
        </section>

        <section className="profile-section" aria-labelledby="profile-permissions-title">
          <h3 id="profile-permissions-title">Autorisations</h3>
          {activePermissions.length ? (
            <div className="profile-permissions">
              {activePermissions.map((permission) => (
                <span key={permission.key}>{permission.label}</span>
              ))}
            </div>
          ) : (
            <p className="empty">Aucune autorisation active.</p>
          )}
        </section>
      </div>

      <section className="profile-section profile-security" aria-labelledby="profile-security-title">
        <div>
          <h3 id="profile-security-title">Securite</h3>
          <p>Change ton mot de passe ou ferme la session pour utiliser un autre compte.</p>
        </div>

        <form className="profile-password-form" onSubmit={handlePasswordSubmit}>
          <label>
            Mot de passe actuel
            <input name="currentPassword" type="password" autoComplete="current-password" required />
          </label>
          <label>
            Nouveau mot de passe
            <input name="newPassword" type="password" autoComplete="new-password" minLength={8} required />
          </label>
          <label>
            Confirmation
            <input name="confirmPassword" type="password" autoComplete="new-password" minLength={8} required />
          </label>
          <button className="button primary small" type="submit" disabled={submitting}>
            {submitting ? "Mise a jour..." : "Changer le mot de passe"}
          </button>
        </form>

        {message && <p className={`message ${isError ? "error" : ""}`}>{message}</p>}

        <div className="profile-session-actions">
          <button className="button neutral small" type="button" onClick={onLogout}>
            Se deconnecter
          </button>
          <button className="button neutral small" type="button" onClick={onLogout}>
            Changer d'utilisateur
          </button>
        </div>
      </section>
    </section>
  );
}
