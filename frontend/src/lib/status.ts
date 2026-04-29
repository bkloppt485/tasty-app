import type { OrderStatus, ReservationStatus } from "@/types";

export const ORDER_STATUS_FLOW: OrderStatus[] = [
  "CONFIRMED",
  "PREPARING",
  "READY",
  "COMPLETED",
];

export const ORDER_STATUS_META: Record<
  OrderStatus,
  { label: string; short: string; color: string; bg: string; dot: string }
> = {
  PENDING: {
    label: "Eingegangen",
    short: "Eingegangen",
    color: "#7A6A6C",
    bg: "rgba(122,106,108,0.12)",
    dot: "#7A6A6C",
  },
  CONFIRMED: {
    label: "Bestätigt",
    short: "Bestätigt",
    color: "#7A1E2A",
    bg: "rgba(122,30,42,0.10)",
    dot: "#7A1E2A",
  },
  PREPARING: {
    label: "Wird zubereitet",
    short: "In Zubereitung",
    color: "#A8843E",
    bg: "rgba(201,162,74,0.16)",
    dot: "#C9A24A",
  },
  READY: {
    label: "Bereit zur Abholung",
    short: "Bereit",
    color: "#2E6B3E",
    bg: "rgba(46,107,62,0.12)",
    dot: "#3F8F52",
  },
  COMPLETED: {
    label: "Abgeschlossen",
    short: "Erledigt",
    color: "#3F4A52",
    bg: "rgba(63,74,82,0.10)",
    dot: "#3F4A52",
  },
  CANCELLED: {
    label: "Storniert",
    short: "Storniert",
    color: "#9B2D2D",
    bg: "rgba(155,45,45,0.10)",
    dot: "#9B2D2D",
  },
};

export const RESERVATION_STATUS_META: Record<
  ReservationStatus,
  { label: string; color: string; bg: string; dot: string }
> = {
  PENDING: {
    label: "Offen",
    color: "#A8843E",
    bg: "rgba(201,162,74,0.16)",
    dot: "#C9A24A",
  },
  CONFIRMED: {
    label: "Bestätigt",
    color: "#2E6B3E",
    bg: "rgba(46,107,62,0.12)",
    dot: "#3F8F52",
  },
  CANCELLED: {
    label: "Storniert",
    color: "#9B2D2D",
    bg: "rgba(155,45,45,0.10)",
    dot: "#9B2D2D",
  },
};

export function nextOrderStatus(s: OrderStatus): OrderStatus | null {
  const idx = ORDER_STATUS_FLOW.indexOf(s);
  if (idx === -1 || idx === ORDER_STATUS_FLOW.length - 1) return null;
  return ORDER_STATUS_FLOW[idx + 1];
}
