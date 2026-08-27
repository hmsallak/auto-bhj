"use client";

import { useEffect, useRef, useState } from "react";

export default function AdminUserMenu({ user, onGoToProfile, onLogout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;

    function onDocClick(event) {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false);
    }
    function onKey(event) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const label =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.email ||
    user?.username ||
    "";
  const initials = (label || "AB").slice(0, 2).toUpperCase();

  return (
    <div className="dash-user-menu" ref={ref}>
      <button
        type="button"
        className="dash-user-avatar"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Mon compte"
        onClick={() => setOpen((value) => !value)}
      >
        {initials}
      </button>

      {open && (
        <div className="dash-user-dropdown" role="menu">
          <div className="dash-user-dropdown-head">
            <strong>{label}</strong>
            <span>{user?.email || user?.username}</span>
          </div>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onGoToProfile();
            }}
          >
            Parametres
          </button>
          <button
            type="button"
            role="menuitem"
            className="danger-text"
            onClick={() => {
              setOpen(false);
              onLogout();
            }}
          >
            Se deconnecter
          </button>
        </div>
      )}
    </div>
  );
}
