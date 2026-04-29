"use client";

import SubPageHeader from "@/components/SubPageHeader";
import OrderCard from "@/components/OrderCard";
import EmptyState from "@/components/EmptyState";
import { ProductCardSkeleton } from "@/components/Skeleton";
import { useOrders } from "@/hooks/queries";
import { useAuthStore } from "@/store/auth";

export default function BestellungenPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { data: orders = [], isLoading } = useOrders();

  return (
    <div>
      <SubPageHeader title="Bestellungen" />

      <div className="px-7 pt-8 pb-12">
        {!isAuthenticated ? (
          <p className="font-serif italic text-text-muted">
            Bitte melden Sie sich an, um Ihre Bestellhistorie zu sehen.
          </p>
        ) : isLoading ? (
          <>
            <ProductCardSkeleton />
            <ProductCardSkeleton />
          </>
        ) : orders.length === 0 ? (
          <EmptyState
            title="Noch keine Bestellungen"
            message="Ihre erste Reise beginnt in der Karte."
            actionLabel="Zur Karte"
            actionHref="/bestellen"
          />
        ) : (
          <div>
            {orders.map((o) => (
              <OrderCard key={o.id} order={o} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
