"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const SW_URL = "/admin-sw.js";
const SW_SCOPE = "/admin";

function urlBase64ToUint8Array(base64) {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const raw = atob((base64 + padding).replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(raw, (char) => char.charCodeAt(0));
}

function BellIcon({ off }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path
        d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15L6 16Zm4 4a2 2 0 0 0 4 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {off && <path d="M4 4l16 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />}
    </svg>
  );
}

// Bell in the admin top bar: turn this device's push notifications on/off,
// send a test, and offer "install the app" when the browser allows it.
export default function AdminNotifications() {
  const [open, setOpen] = useState(false);
  // unsupported | loading | off | on | denied | unconfigured
  const [state, setState] = useState("loading");
  const [busy, setBusy] = useState(false);
  const [info, setInfo] = useState("");
  const [installEvent, setInstallEvent] = useState(null);
  const [needsInstallForIos, setNeedsInstallForIos] = useState(false);
  const registrationRef = useRef(null);
  const publicKeyRef = useRef(null);
  const wrapperRef = useRef(null);

  const refresh = useCallback(async () => {
    const supported = "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
    const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const standalone = window.matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
    // iPhone only allows web push from the app installed on the home screen.
    setNeedsInstallForIos(isIos && !standalone);

    if (!supported) {
      setState("unsupported");
      return;
    }

    try {
      const registration = await navigator.serviceWorker.register(SW_URL, { scope: SW_SCOPE });
      registrationRef.current = registration;

      const response = await fetch("/api/admin/push", { credentials: "same-origin" });
      const status = await response.json().catch(() => ({}));
      publicKeyRef.current = status.publicKey || null;
      if (!status.publicKey) {
        setState("unconfigured");
        return;
      }

      if (Notification.permission === "denied") {
        setState("denied");
        return;
      }
      const subscription = await registration.pushManager.getSubscription();
      setState(subscription ? "on" : "off");
    } catch {
      setState("unsupported");
    }
  }, []);

  useEffect(() => {
    refresh();
    function onInstallPrompt(event) {
      event.preventDefault();
      setInstallEvent(event);
    }
    window.addEventListener("beforeinstallprompt", onInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onInstallPrompt);
  }, [refresh]);

  useEffect(() => {
    if (!open) return undefined;
    function onPointer(event) {
      if (!wrapperRef.current?.contains(event.target)) setOpen(false);
    }
    function onKey(event) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  async function enable() {
    setBusy(true);
    setInfo("");
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setState(permission === "denied" ? "denied" : "off");
        return;
      }
      const subscription = await registrationRef.current.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKeyRef.current),
      });
      const response = await fetch("/api/admin/push", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscription: subscription.toJSON() }),
      });
      if (!response.ok) throw new Error("save");
      setState("on");
      setInfo("Notifications activees sur cet appareil.");
    } catch {
      setInfo("Impossible d'activer les notifications. Reessayez.");
    } finally {
      setBusy(false);
    }
  }

  async function disable() {
    setBusy(true);
    setInfo("");
    try {
      const subscription = await registrationRef.current?.pushManager.getSubscription();
      if (subscription) {
        await fetch("/api/admin/push", {
          method: "DELETE",
          credentials: "same-origin",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: subscription.endpoint }),
        });
        await subscription.unsubscribe();
      }
      setState("off");
      setInfo("Notifications desactivees sur cet appareil.");
    } finally {
      setBusy(false);
    }
  }

  async function sendTest() {
    setBusy(true);
    setInfo("");
    try {
      const response = await fetch("/api/admin/push/test", { method: "POST", credentials: "same-origin" });
      const result = await response.json().catch(() => ({}));
      setInfo(response.ok && result.sent ? "Notification de test envoyee." : result.error || "Aucun appareil n'a recu le test.");
    } finally {
      setBusy(false);
    }
  }

  async function install() {
    if (!installEvent) return;
    installEvent.prompt();
    await installEvent.userChoice.catch(() => null);
    setInstallEvent(null);
  }

  const statusText = {
    loading: "Verification...",
    on: "Activees sur cet appareil.",
    off: "Desactivees sur cet appareil.",
    denied: "Bloquees par le navigateur. Autorisez-les dans les reglages du site, puis revenez ici.",
    unsupported: "Ce navigateur ne permet pas les notifications.",
    unconfigured: "Pas encore configurees sur le serveur.",
  }[state];

  return (
    <div className="admin-notif" ref={wrapperRef}>
      <button
        type="button"
        className={`admin-notif-toggle ${state === "on" ? "is-on" : ""}`}
        aria-label="Notifications"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <BellIcon off={state !== "on"} />
      </button>

      {open && (
        <div className="admin-notif-panel" role="dialog" aria-label="Notifications">
          <strong>Notifications</strong>
          <p>{statusText}</p>

          {needsInstallForIos && (
            <p className="admin-notif-hint">
              Sur iPhone : touchez Partager puis « Sur l'ecran d'accueil », ouvrez l'app BHJ Admin et activez ici.
            </p>
          )}

          <div className="admin-notif-actions">
            {state === "off" && (
              <button className="button primary small" type="button" onClick={enable} disabled={busy}>
                Activer
              </button>
            )}
            {state === "on" && (
              <>
                <button className="button primary small" type="button" onClick={sendTest} disabled={busy}>
                  Envoyer un test
                </button>
                <button className="button neutral small" type="button" onClick={disable} disabled={busy}>
                  Desactiver
                </button>
              </>
            )}
            {installEvent && (
              <button className="button neutral small" type="button" onClick={install}>
                Installer l'app
              </button>
            )}
          </div>

          {info && (
            <p className="admin-notif-info" role="status">
              {info}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
