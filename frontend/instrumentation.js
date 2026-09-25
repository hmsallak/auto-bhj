// Runs once when the Next.js server starts. Only the Node.js server hosts
// the notification scheduler (appointment reminders, morning digest).
// The import must sit inside this exact `if` so the bundler can drop it from
// the Edge build (Node-only modules like crypto/sqlite would break it).
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./instrumentation-node");
  }
}
