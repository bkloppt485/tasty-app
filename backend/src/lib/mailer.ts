import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const FROM = process.env.MAIL_FROM || "Tasty <onboarding@resend.dev>";
const REPLY_TO = process.env.MAIL_REPLY_TO || undefined;
const APP_URL =
  process.env.APP_URL || "https://frontend-five-eta-80.vercel.app";

const resend = apiKey ? new Resend(apiKey) : null;

if (!resend) {
  console.warn("[mailer] RESEND_API_KEY not set — emails will be skipped");
}

const BORDEAUX = "#7A1E2A";
const GOLD = "#C9A961";
const CREAM = "#F5EDE0";
const BG = "#1A1410";
const BG_ELEV = "#241B15";
const TEXT = "#E8DCC8";
const FAINT = "#9A8B75";

const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: "Eingegangen",
  CONFIRMED: "Bestätigt",
  PREPARING: "In Zubereitung",
  READY: "Bereit zur Abholung",
  COMPLETED: "Abgeschlossen",
  CANCELLED: "Storniert",
};

const RESERVATION_STATUS_LABELS: Record<string, string> = {
  PENDING: "Eingegangen",
  CONFIRMED: "Bestätigt",
  CANCELLED: "Storniert",
};

function shell(content: string, preheader: string) {
  return `<!doctype html>
<html lang="de">
  <head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /><title>Tasty</title></head>
  <body style="margin:0;padding:0;background:${BG};font-family:Georgia,'Times New Roman',serif;color:${TEXT};">
    <span style="display:none;visibility:hidden;opacity:0;color:transparent;height:0;width:0;overflow:hidden;">${preheader}</span>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BG};">
      <tr><td align="center" style="padding:32px 16px;">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:${BG_ELEV};border:1px solid rgba(201,169,97,0.2);border-radius:4px;overflow:hidden;">
          <tr><td style="padding:32px 32px 16px;text-align:center;border-bottom:1px solid rgba(201,169,97,0.15);">
            <div style="font-family:Georgia,serif;font-size:28px;letter-spacing:0.18em;color:${GOLD};">TASTY</div>
            <div style="font-size:10px;letter-spacing:0.32em;color:${FAINT};text-transform:uppercase;margin-top:6px;">Italienisch · Döner · Kassel</div>
          </td></tr>
          <tr><td style="padding:32px;">${content}</td></tr>
          <tr><td style="padding:20px 32px 28px;border-top:1px solid rgba(201,169,97,0.15);text-align:center;">
            <div style="font-size:11px;color:${FAINT};line-height:1.6;">
              Tasty Restaurant · Friedrich-Ebert-Str. 12, 34117 Kassel<br/>
              <a href="tel:+4956112345678" style="color:${GOLD};text-decoration:none;">0561 12345678</a>
            </div>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
}

function btn(href: string, label: string) {
  return `<table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="background:${BORDEAUX};border-radius:2px;">
    <a href="${href}" style="display:inline-block;padding:12px 24px;font-family:Georgia,serif;font-size:11px;letter-spacing:0.22em;color:${CREAM};text-decoration:none;text-transform:uppercase;font-weight:600;">${label}</a>
  </td></tr></table>`;
}

const h1 = (t: string) =>
  `<h1 style="font-family:Georgia,serif;font-size:24px;color:${CREAM};margin:0 0 12px;font-weight:normal;">${t}</h1>`;

const p = (t: string) =>
  `<p style="font-size:15px;line-height:1.6;color:${TEXT};margin:0 0 16px;">${t}</p>`;

const statusBadge = (label: string) =>
  `<div style="display:inline-block;padding:8px 16px;background:${BORDEAUX};color:${CREAM};font-size:11px;letter-spacing:0.22em;text-transform:uppercase;border-radius:2px;font-weight:600;">${label}</div>`;

const fmtEUR = (eur: number) =>
  eur.toLocaleString("de-DE", { style: "currency", currency: "EUR" });

const fmtDateTime = (d: Date | string) =>
  (typeof d === "string" ? new Date(d) : d).toLocaleString("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

async function send(to: string, subject: string, html: string) {
  if (!resend) {
    console.log("[mailer] (skipped, no key) to=", to, "subject=", subject);
    return;
  }
  try {
    const result = await resend.emails.send({
      from: FROM,
      to,
      subject,
      html,
      ...(REPLY_TO ? { replyTo: REPLY_TO } : {}),
    });
    if (result.error) console.error("[mailer] send error:", result.error);
  } catch (err) {
    console.error("[mailer] exception:", err);
  }
}

export interface OrderEmailItem {
  quantity: number;
  price: number;
  product: { name: string };
}

export async function sendOrderConfirmation(opts: {
  to: string;
  name: string;
  orderId: string;
  orderType: "PICKUP" | "DELIVERY";
  totalAmount: number;
  tipAmount: number;
  items: OrderEmailItem[];
}) {
  const itemsHtml = opts.items
    .map(
      (i) =>
        `<tr><td style="padding:10px 0;font-size:14px;color:${TEXT};">${i.quantity}× ${i.product.name}</td><td style="padding:10px 0;font-size:14px;color:${CREAM};text-align:right;">${fmtEUR(i.price * i.quantity)}</td></tr>`,
    )
    .join("");
  const subtotal = opts.items.reduce((s, i) => s + i.price * i.quantity, 0);
  const orderShort = opts.orderId.slice(-6).toUpperCase();
  const content = `
    ${h1(`Grazie, ${opts.name}!`)}
    ${p("Wir haben deine Bestellung erhalten und freuen uns, dich gleich zu verwöhnen.")}
    <div style="margin:24px 0;">
      ${statusBadge(`Bestellung #${orderShort}`)}
      <span style="display:inline-block;margin-left:10px;font-size:12px;color:${FAINT};letter-spacing:0.18em;text-transform:uppercase;">${opts.orderType === "PICKUP" ? "Abholung" : "Lieferung"}</span>
    </div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid rgba(201,169,97,0.2);border-bottom:1px solid rgba(201,169,97,0.2);margin:16px 0;">${itemsHtml}</table>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 24px;">
      <tr><td style="font-size:13px;color:${FAINT};">Zwischensumme</td><td style="font-size:13px;color:${TEXT};text-align:right;">${fmtEUR(subtotal)}</td></tr>
      ${opts.tipAmount > 0 ? `<tr><td style="font-size:13px;color:${FAINT};">Trinkgeld</td><td style="font-size:13px;color:${TEXT};text-align:right;">${fmtEUR(opts.tipAmount)}</td></tr>` : ""}
      <tr><td style="font-size:16px;color:${CREAM};padding-top:12px;font-weight:bold;">Gesamt</td><td style="font-size:18px;color:${GOLD};text-align:right;padding-top:12px;font-weight:bold;">${fmtEUR(opts.totalAmount)}</td></tr>
    </table>
    ${p("Sobald deine Bestellung in der Küche ist, bekommst du eine weitere Nachricht.")}
    <div style="margin-top:24px;">${btn(`${APP_URL}/profil/bestellungen`, "Status verfolgen")}</div>
  `;
  await send(
    opts.to,
    `Bestellbestätigung · #${orderShort}`,
    shell(content, "Deine Bestellung bei Tasty wurde bestätigt"),
  );
}

export async function sendOrderStatusUpdate(opts: {
  to: string;
  name: string;
  orderId: string;
  status: string;
}) {
  const label = ORDER_STATUS_LABELS[opts.status] ?? opts.status;
  const messages: Record<string, string> = {
    PREPARING:
      "Unsere Küche legt gerade für dich los — die Zutaten kommen frisch zusammen.",
    READY: "Deine Bestellung ist fertig und wartet auf dich. Buon appetito!",
    COMPLETED:
      "Deine Bestellung ist abgeschlossen. Danke, dass du Tasty gewählt hast.",
    CANCELLED:
      "Deine Bestellung wurde leider storniert. Bei Fragen melde dich gerne bei uns.",
    CONFIRMED: "Wir haben deine Bestellung bestätigt.",
  };
  const message = messages[opts.status] ?? `Status deiner Bestellung: ${label}`;
  const orderShort = opts.orderId.slice(-6).toUpperCase();
  const content = `
    ${h1(`Hallo ${opts.name},`)}
    ${p(message)}
    <div style="margin:24px 0;">${statusBadge(label)}</div>
    ${p(`Bestellung <strong style="color:${CREAM};">#${orderShort}</strong>`)}
    <div style="margin-top:24px;">${btn(`${APP_URL}/profil/bestellungen`, "Bestellung ansehen")}</div>
  `;
  await send(
    opts.to,
    `Status-Update · ${label} · #${orderShort}`,
    shell(content, `Deine Bestellung: ${label}`),
  );
}

export async function sendReservationConfirmation(opts: {
  to: string;
  name: string;
  reservationId: string;
  date: Date | string;
  partySize: number;
  notes?: string | null;
}) {
  const content = `
    ${h1(`Grazie, ${opts.name}!`)}
    ${p("Wir haben deine Reservierung erhalten und freuen uns auf deinen Besuch.")}
    <div style="margin:24px 0;padding:20px;background:${BG};border:1px solid rgba(201,169,97,0.2);border-radius:2px;">
      <div style="font-size:11px;color:${FAINT};letter-spacing:0.22em;text-transform:uppercase;margin-bottom:8px;">Datum & Uhrzeit</div>
      <div style="font-family:Georgia,serif;font-size:20px;color:${CREAM};margin-bottom:16px;">${fmtDateTime(opts.date)}</div>
      <div style="font-size:11px;color:${FAINT};letter-spacing:0.22em;text-transform:uppercase;margin-bottom:8px;">Personen</div>
      <div style="font-family:Georgia,serif;font-size:20px;color:${CREAM};">${opts.partySize}</div>
      ${opts.notes ? `<div style="margin-top:16px;padding-top:16px;border-top:1px solid rgba(201,169,97,0.15);"><div style="font-size:11px;color:${FAINT};letter-spacing:0.22em;text-transform:uppercase;margin-bottom:8px;">Notiz</div><div style="font-size:14px;color:${TEXT};font-style:italic;">${`„${opts.notes}"`}</div></div>` : ""}
    </div>
    ${p(`Solltest du deine Reservierung ändern oder absagen müssen, ruf uns bitte an: <a href="tel:+4956112345678" style="color:${GOLD};">0561 12345678</a>.`)}
    <div style="margin-top:24px;">${btn(`${APP_URL}/profil/reservierungen`, "Reservierung ansehen")}</div>
  `;
  await send(
    opts.to,
    `Reservierungsbestätigung · ${fmtDateTime(opts.date)}`,
    shell(content, "Deine Reservierung bei Tasty wurde bestätigt"),
  );
}

export async function sendReservationStatusUpdate(opts: {
  to: string;
  name: string;
  reservationId: string;
  status: string;
  date: Date | string;
  partySize: number;
}) {
  const label = RESERVATION_STATUS_LABELS[opts.status] ?? opts.status;
  const messages: Record<string, string> = {
    CONFIRMED:
      "Deine Reservierung wurde bestätigt. Wir freuen uns auf dich!",
    CANCELLED:
      "Deine Reservierung wurde storniert. Bei Fragen melde dich gerne.",
    PENDING: "Deine Reservierung wird gerade geprüft.",
  };
  const message = messages[opts.status] ?? `Status: ${label}`;
  const content = `
    ${h1(`Hallo ${opts.name},`)}
    ${p(message)}
    <div style="margin:24px 0;">${statusBadge(label)}</div>
    <div style="padding:20px;background:${BG};border:1px solid rgba(201,169,97,0.2);border-radius:2px;">
      <div style="font-size:14px;color:${TEXT};margin-bottom:6px;"><span style="color:${FAINT};">Datum:</span> ${fmtDateTime(opts.date)}</div>
      <div style="font-size:14px;color:${TEXT};"><span style="color:${FAINT};">Personen:</span> ${opts.partySize}</div>
    </div>
  `;
  await send(opts.to, `Reservierung · ${label}`, shell(content, `Reservierung: ${label}`));
}
