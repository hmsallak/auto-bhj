"use client";

import { useEffect, useRef, useState } from "react";
import { ContactActions, RequestedCar } from "./AdminMessages";
import AppointmentPicker from "./AppointmentPicker";
import { formatAppointment, isPastAppointment, toDateKey } from "../../lib/appointments";
import { phoneLinks } from "../../lib/format";

function shiftedKey(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return toDateKey(date);
}

// Short buckets instead of one heading per date. Weeks run Monday-Sunday.
function groupUpcoming(items) {
  const today = shiftedKey(0);
  const tomorrow = shiftedKey(1);
  const endOfWeek = shiftedKey((7 - new Date().getDay()) % 7);

  const sections = [
    { key: "today", label: "Aujourd'hui", showDay: false, open: true, test: (day) => day === today },
    { key: "tomorrow", label: "Demain", showDay: false, open: true, test: (day) => day === tomorrow },
    { key: "week", label: "Cette semaine", showDay: true, open: false, test: (day) => day <= endOfWeek },
    { key: "later", label: "Plus tard", showDay: true, open: false, test: () => true },
  ].map((section) => ({ ...section, items: [] }));

  for (const item of items) {
    const day = item.startsAt.slice(0, 10);
    sections.find((section) => section.test(day)).items.push(item);
  }
  return sections.filter((section) => section.items.length);
}

const shortDay = new Intl.DateTimeFormat("fr-BE", { weekday: "short", day: "numeric" });


const createdFormat = new Intl.DateTimeFormat("fr-BE", { day: "numeric", month: "long", year: "numeric" });

// Full appointment record: who, when, which car, how to reach them, and the
// original request text when it came from the site.
function AppointmentDetail({ item, car, message, onBack, onEdit, onCancel }) {
  const [confirming, setConfirming] = useState(false);
  const headingRef = useRef(null);
  const past = isPastAppointment(item.startsAt);

  useEffect(() => {
    headingRef.current?.focus();
    window.scrollTo({ top: 0 });
  }, [item.id]);

  return (
    <div className="panel dash-panel appointment-detail">
      <button className="message-back" type="button" onClick={onBack}>
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Tous les rendez-vous
      </button>

      <header className="appointment-detail-head">
        <h2 ref={headingRef} tabIndex={-1}>
          {item.name}
        </h2>
        <p className={`appointment-detail-when ${past ? "past" : ""}`}>
          <img src="/icons/calendrier.svg" alt="" width={18} height={18} aria-hidden="true" />
          {formatAppointment(item.startsAt)}
          {past && <span> - passe</span>}
        </p>
      </header>

      <dl className="appointment-fields">
        <div>
          <dt>Nom</dt>
          <dd>{item.name}</dd>
        </div>
        <div>
          <dt>GSM</dt>
          <dd>{phoneLinks(item.phone) ? <a href={phoneLinks(item.phone).tel}>{item.phone}</a> : item.phone || "-"}</dd>
        </div>
        <div>
          <dt>E-mail</dt>
          <dd>{item.email ? <a href={`mailto:${item.email}`}>{item.email}</a> : "-"}</dd>
        </div>
        <div>
          <dt>Note</dt>
          <dd>{item.note || "-"}</dd>
        </div>
        <div>
          <dt>Origine</dt>
          <dd>{item.messageId ? "Demande recue sur le site" : "Ajoute a la main"}</dd>
        </div>
        <div>
          <dt>Cree par</dt>
          <dd>
            {item.createdBy}, le {createdFormat.format(new Date(item.createdAt))}
          </dd>
        </div>
      </dl>

      {item.carReference && <RequestedCar reference={item.carReference} car={car} />}

      {message && (
        <blockquote className="appointment-request">
          <span>Message du client</span>
          <p>{message.message}</p>
        </blockquote>
      )}

      <ContactActions msg={item} />

      <div className="admin-actions">
        <button className="button primary small message-plan" type="button" onClick={() => onEdit(item)}>
          Modifier
        </button>
        {confirming ? (
          <>
            <button className="danger" type="button" onClick={() => onCancel(item)}>
              Oui, annuler le rendez-vous
            </button>
            <button className="button neutral small" type="button" onClick={() => setConfirming(false)}>
              Non
            </button>
          </>
        ) : (
          <button className="danger" type="button" onClick={() => setConfirming(true)}>
            Annuler le rendez-vous
          </button>
        )}
      </div>
    </div>
  );
}

function AppointmentRow({ item, car, showDay, onOpen, onEdit, onCancel }) {
  const [confirming, setConfirming] = useState(false);

  return (
    <li className="appointment-row">
      <span className="appointment-time">
        {showDay && <span className="appointment-day-tag">{shortDay.format(new Date(item.startsAt))}</span>}
        {item.startsAt.slice(11, 16)}
      </span>
      <div className="appointment-main">
        <button className="appointment-name" type="button" onClick={() => onOpen(item)}>
          {item.name}
        </button>
        {item.carReference && (
          <span className="appointment-car">{car ? `${car.brand} ${car.model} - ${car.reference}` : item.carReference}</span>
        )}
        {item.note && <span className="appointment-note">{item.note}</span>}
        <ContactActions msg={item} />
      </div>
      <div className="appointment-cancel">
        {confirming ? (
          <>
            <button className="danger" type="button" onClick={() => onCancel(item)}>
              Oui, annuler
            </button>
            <button className="button neutral small" type="button" onClick={() => setConfirming(false)}>
              Non
            </button>
          </>
        ) : (
          <>
          <button
            className="appointment-edit"
            type="button"
            aria-label={`Modifier le rendez-vous de ${item.name}`}
            title="Modifier le rendez-vous"
            onClick={() => onEdit(item)}
          >
            <img src="/icons/modifier.svg" alt="" width={20} height={20} aria-hidden="true" />
          </button>
          <button
            className="appointment-cancel-toggle"
            type="button"
            aria-label={`Annuler le rendez-vous de ${item.name}`}
            title="Annuler le rendez-vous"
            onClick={() => setConfirming(true)}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          </>
        )}
      </div>
    </li>
  );
}

// openId / onOpenChange are driven by the page, so the dashboard can open
// an appointment's record directly.
export default function AdminAppointments({
  appointments,
  cars = [],
  messages = [],
  openId = null,
  onOpenChange = () => {},
  onCreate,
  onUpdate,
  onCancel,
}) {
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);
  const carsByReference = new Map(cars.map((car) => [car.reference, car]));
  // Both lists start from today: upcoming soonest first, then past most
  // recent first. "YYYY-MM-DDTHH:MM" strings sort chronologically as text.
  const byTime = (a, b) => a.startsAt.localeCompare(b.startsAt);
  const upcoming = appointments.filter((item) => !isPastAppointment(item.startsAt)).sort(byTime);
  const past = appointments
    .filter((item) => isPastAppointment(item.startsAt))
    .sort((a, b) => byTime(b, a));

  // Accordion: native <details>, so it works with keyboard and screen
  // readers for free. Today and tomorrow start open, the rest folded.
  function renderGroups(groups) {
    return groups.map((group) => (
      <details className="appointment-section" key={group.key} open={group.open}>
        <summary>
          <span className="appointment-section-label">{group.label}</span>
          <span className="appointment-section-count">{group.items.length}</span>
          <svg className="appointment-section-chevron" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </summary>
        <ul>
          {group.items.map((item) => (
            <AppointmentRow
              key={item.id}
              item={item}
              car={carsByReference.get(item.carReference)}
              showDay={group.showDay}
              onOpen={(target) => onOpenChange(target.id)}
              onEdit={setEditing}
              onCancel={onCancel}
            />
          ))}
        </ul>
      </details>
    ));
  }

  const picker = (
    <>
      {creating && (
        <AppointmentPicker
          withCustomer
          cars={cars}
          appointments={appointments}
          onCancel={() => setCreating(false)}
          onConfirm={async (startsAt, note, customer) => {
            await onCreate(startsAt, note, customer);
            setCreating(false);
          }}
        />
      )}

      {editing && (
        <AppointmentPicker
          customerName={editing.name}
          appointments={appointments}
          initial={editing}
          onCancel={() => setEditing(null)}
          onConfirm={async (startsAt, note) => {
            await onUpdate(editing, startsAt, note);
            setEditing(null);
          }}
        />
      )}
    </>
  );

  // Derived from the live list: once cancelled, we fall back to the list.
  const openItem = appointments.find((item) => item.id === openId);
  if (openItem) {
    return (
      <>
        <AppointmentDetail
          item={openItem}
          car={carsByReference.get(openItem.carReference)}
          message={messages.find((msg) => msg.id === openItem.messageId)}
          onBack={() => onOpenChange(null)}
          onEdit={setEditing}
          onCancel={onCancel}
        />
        {picker}
      </>
    );
  }

  return (
    <div className="panel dash-panel">
      <div className="dash-panel-head">
        <div>
          <h2>A venir ({upcoming.length})</h2>
          <p>Depuis une demande (bouton Planifier) ou ajoute a la main.</p>
        </div>
        {onCreate && (
          <button className="button primary small message-plan" type="button" onClick={() => setCreating(true)}>
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
              <path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Nouveau rendez-vous
          </button>
        )}
      </div>

      {upcoming.length ? renderGroups(groupUpcoming(upcoming)) : <p className="empty">Aucun rendez-vous a venir.</p>}

      {past.length > 0 && (
        <div className="appointment-past">
          {renderGroups([{ key: "past", label: "Passes", showDay: true, open: false, items: past }])}
        </div>
      )}

      {picker}
    </div>
  );
}
