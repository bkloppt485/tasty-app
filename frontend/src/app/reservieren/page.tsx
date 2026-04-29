"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Minus, Plus, Check } from "lucide-react";
import SubPageHeader from "@/components/SubPageHeader";
import { useCreateReservation } from "@/hooks/queries";
import { useAuthStore } from "@/store/auth";
import { useUIStore } from "@/store/ui";
import { cn } from "@/lib/utils";

const TIME_SLOTS = (() => {
  const slots: string[] = [];
  for (let h = 11; h <= 21; h++) {
    slots.push(`${h.toString().padStart(2, "0")}:00`);
    slots.push(`${h.toString().padStart(2, "0")}:30`);
  }
  return slots;
})();

function todayIso() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}
function plusDaysIso(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function formatDateLong(date: Date) {
  return new Intl.DateTimeFormat("de-DE", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

export default function ReservierenPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const showToast = useUIStore((s) => s.showToast);
  const createReservation = useCreateReservation();

  const [date, setDate] = useState<string>(plusDaysIso(1));
  const [time, setTime] = useState<string>("19:00");
  const [partySize, setPartySize] = useState(4);
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [success, setSuccess] = useState<{
    date: string;
    partySize: number;
  } | null>(null);

  const validSlots = useMemo(() => {
    const isToday = date === todayIso();
    if (!isToday) return TIME_SLOTS;
    const now = new Date();
    return TIME_SLOTS.filter((s) => {
      const [h, m] = s.split(":").map(Number);
      return h * 60 + m > now.getHours() * 60 + now.getMinutes() + 30;
    });
  }, [date]);

  const canSubmit =
    !!date &&
    !!time &&
    partySize >= 1 &&
    !!phone &&
    (isAuthenticated || (!!name && !!email));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    const iso = new Date(`${date}T${time}:00`).toISOString();
    try {
      const r = await createReservation.mutateAsync({
        date: iso,
        partySize,
        notes: notes.trim() || undefined,
        guestName: isAuthenticated ? undefined : name,
        guestEmail: isAuthenticated ? undefined : email,
        guestPhone: phone,
      });
      setSuccess({ date: r.date, partySize: r.partySize });
    } catch (err: any) {
      showToast(
        err?.response?.data?.error ?? "Reservierung fehlgeschlagen",
        "error"
      );
    }
  };

  if (success) {
    const d = new Date(success.date);
    return (
      <div>
        <SubPageHeader title="Reservierung" backHref="/" />
        <div className="px-7 pt-12 pb-12 animate-fade-up">
          <div className="h-14 w-14 rounded-full border border-accent-gold flex items-center justify-center text-accent-gold">
            <Check className="h-6 w-6" strokeWidth={1.5} />
          </div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-accent-gold-soft mt-6">
            Grazie mille
          </p>
          <h1 className="font-serif text-3xl text-text-cream mt-2 leading-tight">
            Reservierung bestätigt
          </h1>
          <p className="font-serif italic text-text-muted mt-3 leading-relaxed">
            Wir freuen uns, Sie bei Tasty zu begrüßen.
          </p>

          <div className="hairline-gold mt-8 mb-6" />

          <dl className="space-y-4">
            <div>
              <dt className="text-[10px] uppercase tracking-[0.22em] text-text-faint">
                Datum &amp; Uhrzeit
              </dt>
              <dd className="font-serif text-lg text-text-cream mt-1">
                {formatDateLong(d)} · {d.getHours().toString().padStart(2, "0")}
                :{d.getMinutes().toString().padStart(2, "0")} Uhr
              </dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-[0.22em] text-text-faint">
                Personen
              </dt>
              <dd className="font-serif text-lg text-text-cream mt-1">
                {success.partySize}{" "}
                {success.partySize === 1 ? "Gast" : "Gäste"}
              </dd>
            </div>
          </dl>

          <div className="mt-10 flex flex-col gap-3">
            <Link href="/" className="gold-underline-btn">
              Zurück zur Startseite
            </Link>
            {isAuthenticated && (
              <Link
                href="/profil/reservierungen"
                className="text-[11px] uppercase tracking-[0.22em] text-text-muted hover:text-bordeaux transition-colors press"
              >
                Meine Reservierungen ansehen →
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <SubPageHeader title="Tisch reservieren" backHref="/" />

      <form onSubmit={onSubmit} className="px-7 pt-6 pb-16 space-y-9">
        <p className="font-serif italic text-text-muted text-sm leading-relaxed">
          Wählen Sie Datum, Uhrzeit und Anzahl der Gäste. Wir bestätigen Ihre
          Reservierung sofort.
        </p>

        <section>
          <p className="text-[10px] uppercase tracking-[0.3em] text-accent-gold-soft">
            Datum
          </p>
          <input
            type="date"
            min={todayIso()}
            max={plusDaysIso(90)}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-3 w-full bg-bg-elevated border border-border-subtle rounded-sm px-4 py-3 font-serif text-base text-text-cream focus:outline-none focus:border-accent-gold"
            required
          />
        </section>

        <section>
          <p className="text-[10px] uppercase tracking-[0.3em] text-accent-gold-soft">
            Uhrzeit
          </p>
          {validSlots.length === 0 ? (
            <p className="mt-3 font-serif italic text-text-muted text-sm">
              Heute keine freien Slots mehr — bitte wählen Sie ein anderes
              Datum.
            </p>
          ) : (
            <div className="mt-3 grid grid-cols-4 gap-2">
              {validSlots.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setTime(s)}
                  className={cn(
                    "py-2.5 text-sm tabular-nums rounded-sm border transition-colors press",
                    time === s
                      ? "bg-bordeaux text-bg-primary border-bordeaux"
                      : "bg-bg-elevated text-text-cream border-border-subtle hover:border-accent-gold"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </section>

        <section>
          <p className="text-[10px] uppercase tracking-[0.3em] text-accent-gold-soft">
            Personen
          </p>
          <div className="mt-3 flex items-center gap-5">
            <button
              type="button"
              onClick={() => setPartySize((p) => Math.max(1, p - 1))}
              className="h-11 w-11 rounded-full border border-border-subtle text-text-cream flex items-center justify-center hover:border-accent-gold press"
              aria-label="Weniger Personen"
            >
              <Minus className="h-4 w-4" strokeWidth={1.5} />
            </button>
            <span className="font-serif text-3xl text-text-cream tabular-nums w-12 text-center">
              {partySize}
            </span>
            <button
              type="button"
              onClick={() => setPartySize((p) => Math.min(12, p + 1))}
              className="h-11 w-11 rounded-full border border-border-subtle text-text-cream flex items-center justify-center hover:border-accent-gold press"
              aria-label="Mehr Personen"
            >
              <Plus className="h-4 w-4" strokeWidth={1.5} />
            </button>
            <span className="font-serif italic text-text-muted text-sm">
              {partySize === 1 ? "Gast" : "Gäste"}
            </span>
          </div>
        </section>

        <section>
          <p className="text-[10px] uppercase tracking-[0.3em] text-accent-gold-soft">
            Ihre Daten
          </p>
          {isAuthenticated ? (
            <div className="mt-3 space-y-3">
              <div className="bg-bg-elevated border border-border-subtle rounded-sm px-4 py-3">
                <p className="text-[10px] uppercase tracking-[0.22em] text-text-faint">
                  Name
                </p>
                <p className="font-serif text-base text-text-cream mt-1">
                  {user?.name}
                </p>
              </div>
              <div className="bg-bg-elevated border border-border-subtle rounded-sm px-4 py-3">
                <p className="text-[10px] uppercase tracking-[0.22em] text-text-faint">
                  E-Mail
                </p>
                <p className="font-serif text-base text-text-cream mt-1">
                  {user?.email}
                </p>
              </div>
              <input
                type="tel"
                placeholder="Telefonnummer"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-bg-elevated border border-border-subtle rounded-sm px-4 py-3 font-serif text-base text-text-cream placeholder:text-text-faint focus:outline-none focus:border-accent-gold"
                required
              />
            </div>
          ) : (
            <div className="mt-3 space-y-3">
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-bg-elevated border border-border-subtle rounded-sm px-4 py-3 font-serif text-base text-text-cream placeholder:text-text-faint focus:outline-none focus:border-accent-gold"
                required
              />
              <input
                type="email"
                placeholder="E-Mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-bg-elevated border border-border-subtle rounded-sm px-4 py-3 font-serif text-base text-text-cream placeholder:text-text-faint focus:outline-none focus:border-accent-gold"
                required
              />
              <input
                type="tel"
                placeholder="Telefonnummer"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-bg-elevated border border-border-subtle rounded-sm px-4 py-3 font-serif text-base text-text-cream placeholder:text-text-faint focus:outline-none focus:border-accent-gold"
                required
              />
            </div>
          )}
        </section>

        <section>
          <p className="text-[10px] uppercase tracking-[0.3em] text-accent-gold-soft">
            Wünsche
          </p>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="z.B. Fensterplatz, Geburtstag, Allergien…"
            rows={3}
            className="mt-3 w-full bg-bg-elevated border border-border-subtle rounded-sm px-4 py-3 font-serif text-[0.95rem] text-text-cream placeholder:text-text-faint focus:outline-none focus:border-accent-gold resize-none"
          />
        </section>

        <div className="pt-2">
          <button
            type="submit"
            disabled={!canSubmit || createReservation.isPending}
            className="w-full bg-bordeaux text-bg-primary py-4 rounded-sm text-[11px] uppercase tracking-[0.2em] font-semibold press hover:bg-bordeaux-deep transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createReservation.isPending
              ? "Wird gesendet…"
              : "Reservierung absenden"}
          </button>
          <p className="mt-3 text-center text-[10px] uppercase tracking-[0.22em] text-text-faint">
            Mo – So · 11:00 – 22:00
          </p>
        </div>
      </form>
    </div>
  );
}
