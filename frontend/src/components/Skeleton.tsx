"use client";

import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton rounded-sm", className)} />;
}

export function ProductCardSkeleton() {
  return (
    <div className="py-5 border-b border-border-subtle">
      <div className="flex gap-4">
        <Skeleton className="h-16 w-16 rounded-md" />
        <div className="flex-1 space-y-3 py-1">
          <Skeleton className="h-5 w-2/3 rounded-sm" />
          <Skeleton className="h-3 w-full rounded-sm" />
          <Skeleton className="h-3 w-1/2 rounded-sm" />
        </div>
      </div>
    </div>
  );
}

export function CouponSkeleton() {
  return <Skeleton className="h-44 w-full rounded-sm" />;
}
