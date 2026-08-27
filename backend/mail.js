// Minimal transactional email sender (Resend HTTP API, no SDK dependency).
// If RESEND_API_KEY / MAIL_FROM are not configured, the message is logged
// instead of sent - handy in local dev and before the domain is verified.

const RESEND_ENDPOINT = "https://api.resend.com/emails";

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Branded HTML shell for transactional e-mails. All styles are inline
// (mail clients drop <style>), the layout is a centred table, and there
// are no remote images. `lines` are already-safe HTML paragraphs.
function renderEmail({ heading, lines = [], button, footnote }) {
  const body = lines
    .map(
      (line) =>
        `<p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:#2b2b2b;">${line}</p>`
    )
    .join("");

  const cta = button
    ? `<p style="margin:6px 0 18px;">` +
      `<a href="${escapeHtml(button.url)}" style="display:inline-block;padding:12px 22px;border-radius:10px;background:#1a4d3e;color:#ffffff;font-weight:700;font-size:14px;text-decoration:none;">${escapeHtml(
        button.label
      )}</a></p>` +
      `<p style="margin:0 0 4px;font-size:12px;line-height:1.5;color:#8a8a8a;">Ou copie ce lien dans ton navigateur :</p>` +
      `<p style="margin:0 0 8px;font-size:12px;line-height:1.5;color:#1a4d3e;word-break:break-all;">${escapeHtml(
        button.url
      )}</p>`
    : "";

  const foot = footnote
    ? `<p style="margin:18px 0 0;font-size:12px;line-height:1.5;color:#8a8a8a;">${footnote}</p>`
    : "";

  return (
    `<!doctype html><html lang="fr"><body style="margin:0;padding:0;background:#eef1f0;">` +
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef1f0;padding:28px 12px;">` +
    `<tr><td align="center">` +
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:16px;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">` +
    `<tr><td style="background:#1a4d3e;padding:20px 28px;"><span style="color:#ffffff;font-size:18px;font-weight:800;letter-spacing:0.5px;">AUTO&nbsp;BHJ</span></td></tr>` +
    `<tr><td style="padding:28px;">` +
    `<h1 style="margin:0 0 16px;font-size:19px;color:#1a4d3e;">${escapeHtml(heading)}</h1>` +
    body +
    cta +
    foot +
    `</td></tr>` +
    `<tr><td style="padding:16px 28px;background:#f6f8f7;border-top:1px solid #e5ebe8;"><p style="margin:0;font-size:11px;color:#9aa5a1;">Auto BHJ &middot; e-mail automatique, merci de ne pas y repondre.</p></td></tr>` +
    `</table></td></tr></table></body></html>`
  );
}

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

module.exports = { sendMail, renderEmail };
