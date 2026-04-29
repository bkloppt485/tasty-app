"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import {
  useAdminOrders,
  useAdminReservations,
  useAdminStats,
  useUpdateOrderStatus,
  useUpdateReservationStatus,
  useDemoReset,
  type AdminOrder,
} from "@/hooks/admin";
import {
  ORDER_STATUS_FLOW,
  ORDER_STATUS_META,
  RESERVATION_STATUS_META,
  nextOrderStatus,
} from "@/lib/status";
import type { OrderStatus, Reservation, ReservationStatus } from "@/types";
import {
  ChefHat,
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RefreshCw,
  RotateCcw,
} from "lucide-react";

type Tab = "orders" | "reservations" | "stats";

export default function AdminDashboard() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [tab, setTab] = useState<Tab>("orders");

  useEffect(() => {
    if (!hydrated) return;
    if (!isAuthenticated) {
      router.replace("/login?next=/admin");
      return;
    }
    if (user && user.role !== "ADMIN") {
      router.replace("/");
    }
  }, [hydrated, isAuthenticated, user, router]);

  if (!hydrated || !user || user.role !== "ADMIN") {
    return (
      <main className="min-h-screen flex items-center justify-center text-text-muted">
        Lade…
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bg-primary pb-24">
      <header
        className="sticky top-0 z-30 px-5 pt-5 pb-3 bg-bg-primary/95 backdrop-blur-md border-b border-border-subtle"
        style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 1rem)" }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-text-muted">
              Admin
            </p>
            <h1 className="font-serif text-2xl text-text-cream leading-tight">
              Tasty Cockpit
            </h1>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-text-muted">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            Live
          </div>
        </div>

        <div className="mt-4 flex gap-1 p-1 rounded-full bg-bg-deep border border-border-subtle">
          <TabBtn active={tab === "orders"} onClick={() => setTab("orders")}>
            <ChefHat className="h-3.5 w-3.5" /> Bestellungen
          </TabBtn>
          <TabBtn
            active={tab === "reservations"}
            onClick={() => setTab("reservations")}
          >
            <Calendar className="h-3.5 w-3.5" /> Reservierungen
          </TabBtn>
          <TabBtn active={tab === "stats"} onClick={() => setTab("stats")}>
            <TrendingUp className="h-3.5 w-3.5" /> Heute
          </TabBtn>
        </div>
      </header>

      <div className="px-4 pt-4">
        {tab === "orders" && <OrdersPanel />}
        {tab === "reservations" && <ReservationsPanel />}
        {tab === "stats" && <StatsPanel />}
      </div>
    </main>
  );
}

function TabBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 text-[11px] font-medium rounded-full transition-colors"
      style={{
        background: active ? "#7A1E2A" : "transparent",
        color: active ? "#FAF6EE" : "var(--text-muted)",
      }}
    >
      {children}
    </button>
  );
}

function StatsPanel() {
  const { data, isLoading } = useAdminStats();
  if (isLoading || !data) {
    return <div className="text-center text-text-muted py-12">Lade…</div>;
  }
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Bestellungen heute" value={data.todayOrders} />
        <StatCard
          label="Umsatz heute"
          value={`€ ${data.todayRevenue.toFixed(2)}`}
        />
        <StatCard label="Aktiv (Küche)" value={data.activeOrders} accent />
        <StatCard
          label="Reservierungen heute"
          value={data.todayReservations}
        />
        <StatCard
          label="Reservierungen offen"
          value={data.pendingReservations}
          accent
        />
      </div>
      <DemoResetCard />
    </div>
  );
}

function DemoResetCard() {
  const reset = useDemoReset();
  const [confirm, setConfirm] = useState(false);
  const [done, setDone] = useState<null | { count: number }>(null);

  async function doReset() {
    try {
      const r = await reset.mutateAsync();
      const total = Object.values(r.deleted).reduce((s, n) => s + n, 0);
      setDone({ count: total });
      setConfirm(false);
      setTimeout(() => setDone(null), 4000);
    } catch {
      /* error swallowed; mutation has its own error state */
    }
  }

  return (
    <div
      className="rounded-2xl p-4 border mt-4"
      style={{
        background: "rgba(45,10,15,0.04)",
        borderColor: "rgba(122,30,42,0.18)",
      }}
    >
      <div className="flex items-start gap-3">
        <span
          className="flex-shrink-0 h-9 w-9 rounded-xl flex items-center justify-center"
          style={{
            background: "rgba(122,30,42,0.08)",
            border: "1px solid rgba(122,30,42,0.25)",
            color: "#7A1E2A",
          }}
        >
          <RotateCcw className="h-4 w-4" strokeWidth={1.6} />
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-serif text-base text-bordeaux leading-tight">
            Demo zurücksetzen
          </p>
          <p className="text-[12px] text-text-muted leading-snug mt-1">
            Löscht alle Test-Bestellungen, Reservierungen, Coupon-Einlösungen
            und Push-Subscriptions. Nutzer, Produkte und Coupons bleiben
            erhalten.
          </p>

          {done && (
            <p className="text-[12px] mt-3 text-green-700">
              ✓ {done.count} Demo-Einträge gelöscht.
            </p>
          )}

          {!confirm ? (
            <button
              onClick={() => setConfirm(true)}
              disabled={reset.isPending}
              className="mt-3 text-[11px] uppercase tracking-[0.18em] px-3 py-1.5 rounded-full border border-bordeaux/40 text-bordeaux hover:bg-bordeaux/[0.05] transition-colors"
            >
              Zurücksetzen
            </button>
          ) : (
            <div className="mt-3 flex gap-2">
              <button
                onClick={doReset}
                disabled={reset.isPending}
                className="text-[11px] uppercase tracking-[0.18em] px-3 py-1.5 rounded-full bg-bordeaux text-bg-primary disabled:opacity-50"
              >
                {reset.isPending ? "Lösche…" : "Ja, löschen"}
              </button>
              <button
                onClick={() => setConfirm(false)}
                disabled={reset.isPending}
                className="text-[11px] uppercase tracking-[0.18em] px-3 py-1.5 rounded-full border border-border-subtle text-text-muted"
              >
                Abbrechen
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number | string;
  accent?: boolean;
}) {
  return (
    <div
      className="rounded-2xl p-4 border"
      style={{
        background: accent ? "rgba(122,30,42,0.08)" : "#fff",
        borderColor: accent ? "rgba(122,30,42,0.25)" : "var(--border-subtle)",
      }}
    >
      <p className="text-[10px] uppercase tracking-[0.18em] text-text-muted">
        {label}
      </p>
      <p
        className="font-serif mt-1.5 text-2xl"
        style={{ color: accent ? "#7A1E2A" : "var(--text-cream)" }}
      >
        {value}
      </p>
    </div>
  );
}

function OrdersPanel() {
  const [filter, setFilter] = useState<OrderStatus | "ALL">("ALL");
  const { data, isLoading, refetch, isFetching } = useAdminOrders(filter);

  return (
    <div>
      <div className="flex gap-1.5 overflow-x-auto pb-2 mb-3 -mx-1 px-1">
        {(["ALL", ...ORDER_STATUS_FLOW, "CANCELLED"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="flex-shrink-0 text-[10px] uppercase tracking-[0.18em] px-3 py-1.5 rounded-full border transition-colors"
            style={{
              background: filter === f ? "#7A1E2A" : "transparent",
              color: filter === f ? "#FAF6EE" : "var(--text-muted)",
              borderColor:
                filter === f ? "#7A1E2A" : "var(--border-subtle)",
            }}
          >
            {f === "ALL" ? "Alle" : ORDER_STATUS_META[f].short}
          </button>
        ))}
        <button
          onClick={() => refetch()}
          className="flex-shrink-0 ml-auto p-1.5 rounded-full border border-border-subtle text-text-muted"
          aria-label="Neu laden"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`}
          />
        </button>
      </div>

      {isLoading ? (
        <p className="text-center text-text-muted py-12">Lade Bestellungen…</p>
      ) : !data || data.length === 0 ? (
        <p className="text-center text-text-muted py-12">Keine Bestellungen.</p>
      ) : (
        <div className="space-y-2.5">
          {data.map((o) => (
            <OrderCard key={o.id} order={o} />
          ))}
        </div>
      )}
    </div>
  );
}

function OrderCard({ order }: { order: AdminOrder }) {
  const update = useUpdateOrderStatus();
  const meta = ORDER_STATUS_META[order.status];
  const next = nextOrderStatus(order.status);
  const created = new Date(order.createdAt);
  const minutesAgo = Math.floor((Date.now() - created.getTime()) / 60000);

  return (
    <div className="rounded-2xl border border-border-subtle bg-white p-3.5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span
              className="text-[9px] uppercase tracking-[0.2em] px-2 py-0.5 rounded-full"
              style={{ background: meta.bg, color: meta.color }}
            >
              <span
                className="inline-block w-1.5 h-1.5 rounded-full mr-1 align-middle"
                style={{ background: meta.dot }}
              />
              {meta.short}
            </span>
            <span className="text-[10px] text-text-faint">
              <Clock className="inline h-3 w-3 mr-0.5 align-text-bottom" />
              {minutesAgo < 1
                ? "gerade"
                : minutesAgo < 60
                  ? `${minutesAgo}m`
                  : created.toLocaleTimeString("de-DE", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
            </span>
          </div>
          <p className="mt-1.5 font-serif text-base text-text-cream truncate">
            {order.user?.name ?? "Gast"}{" "}
            <span className="text-text-muted text-xs">
              · #{order.id.slice(-6).toUpperCase()}
            </span>
          </p>
          <p className="text-[11px] text-text-muted">
            {order.orderType === "DELIVERY" ? "Lieferung" : "Abholung"} · €{" "}
            {order.totalAmount.toFixed(2)}
          </p>
        </div>
      </div>

      <ul className="mt-2.5 space-y-0.5 text-[12px] text-text-cream/80">
        {order.items.map((it) => (
          <li key={it.id} className="flex justify-between gap-2">
            <span className="truncate">
              <span className="text-text-muted">{it.quantity}×</span>{" "}
              {it.product?.name ?? "Produkt"}
            </span>
            <span className="text-text-muted tabular-nums">
              € {(it.price * it.quantity).toFixed(2)}
            </span>
          </li>
        ))}
      </ul>

      {order.status !== "COMPLETED" && order.status !== "CANCELLED" && (
        <div className="mt-3 pt-3 border-t border-border-subtle flex gap-2">
          {next && (
            <button
              disabled={update.isPending}
              onClick={() => update.mutate({ id: order.id, status: next })}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full text-xs font-medium disabled:opacity-50"
              style={{ background: "#7A1E2A", color: "#FAF6EE" }}
            >
              {ORDER_STATUS_META[next].short}
              <ArrowRight className="h-3 w-3" />
            </button>
          )}
          <button
            disabled={update.isPending}
            onClick={() =>
              update.mutate({ id: order.id, status: "CANCELLED" })
            }
            className="px-3 py-2 rounded-full text-xs border border-border-subtle text-text-muted hover:text-red-700 hover:border-red-300 disabled:opacity-50"
            aria-label="Stornieren"
          >
            <XCircle className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

function ReservationsPanel() {
  const [filter, setFilter] = useState<ReservationStatus | "ALL">("ALL");
  const { data, isLoading } = useAdminReservations(filter);

  return (
    <div>
      <div className="flex gap-1.5 overflow-x-auto pb-2 mb-3 -mx-1 px-1">
        {(["ALL", "PENDING", "CONFIRMED", "CANCELLED"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="flex-shrink-0 text-[10px] uppercase tracking-[0.18em] px-3 py-1.5 rounded-full border"
            style={{
              background: filter === f ? "#7A1E2A" : "transparent",
              color: filter === f ? "#FAF6EE" : "var(--text-muted)",
              borderColor:
                filter === f ? "#7A1E2A" : "var(--border-subtle)",
            }}
          >
            {f === "ALL" ? "Alle" : RESERVATION_STATUS_META[f].label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className="text-center text-text-muted py-12">Lade…</p>
      ) : !data || data.length === 0 ? (
        <p className="text-center text-text-muted py-12">
          Keine Reservierungen.
        </p>
      ) : (
        <div className="space-y-2.5">
          {data.map((r) => (
            <ReservationCard key={r.id} reservation={r} />
          ))}
        </div>
      )}
    </div>
  );
}

function ReservationCard({ reservation }: { reservation: Reservation }) {
  const update = useUpdateReservationStatus();
  const meta = RESERVATION_STATUS_META[reservation.status];
  const d = new Date(reservation.date);

  return (
    <div className="rounded-2xl border border-border-subtle bg-white p-3.5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="text-[9px] uppercase tracking-[0.2em] px-2 py-0.5 rounded-full"
              style={{ background: meta.bg, color: meta.color }}
            >
              <span
                className="inline-block w-1.5 h-1.5 rounded-full mr-1 align-middle"
                style={{ background: meta.dot }}
              />
              {meta.label}
            </span>
            <span className="text-[10px] text-text-faint">
              {reservation.partySize}{" "}
              {reservation.partySize === 1 ? "Person" : "Personen"}
            </span>
          </div>
          <p className="mt-1.5 font-serif text-base text-text-cream">
            {d.toLocaleDateString("de-DE", {
              weekday: "short",
              day: "2-digit",
              month: "short",
            })}{" "}
            ·{" "}
            {d.toLocaleTimeString("de-DE", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          <p className="text-[12px] text-text-cream/80 truncate">
            {reservation.guestName}
          </p>
          <p className="text-[11px] text-text-muted truncate">
            {reservation.guestEmail} · {reservation.guestPhone}
          </p>
          {reservation.notes && (
            <p className="mt-1.5 text-[11px] text-text-muted italic">
              {`„${reservation.notes}"`}
            </p>
          )}
        </div>
      </div>

      {reservation.status !== "CANCELLED" && (
        <div className="mt-3 pt-3 border-t border-border-subtle flex gap-2">
          {reservation.status === "PENDING" && (
            <button
              disabled={update.isPending}
              onClick={() =>
                update.mutate({ id: reservation.id, status: "CONFIRMED" })
              }
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full text-xs font-medium disabled:opacity-50"
              style={{ background: "#7A1E2A", color: "#FAF6EE" }}
            >
              <CheckCircle2 className="h-3.5 w-3.5" /> Bestätigen
            </button>
          )}
          <button
            disabled={update.isPending}
            onClick={() =>
              update.mutate({ id: reservation.id, status: "CANCELLED" })
            }
            className="px-3 py-2 rounded-full text-xs border border-border-subtle text-text-muted hover:text-red-700 hover:border-red-300 disabled:opacity-50 flex items-center gap-1.5"
          >
            <XCircle className="h-3.5 w-3.5" /> Stornieren
          </button>
        </div>
      )}
    </div>
  );
}
