"use client";

import { usePathname } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { useCartStore } from "@/store/cart";
import { useUIStore } from "@/store/ui";
import { formatPrice } from "@/lib/utils";

const HIDDEN_PATHS = ["/cart", "/checkout", "/login", "/register"];

export default function CartFab() {
  const pathname = usePathname();
  const totalCount = useCartStore((s) => s.totalCount());
  const totalPrice = useCartStore((s) => s.totalPrice());
  const openCart = useUIStore((s) => s.openCartDrawer);
  const drawerOpen = useUIStore((s) => s.cartDrawerOpen);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;
  if (totalCount === 0) return null;
  if (drawerOpen) return null;
  if (pathname && HIDDEN_PATHS.some((p) => pathname.startsWith(p))) return null;

  return (
    <div className="fixed bottom-20 inset-x-0 z-30 px-4 pointer-events-none">
      <div className="max-w-[400px] mx-auto pointer-events-auto animate-fade-up">
        <button
          onClick={openCart}
          className="w-full flex items-center justify-between bg-bordeaux text-bg-primary px-6 py-4 rounded-sm shadow-lg press hover:bg-bordeaux-deep transition-colors"
        >
          <span className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.22em] font-semibold">
            <ShoppingBag className="h-4 w-4" strokeWidth={1.6} />
            {totalCount} {totalCount === 1 ? "Artikel" : "Artikel"} ·{" "}
            <span className="tabular-nums">{formatPrice(totalPrice)}</span>
          </span>
          <span className="text-[11px] uppercase tracking-[0.22em] font-semibold">
            Anzeigen →
          </span>
        </button>
      </div>
    </div>
  );
}
