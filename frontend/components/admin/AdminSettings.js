"use client";

import { useState } from "react";

const SETTING_GROUPS = [
  {
    eyebrow: "Entreprise",
    title: "Informations publiques",
    description: "Base utilisee par les pages legales, le footer et les points de contact.",
    items: [
      ["Entreprise", "Auto BHJ SRL"],
      ["TVA", "BE 0801.303.538"],
      ["Telephone", "+32 483 20 88 01"],
      ["WhatsApp", "+32 483 20 88 01"],
      ["Email public", "contact@autobhj.be"],
    ],
  },
  {
    eyebrow: "Site public",
    title: "Configuration visible",
    description: "Elements relies a l'identite du site et aux parcours visiteurs.",
    items: [
      ["Logo", "/logo.png"],
      ["Nom du site", "Auto BHJ - Vehicules d'occasion"],
      ["Page stock", "/stock"],
      ["Formulaire contact", "Messages admin"],
      ["Cookies", "Essentiels uniquement"],
    ],
  },
  {
    eyebrow: "Notifications",
    title: "Suivi des demandes",
    description: "Ce qui existe aujourd'hui et ce qui est pret a etre branche plus tard.",
    items: [
      ["Nouveau message", "Visible dans l'onglet Demandes"],
      ["Email destinataire", "contact@autobhj.be"],
      ["Alertes WhatsApp", "A connecter"],
      ["Rappel rendez-vous", "A connecter"],
    ],
  },
  {
    eyebrow: "Donnees",
    title: "Maintenance",
    description: "Vue de controle pour les donnees gerees par l'administration.",
    items: [
      ["Vehicules", "Geres via l'onglet Vehicules"],
      ["Demandes", "Gerees via l'onglet Demandes"],
      ["Exports CSV", "A connecter"],
      ["Sauvegarde base", "A connecter"],
    ],
  },
];

const ROADMAP = [
  "Edition des coordonnees",
  "Exports CSV",
  "Sauvegarde base",
  "Notifications email",
];

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
    <div className="settings-page settings-page-flat">
      <section className="settings-security-strip" aria-labelledby="settings-security-title">
        <div>
          <p className="eyebrow">Compte</p>
          <h2 id="settings-security-title">Acces administrateur</h2>
          <p>
            Connecte en tant que <strong>{username}</strong>. Session chiffree HMAC,
            deconnexion apres 1h d'inactivite.
          </p>
        </div>

        <form className="settings-password-form" onSubmit={handleSubmit}>
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
            Confirmation
            <input
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
            />
          </label>
          <button className="button primary small" type="submit" disabled={submitting}>
            {submitting ? "Mise a jour..." : "Mettre a jour"}
          </button>
        </form>

        {message && <p className={`message ${isError ? "error" : ""}`}>{message}</p>}
      </section>

      <div className="settings-flat-layout">
        <section className="settings-flat-main" aria-label="Parametres principaux">
          {SETTING_GROUPS.map((group) => (
            <article className="settings-flat-section" key={group.title}>
              <div className="settings-flat-head">
                <div>
                  <p className="eyebrow">{group.eyebrow}</p>
                  <h2>{group.title}</h2>
                </div>
                <p>{group.description}</p>
              </div>

              <div className="settings-flat-list">
                {group.items.map(([label, value]) => (
                  <div className="settings-flat-row" key={`${group.title}-${label}`}>
                    <span>{label}</span>
                    <strong>{value}</strong>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </section>

        <aside className="settings-flat-aside" aria-labelledby="settings-advanced-title">
          <div className="team-section-head">
            <div>
              <p className="eyebrow">A connecter plus tard</p>
              <h2 id="settings-advanced-title">Parametres avances</h2>
              <p>
                L'interface est prete. Pour rendre ces reglages modifiables, il faudra
                ajouter une table de configuration et des routes API dediees.
              </p>
            </div>
          </div>

          <div className="settings-roadmap settings-roadmap-flat">
            {ROADMAP.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
