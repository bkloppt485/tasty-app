import webpush from "web-push";
import { prisma } from "@/database/prisma";

const PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
const PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;
const SUBJECT = process.env.VAPID_SUBJECT || "mailto:lionel.hanke@icloud.com";

let configured = false;
if (PUBLIC_KEY && PRIVATE_KEY) {
  webpush.setVapidDetails(SUBJECT, PUBLIC_KEY, PRIVATE_KEY);
  configured = true;
} else {
  console.warn("[push] VAPID keys not set — push notifications disabled");
}

export const PUSH_PUBLIC_KEY = PUBLIC_KEY ?? "";

interface PushPayload {
  title: string;
  body: string;
  url?: string;
  tag?: string;
  badge?: string;
  icon?: string;
}

async function deliver(
  subs: { id: string; endpoint: string; p256dh: string; auth: string }[],
  payload: PushPayload,
) {
  if (!configured || subs.length === 0) return;
  const json = JSON.stringify(payload);
  await Promise.all(
    subs.map(async (s) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: s.endpoint,
            keys: { p256dh: s.p256dh, auth: s.auth },
          },
          json,
        );
      } catch (err: any) {
        // 404/410 = expired subscription → cleanup
        if (err?.statusCode === 404 || err?.statusCode === 410) {
          await prisma.pushSubscription
            .delete({ where: { id: s.id } })
            .catch(() => undefined);
        } else {
          console.error("[push] send error:", err?.statusCode, err?.body ?? err?.message);
        }
      }
    }),
  );
}

const ORDER_STATUS_PUSH: Record<string, { title: string; body: string }> = {
  CONFIRMED: { title: "Bestellung bestätigt", body: "Wir haben deine Bestellung erhalten." },
  PREPARING: { title: "In Zubereitung 🍝", body: "Unsere Küche legt für dich los." },
  READY: { title: "Bereit zur Abholung ✨", body: "Deine Bestellung wartet auf dich!" },
  COMPLETED: { title: "Abgeschlossen", body: "Buon appetito! Bis bald." },
  CANCELLED: { title: "Bestellung storniert", body: "Bei Fragen melde dich gerne bei uns." },
};

export async function sendOrderStatusPush(opts: {
  userId: string;
  orderId: string;
  status: string;
}) {
  const tpl = ORDER_STATUS_PUSH[opts.status];
  if (!tpl) return;
  const subs = await prisma.pushSubscription.findMany({
    where: { userId: opts.userId },
  });
  if (subs.length === 0) return;
  await deliver(subs, {
    title: tpl.title,
    body: tpl.body,
    tag: `order-${opts.orderId}`,
    url: `/profil/bestellungen`,
  });
}

export async function sendNewOrderToAdmins(opts: {
  orderId: string;
  totalAmount: number;
  customerName: string;
  orderType: string;
}) {
  const admins = await prisma.user.findMany({
    where: { role: "ADMIN" },
    select: { id: true },
  });
  if (admins.length === 0) return;
  const subs = await prisma.pushSubscription.findMany({
    where: { userId: { in: admins.map((a) => a.id) } },
  });
  if (subs.length === 0) return;
  const total = opts.totalAmount.toLocaleString("de-DE", {
    style: "currency",
    currency: "EUR",
  });
  await deliver(subs, {
    title: `Neue Bestellung · ${total}`,
    body: `${opts.customerName} · ${opts.orderType === "PICKUP" ? "Abholung" : "Lieferung"}`,
    tag: `new-order-${opts.orderId}`,
    url: `/admin`,
  });
}

export async function sendNewReservationToAdmins(opts: {
  reservationId: string;
  guestName: string;
  date: Date | string;
  partySize: number;
}) {
  const admins = await prisma.user.findMany({
    where: { role: "ADMIN" },
    select: { id: true },
  });
  if (admins.length === 0) return;
  const subs = await prisma.pushSubscription.findMany({
    where: { userId: { in: admins.map((a) => a.id) } },
  });
  if (subs.length === 0) return;
  const when = (typeof opts.date === "string" ? new Date(opts.date) : opts.date)
    .toLocaleString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  await deliver(subs, {
    title: `Neue Reservierung · ${when}`,
    body: `${opts.guestName} · ${opts.partySize} Personen`,
    tag: `new-reservation-${opts.reservationId}`,
    url: `/admin`,
  });
}
