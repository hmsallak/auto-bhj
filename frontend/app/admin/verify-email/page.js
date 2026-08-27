"use client";

import { useEffect, useState } from "react";

export default function VerifyEmailPage() {
  const [state, setState] = useState("checking"); // checking | ok | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token") || "";
    if (!token) {
      setState("error");
      setMessage("Lien invalide : aucun jeton fourni.");
      return;
    }

    fetch("/api/admin/verify-email", {
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
        <h1>Confirmation d&apos;adresse</h1>

        {state === "checking" && <p className="admin-login-lead">Verification en cours...</p>}

        {state === "ok" && (
          <p className="admin-login-lead">
            Adresse confirmee. Ta demande est maintenant en attente d&apos;approbation par
            un administrateur. Tu recevras un e-mail des qu&apos;elle sera validee.
          </p>
        )}

        {state === "error" && <p className="message error">{message}</p>}

        <div className="admin-login-footer">
          <a href="/admin">Retour a la connexion</a>
        </div>
      </div>
    </div>
  );
}
