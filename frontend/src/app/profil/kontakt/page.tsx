"use client";

import SubPageHeader from "@/components/SubPageHeader";
import { Mail, Phone, MapPin, Instagram, Music2, type LucideIcon } from "lucide-react";

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

export default function KontaktPage() {
  return (
    <div>
      <SubPageHeader title="Kontakt" />

      <div className="px-7 pt-6 pb-12">
        <p className="font-serif italic text-text-muted text-sm">
          Wir freuen uns, von Ihnen zu hören.
        </p>

        <div className="mt-6">
          <Row icon={Mail} label="E-Mail">
            <a
              href="mailto:kontakt@tasty-kassel.de"
              className="hover:text-bordeaux"
            >
              kontakt@tasty-kassel.de
            </a>
          </Row>
          <Row icon={Phone} label="Telefon">
            <a href="tel:+495611234567" className="hover:text-bordeaux">
              +49 561 123 456
            </a>
          </Row>
          <Row icon={MapPin} label="Anschrift">
            Tasty Kassel<br />
            Königsstraße 50<br />
            34117 Kassel
          </Row>
          <Row icon={Instagram} label="Instagram">
            <a
              href="https://instagram.com/tasty.kassel"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-bordeaux"
            >
              @tasty.kassel
            </a>
          </Row>
          <Row icon={Music2} label="TikTok">
            <a
              href="https://tiktok.com/@tasty.kassel"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-bordeaux"
            >
              @tasty.kassel
            </a>
          </Row>
        </div>
      </div>
    </div>
  );
}
