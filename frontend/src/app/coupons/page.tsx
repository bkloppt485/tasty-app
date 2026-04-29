"use client";

import Header from "@/components/Header";
import CouponCard from "@/components/CouponCard";
import LoginRequiredOverlay from "@/components/LoginRequiredOverlay";
import EmptyState from "@/components/EmptyState";
import { CouponSkeleton } from "@/components/Skeleton";
import { useCoupons } from "@/hooks/queries";
import { useAuthStore } from "@/store/auth";

export default function CouponsPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { data: coupons = [], isLoading } = useCoupons();
  const activeCount = coupons.filter((c) => c.redeemedByMe).length;

  return (
    <div>
      <Header title="Angebote" />
      {!isAuthenticated ? (
        <LoginRequiredOverlay
          title="Für unsere Stammgäste"
          message="Schalten Sie aktuelle Angebote frei und genießen Sie kleine Aufmerksamkeiten bei jedem Besuch."
        />
      ) : (
        <div className="px-7 mt-6 pb-12">
          <p className="text-[10px] uppercase tracking-[0.3em] text-accent-gold-soft">
            Per Lei
          </p>
          <h1 className="font-serif text-3xl text-text-cream mt-2">
            Aktuelle Angebote
          </h1>
          <p className="font-serif italic text-text-muted mt-3 text-sm leading-relaxed max-w-sm">
            Tippen Sie auf „Aktivieren&ldquo;, um ein Angebot für Ihre nächste
            Bestellung freizuschalten.
          </p>

          {activeCount > 0 && (
            <div className="mt-5 inline-flex items-center gap-2 px-3 py-1.5 bg-bordeaux/10 border border-bordeaux/30 rounded-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-bordeaux" />
              <span className="text-[11px] uppercase tracking-[0.2em] text-bordeaux font-semibold">
                {activeCount} {activeCount === 1 ? "Angebot" : "Angebote"} aktiv
              </span>
            </div>
          )}

          <div className="hairline-gold mt-7 mb-7" />

          <div className="space-y-6">
            {isLoading && (
              <>
                <CouponSkeleton />
                <CouponSkeleton />
              </>
            )}
            {!isLoading && coupons.length === 0 && (
              <EmptyState
                title="Bald für Sie bereit"
                message="Wir bereiten neue Angebote vor — schauen Sie bald wieder vorbei."
                actionLabel="Zur Karte"
                actionHref="/bestellen"
              />
            )}
            {coupons.map((c) => (
              <CouponCard key={c.id} coupon={c} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
