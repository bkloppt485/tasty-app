"use client";

import { useState } from "react";
import Image from "next/image";
import {
  useAdminProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  type ProductInput,
} from "@/hooks/admin";
import { useUIStore } from "@/store/ui";
import AdminGuard from "@/components/AdminGuard";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import type { Product } from "@/types";
import { formatPrice } from "@/lib/utils";

const empty: ProductInput = {
  name: "",
  description: "",
  price: 0,
  category: "",
  image: "",
  allergens: "",
  ingredients: "",
  active: true,
};

export default function AdminProductsPage() {
  return (
    <AdminGuard title="Speisekarte">
      <ProductsList />
    </AdminGuard>
  );
}

function ProductsList() {
  const { data: products, isLoading } = useAdminProducts();
  const createP = useCreateProduct();
  const updateP = useUpdateProduct();
  const deleteP = useDeleteProduct();
  const showToast = useUIStore((s) => s.showToast);
  const [editing, setEditing] = useState<Product | "new" | null>(null);

  const grouped = (products ?? []).reduce<Record<string, Product[]>>((acc, p) => {
    (acc[p.category] ??= []).push(p);
    return acc;
  }, {});

  const onSave = async (data: ProductInput, id?: string) => {
    try {
      if (id) {
        await updateP.mutateAsync({ id, data });
        showToast("Produkt aktualisiert", "success");
      } else {
        await createP.mutateAsync(data);
        showToast("Produkt angelegt", "success");
      }
      setEditing(null);
    } catch {
      showToast("Speichern fehlgeschlagen", "error");
    }
  };

  const onToggleActive = async (p: Product) => {
    try {
      await updateP.mutateAsync({ id: p.id, data: { active: !p.active } });
    } catch {
      showToast("Update fehlgeschlagen", "error");
    }
  };

  const onDelete = async (p: Product) => {
    if (!confirm(`„${p.name}" wirklich löschen?`)) return;
    try {
      await deleteP.mutateAsync(p.id);
      showToast("Produkt gelöscht", "info");
    } catch {
      showToast("Löschen fehlgeschlagen", "error");
    }
  };

  if (isLoading) {
    return <p className="text-center text-text-muted py-12">Lade…</p>;
  }

  return (
    <>
      <button
        onClick={() => setEditing("new")}
        className="bordeaux-btn w-full mb-6 inline-flex items-center justify-center gap-2"
      >
        <Plus className="h-4 w-4" /> Neues Produkt
      </button>

      {Object.entries(grouped)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([cat, list]) => (
          <section key={cat} className="mb-8">
            <h2 className="luxe-label mb-3">{cat}</h2>
            <div className="space-y-2">
              {list.map((p) => (
                <div
                  key={p.id}
                  className="flex gap-3 items-center bg-bg-elevated border border-border-subtle rounded-md p-3"
                >
                  <div className="relative h-12 w-12 shrink-0 rounded-md overflow-hidden bg-bg-deep">
                    {p.image && (
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`font-serif text-sm truncate ${
                        p.active ? "text-text-cream" : "text-text-faint line-through"
                      }`}
                    >
                      {p.name}
                    </p>
                    <p className="text-xs text-bordeaux tabular-nums font-semibold">
                      {formatPrice(p.price)}
                    </p>
                  </div>
                  <button
                    onClick={() => onToggleActive(p)}
                    aria-label={p.active ? "Deaktivieren" : "Aktivieren"}
                    className="h-8 w-8 rounded-full text-text-muted hover:text-bordeaux flex items-center justify-center press"
                  >
                    {p.active ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    onClick={() => setEditing(p)}
                    aria-label="Bearbeiten"
                    className="h-8 w-8 rounded-full text-text-muted hover:text-bordeaux flex items-center justify-center press"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(p)}
                    aria-label="Löschen"
                    className="h-8 w-8 rounded-full text-text-muted hover:text-bordeaux flex items-center justify-center press"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </section>
        ))}

      {editing && (
        <ProductDialog
          initial={editing === "new" ? empty : editing}
          onSave={(d) =>
            onSave(d, editing === "new" ? undefined : editing.id)
          }
          onClose={() => setEditing(null)}
          saving={createP.isPending || updateP.isPending}
        />
      )}
    </>
  );
}

function ProductDialog({
  initial,
  onSave,
  onClose,
  saving,
}: {
  initial: Product | ProductInput;
  onSave: (data: ProductInput) => void;
  onClose: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState<ProductInput>({
    name: initial.name ?? "",
    description: initial.description ?? "",
    price: initial.price ?? 0,
    category: initial.category ?? "",
    image: initial.image ?? "",
    allergens: (initial as Product).allergens ?? "",
    ingredients: (initial as Product).ingredients ?? "",
    active: (initial as Product).active ?? true,
  });

  const set = <K extends keyof ProductInput>(k: K, v: ProductInput[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-bg-primary border border-border-subtle rounded-lg p-5 space-y-3">
        <h2 className="font-serif text-xl text-text-cream">
          {(initial as Product).id ? "Produkt bearbeiten" : "Neues Produkt"}
        </h2>
        <Field label="Name">
          <input
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            className="luxe-input"
            maxLength={120}
          />
        </Field>
        <Field label="Kategorie">
          <input
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
            placeholder="z.B. Pizza, Pasta, Döner"
            className="luxe-input"
            maxLength={60}
          />
        </Field>
        <Field label="Preis (€)">
          <input
            type="number"
            step="0.10"
            min="0"
            value={form.price}
            onChange={(e) => set("price", parseFloat(e.target.value) || 0)}
            className="luxe-input"
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
        <Field label="Bild-URL">
          <input
            value={form.image ?? ""}
            onChange={(e) => set("image", e.target.value)}
            placeholder="https://..."
            className="luxe-input"
          />
        </Field>
        <Field label="Allergene (Komma-getrennt)">
          <input
            value={form.allergens ?? ""}
            onChange={(e) => set("allergens", e.target.value)}
            placeholder="Gluten, Laktose, Nüsse"
            className="luxe-input"
            maxLength={500}
          />
        </Field>
        <Field label="Zutaten">
          <textarea
            value={form.ingredients ?? ""}
            onChange={(e) => set("ingredients", e.target.value)}
            rows={2}
            className="luxe-input resize-none"
            maxLength={2000}
          />
        </Field>
        <label className="flex items-center gap-2 text-sm text-text-cream">
          <input
            type="checkbox"
            checked={form.active ?? true}
            onChange={(e) => set("active", e.target.checked)}
            className="h-4 w-4"
          />
          Aktiv (sichtbar in der Karte)
        </label>
        <div className="flex gap-3 pt-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-sm border border-border-subtle text-text-muted rounded-md press"
          >
            Abbrechen
          </button>
          <button
            onClick={() => onSave(form)}
            disabled={saving || !form.name || !form.category || form.price <= 0}
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
    <div>
      <label className="block luxe-label mb-1.5">{label}</label>
      {children}
    </div>
  );
}
