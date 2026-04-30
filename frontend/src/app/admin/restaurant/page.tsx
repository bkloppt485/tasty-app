"use client";

import { useEffect, useState } from "react";
import {
  useRestaurantSettings,
  useUpdateRestaurantSettings,
} from "@/hooks/admin";
import { useUIStore } from "@/store/ui";
import AdminGuard from "@/components/AdminGuard";
import type { RestaurantSettings } from "@/types";

export default function AdminRestaurantPage() {
  return (
    <AdminGuard title="Restaurant-Daten">
      <SettingsForm />
    </AdminGuard>
  );
}

function SettingsForm() {
  const { data, isLoading } = useRestaurantSettings();
  const update = useUpdateRestaurantSettings();
  const showToast = useUIStore((s) => s.showToast);
  const [form, setForm] = useState<Partial<RestaurantSettings> | null>(null);

  useEffect(() => {
    if (data && !form) setForm(data);
  }, [data, form]);

  if (isLoading || !form) {
    return <p className="text-center text-text-muted py-12">Lade…</p>;
  }

  const set = <K extends keyof RestaurantSettings>(
    k: K,
    v: RestaurantSettings[K]
  ) => setForm((f) => ({ ...(f ?? {}), [k]: v }));

  const submit = async () => {
    try {
      await update.mutateAsync(form);
      showToast("Gespeichert", "success");
    } catch {
      showToast("Speichern fehlgeschlagen", "error");
    }
  };

  return (
    <div className="space-y-4 mb-12">
      <Section title="Allgemein">
        <Field label="Restaurant-Name">
          <input
            value={form.name ?? ""}
            onChange={(e) => set("name", e.target.value)}
            className="luxe-input"
            maxLength={80}
          />
        </Field>
        <Field label="Slogan">
          <input
            value={form.tagline ?? ""}
            onChange={(e) => set("tagline", e.target.value)}
            className="luxe-input"
            placeholder='z.B. „Italienisch · Döner · Kassel“'
            maxLength={200}
          />
        </Field>
        <Field label="Beschreibung">
          <textarea
            value={form.description ?? ""}
            onChange={(e) => set("description", e.target.value)}
            rows={3}
            className="luxe-input resize-none"
            maxLength={2000}
          />
        </Field>
      </Section>

      <Section title="Kontakt">
        <Field label="Telefon">
          <input
            value={form.phone ?? ""}
            onChange={(e) => set("phone", e.target.value)}
            className="luxe-input"
            maxLength={40}
          />
        </Field>
        <Field label="E-Mail">
          <input
            type="email"
            value={form.email ?? ""}
            onChange={(e) => set("email", e.target.value)}
            className="luxe-input"
          />
        </Field>
      </Section>

      <Section title="Adresse">
        <Field label="Straße & Hausnummer">
          <input
            value={form.street ?? ""}
            onChange={(e) => set("street", e.target.value)}
            className="luxe-input"
            maxLength={120}
          />
        </Field>
        <div className="flex gap-3">
          <Field label="PLZ">
            <input
              value={form.postalCode ?? ""}
              onChange={(e) => set("postalCode", e.target.value)}
              className="luxe-input"
              maxLength={10}
            />
          </Field>
          <Field label="Ort">
            <input
              value={form.city ?? ""}
              onChange={(e) => set("city", e.target.value)}
              className="luxe-input"
              maxLength={80}
            />
          </Field>
        </div>
      </Section>

      <Section title="Öffnungszeiten">
        <Field label="z.B. Mo–So 11:00–22:00">
          <textarea
            value={form.openingHours ?? ""}
            onChange={(e) => set("openingHours", e.target.value)}
            rows={3}
            className="luxe-input resize-none"
            placeholder="Mo–Fr 11:00–22:00&#10;Sa–So 12:00–23:00"
          />
        </Field>
      </Section>

      <Section title="Bestell-Optionen">
        <label className="flex items-center gap-2 text-sm text-text-cream">
          <input
            type="checkbox"
            checked={form.pickupEnabled ?? true}
            onChange={(e) => set("pickupEnabled", e.target.checked)}
            className="h-4 w-4"
          />
          Abholung möglich
        </label>
        <label className="flex items-center gap-2 text-sm text-text-cream">
          <input
            type="checkbox"
            checked={form.deliveryEnabled ?? true}
            onChange={(e) => set("deliveryEnabled", e.target.checked)}
            className="h-4 w-4"
          />
          Lieferung möglich
        </label>
        <div className="flex gap-3">
          <Field label="Liefergebühr (€)">
            <input
              type="number"
              step="0.10"
              min="0"
              value={form.deliveryFee ?? 3.5}
              onChange={(e) =>
                set("deliveryFee", parseFloat(e.target.value) || 0)
              }
              className="luxe-input"
            />
          </Field>
          <Field label="Gratis ab (€)">
            <input
              type="number"
              step="0.5"
              min="0"
              value={form.freeDeliveryThreshold ?? 25}
              onChange={(e) =>
                set("freeDeliveryThreshold", parseFloat(e.target.value) || 0)
              }
              className="luxe-input"
            />
          </Field>
        </div>
        <Field label='Erlaubte PLZ-Präfixe (Komma-getrennt, z.B. „34, 35“)'>
          <input
            value={form.allowedPostalPrefixes ?? "34"}
            onChange={(e) => set("allowedPostalPrefixes", e.target.value)}
            className="luxe-input"
          />
        </Field>
      </Section>

      <Section title="Branding">
        <Field label="Logo-URL">
          <input
            value={form.logoUrl ?? ""}
            onChange={(e) => set("logoUrl", e.target.value)}
            placeholder="https://..."
            className="luxe-input"
          />
        </Field>
        <Field label="Hero-Bild-URL">
          <input
            value={form.heroImageUrl ?? ""}
            onChange={(e) => set("heroImageUrl", e.target.value)}
            placeholder="https://..."
            className="luxe-input"
          />
        </Field>
      </Section>

      <button
        onClick={submit}
        disabled={update.isPending}
        className="bordeaux-btn w-full disabled:opacity-50"
      >
        {update.isPending ? "Speichere…" : "Alle Änderungen speichern"}
      </button>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-bg-elevated border border-border-subtle rounded-md p-4 space-y-3">
      <h2 className="luxe-label">{title}</h2>
      {children}
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 min-w-0">
      <label className="block luxe-label mb-1.5">{label}</label>
      {children}
    </div>
  );
}
