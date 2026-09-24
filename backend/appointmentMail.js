// Customer e-mails for appointments: confirmation, change, cancellation.
// Each one carries the details (when, car, address, phone), a link to the
// public confirmation page and, except for a cancellation, the .ics file.

const { sendMail, escapeHtml } = require("./mail");
const { GARAGE, buildIcs } = require("./calendar");
const { getSiteSettings } = require("./models/siteSettings");
const { getCarByReference } = require("./models/cars");

const KINDS = {
  created: {
    subject: "Votre rendez-vous chez Auto BHJ est confirme",
    heading: "Votre rendez-vous est confirme",
    intro: "Merci pour votre confiance. Voici le recapitulatif de votre rendez-vous.",
  },
  updated: {
    subject: "Votre rendez-vous chez Auto BHJ a ete modifie",
    heading: "Votre rendez-vous a ete modifie",
    intro: "Votre rendez-vous a change. Voici les nouvelles informations.",
  },
  cancelled: {
    subject: "Votre rendez-vous chez Auto BHJ est annule",
    heading: "Votre rendez-vous est annule",
    intro: "Votre rendez-vous ci-dessous a ete annule. Contactez-nous pour en fixer un nouveau.",
  },
};

// Wall-clock "YYYY-MM-DDTHH:MM" -> "samedi 26 septembre 2026 a 18:30".
function formatWhen(startsAt) {
  const [datePart, timePart] = startsAt.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const dayLabel = new Intl.DateTimeFormat("fr-BE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
  return `${dayLabel} a ${timePart}`;
}

function firstName(fullName) {
  return String(fullName || "").trim().split(/\s+/)[0] || "";
}

function detailRow(label, valueHtml) {
  return (
    `<tr><td style="padding:8px 0;border-bottom:1px solid #edf1ef;font-size:12px;color:#7b8783;text-transform:uppercase;letter-spacing:0.04em;width:110px;vertical-align:top;">${label}</td>` +
    `<td style="padding:8px 0;border-bottom:1px solid #edf1ef;font-size:15px;color:#1c1c1a;">${valueHtml}</td></tr>`
  );
}

function button(label, url, primary) {
  const style = primary
    ? "background:#1a4d3e;color:#ffffff;"
    : "background:#ffffff;color:#1a4d3e;border:1px solid #1a4d3e;";
  return `<a href="${escapeHtml(url)}" style="display:inline-block;margin:0 8px 8px 0;padding:12px 20px;border-radius:10px;${style}font-weight:700;font-size:14px;text-decoration:none;">${escapeHtml(label)}</a>`;
}

function renderHtml({ kind, appointment, car, settings, pageUrl }) {
  const copy = KINDS[kind];
  const cancelled = kind === "cancelled";
  const whenHtml = cancelled
    ? `<span style="text-decoration:line-through;color:#7b8783;">${escapeHtml(formatWhen(appointment.startsAt))}</span>`
    : `<strong>${escapeHtml(formatWhen(appointment.startsAt))}</strong>`;

  const rows = [
    detailRow("Quand", whenHtml),
    car ? detailRow("Vehicule", `${escapeHtml(`${car.brand} ${car.model}`)} <span style="color:#7b8783;">(${escapeHtml(car.reference)})</span>`) : "",
    appointment.note && !cancelled ? detailRow("Note", escapeHtml(appointment.note)) : "",
    detailRow("Adresse", `<a href="${escapeHtml(GARAGE.mapsUrl)}" style="color:#1a4d3e;">${escapeHtml(GARAGE.address)}</a>`),
    detailRow("Telephone", `<a href="tel:${escapeHtml(settings.phoneTel)}" style="color:#1a4d3e;">${escapeHtml(settings.phone)}</a>`),
    detailRow("E-mail", `<a href="mailto:${escapeHtml(settings.email)}" style="color:#1a4d3e;">${escapeHtml(settings.email)}</a>`),
  ].join("");

  const actions = cancelled
    ? button("Nous appeler", `tel:${settings.phoneTel}`, true)
    : button("Voir mon rendez-vous", pageUrl, true) + button("Itineraire", GARAGE.mapsUrl, false);

  const agendaNote = cancelled
    ? ""
    : `<p style="margin:10px 0 0;font-size:13px;line-height:1.5;color:#5c5c55;">Le fichier joint <strong>rendez-vous-auto-bhj.ics</strong> ajoute le rendez-vous a votre agenda (Apple, Outlook). Pour Google Agenda, utilisez le bouton de la page de votre rendez-vous.</p>`;

  // Changes only by phone: the customer never edits the appointment online.
  const phoneOnlyNote = cancelled
    ? ""
    : `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0 0;"><tr><td style="padding:14px 16px;border-radius:10px;background:#e3efe9;font-size:14px;line-height:1.5;color:#1c1c1a;">` +
      `<strong>Annuler ou deplacer le rendez-vous ?</strong><br>Merci de nous contacter par telephone au ` +
      `<a href="tel:${escapeHtml(settings.phoneTel)}" style="color:#1a4d3e;font-weight:700;">${escapeHtml(settings.phone)}</a>.` +
      `</td></tr></table>`;

  return (
    `<!doctype html><html lang="fr"><body style="margin:0;padding:0;background:#eef1f0;">` +
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef1f0;padding:28px 12px;"><tr><td align="center">` +
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:540px;background:#ffffff;border-radius:16px;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">` +
    `<tr><td style="background:#1a4d3e;padding:20px 28px;"><span style="color:#ffffff;font-size:18px;font-weight:800;letter-spacing:0.5px;">AUTO&nbsp;BHJ</span></td></tr>` +
    `<tr><td style="padding:28px;">` +
    `<h1 style="margin:0 0 10px;font-size:20px;color:${cancelled ? "#b91c1c" : "#1a4d3e"};">${escapeHtml(copy.heading)}</h1>` +
    `<p style="margin:0 0 6px;font-size:15px;line-height:1.6;color:#2b2b2b;">Bonjour ${escapeHtml(firstName(appointment.name))},</p>` +
    `<p style="margin:0 0 18px;font-size:15px;line-height:1.6;color:#2b2b2b;">${escapeHtml(copy.intro)}</p>` +
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;">${rows}</table>` +
    actions +
    agendaNote +
    phoneOnlyNote +
    `</td></tr>` +
    `<tr><td style="padding:16px 28px;background:#f6f8f7;border-top:1px solid #e5ebe8;"><p style="margin:0;font-size:12px;line-height:1.5;color:#7b8783;">Une question ? Appelez-nous au ${escapeHtml(settings.phone)}.<br>${escapeHtml(GARAGE.name)} &middot; ${escapeHtml(GARAGE.address)}</p></td></tr>` +
    `</table></td></tr></table></body></html>`
  );
}

function renderText({ kind, appointment, car, settings, pageUrl }) {
  const copy = KINDS[kind];
  return [
    `Bonjour ${firstName(appointment.name)},`,
    "",
    copy.intro,
    "",
    `Quand : ${formatWhen(appointment.startsAt)}${kind === "cancelled" ? " (annule)" : ""}`,
    car ? `Vehicule : ${car.brand} ${car.model} (${car.reference})` : null,
    `Adresse : ${GARAGE.address}`,
    `Itineraire : ${GARAGE.mapsUrl}`,
    `Telephone : ${settings.phone}`,
    `E-mail : ${settings.email}`,
    kind === "cancelled" ? null : "",
    kind === "cancelled" ? null : `Votre rendez-vous (et ajout a l'agenda) : ${pageUrl}`,
    kind === "cancelled" ? null : "",
    kind === "cancelled"
      ? null
      : `Annuler ou deplacer le rendez-vous ? Merci de nous contacter par telephone au ${settings.phone}.`,
    "",
    "Auto BHJ",
  ]
    .filter((line) => line !== null)
    .join("\n");
}

// Sends the customer e-mail for `kind` ("created" | "updated" | "cancelled").
// Never throws: a mail problem must not undo the appointment itself.
// Returns "none" (no address), "sent", "logged" (no mail config: dev) or "failed".
async function notifyAppointment({ appointment, kind, baseUrl }) {
  if (!appointment?.email) return "none";

  try {
    const settings = getSiteSettings();
    const car = appointment.carReference ? getCarByReference(appointment.carReference) : null;
    const pageUrl = `${baseUrl}/rdv/${appointment.token}`;
    const context = { kind, appointment, car, settings, pageUrl };

    const result = await sendMail({
      to: appointment.email,
      subject: KINDS[kind].subject,
      html: renderHtml(context),
      text: renderText(context),
      replyTo: settings.email,
      attachments:
        kind === "cancelled"
          ? []
          : [
              {
                filename: "rendez-vous-auto-bhj.ics",
                // Same UID + a higher SEQUENCE lets calendars replace the
                // old event; seconds since epoch always increase.
                content: buildIcs({
                  appointment,
                  car,
                  settings,
                  pageUrl,
                  sequence: kind === "updated" ? Math.floor(Date.now() / 1000) : 0,
                }),
              },
            ],
    });
    return result.sent ? "sent" : "logged";
  } catch (error) {
    console.error(`[appointment mail] ${kind} failed:`, error.message);
    return "failed";
  }
}

module.exports = { notifyAppointment };
