"use client";

import Image from "next/image";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { useAuthStore } from "@/store/auth";
import { useUIStore } from "@/store/ui";
import ProductDetailModal from "./ProductDetailModal";

export default function ProductCard({
  product,
  showImage = true,
}: {
  product: Product;
  showImage?: boolean;
}) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const showToast = useUIStore((s) => s.showToast);
  const openLoginModal = useUIStore((s) => s.openLoginModal);
  const openCartDrawer = useUIStore((s) => s.openCartDrawer);
  const items = useCartStore((s) => s.items);
  const addItem = useCartStore((s) => s.addItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const qty = items.find((i) => i.product.id === product.id)?.quantity ?? 0;
  const [detailOpen, setDetailOpen] = useState(false);

  const handleAdd = () => {
    if (!isAuthenticated) {
      showToast("Bitte melden Sie sich an", "info");
      openLoginModal();
      return;
    }
    addItem(product, 1);
    openCartDrawer();
  };

  const allergens = (product.allergens ?? "")
    .split(",")
    .map((a) => a.trim())
    .filter(Boolean);

  return (
    <>
      <article className="group py-5 first:pt-0 border-b border-border-subtle last:border-b-0">
        <div className="flex gap-4 items-start">
          {showImage && product.image && (
            <button
              type="button"
              onClick={() => setDetailOpen(true)}
              aria-label={`${product.name} – Details`}
              className="relative h-16 w-16 shrink-0 rounded-md overflow-hidden bg-bg-deep press hover:opacity-90 transition-opacity"
            >
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          )}
          <div className="flex-1 min-w-0">
            <button
              type="button"
              onClick={() => setDetailOpen(true)}
              className="w-full text-left press"
            >
              <div className="flex items-baseline">
                <h3 className="font-serif text-[1.35rem] leading-tight text-text-cream">
                  {product.name}
                </h3>
                <span className="menu-divider" aria-hidden />
                <span className="font-sans text-[0.95rem] text-accent-gold-soft tabular-nums font-semibold">
                  {formatPrice(product.price)}
                </span>
              </div>
              {product.description && (
                <p className="font-serif italic text-[0.9rem] text-text-muted mt-1 leading-snug max-w-[28rem]">
                  {product.description}
                </p>
              )}
            </button>

            {allergens.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {allergens.map((a) => (
                  <span
                    key={a}
                    className="inline-flex items-center px-1.5 py-0.5 text-[9px] uppercase tracking-[0.16em] font-medium rounded-sm bg-bg-deep text-text-faint border border-border-subtle"
                    title={a}
                  >
                    {a}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-3 flex items-center gap-4">
              {qty === 0 ? (
                <button
                  onClick={handleAdd}
                  className="text-[10px] uppercase tracking-[0.22em] text-bordeaux border-b border-bordeaux/40 pb-0.5 hover:border-bordeaux transition-colors press"
                >
                  + Hinzufügen
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateQuantity(product.id, qty - 1)}
                    aria-label="Weniger"
                    className="h-7 w-7 rounded-full border border-bordeaux/50 text-bordeaux flex items-center justify-center hover:bg-bordeaux hover:text-bg-primary transition-colors press"
                  >
                    <Minus className="h-3 w-3" strokeWidth={1.6} />
                  </button>
                  <span className="font-serif text-base w-5 text-center text-text-cream tabular-nums">
                    {qty}
                  </span>
                  <button
                    onClick={() => updateQuantity(product.id, qty + 1)}
                    aria-label="Mehr"
                    className="h-7 w-7 rounded-full border border-bordeaux/50 text-bordeaux flex items-center justify-center hover:bg-bordeaux hover:text-bg-primary transition-colors press"
                  >
                    <Plus className="h-3 w-3" strokeWidth={1.6} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </article>
      {detailOpen && (
        <ProductDetailModal
          product={product}
          onClose={() => setDetailOpen(false)}
        />
      )}
    </>
  );
}

