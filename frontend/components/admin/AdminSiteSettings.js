"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

// Public phone + e-mail. Editing is plain; saving opens a small dialog that
// shows what changes and asks for the password to validate it.
export default function AdminSiteSettings({ onLoad, onSave }) {
  const [settings, setSettings] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [password, setPassword] = useState("");
  const [dialogError, setDialogError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState("");
  const passwordRef = useRef(null);

  // Load once when the section opens: the parent re-creates onLoad on every
  // render, which would otherwise re-fetch each time the admin page updates.
  useEffect(() => {
    onLoad()
      .then((loaded) => {
        setSettings(loaded);
        setPhone(loaded.phone);
        setEmail(loaded.email);
      })
      .catch((error) => setLoadError(error.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(""), 3200);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!confirming) return undefined;
    passwordRef.current?.focus();
    function onKey(event) {
      if (event.key === "Escape") closeDialog();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [confirming]);

  if (loadError) return <p className="message error">{loadError}</p>;
  if (!settings) return <p className="py-6 text-center text-[15px]">Chargement...</p>;

  const changes = [
    phone.trim() !== settings.phone && { label: "Telephone", from: settings.phone, to: phone.trim() },
    email.trim().toLowerCase() !== settings.email && { label: "E-mail", from: settings.email, to: email.trim() },
  ].filter(Boolean);

  function closeDialog() {
    setConfirming(false);
    setPassword("");
    setDialogError("");
  }

  function askConfirmation(event) {
    event.preventDefault();
    if (changes.length) setConfirming(true);
  }

  async function validate(event) {
    event.preventDefault();
    setSubmitting(true);
    setDialogError("");
    try {
      const updated = await onSave({ currentPassword: password, phone: phone.trim(), email: email.trim() });
      setSettings(updated);
      setPhone(updated.phone);
      setEmail(updated.email);
      closeDialog();
      setToast("Coordonnees mises a jour.");
    } catch (error) {
      // Wrong password: stay in the dialog, clear the field, try again.
      setDialogError(error.message);
      setPassword("");
      passwordRef.current?.focus();
    } finally {
      setSubmitting(false);
    }
  }

  const dialog = confirming && (
    <div
      className="admin-confirm-overlay"
      role="presentation"
      onClick={(event) => event.target === event.currentTarget && closeDialog()}
    >
      <form
        className="admin-confirm-dialog site-confirm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="site-confirm-title"
        onSubmit={validate}
      >
        <div>
          <h3 id="site-confirm-title">Confirmer la modification</h3>
        </div>

        <dl className="site-confirm-changes">
          {changes.map((change) => (
            <div key={change.label}>
              <dt>{change.label}</dt>
              <dd>
                <span className="site-confirm-old">{change.from || "-"}</span>
                <span aria-hidden="true"> → </span>
                <span className="visually-hidden"> devient </span>
                <strong>{change.to || "-"}</strong>
              </dd>
            </div>
          ))}
        </dl>

        <label className="site-confirm-password">
          Saisissez votre mot de passe pour valider
          <input
            ref={passwordRef}
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            aria-invalid={Boolean(dialogError)}
            aria-describedby={dialogError ? "site-confirm-error" : undefined}
            required
          />
        </label>
        {dialogError && (
          <p id="site-confirm-error" className="set-form-message is-error" role="alert">
            {dialogError}
          </p>
        )}

        <div className="admin-confirm-actions">
          <button className="button neutral small" type="button" onClick={closeDialog}>
            Annuler
          </button>
          <button className="button primary small" type="submit" disabled={!password || submitting}>
            {submitting ? "..." : "Valider"}
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <section className="profile-page" aria-labelledby="site-settings-title">
      {toast && (
        <div className="admin-toast" role="status">
          <span aria-hidden="true">&#10003;</span>
          {toast}
        </div>
      )}

      <div className="profile-head">
        <div>
          <h2 id="site-settings-title">Coordonnees publiques</h2>
          <p>Numero et e-mail affiches sur tout le site public (en-tete, pied de page, fiches vehicules).</p>
        </div>
      </div>

      <form className="profile-form site-settings-form" onSubmit={askConfirmation}>
        <label>
          Telephone
          <input
            name="phone"
            type="tel"
            inputMode="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="0483 20 88 01"
            autoComplete="off"
          />
        </label>
        <label>
          E-mail public
          <input
            name="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="contact@autobhj.be"
            autoComplete="off"
          />
        </label>

        <div className="profile-form-actions">
          <button type="submit" className="button primary small" disabled={!changes.length}>
            Enregistrer
          </button>
        </div>
      </form>

      {/* At the admin root so the fixed overlay is centred on the screen. */}
      {dialog && createPortal(dialog, document.querySelector(".dashboard") || document.body)}
    </section>
  );
}
