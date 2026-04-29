"use client";

import Image from "next/image";
import { X, Plus, Minus } from "lucide-react";
import { useEffect } from "react";
import type { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { useAuthStore } from "@/store/auth";
import { useUIStore } from "@/store/ui";

export default function ProductDetailModal({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const showToast = useUIStore((s) => s.showToast);
  const openLoginModal = useUIStore((s) => s.openLoginModal);
  const openCartDrawer = useUIStore((s) => s.openCartDrawer);
  const items = useCartStore((s) => s.items);
  const addItem = useCartStore((s) => s.addItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const qty = items.find((i) => i.product.id === product.id)?.quantity ?? 0;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const allergens = (product.allergens ?? "")
    .split(",")
    .map((a) => a.trim())
    .filter(Boolean);

  const handleAdd = () => {
    if (!isAuthenticated) {
      showToast("Bitte melden Sie sich an", "info");
      openLoginModal();
      return;
    }
    addItem(product, 1);
    onClose();
    openCartDrawer();
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[440px] mx-auto bg-bg-primary rounded-t-[2rem] sm:rounded-sm overflow-hidden animate-fade-up max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Schließen"
          className="absolute top-3 right-3 z-10 h-9 w-9 rounded-full flex items-center justify-center bg-bg-primary/80 backdrop-blur-sm text-text-cream hover:text-bordeaux transition-colors press"
        >
          <X className="h-4 w-4" strokeWidth={1.6} />
        </button>

        {product.image && (
          <div className="relative h-56 w-full bg-bg-deep shrink-0">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="440px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bordeaux/30 to-transparent" />
          </div>
        )}

        <div className="px-7 pt-5 pb-7 overflow-y-auto no-scrollbar">
          <p className="text-[10px] uppercase tracking-[0.3em] text-accent-gold-soft">
            {product.category}
          </p>
          <div className="mt-2 flex items-baseline justify-between gap-3">
            <h2 className="font-serif text-2xl text-text-cream leading-tight">
              {product.name}
            </h2>
            <span className="font-sans text-lg text-bordeaux tabular-nums font-semibold shrink-0">
              {formatPrice(product.price)}
            </span>
          </div>

          {product.description && (
            <p className="font-serif italic text-text-muted mt-3 text-[0.95rem] leading-relaxed">
              {product.description}
            </p>
          )}

          {product.ingredients && (
            <div className="mt-6">
              <p className="luxe-label">Inhaltsstoffe</p>
              <p className="mt-2 text-[13px] text-text-cream leading-relaxed">
                {product.ingredients}
              </p>
            </div>
          )}

          {allergens.length > 0 && (
            <div className="mt-6">
              <p className="luxe-label">Allergene</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {allergens.map((a) => (
                  <span
                    key={a}
                    className="inline-flex items-center px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] font-semibold rounded-sm bg-bg-deep text-text-muted border border-border-subtle"
                  >
                    {a}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 flex items-center gap-4">
            {qty === 0 ? (
              <button onClick={handleAdd} className="bordeaux-btn flex-1">
                + In den Warenkorb
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => updateQuantity(product.id, qty - 1)}
                  aria-label="Weniger"
                  className="h-9 w-9 rounded-full border border-bordeaux/50 text-bordeaux flex items-center justify-center hover:bg-bordeaux hover:text-bg-primary transition-colors press"
                >
                  <Minus className="h-4 w-4" strokeWidth={1.6} />
                </button>
                <span className="font-serif text-lg w-6 text-center text-text-cream tabular-nums">
                  {qty}
                </span>
                <button
                  onClick={() => updateQuantity(product.id, qty + 1)}
                  aria-label="Mehr"
                  className="h-9 w-9 rounded-full border border-bordeaux/50 text-bordeaux flex items-center justify-center hover:bg-bordeaux hover:text-bg-primary transition-colors press"
                >
                  <Plus className="h-4 w-4" strokeWidth={1.6} />
                </button>
                <span className="ml-3 text-[10px] uppercase tracking-[0.22em] text-accent-gold-soft">
                  Im Warenkorb
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
