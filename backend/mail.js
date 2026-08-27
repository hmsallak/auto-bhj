// Minimal transactional email sender (Resend HTTP API, no SDK dependency).
// If RESEND_API_KEY / MAIL_FROM are not configured, the message is logged
// instead of sent - handy in local dev and before the domain is verified.

const RESEND_ENDPOINT = "https://api.resend.com/emails";

async function sendMail({ to, subject, html, text }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.MAIL_FROM;

  if (!apiKey || !from) {
    console.warn(
      `[mail] RESEND_API_KEY / MAIL_FROM not set - email NOT sent.\n` +
        `  To: ${to}\n  Subject: ${subject}\n  Body:\n${text || html}`
    );
    return { sent: false };
  }

  const response = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, html, text }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Resend ${response.status}: ${detail.slice(0, 300)}`);
  }

  return { sent: true };
}

module.exports = { sendMail };
