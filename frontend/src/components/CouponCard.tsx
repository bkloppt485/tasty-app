"use client";

import Image from "next/image";
import { Check, X } from "lucide-react";
import type { Coupon } from "@/types";
import { useRedeemCoupon, useUnredeemCoupon } from "@/hooks/queries";
import { useAuthStore } from "@/store/auth";
import { useUIStore } from "@/store/ui";
import { formatDate, cn } from "@/lib/utils";

export default function CouponCard({ coupon }: { coupon: Coupon }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const showToast = useUIStore((s) => s.showToast);
  const openLoginModal = useUIStore((s) => s.openLoginModal);
  const redeem = useRedeemCoupon();
  const unredeem = useUnredeemCoupon();

  const expired = new Date(coupon.validUntil).getTime() < Date.now();
  const isActive = !!coupon.redeemedByMe;
  const busy = redeem.isPending || unredeem.isPending;

  const onClick = async () => {
    if (!isAuthenticated) {
      openLoginModal();
      return;
    }
    try {
      if (isActive) {
        await unredeem.mutateAsync(coupon.id);
        showToast("Angebot entfernt", "info");
      } else {
        await redeem.mutateAsync(coupon.id);
        showToast(`${coupon.title} aktiviert`, "success");
      }
    } catch (err: any) {
      showToast(
        err?.response?.data?.error ?? "Aktion fehlgeschlagen",
        "error"
      );
    }
  };

  return (
    <article className="surface overflow-hidden">
      {coupon.imageUrl && (
        <div className="relative h-44 w-full bg-bg-deep">
          <Image
            src={coupon.imageUrl}
            alt={coupon.title}
            fill
            sizes="400px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bordeaux/70 via-bordeaux/15 to-transparent" />
          <span className="absolute top-3 right-3 inline-flex items-center px-3 py-1 bg-bordeaux text-bg-primary text-[11px] uppercase tracking-[0.18em] font-semibold rounded-sm shadow-sm">
            {coupon.discountText}
          </span>
        </div>
      )}

      <div className="p-5">
        {!coupon.imageUrl && (
          <span className="inline-flex items-center px-3 py-1 bg-bordeaux text-bg-primary text-[11px] uppercase tracking-[0.18em] font-semibold rounded-sm mb-3">
            {coupon.discountText}
          </span>
        )}
        <h3 className="font-serif text-2xl text-text-cream leading-tight">
          {coupon.title}
        </h3>
        <p className="font-serif italic text-text-muted mt-1.5 text-[0.95rem] leading-snug">
          {coupon.subtitle}
        </p>

        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="text-[10px] uppercase tracking-[0.22em] text-text-faint">
            Gültig bis {formatDate(coupon.validUntil)}
          </p>
          {expired ? (
            <span className="inline-flex items-center px-4 py-2 text-[11px] uppercase tracking-[0.18em] font-semibold rounded-sm bg-bg-deep text-text-faint border border-border-subtle">
              Abgelaufen
            </span>
          ) : (
            <button
              onClick={onClick}
              disabled={busy}
              className={cn(
                "inline-flex items-center gap-1.5 px-4 py-2 text-[11px] uppercase tracking-[0.18em] font-semibold rounded-sm transition-colors press disabled:opacity-60 disabled:cursor-not-allowed",
                isActive
                  ? "bg-bg-primary text-bordeaux border border-accent-gold hover:bg-accent-gold/10"
                  : "bg-bordeaux text-bg-primary hover:bg-bordeaux-deep"
              )}
              aria-pressed={isActive}
            >
              {isActive ? (
                <>
                  <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                  Aktiv
                  <X className="h-3 w-3 ml-1 opacity-70" strokeWidth={2.5} />
                </>
              ) : (
                "Aktivieren"
              )}
            </button>
          )}
        </div>
        {isActive && !expired && (
          <p className="mt-2 text-[10px] uppercase tracking-[0.22em] text-text-faint text-right">
            Antippen zum Entfernen
          </p>
        )}
      </div>
    </article>
  );
}

