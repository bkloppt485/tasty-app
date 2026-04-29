"use client";

import Image from "next/image";
import SubPageHeader from "@/components/SubPageHeader";
import { ProductCardSkeleton } from "@/components/Skeleton";
import { useProducts } from "@/hooks/queries";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

const CATEGORY_ORDER = ["Döner", "Italienisch", "Getränke", "Desserts"];

export default function ProdukteSubPage() {
  const { data: products = [], isLoading } = useProducts();

  const grouped = CATEGORY_ORDER.map((cat) => ({
    cat,
    items: products.filter((p) => p.category === cat),
  })).filter((g) => g.items.length > 0);

  return (
    <div>
      <SubPageHeader title="Unsere Produkte" />

      <div className="px-7 pt-6 pb-12">
        <p className="font-serif italic text-text-muted text-sm">
          Unsere komplette Speisekarte auf einen Blick.
        </p>

        {isLoading && (
          <div className="mt-6">
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
          </div>
        )}

        {!isLoading &&
          grouped.map((g) => (
            <section key={g.cat} className="mt-10">
              <p className="text-[10px] uppercase tracking-[0.3em] text-accent-gold-soft mb-4">
                {g.cat}
              </p>
              <ul>
                {g.items.map((p: Product) => (
                  <li
                    key={p.id}
                    className="flex gap-4 items-start py-4 border-b border-border-subtle"
                  >
                    {p.image && (
                      <div className="relative h-14 w-14 shrink-0 rounded-md overflow-hidden bg-bg-deep">
                        <Image
                          src={p.image}
                          alt={p.name}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline">
                        <h3 className="font-serif text-base text-text-cream leading-tight">
                          {p.name}
                        </h3>
                        <span className="menu-divider" aria-hidden />
                        <span className="font-sans text-sm text-accent-gold-soft tabular-nums">
                          {formatPrice(p.price)}
                        </span>
                      </div>
                      {p.description && (
                        <p className="font-serif italic text-[0.85rem] text-text-muted mt-1 leading-snug">
                          {p.description}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
      </div>
    </div>
  );
}
