import { useEffect, useRef, useState } from "react";
import OfficialIcon from "../OfficialIcon";
import AppointmentPicker from "./AppointmentPicker";
import { formatAppointment, isPastAppointment } from "../../lib/appointments";
import { carImage, carPriceLabel, imageErrorHandler, phoneLinks, statusLabel } from "../../lib/format";

// The car the customer asked about, so it can be answered without looking
// the reference up. A deleted car falls back to the bare reference.
export function RequestedCar({ reference, car }) {
  if (!car) {
    return (
      <p className="message-car message-car-missing">
        {reference} <span>- annonce supprimee</span>
      </p>
    );
  }

  const price = carPriceLabel(car);

  return (
    <a className="message-car" href={`/cars/${car.reference}`} target="_blank" rel="noopener noreferrer">
      <img src={carImage(car)} alt="" onError={imageErrorHandler(car.status)} />
      <span className="message-car-text">
        <strong>
          {car.brand} {car.model}
        </strong>
        <span>
          {car.reference}
          {price && ` - ${price}`}
        </span>
      </span>
      <span className={`status ${car.status}`}>{statusLabel(car.status)}</span>
    </a>
  );
}

function replyText(msg) {
  const about = msg.carReference ? ` concernant le vehicule ${msg.carReference}` : "";
  return `Bonjour ${msg.name},\n\nMerci pour votre demande${about}.\n\n`;
}

export function ContactActions({ msg }) {
  const phone = phoneLinks(msg.phone);
  const text = replyText(msg);
  const subject = `Votre demande Auto BHJ${msg.carReference ? ` - ${msg.carReference}` : ""}`;

  return (
    <div className="message-contact-actions">
      {phone && (
        <a className="message-contact-link" href={phone.tel} aria-label={`Appeler ${msg.name}`} title="Appeler">
          <OfficialIcon name="phone" width={20} height={20} />
        </a>
      )}
      {msg.email && (
        <a
          className="message-contact-link"
          href={`mailto:${msg.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`}
          aria-label={`Envoyer un e-mail a ${msg.name}`}
          title="E-mail"
        >
          <OfficialIcon name="email" width={20} height={20} />
        </a>
      )}
    </div>
  );
}

function relativeTime(iso) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.round(diffMs / 60000);
  if (minutes < 1) return "a l'instant";
  if (minutes < 60) return `il y a ${minutes} min`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `il y a ${hours} h`;
  const days = Math.round(hours / 24);
  return `il y a ${days} j`;
}

export default function AdminMessages({
  messages,
  cars = [],
  appointments = [],
  onToggleRead,
  onDelete,
  onSchedule,
  onUpdateAppointment,
  onDeleteMany,
  requestedOpenId = null,
  canDelete = true,
}) {
  const carsByReference = new Map(cars.map((car) => [car.reference, car]));
  const [openId, setOpenId] = useState(null);
  const [planning, setPlanning] = useState(false);
  // Batch delete: ids ticked in the inbox list.
  const [selected, setSelected] = useState(() => new Set());
  const [confirmingBatch, setConfirmingBatch] = useState(false);
  const [batchBusy, setBatchBusy] = useState(false);
  const [batchError, setBatchError] = useState("");
  const [editingAppointment, setEditingAppointment] = useState(null);
  const headingRef = useRef(null);
  const handledRequestRef = useRef(null);

  // Deep link from a push notification: open that request once it is loaded.
  useEffect(() => {
    if (!requestedOpenId || handledRequestRef.current === requestedOpenId) return;
    const msg = messages.find((item) => item.id === requestedOpenId);
    if (!msg) return;
    handledRequestRef.current = requestedOpenId;
    setOpenId(msg.id);
    if (!msg.isRead) onToggleRead(msg);
  }, [requestedOpenId, messages, onToggleRead]);
  // Derived from the live list: once the open message is deleted, we fall
  // back to the inbox on our own.
  const openMessage = messages.find((msg) => msg.id === openId) || null;

  useEffect(() => {
    if (openMessage) headingRef.current?.focus();
  }, [openMessage?.id]);

  function openRequest(msg) {
    setOpenId(msg.id);
    window.scrollTo({ top: 0 });
    // Opening a request is reading it.
    if (!msg.isRead) onToggleRead(msg);
  }

  if (openMessage) {
    const msg = openMessage;
    const messageAppointments = appointments.filter((item) => item.messageId === msg.id);
    return (
      <div className="panel dash-panel message-detail">
        <button className="message-back" type="button" onClick={() => setOpenId(null)}>
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Tous les messages
        </button>

        <header className="message-detail-head">
          <h2 ref={headingRef} tabIndex={-1}>
            {msg.name}
          </h2>
          <span className="recent-time">{relativeTime(msg.createdAt)}</span>
        </header>
        <p className="message-contact">
          {msg.email}
          {msg.phone && ` - ${msg.phone}`}
        </p>
        <p className="message-detail-body">{msg.message}</p>
        {msg.carReference && (
          <RequestedCar reference={msg.carReference} car={carsByReference.get(msg.carReference)} />
        )}
        <ContactActions msg={msg} />

        {messageAppointments.map((item) => (
          <p className={`message-appointment ${isPastAppointment(item.startsAt) ? "past" : ""}`} key={item.id}>
            <img src="/icons/calendrier.svg" alt="" width={18} height={18} aria-hidden="true" />
            <span>
              Rendez-vous le <strong>{formatAppointment(item.startsAt)}</strong>
              {item.note && ` - ${item.note}`}
            </span>
            {onUpdateAppointment && (
              <button
                className="message-appointment-edit"
                type="button"
                aria-label="Modifier le rendez-vous"
                title="Modifier le rendez-vous"
                onClick={() => setEditingAppointment(item)}
              >
                <img src="/icons/modifier.svg" alt="" width={18} height={18} aria-hidden="true" />
              </button>
            )}
          </p>
        ))}

        <div className="admin-actions">
          {onSchedule && (
            <button className="button primary small message-plan" type="button" onClick={() => setPlanning(true)}>
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                <path
                  d="M7 3v3M17 3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Planifier
            </button>
          )}
          <button className="button neutral small" type="button" onClick={() => onToggleRead(msg)}>
            {msg.isRead ? "Marquer non lu" : "Marquer lu"}
          </button>
          {canDelete && (
            <button className="danger" type="button" onClick={() => onDelete(msg)}>
              Supprimer
            </button>
          )}
        </div>

        {planning && (
          <AppointmentPicker
            customerName={msg.name}
            appointments={appointments}
            car={carsByReference.get(msg.carReference)}
            onCancel={() => setPlanning(false)}
            onConfirm={async (startsAt, note) => {
              await onSchedule(msg, startsAt, note);
              setPlanning(false);
            }}
          />
        )}

        {editingAppointment && (
          <AppointmentPicker
            customerName={msg.name}
            appointments={appointments}
            initial={editingAppointment}
            onCancel={() => setEditingAppointment(null)}
            onConfirm={async (startsAt, note) => {
              await onUpdateAppointment(editingAppointment, startsAt, note);
              setEditingAppointment(null);
            }}
          />
        )}
      </div>
    );
  }

  const unread = messages.filter((msg) => !msg.isRead).length;
  const canSelect = canDelete && Boolean(onDeleteMany);
  // Ignore ids of messages that are gone (deleted elsewhere, reloaded).
  const selectedIds = messages.filter((msg) => selected.has(msg.id)).map((msg) => msg.id);
  const allSelected = messages.length > 0 && selectedIds.length === messages.length;

  function toggleSelected(id) {
    setConfirmingBatch(false);
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    setConfirmingBatch(false);
    setSelected(allSelected ? new Set() : new Set(messages.map((msg) => msg.id)));
  }

  async function deleteSelected() {
    setBatchBusy(true);
    setBatchError("");
    try {
      await onDeleteMany(selectedIds);
      setSelected(new Set());
      setConfirmingBatch(false);
    } catch (error) {
      setBatchError(error.message);
    } finally {
      setBatchBusy(false);
    }
  }

  return (
    <div className="panel dash-panel">
      {/* Selection mode (like a phone mail app): the title row becomes
          "x  N ... trash", then a "Tout selectionner" row under it. */}
      {canSelect && selectedIds.length > 0 ? (
        <div className="message-select-mode" role="region" aria-label="Selection">
          <div className="message-select-head">
            {confirmingBatch ? (
              <>
                <span className="message-select-question">
                  Supprimer {selectedIds.length} message{selectedIds.length > 1 ? "s" : ""} ?
                </span>
                <button className="button neutral small" type="button" onClick={() => setConfirmingBatch(false)} disabled={batchBusy}>
                  Non
                </button>
                <button className="button small set-danger" type="button" onClick={deleteSelected} disabled={batchBusy}>
                  {batchBusy ? "..." : "Oui, supprimer"}
                </button>
              </>
            ) : (
              <>
                <button
                  className="message-select-icon"
                  type="button"
                  aria-label="Quitter la selection"
                  onClick={() => {
                    setSelected(new Set());
                    setConfirmingBatch(false);
                  }}
                >
                  <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                    <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
                <strong className="message-select-count" aria-live="polite">
                  {selectedIds.length}
                  <span className="visually-hidden"> selectionne{selectedIds.length > 1 ? "s" : ""}</span>
                </strong>
                <button
                  className="message-select-icon message-batch-trash"
                  type="button"
                  aria-label={`Supprimer ${selectedIds.length} message${selectedIds.length > 1 ? "s" : ""}`}
                  title="Supprimer la selection"
                  onClick={() => setConfirmingBatch(true)}
                >
                  <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                    <path
                      d="M4 7h16M9 7V4.8A.8.8 0 0 1 9.8 4h4.4a.8.8 0 0 1 .8.8V7m-8.5 0 .8 12.2A1.9 1.9 0 0 0 9.4 21h5.2a1.9 1.9 0 0 0 1.9-1.8L17.3 7M10 11v6m4-6v6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </>
            )}
          </div>
          <label className="message-select-all">
            <span className="message-select-box">
              <input
                type="checkbox"
                checked={allSelected}
                ref={(input) => {
                  if (input) input.indeterminate = !allSelected && selectedIds.length > 0;
                }}
                onChange={toggleAll}
              />
            </span>
            {allSelected ? "Tout deselectionner" : "Tout selectionner"}
          </label>
          {batchError && (
            <p className="set-form-message is-error" role="alert">
              {batchError}
            </p>
          )}
        </div>
      ) : (
        <div className="dash-panel-head">
          <h2>
            Messages recus ({messages.length}){unread > 0 && <span className="message-unread-count"> - {unread} non lu{unread > 1 ? "s" : ""}</span>}
          </h2>
        </div>
      )}

      {messages.length ? (
        <ul className="message-inbox">
          {messages.map((msg) => {
            const car = carsByReference.get(msg.carReference);
            return (
              <li key={msg.id} className={`message-inbox-row ${selected.has(msg.id) ? "is-selected" : ""}`}>
                {canSelect && (
                  <label className="message-select">
                    <input
                      type="checkbox"
                      checked={selected.has(msg.id)}
                      onChange={() => toggleSelected(msg.id)}
                    />
                    <span className="visually-hidden">Selectionner le message de {msg.name}</span>
                  </label>
                )}
                <button
                  className={`message-preview ${msg.isRead ? "" : "unread"}`}
                  type="button"
                  onClick={() => openRequest(msg)}
                >
                  <span className="message-preview-dot" aria-hidden="true" />
                  <span className="message-preview-main">
                    <span className="message-preview-top">
                      <strong>{msg.name}</strong>
                      <span className="recent-time">{relativeTime(msg.createdAt)}</span>
                    </span>
                    {msg.carReference && (
                      <span className="message-preview-car">
                        {car ? `${car.brand} ${car.model}` : msg.carReference}
                      </span>
                    )}
                    <span className="message-preview-text">{msg.message}</span>
                  </span>
                  {!msg.isRead && <span className="visually-hidden">Non lu</span>}
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="empty">Aucun message pour le moment.</p>
      )}
    </div>
  );
}
