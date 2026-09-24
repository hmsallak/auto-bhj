"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { pad, toDateKey } from "../../lib/appointments";

// Opening hours offered as slots, every 30 minutes.
const FIRST_HOUR = 9;
const LAST_HOUR = 19;
const TIME_SLOTS = [];
for (let hour = FIRST_HOUR; hour < LAST_HOUR; hour += 1) {
  TIME_SLOTS.push(`${pad(hour)}:00`, `${pad(hour)}:30`);
}

const WEEKDAYS = ["L", "M", "M", "J", "V", "S", "D"];

function monthDays(year, month) {
  const first = new Date(year, month, 1);
  // Monday-first week: Sunday (0) becomes 6.
  const leading = (first.getDay() + 6) % 7;
  const count = new Date(year, month + 1, 0).getDate();
  const cells = Array.from({ length: leading }, () => null);
  for (let day = 1; day <= count; day += 1) cells.push(new Date(year, month, day));
  return cells;
}

// With `initial` (an existing appointment) the picker opens on its date,
// time and note, and treats its own slot as free.
// With `withCustomer` (manual appointment, no request behind it) a first
// step asks who the customer is; `cars` feeds its optional model list.
// `car` is the vehicle a request is about: if it is reserved or sold, a
// warning step comes first so nobody books a visit for a car that's gone.
export default function AppointmentPicker({
  customerName = "",
  appointments = [],
  initial = null,
  withCustomer = false,
  cars = [],
  car = null,
  onCancel,
  onConfirm,
}) {
  const today = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }, []);
  const initialDate = initial ? new Date(initial.startsAt) : today;
  const [view, setView] = useState({ year: initialDate.getFullYear(), month: initialDate.getMonth() });
  const [dayKey, setDayKey] = useState(initial ? initial.startsAt.slice(0, 10) : null);
  const [time, setTime] = useState(initial ? initial.startsAt.slice(11, 16) : null);
  const [note, setNote] = useState(initial?.note || "");
  const others = initial ? appointments.filter((item) => item.id !== initial.id) : appointments;
  const [customer, setCustomer] = useState({ firstName: "", lastName: "", phone: "", email: "", carReference: "" });
  const linkedCar = withCustomer ? cars.find((item) => item.reference === customer.carReference) : car;
  const carUnavailable = linkedCar && (linkedCar.status === "reserved" || linkedCar.status === "sold");
  // Two steps keep the dialog small: pick the day, then the time.
  const [step, setStep] = useState(() => {
    if (withCustomer) return "customer";
    return carUnavailable && !initial ? "warning" : "date";
  });
  const customerReady =
    customer.firstName.trim() && customer.lastName.trim() && customer.phone.replace(/\D/g, "").length >= 8;
  const displayName = withCustomer
    ? `${customer.firstName} ${customer.lastName}`.trim() || "Nouveau client"
    : customerName;
  const stepNumber = { customer: 1, warning: null, date: withCustomer ? 2 : 1, time: withCustomer ? 3 : 2 }[step];
  const stepTitle = {
    customer: "Client",
    warning: "Attention",
    date: "Choisir le jour",
    time: "Choisir l'heure",
  }[step];
  const carsForSale = cars
    .filter((car) => car.status !== "sold")
    .sort((a, b) => `${a.brand} ${a.model}`.localeCompare(`${b.brand} ${b.model}`));

  function updateCustomer(field, value) {
    setCustomer((current) => ({ ...current, [field]: value }));
  }
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    function onKey(event) {
      if (event.key === "Escape") onCancel();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  const cells = monthDays(view.year, view.month);
  const monthLabel = new Intl.DateTimeFormat("fr-BE", { month: "long", year: "numeric" }).format(
    new Date(view.year, view.month, 1)
  );
  const isCurrentMonth = view.year === today.getFullYear() && view.month === today.getMonth();

  // Slots already booked that day, and slots already gone today.
  const taken = new Set(
    others.filter((item) => item.startsAt.startsWith(`${dayKey}T`)).map((item) => item.startsAt.slice(11, 16))
  );
  const now = new Date();
  const isToday = dayKey === toDateKey(now);
  const nowTime = `${pad(now.getHours())}:${pad(now.getMinutes())}`;

  function dayLabel(date) {
    return new Intl.DateTimeFormat("fr-BE", { weekday: "long", day: "numeric", month: "long" }).format(date);
  }

  function pickDay(key) {
    // Same day again keeps the chosen time (useful when editing).
    if (key !== dayKey) setTime(null);
    setDayKey(key);
    setStep("time");
  }

  function shiftMonth(delta) {
    setView(({ year, month }) => {
      const next = new Date(year, month + delta, 1);
      return { year: next.getFullYear(), month: next.getMonth() };
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    // Enter on the customer step moves on instead of submitting.
    if (step === "customer") {
      if (customerReady) setStep(carUnavailable ? "warning" : "date");
      return;
    }
    if (step !== "time" || !dayKey || !time) return;
    setSaving(true);
    setError("");
    try {
      await onConfirm(`${dayKey}T${time}`, note, withCustomer ? customer : null);
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  // Rendered at the admin root (not inside the panel): a transformed or
  // animated ancestor would make position:fixed relative to it instead of
  // the screen, off-centring the dialog. .dashboard carries the --admin-*
  // colour tokens, which <body> does not.
  return createPortal(
    <div
      className="admin-confirm-overlay appointment-overlay"
      role="presentation"
      onClick={(event) => event.target === event.currentTarget && onCancel()}
    >
      <form
        className="admin-confirm-dialog appointment-picker"
        role="dialog"
        aria-modal="true"
        aria-labelledby="appointment-picker-title"
        onSubmit={handleSubmit}
      >
        <div>
          <h3 id="appointment-picker-title">{initial ? "Modifier le rendez-vous" : "Planifier un rendez-vous"}</h3>
          <p>
            {displayName} - {stepNumber ? `${stepNumber}. ` : ""}{stepTitle}
          </p>
        </div>

        {step === "customer" && (
          <div className="picker-fields">
            <label>
              Prenom
              <input
                type="text"
                autoComplete="given-name"
                maxLength={60}
                value={customer.firstName}
                onChange={(event) => updateCustomer("firstName", event.target.value)}
                required
                autoFocus
              />
            </label>
            <label>
              Nom
              <input
                type="text"
                autoComplete="family-name"
                maxLength={60}
                value={customer.lastName}
                onChange={(event) => updateCustomer("lastName", event.target.value)}
                required
              />
            </label>
            <label>
              GSM
              <input
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="0470 12 34 56"
                maxLength={30}
                value={customer.phone}
                onChange={(event) => updateCustomer("phone", event.target.value)}
                required
              />
            </label>
            <label>
              E-mail (optionnel, pour la confirmation)
              <input
                type="email"
                inputMode="email"
                autoComplete="email"
                maxLength={160}
                value={customer.email}
                onChange={(event) => updateCustomer("email", event.target.value)}
              />
            </label>
            <label>
              Modele (optionnel)
              <select
                value={customer.carReference}
                onChange={(event) => updateCustomer("carReference", event.target.value)}
              >
                <option value="">Aucun</option>
                {carsForSale.map((car) => (
                  <option key={car.id} value={car.reference}>
                    {car.brand} {car.model} - {car.reference}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}

        {step === "warning" && linkedCar && (
          <div className={`picker-warning ${linkedCar.status}`} role="alert">
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
              <path
                d="M12 3 2 20h20L12 3Zm0 6v5m0 3v.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div>
              <strong>{linkedCar.status === "sold" ? "Voiture deja vendue" : "Voiture reservee"}</strong>
              <p>
                {linkedCar.brand} {linkedCar.model} - {linkedCar.reference}
                {linkedCar.status === "sold"
                  ? " a ete vendue. Le client ne pourra pas l'acheter."
                  : " est reservee pour un autre client."}
              </p>
            </div>
          </div>
        )}

        {step === "date" && (
          <>
            {withCustomer && (
              <button className="picker-back" type="button" onClick={() => setStep("customer")}>
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                  <path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {displayName}
              </button>
            )}
            <div className="picker-month">
              <button
                type="button"
                onClick={() => shiftMonth(-1)}
                disabled={isCurrentMonth}
                aria-label="Mois precedent"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                  <path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <strong aria-live="polite">{monthLabel}</strong>
              <button type="button" onClick={() => shiftMonth(1)} aria-label="Mois suivant">
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                  <path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            <div className="picker-grid" role="group" aria-label={`Jours de ${monthLabel}`}>
              {WEEKDAYS.map((label, index) => (
                <span className="picker-weekday" key={`${label}-${index}`} aria-hidden="true">
                  {label}
                </span>
              ))}
              {cells.map((date, index) => {
                if (!date) return <span key={`empty-${index}`} />;
                const key = toDateKey(date);
                const past = date < today;
                const booked = others.some((item) => item.startsAt.startsWith(`${key}T`));
                return (
                  <button
                    key={key}
                    type="button"
                    className={`picker-day ${key === dayKey ? "selected" : ""} ${booked ? "booked" : ""}`}
                    disabled={past}
                    aria-pressed={key === dayKey}
                    aria-label={dayLabel(date)}
                    onClick={() => pickDay(key)}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {step === "time" && (
          <>
            <button className="picker-back" type="button" onClick={() => setStep("date")} autoFocus>
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {dayLabel(new Date(`${dayKey}T00:00`))}
            </button>

            <div className="picker-times" role="group" aria-label="Heure du rendez-vous">
              {TIME_SLOTS.map((slot) => {
                const unavailable = taken.has(slot) || (isToday && slot <= nowTime);
                return (
                  <button
                    key={slot}
                    type="button"
                    className={`${slot === time ? "selected" : ""} ${taken.has(slot) ? "taken" : ""}`}
                    disabled={unavailable}
                    aria-pressed={slot === time}
                    aria-label={taken.has(slot) ? `${slot}, deja pris` : slot}
                    title={taken.has(slot) ? "Deja pris" : undefined}
                    onClick={() => setTime(slot)}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>

            <label className="picker-note">
              Note (optionnel)
              <input
                type="text"
                maxLength={500}
                placeholder="Essai, reprise, signature..."
                value={note}
                onChange={(event) => setNote(event.target.value)}
              />
            </label>
          </>
        )}

        {error && <p className="message error">{error}</p>}

        <div className="admin-confirm-actions">
          <button className="button neutral small" type="button" onClick={onCancel}>
            Annuler
          </button>
          {step === "warning" && (
            <button className="button primary small" type="button" onClick={() => setStep("date")} autoFocus>
              Continuer quand meme
            </button>
          )}
          {step === "customer" && (
            <button className="button primary small" type="submit" disabled={!customerReady}>
              Suivant
            </button>
          )}
          {step === "time" && (
            <button className="button primary small" type="submit" disabled={!time || saving}>
              {saving ? "..." : initial ? "Enregistrer" : "Confirmer"}
            </button>
          )}
        </div>
      </form>
    </div>,
    document.querySelector(".dashboard") || document.body
  );
}
