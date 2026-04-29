"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function SubPageHeader({
  title,
  backHref = "/profil",
}: {
  title: string;
  backHref?: string;
}) {
  return (
    <header className="sticky top-0 z-30 px-6 pt-4 pb-3 bg-bg-primary/95 backdrop-blur-md border-b border-border-subtle">
      <div className="flex items-center gap-3">
        <Link
          href={backHref}
          aria-label="Zurück"
          className="h-9 w-9 -ml-2 rounded-full flex items-center justify-center text-text-cream hover:text-bordeaux transition-colors press"
        >
          <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
        </Link>
        <h1 className="font-serif text-xl text-text-cream tracking-wide">
          {title}
        </h1>
      </div>
    </header>
  );
}
