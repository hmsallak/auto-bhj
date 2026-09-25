"use client";

import { useEffect, useState } from "react";

export default function ConfirmEmailPage() {
  const [state, setState] = useState("checking");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token") || "";
    if (!token) {
      setState("error");
      setMessage("Lien invalide : aucun jeton fourni.");
      return;
    }

    fetch("/api/admin/confirm-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then(async (response) => {
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(payload.error || "Une erreur est survenue.");
        setState("ok");
      })
      .catch((error) => {
        setState("error");
        setMessage(error.message);
      });
  }, []);

  return (
    <div className="admin-login-shell">
      <div className="admin-login-card">
        <p className="eyebrow">Espace administrateur</p>
        <h1>Nouvelle adresse confirmee</h1>
        {state === "checking" && <p className="admin-login-lead">Verification en cours...</p>}
        {state === "ok" && <p className="admin-login-lead">Cette adresse est maintenant utilisee pour la connexion et la recuperation du compte.</p>}
        {state === "error" && <p className="message error">{message}</p>}
        <div className="admin-login-footer"><a href="/admin">Retour a l'administration</a></div>
      </div>
    </div>
  );
}
