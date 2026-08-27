"use client";

import { useEffect, useState } from "react";

export default function AdminSiteSettings({ onLoad, onSave }) {
  const [settings, setSettings] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [message, setMessage] = useState("");
  const [toast, setToast] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    onLoad()
      .then(setSettings)
      .catch((error) => setLoadError(error.message));
  }, [onLoad]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 3200);
    return () => clearTimeout(timer);
  }, [toast]);

  async function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const phone = String(data.get("phone") || "").trim();
    const email = String(data.get("email") || "").trim();
    const currentPassword = String(data.get("currentPassword") || "");
    setMessage("");

    if (!currentPassword) {
      setMessage("Saisis ton mot de passe actuel pour confirmer.");
      return;
    }

    setSubmitting(true);
    try {
      const updated = await onSave({ currentPassword, phone, email });
      setSettings(updated);
      setToast("Coordonnees mises a jour.");
      setFormKey((key) => key + 1);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loadError) {
    return <p className="message error">{loadError}</p>;
  }
  if (!settings) {
    return <p className="py-6 text-center text-[15px]">Chargement...</p>;
  }

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
          <p className="eyebrow">Parametres site</p>
          <h2 id="site-settings-title">Coordonnees publiques</h2>
          <p>
            Numero et e-mail affiches partout sur le site public (header, footer, boutons
            des fiches vehicules, WhatsApp).
          </p>
        </div>
      </div>

      <section className="profile-section">
        <form className="profile-form" key={formKey} onSubmit={handleSubmit}>
          <label>
            Telephone
            <input
              name="phone"
              type="text"
              defaultValue={settings.phone}
              placeholder="0483 20 88 01"
              autoComplete="off"
            />
          </label>
          <label>
            E-mail public
            <input
              name="email"
              type="email"
              defaultValue={settings.email}
              placeholder="contact@autobhj.be"
              autoComplete="off"
            />
          </label>

          <p className="signup-rules" style={{ color: "var(--admin-muted)" }}>
            wa.me / tel: sont deduits automatiquement du numero
            (actuellement <strong>{settings.phoneTel}</strong>).
          </p>

          <label>
            Mot de passe actuel <span aria-hidden="true">*</span>
            <input name="currentPassword" type="password" autoComplete="current-password" required />
          </label>

          <div className="profile-form-actions">
            <button type="submit" className="button primary small" disabled={submitting}>
              {submitting ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </form>

        {message && <p className="message error">{message}</p>}
      </section>
    </section>
  );
}
