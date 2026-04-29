"use client";

import Link from "next/link";

export default function EmptyState({
  title,
  message,
  actionLabel,
  actionHref,
}: {
  emoji?: string;
  title: string;
  message: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div className="px-6 py-16 text-left animate-fade-up max-w-md">
      <span className="inline-block h-px w-10 bg-accent-gold/60 mb-5" />
      <h3 className="font-serif text-2xl text-text-cream leading-tight">
        {title}
      </h3>
      <p className="font-serif italic text-text-muted/80 mt-3 leading-relaxed">
        {message}
      </p>
      {actionLabel && actionHref && (
        <Link href={actionHref} className="gold-underline-btn mt-6 inline-block">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
