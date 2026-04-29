"use client";

import Link from "next/link";
import { CalendarPlus } from "lucide-react";
import SubPageHeader from "@/components/SubPageHeader";
import EmptyState from "@/components/EmptyState";
import { useMyReservations } from "@/hooks/queries";
import { useAuthStore } from "@/store/auth";
import type { Reservation } from "@/types";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("de-DE", {
    weekday: "short",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatTime(date: Date) {
  return `${date.getHours().toString().padStart(2, "0")}:${date
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
}

function ReservationCard({ r }: { r: Reservation }) {
  const d = new Date(r.date);
  const isPast = d.getTime() < Date.now();
  const statusLabel =
    isPast && r.status === "CONFIRMED" ? "Vergangen" : r.status;
  const statusColor =
    r.status === "CONFIRMED" && !isPast
      ? "text-accent-gold border-accent-gold/60"
      : r.status === "CANCELLED"
      ? "text-text-faint border-border-subtle"
      : isPast
      ? "text-text-faint border-border-subtle"
      : "text-bordeaux border-bordeaux/40";
  return (
    <article className="surface p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="font-serif text-2xl text-text-cream leading-tight">
            {formatDate(d)}
          </p>
          <p className="font-serif italic text-text-muted mt-1">
            {formatTime(d)} Uhr · {r.partySize}{" "}
            {r.partySize === 1 ? "Gast" : "Gäste"}
          </p>
        </div>
        <span
          className={`shrink-0 text-[10px] uppercase tracking-[0.22em] font-semibold px-2.5 py-1 border rounded-sm ${statusColor}`}
        >
          {statusLabel}
        </span>
      </div>
      {r.notes && (
        <p className="mt-3 pt-3 border-t border-border-subtle font-serif italic text-text-muted text-sm leading-relaxed">
          „{r.notes}&ldquo;
        </p>
      )}
    </article>
  );
}

export default function ReservierungenPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { data: reservations = [], isLoading } = useMyReservations();

  return (
    <div>
      <SubPageHeader title="Meine Reservierungen" />
      <div className="px-7 pt-6 pb-12">
        {!isAuthenticated ? (
          <p className="font-serif italic text-text-muted">
            Bitte melden Sie sich an, um Ihre Reservierungen zu sehen.
          </p>
        ) : isLoading ? (
          <p className="font-serif italic text-text-muted">Lädt…</p>
        ) : reservations.length === 0 ? (
          <EmptyState
            title="Noch keine Reservierung"
            message="Sichern Sie sich Ihren Tisch — wir freuen uns auf Sie."
            actionLabel="Jetzt reservieren"
            actionHref="/reservieren"
          />
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-[10px] uppercase tracking-[0.22em] text-text-faint">
                {reservations.length}{" "}
                {reservations.length === 1
                  ? "Reservierung"
                  : "Reservierungen"}
              </p>
              <Link
                href="/reservieren"
                className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.22em] text-accent-gold border-b border-accent-gold/60 pb-0.5 hover:text-bordeaux hover:border-bordeaux transition-colors press"
              >
                <CalendarPlus className="h-3.5 w-3.5" strokeWidth={1.5} />
                Neue
              </Link>
            </div>
            <div className="space-y-4">
              {reservations.map((r) => (
                <ReservationCard key={r.id} r={r} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
