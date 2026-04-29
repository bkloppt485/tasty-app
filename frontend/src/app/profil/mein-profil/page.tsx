"use client";

import SubPageHeader from "@/components/SubPageHeader";
import { useAuthStore } from "@/store/auth";

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

            <p className="mt-8 text-[11px] uppercase tracking-[0.22em] text-text-faint">
              Bearbeiten der Daten in Kürze verfügbar.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
