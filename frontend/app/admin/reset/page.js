"use client";

import { useEffect, useState } from "react";

export default function ResetPasswordPage() {
  const [token, setToken] = useState("");
  const [show, setShow] = useState(true);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setToken(params.get("token") || "");
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const newPassword = data.get("newPassword");
    const confirmPassword = data.get("confirmPassword");
    setMessage("");
    setIsError(false);

    if (newPassword !== confirmPassword) {
      setMessage("Les deux mots de passe ne correspondent pas.");
      setIsError(true);
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/admin/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || "Une erreur est survenue.");
      setDone(true);
    } catch (error) {
      setMessage(error.message);
      setIsError(true);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="admin-login-shell">
      <div className="admin-login-card">
        <p className="eyebrow">Espace administrateur</p>
        <h1>Nouveau mot de passe</h1>

        {done ? (
          <>
            <p className="admin-login-lead">
              Mot de passe mis a jour. Tu peux maintenant te connecter.
            </p>
            <div className="admin-login-footer">
              <a href="/admin">Aller a la connexion</a>
            </div>
          </>
        ) : (
          <>
            <p className="admin-login-lead">Choisis un nouveau mot de passe pour ton compte.</p>
            <form className="form" onSubmit={handleSubmit}>
              <label>
                Nouveau mot de passe
                <input
                  name="newPassword"
                  type={show ? "text" : "password"}
                  minLength={8}
                  autoComplete="new-password"
                  required
                  autoFocus
                />
              </label>
              <label>
                Confirmation
                <input
                  name="confirmPassword"
                  type={show ? "text" : "password"}
                  minLength={8}
                  autoComplete="new-password"
                  required
                />
              </label>
              <label className="reset-show-toggle">
                <input
                  type="checkbox"
                  checked={show}
                  onChange={(event) => setShow(event.target.checked)}
                />
                Afficher le mot de passe
              </label>
              <button
                className="button primary admin-login-submit"
                type="submit"
                disabled={submitting || !token}
              >
                {submitting ? "..." : "Enregistrer"}
              </button>
            </form>

            {!token && <p className="message error">Lien invalide : aucun jeton fourni.</p>}
            {message && <p className={`message ${isError ? "error" : ""}`}>{message}</p>}

            <div className="admin-login-footer">
              <a href="/admin">Retour a la connexion</a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
