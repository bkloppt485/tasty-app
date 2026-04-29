"use client";

import Link from "next/link";

export default function LoginRequiredOverlay({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <div className="px-7 py-16 max-w-md animate-fade-up">
      <p className="text-[10px] uppercase tracking-[0.3em] text-accent-gold/70">
        Riservato
      </p>
      <h2 className="mt-3 font-serif text-3xl text-text-cream leading-tight">
        {title}
      </h2>
      <p className="font-serif italic text-text-muted/85 mt-3 leading-relaxed">
        {message}
      </p>
      <div className="mt-8 flex flex-col items-start gap-5">
        <Link href="/login" className="gold-underline-btn">
          Anmelden
        </Link>
        <Link href="/register" className="gold-underline-btn">
          Konto erstellen
        </Link>
      </div>
    </div>
  );
}
