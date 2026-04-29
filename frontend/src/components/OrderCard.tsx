"use client";

import type { Order } from "@/types";
import { formatDate, formatPrice, cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { useUIStore } from "@/store/ui";
import { RotateCcw } from "lucide-react";

const statusLabels: Record<Order["status"], string> = {
  PENDING: "Ausstehend",
  CONFIRMED: "Bestätigt",
  PREPARING: "In Zubereitung",
  READY: "Abholbereit",
  COMPLETED: "Abgeschlossen",
  CANCELLED: "Storniert",
};

const STEPS: { key: Order["status"]; label: string }[] = [
  { key: "CONFIRMED", label: "Bestätigt" },
  { key: "PREPARING", label: "In Zubereitung" },
  { key: "READY", label: "Bereit" },
  { key: "COMPLETED", label: "Abgeschlossen" },
];

const stepIndex = (s: Order["status"]) => {
  const i = STEPS.findIndex((x) => x.key === s);
  return i < 0 ? 0 : i;
};

export default function OrderCard({ order }: { order: Order }) {
  const addItem = useCartStore((s) => s.addItem);
  const showToast = useUIStore((s) => s.showToast);
  const isCancelled = order.status === "CANCELLED";
  const activeIdx = stepIndex(order.status);

  const reorder = () => {
    order.items.forEach((it) => {
      if (it.product) addItem(it.product, it.quantity);
    });
    showToast("In den Warenkorb gelegt", "success");
  };

  return (
    <div className="py-6 border-b border-border-subtle last:border-b-0">
      <div className="flex items-baseline justify-between">
        <p className="text-[10px] uppercase tracking-[0.22em] text-text-faint">
          #{order.id.slice(-6).toUpperCase()} · {formatDate(order.createdAt)}
        </p>
        <p
          className={cn(
            "text-[10px] uppercase tracking-[0.22em] font-semibold",
            isCancelled ? "text-text-faint" : "text-bordeaux"
          )}
        >
          {statusLabels[order.status]}
        </p>
      </div>

      {/* Stepper */}
      {!isCancelled && (
        <div className="mt-4">
          <div className="flex items-center">
            {STEPS.map((s, i) => {
              const reached = i <= activeIdx;
              const isLast = i === STEPS.length - 1;
              return (
                <div key={s.key} className="flex-1 flex items-center">
                  <div
                    className={cn(
                      "h-2.5 w-2.5 rounded-full shrink-0 transition-colors",
                      reached ? "bg-bordeaux" : "bg-border-subtle"
                    )}
                  />
                  {!isLast && (
                    <div
                      className={cn(
                        "flex-1 h-px mx-1.5 transition-colors",
                        i < activeIdx ? "bg-bordeaux" : "bg-border-subtle"
                      )}
                    />
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-2 flex justify-between">
            {STEPS.map((s, i) => (
              <span
                key={s.key}
                className={cn(
                  "text-[9px] uppercase tracking-[0.18em] flex-1",
                  i === 0
                    ? "text-left"
                    : i === STEPS.length - 1
                      ? "text-right"
                      : "text-center",
                  i <= activeIdx ? "text-text-cream" : "text-text-faint"
                )}
              >
                {s.label}
              </span>
            ))}
          </div>
          {(order.status === "CONFIRMED" || order.status === "PREPARING") && (
            <p className="mt-3 text-[11px] italic font-serif text-text-muted">
              Voraussichtlich in ca. 25–30 Min bereit
            </p>
          )}
        </div>
      )}

      <ul className="mt-4 space-y-1.5">
        {order.items.map((item) => (
          <li
            key={item.id}
            className="flex items-baseline font-serif text-text-cream"
          >
            <span>
              {item.quantity}× {item.product?.name ?? "Artikel"}
            </span>
            <span className="menu-divider" aria-hidden />
            <span className="font-sans text-sm text-text-muted tabular-nums">
              {formatPrice(item.price * item.quantity)}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex items-baseline justify-between">
        <span className="text-[10px] uppercase tracking-[0.22em] text-text-faint">
          {order.orderType === "DELIVERY" ? "Lieferung" : "Abholung"}
          {order.tipAmount && order.tipAmount > 0
            ? ` · inkl. ${formatPrice(order.tipAmount)} Trinkgeld`
            : ""}
        </span>
        <span className="font-serif text-lg text-bordeaux font-semibold">
          {formatPrice(order.totalAmount)}
        </span>
      </div>

      <button
        onClick={reorder}
        className="mt-5 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] font-semibold text-bordeaux hover:text-bordeaux/70 transition-colors press"
      >
        <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.6} />
        Erneut bestellen
      </button>
    </div>
  );
}
