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

export default function AdminMessages({ messages, onToggleRead, onDelete }) {
  return (
    <div className="panel dash-panel">
      <div className="dash-panel-head">
        <h2>Messages recus ({messages.length})</h2>
      </div>

      {messages.length ? (
        <div className="messages-list">
          {messages.map((msg) => (
            <article className={`message-item ${msg.isRead ? "" : "unread"}`} key={msg.id}>
              <header>
                <div>
                  <strong>{msg.name}</strong>
                  {msg.carReference && <span className="message-ref">{msg.carReference}</span>}
                  {!msg.isRead && <span className="message-new-dot" aria-label="Non lu" />}
                </div>
                <span className="recent-time">{relativeTime(msg.createdAt)}</span>
              </header>
              <p className="message-contact">
                {msg.email}
                {msg.phone && ` - ${msg.phone}`}
              </p>
              <p className="message-body">{msg.message}</p>
              <div className="admin-actions">
                <button
                  className="button neutral small"
                  type="button"
                  onClick={() => onToggleRead(msg)}
                >
                  {msg.isRead ? "Marquer non lu" : "Marquer lu"}
                </button>
                <button className="danger" type="button" onClick={() => onDelete(msg)}>
                  Supprimer
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="empty">Aucun message pour le moment.</p>
      )}
    </div>
  );
}
