"use client";

import { useState } from "react";
import {
  useAdminCoupons,
  useCreateCoupon,
  useUpdateCoupon,
  useDeleteCoupon,
  type CouponInput,
} from "@/hooks/admin";
import { useUIStore } from "@/store/ui";
import AdminGuard from "@/components/AdminGuard";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { Coupon } from "@/types";

const todayPlus30 = () => {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d.toISOString().slice(0, 10);
};

const empty: CouponInput = {
  code: "",
  title: "",
  subtitle: "",
  imageUrl: "",
  discountText: "",
  discountType: "PERCENT",
  discountValue: 10,
  minOrderValue: null,
  validUntil: todayPlus30(),
  usageLimit: null,
  isPersonalized: true,
};

export default function AdminCouponsPage() {
  return (
    <AdminGuard title="Angebote">
      <CouponsList />
    </AdminGuard>
  );
}

function CouponsList() {
  const { data: coupons, isLoading } = useAdminCoupons();
  const createC = useCreateCoupon();
  const updateC = useUpdateCoupon();
  const deleteC = useDeleteCoupon();
  const showToast = useUIStore((s) => s.showToast);
  const [editing, setEditing] = useState<Coupon | "new" | null>(null);

  const onSave = async (data: CouponInput, id?: string) => {
    try {
      if (id) {
        await updateC.mutateAsync({ id, data });
        showToast("Angebot aktualisiert", "success");
      } else {
        await createC.mutateAsync(data);
        showToast("Angebot angelegt", "success");
      }
      setEditing(null);
    } catch (e: unknown) {
      const err = e as { response?: { data?: { error?: string } } };
      showToast(
        err?.response?.data?.error ?? "Speichern fehlgeschlagen",
        "error"
      );
    }
  };

  const onDelete = async (c: Coupon) => {
    if (!confirm(`„${c.title}" wirklich löschen?`)) return;
    try {
      await deleteC.mutateAsync(c.id);
      showToast("Gelöscht", "info");
    } catch {
      showToast("Löschen fehlgeschlagen", "error");
    }
  };

  if (isLoading) return <p className="text-center text-text-muted py-12">Lade…</p>;

  return (
    <>
      <button
        onClick={() => setEditing("new")}
        className="bordeaux-btn w-full mb-6 inline-flex items-center justify-center gap-2"
      >
        <Plus className="h-4 w-4" /> Neues Angebot
      </button>

      <div className="space-y-2">
        {(coupons ?? []).map((c) => {
          const expired = new Date(c.validUntil) < new Date();
          return (
            <div
              key={c.id}
              className="bg-bg-elevated border border-border-subtle rounded-md p-3"
            >
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <p
                    className={`font-serif text-sm truncate ${
                      expired ? "text-text-faint line-through" : "text-text-cream"
                    }`}
                  >
                    {c.title}
                  </p>
                  <p className="text-xs text-text-muted truncate">{c.subtitle}</p>
                  <div className="flex flex-wrap gap-2 mt-1.5 text-[10px] uppercase tracking-[0.18em]">
                    <span className="text-bordeaux">{c.code}</span>
                    <span className="text-gold">{c.discountText}</span>
                    <span className="text-text-faint">
                      bis {new Date(c.validUntil).toLocaleDateString("de-DE")}
                    </span>
                    <span className="text-text-faint">
                      {c.usedCount}/{c.usageLimit ?? "∞"} eingelöst
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setEditing(c)}
                  aria-label="Bearbeiten"
                  className="h-8 w-8 rounded-full text-text-muted hover:text-bordeaux flex items-center justify-center press"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDelete(c)}
                  aria-label="Löschen"
                  className="h-8 w-8 rounded-full text-text-muted hover:text-bordeaux flex items-center justify-center press"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {editing && (
        <CouponDialog
          initial={editing === "new" ? empty : couponToInput(editing)}
          onSave={(d) =>
            onSave(d, editing === "new" ? undefined : editing.id)
          }
          onClose={() => setEditing(null)}
          saving={createC.isPending || updateC.isPending}
        />
      )}
    </>
  );
}

function couponToInput(c: Coupon): CouponInput {
  return {
    code: c.code,
    title: c.title,
    subtitle: c.subtitle,
    imageUrl: c.imageUrl ?? "",
    discountText: c.discountText,
    discountType: c.discountType,
    discountValue: c.discountValue,
    minOrderValue: c.minOrderValue ?? null,
    validUntil: new Date(c.validUntil).toISOString().slice(0, 10),
    usageLimit: c.usageLimit ?? null,
    isPersonalized: c.isPersonalized,
  };
}

function CouponDialog({
  initial,
  onSave,
  onClose,
  saving,
}: {
  initial: CouponInput;
  onSave: (data: CouponInput) => void;
  onClose: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState<CouponInput>(initial);
  const set = <K extends keyof CouponInput>(k: K, v: CouponInput[K]) =>
    setForm((f) => ({ ...f, [k]: v }));
  const isEdit = initial !== empty;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-bg-primary border border-border-subtle rounded-lg p-5 space-y-3">
        <h2 className="font-serif text-xl text-text-cream">
          {isEdit ? "Angebot bearbeiten" : "Neues Angebot"}
        </h2>

        <Field label="Code (z.B. PIZZA10)">
          <input
            value={form.code}
            onChange={(e) => set("code", e.target.value.toUpperCase())}
            className="luxe-input"
            maxLength={60}
          />
        </Field>
        <Field label="Titel">
          <input
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            className="luxe-input"
            maxLength={120}
          />
        </Field>
        <Field label="Untertitel">
          <input
            value={form.subtitle}
            onChange={(e) => set("subtitle", e.target.value)}
            className="luxe-input"
            maxLength={200}
          />
        </Field>
        <Field label="Rabatt-Text (Anzeige, z.B. -20% oder 5,00 €)">
          <input
            value={form.discountText}
            onChange={(e) => set("discountText", e.target.value)}
            className="luxe-input"
            maxLength={40}
          />
        </Field>
        <div className="flex gap-3">
          <Field label="Typ">
            <select
              value={form.discountType}
              onChange={(e) =>
                set("discountType", e.target.value as "PERCENT" | "FIXED")
              }
              className="luxe-input"
            >
              <option value="PERCENT">Prozent</option>
              <option value="FIXED">Fest (€)</option>
            </select>
          </Field>
          <Field label="Wert">
            <input
              type="number"
              step="0.5"
              min="0"
              value={form.discountValue}
              onChange={(e) =>
                set("discountValue", parseFloat(e.target.value) || 0)
              }
              className="luxe-input"
            />
          </Field>
        </div>
        <Field label="Mindestbestellwert (€, optional)">
          <input
            type="number"
            step="0.5"
            min="0"
            value={form.minOrderValue ?? ""}
            onChange={(e) =>
              set(
                "minOrderValue",
                e.target.value === "" ? null : parseFloat(e.target.value)
              )
            }
            className="luxe-input"
          />
        </Field>
        <Field label="Gültig bis">
          <input
            type="date"
            value={form.validUntil}
            onChange={(e) => set("validUntil", e.target.value)}
            className="luxe-input"
          />
        </Field>
        <Field label="Nutzungs-Limit gesamt (optional)">
          <input
            type="number"
            min="1"
            value={form.usageLimit ?? ""}
            onChange={(e) =>
              set(
                "usageLimit",
                e.target.value === "" ? null : parseInt(e.target.value, 10)
              )
            }
            className="luxe-input"
          />
        </Field>
        <Field label="Bild-URL (optional)">
          <input
            value={form.imageUrl ?? ""}
            onChange={(e) => set("imageUrl", e.target.value)}
            placeholder="https://..."
            className="luxe-input"
          />
        </Field>

        <div className="flex gap-3 pt-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-sm border border-border-subtle text-text-muted rounded-md press"
          >
            Abbrechen
          </button>
          <button
            onClick={() => onSave(form)}
            disabled={
              saving ||
              !form.code ||
              !form.title ||
              !form.subtitle ||
              !form.discountText
            }
            className="bordeaux-btn flex-1 disabled:opacity-50"
          >
            {saving ? "Speichere…" : "Speichern"}
          </button>
        </div>
      </div>
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
