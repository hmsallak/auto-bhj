"use client";

import { useState } from "react";

export default function AdminSettings({ username, onChangePassword }) {
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setIsError(false);

    const formData = new FormData(event.target);
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
      setIsError(false);
      event.target.reset();
    } catch (error) {
      setMessage(error.message);
      setIsError(true);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="settings-grid">
      <div className="panel dash-panel">
        <p className="eyebrow">Compte</p>
        <h2>Acces administrateur</h2>
        <div className="spec-grid">
          <div className="spec-row">
            <span className="spec-label">Utilisateur connecte</span>
            <span className="spec-value">{username}</span>
          </div>
          <div className="spec-row">
            <span className="spec-label">Session</span>
            <span className="spec-value">Chiffree (HMAC), expire apres 8h</span>
          </div>
        </div>
      </div>

      <div className="panel dash-panel">
        <p className="eyebrow">Securite</p>
        <h2>Changer le mot de passe</h2>
        <form className="form" onSubmit={handleSubmit}>
          <label>
            Mot de passe actuel
            <input name="currentPassword" type="password" autoComplete="current-password" required />
          </label>
          <label>
            Nouveau mot de passe
            <input
              name="newPassword"
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
            />
          </label>
          <label>
            Confirmer le nouveau mot de passe
            <input
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
            />
          </label>
          <div className="form-actions">
            <button className="button primary" type="submit" disabled={submitting}>
              {submitting ? "Mise a jour..." : "Mettre a jour le mot de passe"}
            </button>
          </div>
        </form>
        {message && <p className={`message ${isError ? "error" : ""}`}>{message}</p>}
      </div>
    </div>
  );
}
