"use client";

import SubPageHeader from "@/components/SubPageHeader";
import { useAuthStore } from "@/store/auth";
import { usePushSubscription } from "@/hooks/push";
import { Bell, BellOff } from "lucide-react";

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="py-4 border-b border-border-subtle">
      <p className="text-[10px] uppercase tracking-[0.22em] text-text-faint">
        {label}
      </p>
      <p className="font-serif text-base text-text-cream mt-1.5">{value}</p>
    </div>
  );
}

function NotificationsBlock() {
  const { status, error, supported, subscribe, unsubscribe } =
    usePushSubscription();

  if (!supported) {
    return (
      <div className="mt-8 p-4 rounded-sm border border-border-subtle bg-bg-elevated">
        <p className="text-[11px] uppercase tracking-[0.22em] text-text-faint mb-1">
          Benachrichtigungen
        </p>
        <p className="font-serif text-sm text-text-muted">
          Dein Browser unterstützt keine Push-Benachrichtigungen.
        </p>
      </div>
    );
  }

  const isOn = status === "subscribed";
  const isLoading = status === "loading";

  return (
    <div className="mt-8 p-5 rounded-sm border border-border-subtle bg-bg-elevated">
      <div className="flex items-start gap-4">
        <div
          className="h-10 w-10 rounded-full flex items-center justify-center shrink-0"
          style={{
            background: isOn ? "rgba(122,30,42,0.15)" : "rgba(154,139,117,0.1)",
            border: `1px solid ${isOn ? "rgba(122,30,42,0.4)" : "rgba(154,139,117,0.25)"}`,
          }}
        >
          {isOn ? (
            <Bell
              className="h-4 w-4"
              strokeWidth={1.8}
              style={{ color: "#7A1E2A" }}
            />
          ) : (
            <BellOff
              className="h-4 w-4 text-text-faint"
              strokeWidth={1.8}
            />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-serif text-base text-text-cream">
            Bestell-Updates per Push
          </p>
          <p className="text-xs text-text-muted mt-1 leading-relaxed">
            Wir benachrichtigen dich, sobald deine Bestellung in Zubereitung
            oder bereit zur Abholung ist.
          </p>

          {status === "denied" && (
            <p className="mt-3 text-[11px] text-bordeaux">
              Benachrichtigungen sind blockiert. Bitte in den Browser-Einstellungen erlauben.
            </p>
          )}
          {error && (
            <p className="mt-3 text-[11px] text-bordeaux">{error}</p>
          )}

          <div className="mt-4">
            {isOn ? (
              <button
                onClick={() => void unsubscribe()}
                disabled={isLoading}
                className="px-4 py-2 text-[11px] uppercase tracking-[0.22em] font-semibold border border-border-subtle text-text-muted hover:text-bordeaux hover:border-bordeaux/40 transition-colors press disabled:opacity-50"
              >
                {isLoading ? "…" : "Deaktivieren"}
              </button>
            ) : (
              <button
                onClick={() => void subscribe()}
                disabled={isLoading || status === "denied"}
                className="px-4 py-2 text-[11px] uppercase tracking-[0.22em] font-semibold bg-bordeaux text-bg-primary hover:bg-bordeaux-deep transition-colors press disabled:opacity-50"
              >
                {isLoading ? "…" : "Aktivieren"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MeinProfilPage() {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <div>
      <SubPageHeader title="Mein Profil" />

      <div className="px-7 pt-8 pb-12">
        {!isAuthenticated ? (
          <p className="font-serif italic text-text-muted">
            Bitte melden Sie sich an, um Ihre Profildaten zu sehen.
          </p>
        ) : (
          <>
            <Field label="Name" value={user?.name ?? "—"} />
            <Field label="E-Mail" value={user?.email ?? "—"} />
            <Field label="Telefon" value="+49 561 123 456" />
            <Field label="Adresse" value="Königsstraße 50, 34117 Kassel" />

            <NotificationsBlock />

            <p className="mt-8 text-[11px] uppercase tracking-[0.22em] text-text-faint">
              Bearbeiten der Daten in Kürze verfügbar.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
