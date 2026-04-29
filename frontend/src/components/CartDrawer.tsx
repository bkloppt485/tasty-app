"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useUIStore } from "@/store/ui";
import { formatPrice } from "@/lib/utils";

export default function CartDrawer() {
  const open = useUIStore((s) => s.cartDrawerOpen);
  const close = useUIStore((s) => s.closeCartDrawer);
  const items = useCartStore((s) => s.items);
  const totalPrice = useCartStore((s) => s.totalPrice());
  const totalCount = useCartStore((s) => s.totalCount());
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    if (open) {
      window.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={close}
        className={`fixed inset-0 z-40 bg-text-cream/30 backdrop-blur-[2px] transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!open}
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-label="Warenkorb"
        aria-hidden={!open}
        className={`fixed top-0 right-0 z-50 h-full w-[88%] max-w-[340px] bg-bg-primary shadow-2xl border-l border-border-subtle flex flex-col transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-border-subtle flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="h-4 w-4 text-bordeaux" strokeWidth={1.6} />
            <h2 className="font-serif text-lg text-text-cream">
              Warenkorb
              {totalCount > 0 && (
                <span className="ml-2 text-[11px] uppercase tracking-[0.18em] text-text-faint font-sans">
                  {totalCount} {totalCount === 1 ? "Artikel" : "Artikel"}
                </span>
              )}
            </h2>
          </div>
          <button
            onClick={close}
            aria-label="Schließen"
            className="h-8 w-8 rounded-full flex items-center justify-center text-text-muted hover:text-bordeaux hover:bg-bg-deep transition-colors press"
          >
            <X className="h-4 w-4" strokeWidth={1.6} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-8 gap-3">
              <ShoppingBag
                className="h-9 w-9 text-text-faint"
                strokeWidth={1.2}
              />
              <p className="font-serif text-base text-text-muted">
                Ihr Warenkorb ist leer
              </p>
              <p className="text-[11px] uppercase tracking-[0.18em] text-text-faint">
                Stöbern Sie in unserer Karte
              </p>
              <Link
                href="/bestellen"
                onClick={close}
                className="mt-2 text-[11px] uppercase tracking-[0.22em] text-bordeaux border-b border-bordeaux/40 pb-0.5 hover:border-bordeaux press"
              >
                Zur Karte →
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-border-subtle">
              {items.map((it) => (
                <li key={it.product.id} className="px-5 py-4 flex gap-3">
                  {it.product.image && (
                    <div className="relative h-14 w-14 shrink-0 rounded-md overflow-hidden bg-bg-deep">
                      <Image
                        src={it.product.image}
                        alt={it.product.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-serif text-[1rem] leading-tight text-text-cream truncate">
                        {it.product.name}
                      </h3>
                      <button
                        onClick={() => removeItem(it.product.id)}
                        aria-label="Entfernen"
                        className="text-text-faint hover:text-bordeaux press shrink-0"
                      >
                        <Trash2 className="h-3.5 w-3.5" strokeWidth={1.4} />
                      </button>
                    </div>
                    <p className="text-[0.85rem] text-accent-gold-soft font-semibold tabular-nums mt-0.5">
                      {formatPrice(it.product.price * it.quantity)}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateQuantity(it.product.id, it.quantity - 1)
                        }
                        aria-label="Weniger"
                        className="h-6 w-6 rounded-full border border-bordeaux/40 text-bordeaux flex items-center justify-center hover:bg-bordeaux hover:text-bg-primary transition-colors press"
                      >
                        <Minus className="h-3 w-3" strokeWidth={1.6} />
                      </button>
                      <span className="font-serif text-sm w-5 text-center text-text-cream tabular-nums">
                        {it.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(it.product.id, it.quantity + 1)
                        }
                        aria-label="Mehr"
                        className="h-6 w-6 rounded-full border border-bordeaux/40 text-bordeaux flex items-center justify-center hover:bg-bordeaux hover:text-bg-primary transition-colors press"
                      >
                        <Plus className="h-3 w-3" strokeWidth={1.6} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border-subtle px-5 py-4 space-y-3 bg-bg-elevated">
            <div className="flex items-baseline justify-between">
              <span className="text-[10px] uppercase tracking-[0.22em] text-text-faint">
                Zwischensumme
              </span>
              <span className="font-serif text-xl text-text-cream tabular-nums">
                {formatPrice(totalPrice)}
              </span>
            </div>
            <Link
              href="/cart"
              onClick={close}
              className="block w-full text-center py-3 bg-bordeaux text-bg-primary text-[11px] uppercase tracking-[0.22em] font-semibold rounded-sm hover:bg-bordeaux-deep transition-colors press"
            >
              Warenkorb ansehen
            </Link>
            <Link
              href="/checkout"
              onClick={close}
              className="block w-full text-center py-2.5 text-[11px] uppercase tracking-[0.22em] text-bordeaux border border-bordeaux/40 rounded-sm hover:border-bordeaux press"
            >
              Direkt zur Kasse →
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
