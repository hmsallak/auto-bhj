"use client";

import { useEffect, useState } from "react";
import { USER_PERMISSIONS } from "./userPermissions";
import { PillTabs } from "./SettingsUI";

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
  const [tab, setTab] = useState("info");
  const [showPasswords, setShowPasswords] = useState(false);

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

    const wantsPasswordChange = tab === "security" && Boolean(newPassword || confirmPassword);
    const wantsEmailChange = tab === "email" && email !== (user?.email || "");

    if (wantsEmailChange && !currentPassword) {
      setMessage("Saisis ton mot de passe actuel pour changer l'e-mail.");
      return;
    }

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
      if (wantsEmailChange) {
        const result = await onUpdateEmail(email, currentPassword);
        changed.push(result.pendingEmail ? "Confirmation de l'e-mail" : "E-mail");
      }
      if (wantsPasswordChange) {
        await onChangePassword({ currentPassword, newPassword });
        changed.push("Mot de passe");
      }

      if (changed.length) {
        setToast(
          changed.includes("Confirmation de l'e-mail")
            ? "Un lien de confirmation a ete envoye a la nouvelle adresse."
            : `${changed.join(" et ")} modifie${changed.length > 1 ? "s" : ""} avec succes.`
        );
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

      <PillTabs
        tabs={[{ id: "info", label: "Infos" }, { id: "email", label: "E-mail" }, { id: "security", label: "Securite" }]}
        active={tab}
        onSelect={(nextTab) => { setTab(nextTab); resetForm(); }}
        label="Sections du compte"
      />

      {tab === "info" && <section className="profile-section" aria-labelledby="profile-account-title">
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
      </section>}

      {tab !== "info" && <form className="profile-form" key={formKey} onSubmit={handleSubmit}>
        {tab === "email" && <section className="profile-section" aria-labelledby="profile-email-title">
          <h3 id="profile-email-title">Nouvel e-mail</h3>
          <p>Confirme ton mot de passe actuel pour enregistrer cette modification.</p>
          <label>
            E-mail actuel
            <input type="email" value={user?.email || ""} readOnly aria-readonly="true" />
          </label>
          <label>
            Nouvel e-mail
            <input
              name="email"
              type="email"
              autoComplete="email"
              placeholder="prenom@exemple.com"
            />
          </label>
          <label>
            Mot de passe actuel
            <input name="currentPassword" type="password" autoComplete="current-password" required />
          </label>
        </section>}

        {tab === "security" && <section className="profile-section" aria-labelledby="profile-password-title">
          <h3 id="profile-password-title">Changer le mot de passe</h3>
          <p>Au moins 10 caracteres, avec une majuscule, une minuscule et un chiffre.</p>
          <div className="profile-password-fields">
            <label>
              Mot de passe actuel
              <span className="profile-password-input">
                <input name="currentPassword" type={showPasswords ? "text" : "password"} autoComplete="current-password" />
                <button className="password-reveal" type="button" onClick={() => setShowPasswords((current) => !current)} aria-label={showPasswords ? "Masquer le mot de passe" : "Afficher le mot de passe"}>
                  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d={showPasswords ? "M4 4l16 16M10.6 10.7a2 2 0 0 0 2.7 2.7M9.9 5.1A10.7 10.7 0 0 1 12 5c5.1 0 8.5 4.4 9.5 7-0.4 1-1.2 2.3-2.4 3.4M6.1 6.1C4.3 7.5 3.1 10 2.5 12c1 2.6 4.4 7 9.5 7 1.1 0 2.1-.2 3-.6" : "M2.5 12S5.9 5 12 5s9.5 7 9.5 7-3.4 7-9.5 7S2.5 12 2.5 12Zm9.5 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
              </span>
            </label>
            <label>
              Nouveau mot de passe
              <span className="profile-password-input">
                <input name="newPassword" type={showPasswords ? "text" : "password"} autoComplete="new-password" minLength={10} />
                <button className="password-reveal" type="button" onClick={() => setShowPasswords((current) => !current)} aria-label={showPasswords ? "Masquer le mot de passe" : "Afficher le mot de passe"}>
                  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d={showPasswords ? "M4 4l16 16M10.6 10.7a2 2 0 0 0 2.7 2.7M9.9 5.1A10.7 10.7 0 0 1 12 5c5.1 0 8.5 4.4 9.5 7-0.4 1-1.2 2.3-2.4 3.4M6.1 6.1C4.3 7.5 3.1 10 2.5 12c1 2.6 4.4 7 9.5 7 1.1 0 2.1-.2 3-.6" : "M2.5 12S5.9 5 12 5s9.5 7 9.5 7-3.4 7-9.5 7S2.5 12 2.5 12Zm9.5 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
              </span>
            </label>
            <label>
              Confirmation
              <span className="profile-password-input">
                <input name="confirmPassword" type={showPasswords ? "text" : "password"} autoComplete="new-password" minLength={10} />
                <button className="password-reveal" type="button" onClick={() => setShowPasswords((current) => !current)} aria-label={showPasswords ? "Masquer le mot de passe" : "Afficher le mot de passe"}>
                  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d={showPasswords ? "M4 4l16 16M10.6 10.7a2 2 0 0 0 2.7 2.7M9.9 5.1A10.7 10.7 0 0 1 12 5c5.1 0 8.5 4.4 9.5 7-0.4 1-1.2 2.3-2.4 3.4M6.1 6.1C4.3 7.5 3.1 10 2.5 12c1 2.6 4.4 7 9.5 7 1.1 0 2.1-.2 3-.6" : "M2.5 12S5.9 5 12 5s9.5 7 9.5 7-3.4 7-9.5 7S2.5 12 2.5 12Zm9.5 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
              </span>
            </label>
          </div>
        </section>}

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
      </form>}

      <div className="profile-session-actions">
        <button className="button neutral small" type="button" onClick={onLogout}>
          Se deconnecter
        </button>
      </div>
    </section>
  );
}
