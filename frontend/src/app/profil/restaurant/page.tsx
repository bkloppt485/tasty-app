"use client";

import SubPageHeader from "@/components/SubPageHeader";
import { MapPin, Phone, Mail, Clock, type LucideIcon } from "lucide-react";

function Row({
  icon: Icon,
  label,
  children,
}: {
  icon: LucideIcon;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4 py-4 border-b border-border-subtle">
      <span className="h-9 w-9 shrink-0 rounded-full bg-bg-elevated border border-border-subtle flex items-center justify-center text-accent-gold-soft">
        <Icon className="h-4 w-4" strokeWidth={1.5} />
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] uppercase tracking-[0.22em] text-text-faint">
          {label}
        </p>
        <div className="font-serif text-base text-text-cream mt-1 leading-snug">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function RestaurantPage() {
  return (
    <div>
      <SubPageHeader title="Restaurant" />

      <div className="px-7 pt-6 pb-12">
        <div className="surface overflow-hidden">
          <div className="aspect-[16/10] w-full bg-bg-deep">
            <iframe
              title="Tasty Kassel — Standort"
              src="https://www.openstreetmap.org/export/embed.html?bbox=9.4900%2C51.3120%2C9.5050%2C51.3200&layer=mapnik&marker=51.3160%2C9.4975"
              className="h-full w-full border-0"
              loading="lazy"
            />
          </div>
        </div>

        <div className="mt-6">
          <Row icon={MapPin} label="Adresse">
            Königsstraße 50<br />
            34117 Kassel
          </Row>
          <Row icon={Phone} label="Telefon">
            <a href="tel:+495611234567" className="hover:text-bordeaux">
              +49 561 123 456
            </a>
          </Row>
          <Row icon={Mail} label="E-Mail">
            <a
              href="mailto:kontakt@tasty-kassel.de"
              className="hover:text-bordeaux"
            >
              kontakt@tasty-kassel.de
            </a>
          </Row>
          <Row icon={Clock} label="Öffnungszeiten">
            Montag – Sonntag<br />
            11:00 – 22:00 Uhr
          </Row>
        </div>
      </div>
    </div>
  );
}
