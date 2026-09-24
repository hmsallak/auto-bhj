// Service worker for the Auto BHJ admin app (scope /admin).
// Its only job: show push notifications and open the right admin screen
// when one is tapped. No offline caching - the admin always needs live data.

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { body: event.data ? event.data.text() : "" };
  }

  event.waitUntil(
    self.registration.showNotification(data.title || "Auto BHJ", {
      body: data.body || "",
      icon: "/admin-icon-192.png",
      badge: "/notification-badge.png",
      tag: data.tag || undefined,
      renotify: Boolean(data.tag),
      data: { url: data.url || "/admin" },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = new URL(event.notification.data?.url || "/admin", self.location.origin).href;

  event.waitUntil(
    (async () => {
      const windows = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
      // Reuse an open admin window when there is one, otherwise open the app.
      const existing = windows.find((client) => new URL(client.url).pathname.startsWith("/admin"));
      if (existing) {
        await existing.focus();
        return existing.navigate(target);
      }
      return self.clients.openWindow(target);
    })()
  );
});
