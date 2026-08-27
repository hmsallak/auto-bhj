"use client";

import { useState } from "react";

export default function SignupPage() {
  const [show, setShow] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    const password = data.get("password");
    const confirmPassword = data.get("confirmPassword");
    setMessage("");
    setIsError(false);

    if (password !== confirmPassword) {
      setMessage("Les deux mots de passe ne correspondent pas.");
      setIsError(true);
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/admin/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
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
        <h1>Creer un compte</h1>

        {done ? (
          <>
            <p className="admin-login-lead">
              Si l&apos;adresse est valide, un e-mail de confirmation vient d&apos;etre
              envoye. Clique sur le lien, puis attends la validation d&apos;un
              administrateur.
            </p>
            <div className="admin-login-footer">
              <a href="/admin">Retour a la connexion</a>
            </div>
          </>
        ) : (
          <>
            <p className="admin-login-lead">
              Ta demande sera examinee par un administrateur avant activation.
            </p>
            <form className="form" onSubmit={handleSubmit}>
              <label>
                Email
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="vous@exemple.com"
                  required
                  autoFocus
                />
              </label>
              <label>
                Mot de passe
                <input
                  name="password"
                  type={show ? "text" : "password"}
                  autoComplete="new-password"
                  minLength={10}
                  required
                />
              </label>
              <label>
                Confirmation
                <input
                  name="confirmPassword"
                  type={show ? "text" : "password"}
                  autoComplete="new-password"
                  minLength={10}
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
              <p className="signup-rules">
                Au moins 10 caracteres, avec une majuscule, une minuscule et un chiffre.
                Evite les suites (1234), les mots courants et ton adresse e-mail.
              </p>
              <button
                className="button primary admin-login-submit"
                type="submit"
                disabled={submitting}
              >
                {submitting ? "Envoi..." : "Envoyer la demande"}
              </button>
            </form>

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
