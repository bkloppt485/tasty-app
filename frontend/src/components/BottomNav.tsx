"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, UtensilsCrossed, Gift, User } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/", label: "Start", icon: Home },
  { href: "/bestellen", label: "Karte", icon: UtensilsCrossed },
  { href: "/coupons", label: "Angebote", icon: Gift },
  { href: "/profil", label: "Profil", icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();
  const activeIndex = tabs.findIndex((t) =>
    t.href === "/" ? pathname === "/" : pathname?.startsWith(t.href)
  );

  return (
    <nav className="absolute bottom-0 inset-x-0 z-40 bg-bg-primary/95 backdrop-blur-md border-t border-border-subtle">
      <ul className="grid grid-cols-4 px-2 pt-2 pb-3">
        {tabs.map((tab, i) => {
          const active = i === activeIndex;
          const Icon = tab.icon;
          return (
            <li key={tab.href} className="flex justify-center">
              <Link
                href={tab.href}
                aria-label={tab.label}
                className="relative flex flex-col items-center gap-1.5 px-3 pt-2 pb-1 press"
              >
                <Icon
                  className={cn(
                    "h-[18px] w-[18px] transition-colors duration-300",
                    active ? "text-bordeaux" : "text-text-faint"
                  )}
                  strokeWidth={1.5}
                />
                <span
                  className={cn(
                    "text-[9px] uppercase tracking-[0.18em] transition-colors duration-300 font-medium",
                    active ? "text-bordeaux" : "text-text-faint"
                  )}
                >
                  {tab.label}
                </span>
                <span
                  className={cn(
                    "absolute -bottom-1 left-1/2 -translate-x-1/2 h-px bg-bordeaux transition-all duration-500 ease-out",
                    active ? "w-6 opacity-100" : "w-0 opacity-0"
                  )}
                  aria-hidden
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
