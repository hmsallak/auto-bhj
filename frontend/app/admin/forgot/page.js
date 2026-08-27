"use client";

import { useState } from "react";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    const identifier = new FormData(event.currentTarget).get("identifier");
    setMessage("");
    setSubmitting(true);
    try {
      await fetch("/api/admin/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier }),
      });
      setSent(true);
    } catch {
      setMessage("Une erreur est survenue. Reessaie.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="admin-login-shell">
      <div className="admin-login-card">
        <p className="eyebrow">Espace administrateur</p>
        <h1>Mot de passe oublie</h1>

        {sent ? (
          <p className="admin-login-lead">
            Si un compte correspond, un e-mail contenant un lien de reinitialisation
            vient d&apos;etre envoye. Le lien est valable 30 minutes.
          </p>
        ) : (
          <>
            <p className="admin-login-lead">
              Saisis ton identifiant ou ton e-mail de recuperation. On t&apos;envoie un
              lien pour choisir un nouveau mot de passe.
            </p>
            <form className="form" onSubmit={handleSubmit}>
              <label>
                Identifiant ou e-mail
                <input name="identifier" autoComplete="username" required autoFocus />
              </label>
              <button
                className="button primary admin-login-submit"
                type="submit"
                disabled={submitting}
              >
                {submitting ? "Envoi..." : "Envoyer le lien"}
              </button>
            </form>
            {message && <p className="message error">{message}</p>}
          </>
        )}

        <div className="admin-login-footer">
          <a href="/admin">Retour a la connexion</a>
        </div>
      </div>
    </div>
  );
}
