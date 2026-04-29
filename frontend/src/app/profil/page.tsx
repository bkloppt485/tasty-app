"use client";

import Link from "next/link";
import {
  User,
  ClipboardList,
  CalendarDays,
  CalendarPlus,
  MapPin,
  UtensilsCrossed,
  Mail,
  FileText,
  ScrollText,
  Shield,
  ChevronRight,
  LayoutDashboard,
} from "lucide-react";
import Header from "@/components/Header";
import { useAuthStore } from "@/store/auth";
import { useUIStore } from "@/store/ui";

const MENU = [
  { href: "/profil/mein-profil", label: "Mein Profil", icon: User },
  { href: "/profil/bestellungen", label: "Vorherige Bestellungen", icon: ClipboardList },
  { href: "/profil/reservierungen", label: "Reservierungen", icon: CalendarDays },
  { href: "/profil/restaurant", label: "Restaurant", icon: MapPin },
  { href: "/profil/produkte", label: "Unsere Produkte", icon: UtensilsCrossed },
  { href: "/profil/kontakt", label: "Kontakt", icon: Mail },
  { href: "/profil/impressum", label: "Impressum", icon: FileText },
  { href: "/profil/agb", label: "AGB", icon: ScrollText },
  { href: "/profil/datenschutz", label: "Datenschutz", icon: Shield },
] as const;

export default function ProfilPage() {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const logout = useAuthStore((s) => s.logout);
  const showToast = useUIStore((s) => s.showToast);
  const openLoginModal = useUIStore((s) => s.openLoginModal);

  const initial = user?.name.charAt(0).toUpperCase() ?? "G";

  return (
    <div>
      <Header title="Profil" />

      {/* Avatar + Name */}
      <section className="px-7 mt-8 flex items-center gap-5">
        <div className="h-16 w-16 rounded-full bg-bg-elevated border border-accent-gold/60 flex items-center justify-center font-serif text-2xl text-accent-gold-soft shadow-soft">
          {initial}
        </div>
        <div className="min-w-0 flex-1">
          {isAuthenticated ? (
            <>
              <h1 className="font-serif text-2xl text-text-cream truncate leading-tight">
                {user?.name}
              </h1>
              <p className="text-[11px] uppercase tracking-[0.22em] text-text-faint mt-1.5">
                Mitglied seit März 2024
              </p>
            </>
          ) : (
            <>
              <h1 className="font-serif text-2xl text-text-cream truncate leading-tight">
                Salve, Gast
              </h1>
              <button
                onClick={openLoginModal}
                className="text-[11px] uppercase tracking-[0.22em] text-accent-gold-soft mt-1.5 hover:text-bordeaux transition-colors press"
              >
                Anmelden →
              </button>
            </>
          )}
        </div>
      </section>

      <div className="hairline-gold mx-7 mt-8" />

      {/* Quick action — neue Reservierung */}
      <div className="px-7 mt-6">
        <Link
          href="/reservieren"
          className="flex items-center gap-3 px-4 py-3 bg-bordeaux text-bg-primary rounded-sm shadow-soft press hover:bg-bordeaux-deep transition-colors"
        >
          <CalendarPlus className="h-4 w-4 shrink-0" strokeWidth={1.8} />
          <span className="flex-1 text-[11px] uppercase tracking-[0.22em] font-semibold">
            Neue Reservierung
          </span>
          <ChevronRight className="h-4 w-4 opacity-70" strokeWidth={1.8} />
        </Link>
      </div>

      {/* Admin entry — only for admins */}
      {isAuthenticated && user?.role === "ADMIN" && (
        <div className="px-7 mt-6">
          <Link
            href="/admin"
            className="flex items-center gap-3 px-4 py-3 rounded-sm shadow-soft press transition-colors"
            style={{
              background: "rgba(122,30,42,0.08)",
              border: "1px solid rgba(122,30,42,0.3)",
              color: "#7A1E2A",
            }}
          >
            <LayoutDashboard className="h-4 w-4 shrink-0" strokeWidth={1.8} />
            <span className="flex-1 text-[11px] uppercase tracking-[0.22em] font-semibold">
              Admin Cockpit
            </span>
            <ChevronRight className="h-4 w-4 opacity-70" strokeWidth={1.8} />
          </Link>
        </div>
      )}

      {/* Menu list */}
      <nav className="mt-4 px-7">
        <ul>
          {MENU.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center gap-4 py-4 border-b border-border-subtle press group"
                >
                  <span className="h-9 w-9 rounded-full bg-bg-elevated border border-border-subtle flex items-center justify-center text-accent-gold-soft group-hover:border-accent-gold transition-colors">
                    <Icon className="h-4 w-4" strokeWidth={1.5} />
                  </span>
                  <span className="flex-1 font-serif text-base text-text-cream group-hover:text-bordeaux transition-colors">
                    {item.label}
                  </span>
                  <ChevronRight
                    className="h-4 w-4 text-text-faint"
                    strokeWidth={1.5}
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {isAuthenticated && (
        <div className="px-7 mt-10 mb-10">
          <button
            onClick={() => {
              logout();
              showToast("Abgemeldet", "info");
            }}
            className="text-[10px] uppercase tracking-[0.25em] text-text-faint hover:text-bordeaux transition-colors press"
          >
            Abmelden
          </button>
        </div>
      )}

      {!isAuthenticated && <div className="h-10" />}
    </div>
  );
}
