"use client";

import Link from "next/link";
import { ShoppingBag, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useCartStore } from "@/store/cart";
import { useUIStore } from "@/store/ui";

export default function Header({ title }: { title?: string }) {
  const totalCount = useCartStore((s) => s.totalCount());
  const openCart = useUIStore((s) => s.openCartDrawer);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-30 px-6 pt-4 pb-3 bg-bg-primary/95 backdrop-blur-md border-b border-border-subtle">
      <div className="flex items-center justify-between">
        <Link href="/" className="press" aria-label="Tasty Startseite">
          {title ? (
            <span className="font-serif text-text-cream text-xl tracking-wide">
              {title}
            </span>
          ) : (
            <span className="font-script text-2xl text-accent-gold leading-none">
              Tasty
            </span>
          )}
        </Link>
        <div className="flex items-center gap-2.5">
          <button
            onClick={openCart}
            aria-label="Warenkorb öffnen"
            className="relative h-9 w-9 rounded-full border border-accent-gold/50 text-accent-gold-soft flex items-center justify-center press hover:border-bordeaux hover:text-bordeaux transition-colors bg-bg-elevated"
          >
            <ShoppingBag className="h-4 w-4" strokeWidth={1.5} />
            {mounted && totalCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-bordeaux text-bg-primary text-[10px] font-semibold flex items-center justify-center tabular-nums shadow-sm animate-fade-in">
                {totalCount > 9 ? "9+" : totalCount}
              </span>
            )}
          </button>
          <Link
            href="/profil"
            aria-label="Profil"
            className="h-9 w-9 rounded-full border border-accent-gold/50 text-accent-gold-soft flex items-center justify-center press hover:border-bordeaux hover:text-bordeaux transition-colors bg-bg-elevated"
          >
            <User className="h-4 w-4" strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </header>
  );
}

