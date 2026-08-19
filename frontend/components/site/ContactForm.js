"use client";

import { useEffect, useState } from "react";

export default function ContactForm() {
  const [carReference, setCarReference] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    const intent = params.get("intent");
    if (ref) {
      const upperRef = ref.toUpperCase();
      setCarReference(upperRef);
      setMessage(
        intent === "visit"
          ? `Bonjour, je souhaite organiser une visite pour le vehicule ${upperRef}.`
          : `Bonjour, je suis interesse(e) par le vehicule ${upperRef}.`
      );
    }
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setStatus("sending");

    const formData = new FormData(event.target);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) throw new Error(data.error || "Une erreur est survenue.");

      setStatus("sent");
      event.target.reset();
      setCarReference("");
      setMessage("");
    } catch (submitError) {
      setError(submitError.message);
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="contact-form-success">
        <strong>Message envoye.</strong>
        <p>Nous revenons vers vous des que possible.</p>
      </div>
    );
  }

  return (
    <form className="form contact-form" onSubmit={handleSubmit}>
      <div className="two-cols">
        <label>
          Nom
          <input name="name" required autoComplete="name" />
        </label>
        <label>
          Email
          <input name="email" type="email" required autoComplete="email" />
        </label>
      </div>
      <div className="two-cols">
        <label>
          Telephone (optionnel)
          <input name="phone" type="tel" autoComplete="tel" />
        </label>
        <label>
          Reference voiture (optionnel)
          <input
            name="carReference"
            placeholder="AB-000123"
            value={carReference}
            onChange={(event) => setCarReference(event.target.value)}
          />
        </label>
      </div>
      <label>
        Date ou moment souhaite pour la visite (optionnel)
        <input
          name="preferredVisit"
          placeholder="Ex: samedi matin, lundi apres-midi..."
          autoComplete="off"
        />
      </label>
      <label>
        Message
        <textarea
          name="message"
          required
          placeholder="Bonjour, je suis interesse(e) par..."
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />
      </label>
      <div className="form-actions">
        <button className="button primary" type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Envoi..." : "Envoyer le message"}
        </button>
      </div>
      {error && <p className="message error">{error}</p>}
    </form>
  );
}
