"use client";

import { useState } from "react";
import { useT } from "../lib/i18n";

const FIELD =
  "w-full rounded-lg border border-line bg-white px-3 py-2 text-[13.5px] text-ink placeholder:text-subtle focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand";

export default function VehicleAppointmentForm({ reference, carLabel }) {
  const t = useT();
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [error, setError] = useState("");
  const [form, setForm] = useState(() => ({
    name: "",
    email: "",
    phone: "",
    message: t("apptForm.defaultMessage"),
    consent: false,
    company: "", // honeypot
  }));

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  const sent = status === "sent";

  async function handleSubmit(event) {
    event.preventDefault();
    if (status === "sending" || sent) return;
    if (!form.consent) {
      setError(t("apptForm.errConsent"));
      return;
    }
    setStatus("sending");
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          carReference: reference,
          company: form.company,
          message: `${t("apptForm.vehiclePrefix")} : ${carLabel} - ref. ${reference}\n\n${form.message}`,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || t("apptForm.errSend"));
        setStatus("error");
        return;
      }
      setStatus("sent");
    } catch {
      setError(t("apptForm.errNetwork"));
      setStatus("error");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-line bg-white p-4 sm:p-5"
      aria-label={t("apptForm.aria")}
    >
      <h2
        className="whitespace-nowrap text-ink"
        style={{ fontSize: "16px", fontWeight: 700, lineHeight: 1.3 }}
      >
        {t("apptForm.title")}
      </h2>

      <div className="mt-3 flex flex-col gap-2.5">
        <label className="flex flex-col gap-1">
          <span className="text-[13px] font-medium text-body">{t("apptForm.yourMessage")}</span>
          <textarea
            className={`${FIELD} min-h-[84px] resize-y`}
            rows={4}
            value={form.message}
            onChange={(event) => update("message", event.target.value)}
            required
          />
        </label>

        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          <label className="flex flex-col gap-1">
            <span className="text-[13px] font-medium text-body">{t("apptForm.name")}</span>
            <input
              className={FIELD}
              type="text"
              autoComplete="name"
              value={form.name}
              onChange={(event) => update("name", event.target.value)}
              required
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-[13px] font-medium text-body">{t("apptForm.email")}</span>
            <input
              className={FIELD}
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(event) => update("email", event.target.value)}
              required
            />
          </label>
          <label className="flex flex-col gap-1 sm:col-span-2">
            <span className="text-[13px] font-medium text-body">{t("apptForm.phone")}</span>
            <input
              className={FIELD}
              type="tel"
              autoComplete="tel"
              value={form.phone}
              onChange={(event) => update("phone", event.target.value)}
              required
            />
          </label>
        </div>

        {/* Honeypot : invisible pour un humain, rempli par les bots. */}
        <input
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
          value={form.company}
          onChange={(event) => update("company", event.target.value)}
        />

        <div className="flex items-start gap-2 text-[13px] text-body">
          <input
            id="appointment-consent"
            type="checkbox"
            className="mt-0.5 h-4 w-4 shrink-0 accent-brand"
            checked={form.consent}
            onChange={(event) => update("consent", event.target.checked)}
            required
          />
          <label htmlFor="appointment-consent">
            {t("apptForm.consentPre")}
            <a
              href="/politique-confidentialite"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(event) => event.stopPropagation()}
              className="font-medium text-brand underline underline-offset-2 hover:text-brand-dark"
            >
              {t("apptForm.consentLink")}
            </a>
            .
          </label>
        </div>

        {error && <p className="text-[13px] font-medium text-red-600">{error}</p>}
        {sent && (
          <p className="text-[13px] font-medium text-brand">{t("apptForm.success")}</p>
        )}

        <button
          type="submit"
          disabled={status === "sending" || sent}
          className={`mt-1 inline-flex w-full items-center justify-center rounded-full px-10 py-4 text-[13px] font-semibold uppercase tracking-wider text-white transition-colors sm:w-auto sm:self-start ${
            sent
              ? "bg-cta"
              : "bg-cta-dark hover:bg-cta disabled:opacity-60"
          }`}
        >
          {sent ? t("apptForm.sent") : status === "sending" ? t("apptForm.sending") : t("apptForm.submit")}
        </button>
      </div>
    </form>
  );
}
