"use client";

import { use } from "react";
import Link from "next/link";
import { CheckCircle2, Clock, MapPin, Package } from "lucide-react";
import { useOrder } from "@/hooks/queries";
import { useRestaurantSettings } from "@/hooks/admin";
import { formatPrice } from "@/lib/utils";

export default function DankePage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = use(params);
  const { data: order, isLoading } = useOrder(orderId);
  const { data: settings } = useRestaurantSettings();

  if (isLoading || !order) {
    return (
      <main className="min-h-screen flex items-center justify-center text-text-muted">
        Lade Bestellung…
      </main>
    );
  }

  const eta =
    order.orderType === "DELIVERY" ? "ca. 35–50 Min" : "ca. 20–30 Min";
  const subtotal = order.items.reduce(
    (s, it) => s + it.price * it.quantity,
    0,
  );

  return (
    <main className="min-h-screen bg-bg-primary pb-24">
      <section className="px-6 pt-12 text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-bordeaux/10 text-bordeaux mb-5">
          <CheckCircle2 className="h-9 w-9" strokeWidth={1.4} />
        </div>
        <p className="luxe-label text-bordeaux mb-2">Bestätigt</p>
        <h1 className="font-serif text-3xl text-text-cream leading-tight">
          Vielen Dank
        </h1>
        <p className="text-text-muted text-sm mt-3 max-w-xs mx-auto">
          Wir haben Ihre Bestellung erhalten und bereiten alles für Sie vor.
        </p>
      </section>

      <section className="px-6 mt-10">
        <div className="bg-bg-elevated border border-border-subtle rounded-md p-5 space-y-4">
          <div className="flex items-start justify-between border-b border-border-subtle pb-3">
            <div>
              <p className="luxe-label">Bestell-Nr.</p>
              <p className="font-mono text-sm text-text-cream mt-1">
                #{order.id.slice(-8).toUpperCase()}
              </p>
            </div>
            <div className="text-right">
              <p className="luxe-label">Gesamt</p>
              <p className="font-serif text-lg text-bordeaux mt-1">
                {formatPrice(order.totalAmount)}
              </p>
            </div>
          </div>

          <Row
            icon={<Clock className="h-4 w-4" />}
            label={
              order.orderType === "DELIVERY"
                ? "Voraussichtliche Lieferzeit"
                : "Voraussichtlich abholbereit in"
            }
            value={eta}
          />
          <Row
            icon={
              order.orderType === "DELIVERY" ? (
                <MapPin className="h-4 w-4" />
              ) : (
                <Package className="h-4 w-4" />
              )
            }
            label={order.orderType === "DELIVERY" ? "Lieferung" : "Abholung"}
            value={
              order.orderType === "PICKUP" && settings
                ? `${settings.street ?? ""}, ${settings.postalCode ?? ""} ${settings.city ?? ""}`
                : order.orderType === "DELIVERY"
                  ? "Wir kommen zu Ihnen"
                  : "Im Restaurant"
            }
          />
        </div>

        <div className="mt-6 bg-bg-elevated border border-border-subtle rounded-md p-5">
          <h2 className="luxe-label mb-4">Ihre Bestellung</h2>
          <ul className="space-y-3">
            {order.items.map((it) => (
              <li
                key={it.id}
                className="flex items-baseline justify-between gap-3 text-sm"
              >
                <span className="text-text-cream">
                  <span className="text-text-faint tabular-nums">
                    {it.quantity}×
                  </span>{" "}
                  {it.product.name}
                </span>
                <span className="text-text-muted tabular-nums shrink-0">
                  {formatPrice(it.price * it.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 pt-4 border-t border-border-subtle space-y-1.5 text-sm">
            <SumRow label="Zwischensumme" value={formatPrice(subtotal)} />
            {order.tipAmount ? (
              <SumRow label="Trinkgeld" value={formatPrice(order.tipAmount)} />
            ) : null}
            <div className="flex justify-between pt-2 border-t border-border-subtle font-serif text-base">
              <span className="text-text-cream">Gesamt</span>
              <span className="text-bordeaux tabular-nums">
                {formatPrice(order.totalAmount)}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 mt-8 space-y-3">
        <Link
          href="/profil/bestellungen"
          className="bordeaux-btn w-full block text-center"
        >
          Bestellung verfolgen
        </Link>
        <Link
          href="/"
          className="block w-full text-center text-sm text-text-muted hover:text-bordeaux py-3 press"
        >
          Zur Startseite
        </Link>
      </section>
    </main>
  );
}

function Row({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-bordeaux mt-0.5">{icon}</span>
      <div className="flex-1">
        <p className="luxe-label">{label}</p>
        <p className="text-sm text-text-cream mt-0.5">{value}</p>
      </div>
    </div>
  );
}

function SumRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-text-muted">
      <span>{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}
