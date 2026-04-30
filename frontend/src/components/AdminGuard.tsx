"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useAuthStore } from "@/store/auth";

export default function AdminGuard({
  title,
  backHref = "/admin",
  children,
}: {
  title: string;
  backHref?: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (!hydrated) return;
    if (!isAuthenticated) {
      router.replace("/login?next=/admin");
      return;
    }
    if (user && user.role !== "ADMIN") {
      router.replace("/");
    }
  }, [hydrated, isAuthenticated, user, router]);

  if (!hydrated || !user || user.role !== "ADMIN") {
    return (
      <main className="min-h-screen flex items-center justify-center text-text-muted">
        Lade…
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bg-primary pb-24">
      <header
        className="sticky top-0 z-30 px-5 pt-5 pb-3 bg-bg-primary/95 backdrop-blur-md border-b border-border-subtle flex items-center gap-3"
        style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 1rem)" }}
      >
        <Link
          href={backHref}
          aria-label="Zurück"
          className="h-9 w-9 -ml-2 rounded-full flex items-center justify-center text-text-cream hover:text-bordeaux transition-colors press"
        >
          <ArrowLeft className="h-5 w-5" strokeWidth={1.5} />
        </Link>
        <div>
          <p className="text-[10px] uppercase tracking-[0.28em] text-text-muted">
            Admin
          </p>
          <h1 className="font-serif text-xl text-text-cream leading-tight">
            {title}
          </h1>
        </div>
      </header>
      <div className="px-4 pt-4">{children}</div>
    </main>
  );
}
