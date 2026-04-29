"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Minus, Plus, X, MessageSquare } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/store/cart";
import { useUIStore } from "@/store/ui";
import { formatPrice } from "@/lib/utils";
import EmptyState from "@/components/EmptyState";

export default function CartPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const setNotes = useCartStore((s) => s.setNotes);
  const totalPrice = useCartStore((s) => s.totalPrice());
  const totalCount = useCartStore((s) => s.totalCount());
  const showToast = useUIStore((s) => s.showToast);
  const [openNotes, setOpenNotes] = useState<Record<string, boolean>>({});

  const toggleNotes = (id: string) =>
    setOpenNotes((prev) => ({ ...prev, [id]: !prev[id] }));

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
        <h1 className="font-serif text-xl text-text-cream tracking-wide">
          Warenkorb
        </h1>
        {totalCount > 0 && (
          <span className="ml-auto text-[10px] uppercase tracking-[0.22em] text-text-faint">
            {totalCount} {totalCount === 1 ? "Artikel" : "Artikel"}
          </span>
        )}
      </header>

      {items.length === 0 ? (
        <EmptyState
          title="Ihr Warenkorb ist leer"
          message="Stöbern Sie in unserer Karte und entdecken Sie Lieblingsgerichte."
          actionLabel="Zur Karte"
          actionHref="/bestellen"
        />
      ) : (
        <>
          <div className="px-7 mt-4">
            {items.map((i) => (
              <div
                key={i.product.id}
                className="py-5 border-b border-border-subtle"
              >
                <div className="flex gap-4 items-start">
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
                      <button
                        onClick={() => toggleNotes(i.product.id)}
                        className="ml-auto inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-text-faint hover:text-bordeaux transition-colors press"
                      >
                        <MessageSquare className="h-3 w-3" strokeWidth={1.6} />
                        {i.notes ? "Notiz bearbeiten" : "Notiz hinzufügen"}
                      </button>
                    </div>

                    {(openNotes[i.product.id] || i.notes) && (
                      <textarea
                        value={i.notes ?? ""}
                        onChange={(e) =>
                          setNotes(i.product.id, e.target.value)
                        }
                        placeholder="z.B. ohne Zwiebeln, scharf, ..."
                        rows={2}
                        className="luxe-input mt-3 text-sm resize-none"
                        maxLength={300}
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="px-7 mt-8 mb-32">
            <div className="hairline-gold mb-5" />
            <div className="flex items-baseline justify-between">
              <span className="luxe-label">Zwischensumme</span>
              <span className="font-serif text-2xl text-bordeaux tabular-nums font-semibold">
                {formatPrice(totalPrice)}
              </span>
            </div>
            <p className="mt-2 text-[10px] uppercase tracking-[0.22em] text-text-faint">
              Trinkgeld &amp; Gesamt im nächsten Schritt
            </p>

            <Link
              href="/checkout"
              className="bordeaux-btn mt-8 w-full inline-flex justify-center"
            >
              Zur Kasse →
            </Link>

            <Link
              href="/bestellen"
              className="gold-underline-btn mt-6 inline-block"
            >
              Weiter stöbern
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
