"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Minus, Plus, X } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useAuthStore } from "@/store/auth";
import { useUIStore } from "@/store/ui";
import { useCreateOrder } from "@/hooks/queries";
import { formatPrice, cn } from "@/lib/utils";
import EmptyState from "@/components/EmptyState";

const TIP_PRESETS = [0, 10, 15, 20] as const;

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const subtotal = useCartStore((s) => s.totalPrice());
  const clear = useCartStore((s) => s.clear);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const showToast = useUIStore((s) => s.showToast);
  const createOrder = useCreateOrder();
  const [orderType, setOrderType] = useState<"PICKUP" | "DELIVERY">("PICKUP");
  const [success, setSuccess] = useState(false);
  const [tipPercent, setTipPercent] = useState<number | "custom">(0);
  const [customTip, setCustomTip] = useState<string>("");

  const tipAmount =
    tipPercent === "custom"
      ? Math.max(0, Math.min(parseFloat(customTip.replace(",", ".")) || 0, 1000))
      : (subtotal * tipPercent) / 100;
  const grandTotal = subtotal + tipAmount;

  const submit = async () => {
    if (!isAuthenticated) {
      showToast("Bitte melden Sie sich an", "info");
      router.push("/login");
      return;
    }
    if (items.length === 0) return;
    try {
      await createOrder.mutateAsync({
        orderType,
        tipAmount: Number(tipAmount.toFixed(2)),
        items: items.map((i) => ({
          productId: i.product.id,
          quantity: i.quantity,
          notes: i.notes,
        })),
      });
      setSuccess(true);
      showToast("Vielen Dank für Ihre Bestellung", "success");
      setTimeout(() => {
        clear();
        router.push("/profil/bestellungen");
      }, 1800);
    } catch {
      showToast("Bestellung fehlgeschlagen", "error");
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      <header className="sticky top-0 z-30 bg-bg-primary/95 backdrop-blur-md border-b border-border-subtle px-6 py-4 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          aria-label="Zurück"
          className="h-9 w-9 -ml-2 rounded-full flex items-center justify-center text-text-cream hover:text-bordeaux transition-colors press"
        >
          <ArrowLeft className="h-5 w-5" strokeWidth={1.5} />
        </button>
        <h1 className="font-serif text-xl text-text-cream tracking-wide">Ihre Bestellung</h1>
      </header>

      {items.length === 0 ? (
        <EmptyState
          title="Noch nichts ausgewählt"
          message="Suchen Sie aus unserer Karte, was Sie heute begleiten darf."
          actionLabel="Zur Karte"
          actionHref="/bestellen"
        />
      ) : (
        <>
          <div className="px-7 mt-7">
            {items.map((i) => (
              <div
                key={i.product.id}
                className="py-5 border-b border-border-subtle flex gap-4 items-start"
              >
                <div className="relative h-16 w-16 shrink-0 rounded-md overflow-hidden bg-bg-deep">
                  {i.product.image && (
                    <Image
                      src={i.product.image}
                      alt={i.product.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-serif text-lg text-text-cream truncate leading-tight">
                        {i.product.name}
                      </h3>
                      <p className="font-sans text-sm text-bordeaux mt-1 tabular-nums font-semibold">
                        {formatPrice(i.product.price * i.quantity)}
                      </p>
                      {i.notes && (
                        <p className="mt-1 text-[11px] italic font-serif text-text-muted">
                          „{i.notes}“
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        removeItem(i.product.id);
                        showToast("Entfernt", "info");
                      }}
                      aria-label="Entfernen"
                      className="text-text-faint hover:text-bordeaux transition-colors press p-1"
                    >
                      <X className="h-4 w-4" strokeWidth={1.4} />
                    </button>
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    <button
                      onClick={() =>
                        updateQuantity(i.product.id, i.quantity - 1)
                      }
                      aria-label="Weniger"
                      className="h-7 w-7 rounded-full border border-bordeaux/50 text-bordeaux flex items-center justify-center hover:bg-bordeaux hover:text-bg-primary transition-colors press"
                    >
                      <Minus className="h-3 w-3" strokeWidth={1.6} />
                    </button>
                    <span className="font-serif text-text-cream w-5 text-center tabular-nums">
                      {i.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(i.product.id, i.quantity + 1)
                      }
                      aria-label="Mehr"
                      className="h-7 w-7 rounded-full border border-bordeaux/50 text-bordeaux flex items-center justify-center hover:bg-bordeaux hover:text-bg-primary transition-colors press"
                    >
                      <Plus className="h-3 w-3" strokeWidth={1.6} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="px-7 mt-10">
            <p className="luxe-label">Modus</p>
            <div className="mt-3 flex gap-6">
              {(
                [
                  { id: "PICKUP", label: "Abholung" },
                  { id: "DELIVERY", label: "Lieferung" },
                ] as const
              ).map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setOrderType(id)}
                  className={cn(
                    "text-[11px] uppercase tracking-[0.22em] pb-1 border-b transition-colors",
                    orderType === id
                      ? "text-bordeaux border-bordeaux"
                      : "text-text-faint border-transparent hover:text-text-muted"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Trinkgeld */}
          <div className="px-7 mt-10">
            <p className="luxe-label">Trinkgeld</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {TIP_PRESETS.map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    setTipPercent(p);
                    setCustomTip("");
                  }}
                  className={cn(
                    "px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] font-semibold rounded-sm border transition-colors press",
                    tipPercent === p
                      ? "bg-bordeaux text-bg-primary border-bordeaux"
                      : "bg-bg-elevated text-text-cream border-border-subtle hover:border-bordeaux/50"
                  )}
                >
                  {p === 0 ? "Kein" : `${p} %`}
                </button>
              ))}
              <button
                onClick={() => setTipPercent("custom")}
                className={cn(
                  "px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] font-semibold rounded-sm border transition-colors press",
                  tipPercent === "custom"
                    ? "bg-bordeaux text-bg-primary border-bordeaux"
                    : "bg-bg-elevated text-text-cream border-border-subtle hover:border-bordeaux/50"
                )}
              >
                Eigener Betrag
              </button>
            </div>
            {tipPercent === "custom" && (
              <div className="mt-3 relative max-w-[180px]">
                <input
                  type="number"
                  inputMode="decimal"
                  min="0"
                  max="1000"
                  step="0.5"
                  value={customTip}
                  onChange={(e) => setCustomTip(e.target.value)}
                  placeholder="0,00"
                  className="luxe-input pr-10"
                  autoFocus
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-faint text-sm">
                  €
                </span>
              </div>
            )}
          </div>

          <div className="px-7 mt-10 mb-12">
            <div className="hairline-gold mb-5" />
            <div className="space-y-2">
              <div className="flex items-baseline justify-between text-sm">
                <span className="text-text-muted">Zwischensumme</span>
                <span className="font-sans text-text-cream tabular-nums">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <div className="flex items-baseline justify-between text-sm">
                <span className="text-text-muted">Trinkgeld</span>
                <span className="font-sans text-text-cream tabular-nums">
                  {formatPrice(tipAmount)}
                </span>
              </div>
              <div className="flex items-baseline justify-between pt-3 border-t border-border-subtle">
                <span className="luxe-label">Gesamt</span>
                <span className="font-serif text-3xl text-bordeaux tabular-nums font-semibold">
                  {formatPrice(grandTotal)}
                </span>
              </div>
            </div>

            <button
              onClick={submit}
              disabled={createOrder.isPending || success}
              className="bordeaux-btn mt-10 w-full disabled:opacity-50"
            >
              {success
                ? "Vielen Dank ✦"
                : createOrder.isPending
                  ? "Sende…"
                  : isAuthenticated
                    ? "Jetzt bestellen"
                    : "Anmelden & bestellen"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
