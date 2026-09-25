"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const SW_URL = "/admin-sw.js";
const SW_SCOPE = "/admin";
const CHANGE_EVENT = "bhj-push-change";

function urlBase64ToUint8Array(base64) {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const raw = atob((base64 + padding).replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(raw, (char) => char.charCodeAt(0));
}

export const PUSH_STATUS_TEXT = {
  loading: "Verification...",
  on: "Activees sur cet appareil.",
  off: "Desactivees sur cet appareil.",
  denied: "Bloquees par le navigateur. Autorisez-les dans les reglages du site, puis revenez ici.",
  unsupported: "Ce navigateur ne permet pas les notifications.",
  unconfigured: "Pas encore configurees sur le serveur.",
};

// This device's push state + actions for the Parametres tab. Other
// instances (if any) stay in sync through a window event.
// state: unsupported | loading | off | on | denied | unconfigured
export default function usePushDevice() {
  const [state, setState] = useState("loading");
  const [busy, setBusy] = useState(false);
  const [info, setInfo] = useState("");
  const [installEvent, setInstallEvent] = useState(null);
  const [needsInstallForIos, setNeedsInstallForIos] = useState(false);
  const registrationRef = useRef(null);
  const publicKeyRef = useRef(null);

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
    window.addEventListener(CHANGE_EVENT, refresh);
    return () => {
      window.removeEventListener("beforeinstallprompt", onInstallPrompt);
      window.removeEventListener(CHANGE_EVENT, refresh);
    };
  }, [refresh]);

  const announce = () => window.dispatchEvent(new Event(CHANGE_EVENT));

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
      announce();
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
      announce();
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

  return {
    state,
    statusText: PUSH_STATUS_TEXT[state],
    busy,
    info,
    installEvent,
    needsInstallForIos,
    enable,
    disable,
    sendTest,
    install,
  };
}
