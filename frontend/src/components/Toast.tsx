"use client";

import { useEffect } from "react";
import { useUIStore } from "@/store/ui";
import { cn } from "@/lib/utils";

export default function Toast() {
  const toast = useUIStore((s) => s.toast);
  const clear = useUIStore((s) => s.clearToast);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(clear, 2800);
    return () => clearTimeout(t);
  }, [toast, clear]);

  if (!toast) return null;

  return (
    <div
      key={toast.id}
      className="fixed top-6 inset-x-0 z-[95] flex justify-center pointer-events-none px-4"
    >
      <div
        className={cn(
          "pointer-events-auto px-6 py-3 border rounded-sm text-[11px] uppercase tracking-[0.22em] animate-fade-up backdrop-blur-xl shadow-soft font-semibold",
          toast.type === "success" &&
            "bg-bordeaux text-bg-primary border-bordeaux-deep",
          toast.type === "error" &&
            "bg-red-700 text-bg-primary border-red-900",
          toast.type === "info" &&
            "bg-bg-elevated border-border-subtle text-text-cream"
        )}
      >
        {toast.message}
      </div>
    </div>
  );
}
