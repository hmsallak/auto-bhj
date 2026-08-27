"use client";

import { useState } from "react";
import { USER_PERMISSIONS } from "./userPermissions";

function EyeIcon({ off }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
      {off && <path d="M4 4l16 16" />}
    </svg>
  );
}

function PasswordField({ label, name, autoComplete, minLength, visible, onToggleVisibility }) {
  return (
    <label>
      {label}
      <div className="password-field">
        <input
          name={name}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          minLength={minLength}
          required
        />
        <button
          type="button"
          className="password-reveal"
          onClick={onToggleVisibility}
          aria-label={visible ? "Masquer les mots de passe" : "Afficher les mots de passe"}
          title={visible ? "Masquer" : "Afficher"}
        >
          <EyeIcon off={visible} />
        </button>
      </div>
    </label>
  );
}

function accessLabel(user) {
  if (user?.role === "owner") return "Full acces Admin";
  const hasEverything = USER_PERMISSIONS.every((permission) =>
    user?.permissions?.includes(permission.key)
  );
  return hasEverything ? "Full acces" : "Acces limite";
}

export default function AdminProfile({ user, onChangePassword, onUpdateEmail, onLogout }) {
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  // Visible by default so you can check exactly what you are setting - the
  // "Masquer" button hides it again.
  const [showPassword, setShowPassword] = useState(true);
  const [emailMessage, setEmailMessage] = useState("");
  const [emailIsError, setEmailIsError] = useState(false);
  const [emailSubmitting, setEmailSubmitting] = useState(false);
  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ");
  const activePermissions =
    user?.role === "owner"
      ? USER_PERMISSIONS
      : USER_PERMISSIONS.filter((permission) => user?.permissions?.includes(permission.key));

  async function handleEmailSubmit(event) {
    event.preventDefault();
    const email = new FormData(event.currentTarget).get("email");
    setEmailMessage("");
    setEmailIsError(false);
    setEmailSubmitting(true);
    try {
      await onUpdateEmail(email);
      setEmailMessage("Email enregistre.");
    } catch (error) {
      setEmailMessage(error.message);
      setEmailIsError(true);
    } finally {
      setEmailSubmitting(false);
    }
  }

  async function handlePasswordSubmit(event) {
    event.preventDefault();
    // Grab the form node now: React nulls out event.currentTarget after the
    // handler yields, so reading it again past the await below would throw.
    const form = event.currentTarget;
    setMessage("");
    setIsError(false);

    const formData = new FormData(form);
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
      form.reset();
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

        <form className="profile-email-form" onSubmit={handleEmailSubmit}>
          <label>
            Email de recuperation
            <input
              name="email"
              type="email"
              defaultValue={user?.email || ""}
              autoComplete="email"
              placeholder="prenom@exemple.com"
            />
          </label>
          <button className="button neutral small" type="submit" disabled={emailSubmitting}>
            {emailSubmitting ? "..." : "Enregistrer"}
          </button>
        </form>

        {emailMessage && (
          <p className={`message ${emailIsError ? "error" : ""}`}>{emailMessage}</p>
        )}

        <form className="profile-password-form" onSubmit={handlePasswordSubmit}>
          <PasswordField
            label="Mot de passe actuel"
            name="currentPassword"
            autoComplete="current-password"
            visible={showPassword}
            onToggleVisibility={() => setShowPassword((value) => !value)}
          />
          <PasswordField
            label="Nouveau mot de passe"
            name="newPassword"
            autoComplete="new-password"
            minLength={8}
            visible={showPassword}
            onToggleVisibility={() => setShowPassword((value) => !value)}
          />
          <PasswordField
            label="Confirmation"
            name="confirmPassword"
            autoComplete="new-password"
            minLength={8}
            visible={showPassword}
            onToggleVisibility={() => setShowPassword((value) => !value)}
          />
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
