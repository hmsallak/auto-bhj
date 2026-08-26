"use client";

import Image from "next/image";
import { useState } from "react";

export default function AdminLogin({ onSubmit, message }) {
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(event);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="admin-login-shell">
      <div className="admin-login-card">
        <div className="admin-login-brand">
          <Image src="/logo-auto-bhj.png" alt="Auto BHJ" width={1050} height={600} priority />
        </div>
        <p className="eyebrow">Connexion securisee</p>
        <h1>Espace administrateur</h1>
        <p className="admin-login-lead">
          Gerez le stock, les messages et les parametres d&apos;Auto BHJ.
        </p>

        <form className="form" onSubmit={handleSubmit}>
          <label>
            Utilisateur
            <input name="username" autoComplete="username" required autoFocus />
          </label>
          <label>
            Mot de passe
            <div className="password-field">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {showPassword ? "Masquer" : "Afficher"}
              </button>
            </div>
          </label>
          <button className="button primary admin-login-submit" type="submit" disabled={submitting}>
            {submitting ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        {message && <p className="message error">{message}</p>}

        <div className="admin-login-footer">
          <span>Session chiffree - acces reserve a l&apos;equipe Auto BHJ</span>
          <a href="/">Retour au site public</a>
        </div>
      </div>
    </div>
  );
}
