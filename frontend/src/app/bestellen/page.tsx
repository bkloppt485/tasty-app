"use client";

import { useMemo, useState } from "react";
import { Search, X, Tag } from "lucide-react";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import EmptyState from "@/components/EmptyState";
import { ProductCardSkeleton } from "@/components/Skeleton";
import { useProducts, useCoupons } from "@/hooks/queries";
import { cn } from "@/lib/utils";

const FILTERS = ["Alle", "Döner", "Italienisch", "Getränke", "Desserts"] as const;
type Filter = (typeof FILTERS)[number];

export default function BestellenPage() {
  const { data: products = [], isLoading } = useProducts();
  const { data: coupons = [] } = useCoupons();
  const [filter, setFilter] = useState<Filter>("Alle");
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  const activeOffers = coupons.filter((c) => c.redeemedByMe).length;

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchFilter = filter === "Alle" || p.category === filter;
      const matchSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.description ?? "").toLowerCase().includes(search.toLowerCase());
      return matchFilter && matchSearch;
    });
  }, [products, filter, search]);

  return (
    <div>
      <Header title="La Carta" />

      <section className="px-7 mt-6">
        <p className="font-serif italic text-text-muted text-sm">
          Unsere Speisekarte
        </p>
        <h1 className="font-serif text-3xl text-text-cream mt-1">Karte</h1>
      </section>

      {activeOffers > 0 && (
        <div className="px-7 mt-5">
          <div className="flex items-center gap-3 px-4 py-3 bg-bordeaux text-bg-primary rounded-sm shadow-sm">
            <Tag className="h-4 w-4 shrink-0" strokeWidth={1.8} />
            <p className="text-[11px] uppercase tracking-[0.18em] font-semibold flex-1">
              {activeOffers} {activeOffers === 1 ? "Angebot" : "Angebote"} aktiv
            </p>
            <span className="text-[10px] tracking-[0.18em] uppercase opacity-80">
              werden beim Checkout angewendet
            </span>
          </div>
        </div>
      )}

      {/* Categories */}
      <div className="mt-6 px-7 flex items-center gap-5 overflow-x-auto no-scrollbar pb-3 border-b border-border-subtle">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "shrink-0 text-[10px] uppercase tracking-[0.22em] transition-colors duration-300 pb-1 border-b",
              filter === f
                ? "text-bordeaux border-bordeaux"
                : "text-text-faint border-transparent hover:text-text-muted"
            )}
          >
            {f}
          </button>
        ))}
        <button
          onClick={() => setSearchOpen((v) => !v)}
          className="ml-auto shrink-0 text-text-faint hover:text-bordeaux transition-colors press"
          aria-label="Suchen"
        >
          {searchOpen ? (
            <X className="h-4 w-4" strokeWidth={1.4} />
          ) : (
            <Search className="h-4 w-4" strokeWidth={1.4} />
          )}
        </button>
      </div>

      {searchOpen && (
        <div className="px-7 mt-4 animate-fade-in">
          <input
            type="text"
            value={search}
            autoFocus
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Suchen…"
            className="luxe-input"
          />
        </div>
      )}

      <div className="mt-6 px-7">
        {isLoading &&
          [0, 1, 2, 3].map((i) => <ProductCardSkeleton key={i} />)}
        {!isLoading && filtered.length === 0 && (
          <EmptyState
            title="Nichts gefunden"
            message="Probieren Sie eine andere Kategorie oder einen anderen Suchbegriff."
          />
        )}
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
