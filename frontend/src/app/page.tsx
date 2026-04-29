"use client";

import Link from "next/link";
import Image from "next/image";
import { UtensilsCrossed, CalendarDays } from "lucide-react";
import Header from "@/components/Header";
import { useProducts, useCoupons } from "@/hooks/queries";
import { useAuthStore } from "@/store/auth";
import { CouponSkeleton, Skeleton } from "@/components/Skeleton";
import CouponCard from "@/components/CouponCard";
import Reveal from "@/components/Reveal";
import { formatPrice } from "@/lib/utils";

const PIZZA_VERINIO = {
  name: "Pizza Verinio",
  price: 11.9,
  description:
    "Hauchdünner Teig, San-Marzano-Tomaten, Büffelmozzarella aus Kampanien — frisches Basilikum.",
  image:
    "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=1400&q=80",
};

function getItalianGreeting(now: Date) {
  const h = now.getHours();
  if (h < 11) return { it: "Buongiorno.", de: "Guten Morgen." };
  if (h < 18) return { it: "Buon pomeriggio.", de: "Schön, dass Sie da sind." };
  return { it: "Buona sera.", de: "Schön, dass Sie da sind." };
}

export default function HomePage() {
  const { data: products = [], isLoading: productsLoading } = useProducts();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { data: coupons = [], isLoading: couponsLoading } = useCoupons();

  const featured = products.slice(0, 4);
  const greeting = getItalianGreeting(new Date());

  return (
    <div>
      <Header />

      {/* HERO – Pizza Verinio (Bordeaux Block, sticht raus auf Cream) */}
      <section className="px-5 pt-6">
        <div className="relative overflow-hidden bg-bordeaux text-bg-primary rounded-sm shadow-lg">
          <div className="relative h-56 w-full">
            <Image
              src={PIZZA_VERINIO.image}
              alt={PIZZA_VERINIO.name}
              fill
              sizes="400px"
              priority
              className="object-cover animate-fade-in-slow"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bordeaux via-bordeaux/40 to-transparent" />
            <span className="absolute top-3 left-4 inline-flex items-center px-2.5 py-1 bg-accent-gold text-bordeaux-deep text-[10px] uppercase tracking-[0.22em] font-semibold rounded-sm">
              Jetzt neu
            </span>
          </div>
          <div className="px-6 pt-4 pb-6">
            <p className="font-serif italic text-bg-primary/80 text-base">
              Una novità.
            </p>
            <h1 className="font-serif text-[2.4rem] leading-[1.05] mt-1 font-light tracking-tight">
              {PIZZA_VERINIO.name}
            </h1>
            <p className="font-serif italic text-bg-primary/85 mt-3 leading-relaxed text-[0.92rem]">
              {PIZZA_VERINIO.description}
            </p>
            <div className="mt-5 flex items-center justify-between gap-4">
              <p className="font-sans text-accent-gold text-sm tracking-wide">
                Probierpreis · {formatPrice(PIZZA_VERINIO.price)}
              </p>
              <Link
                href="/bestellen"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-accent-gold text-bordeaux-deep text-[11px] uppercase tracking-[0.18em] font-semibold rounded-sm press hover:bg-bg-primary transition-colors"
              >
                Entdecken →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA — Bestellen + Reservieren (Cream-elegant, two columns) */}
      <Reveal y={20} delay={120}>
        <section className="px-5 mt-8">
        <div className="bg-bg-elevated border border-border-subtle shadow-soft rounded-sm">
          <div className="flex flex-col sm:flex-row">
            <Link
              href="/bestellen"
              className="group flex-1 flex flex-col items-start px-6 py-8 hover:bg-bordeaux/[0.03] transition-colors press rounded-sm"
            >
              <span className="inline-flex items-center justify-center h-9 w-9 rounded-full border border-accent-gold/40 text-accent-gold mb-4 group-hover:border-accent-gold transition-colors">
                <UtensilsCrossed className="h-4 w-4" strokeWidth={1.4} />
              </span>
              <p className="text-[10px] uppercase tracking-[0.3em] text-accent-gold-soft">
                À la Carte
              </p>
              <h3 className="font-serif text-2xl text-bordeaux mt-2 leading-tight">
                Bestellen
              </h3>
              <p className="font-serif italic text-text-muted mt-2 text-sm leading-snug">
                Pickup oder Lieferung
              </p>
              <span className="mt-5 text-[11px] uppercase tracking-[0.22em] text-bordeaux border-b border-accent-gold pb-0.5 group-hover:text-bordeaux-deep transition-colors">
                Zur Karte →
              </span>
            </Link>

            {/* Vertical gold hairline divider on >= sm, horizontal on mobile */}
            <div className="hidden sm:flex items-stretch">
              <div className="my-6 w-px bg-gradient-to-b from-transparent via-accent-gold/50 to-transparent" />
            </div>
            <div className="sm:hidden mx-6">
              <div className="hairline-gold" />
            </div>

            <Link
              href="/reservieren"
              className="group flex-1 flex flex-col items-start px-6 py-8 hover:bg-bordeaux/[0.03] transition-colors press rounded-sm"
            >
              <span className="inline-flex items-center justify-center h-9 w-9 rounded-full border border-accent-gold/40 text-accent-gold mb-4 group-hover:border-accent-gold transition-colors">
                <CalendarDays className="h-4 w-4" strokeWidth={1.4} />
              </span>
              <p className="text-[10px] uppercase tracking-[0.3em] text-accent-gold-soft">
                Per Voi
              </p>
              <h3 className="font-serif text-2xl text-bordeaux mt-2 leading-tight">
                Reservieren
              </h3>
              <p className="font-serif italic text-text-muted mt-2 text-sm leading-snug">
                Tisch online buchen
              </p>
              <span className="mt-5 text-[11px] uppercase tracking-[0.22em] text-bordeaux border-b border-accent-gold pb-0.5 group-hover:text-bordeaux-deep transition-colors">
                Tisch reservieren →
              </span>
            </Link>
          </div>
        </div>
      </section>
      </Reveal>

      {/* Greeting */}
      <section className="px-7 pt-10 pb-4 animate-fade-up">
        <p className="font-serif italic text-2xl text-bordeaux">
          {greeting.it}
        </p>
        <p className="font-serif text-text-cream text-lg mt-1">
          {greeting.de}
        </p>
      </section>

      <div className="hairline-gold mx-7 my-2" />

      {/* Unsere Karte */}
      <Reveal y={18}>
      <section className="pt-10 pb-6">
        <div className="px-7">
          <p className="text-[10px] uppercase tracking-[0.3em] text-accent-gold-soft">
            La Carta
          </p>
          <h2 className="font-serif text-3xl text-text-cream mt-2">
            Unsere Karte
          </h2>
          <p className="font-serif italic text-text-muted mt-2 text-sm">
            Eine Auswahl unserer Lieblingsgerichte.
          </p>
        </div>
        <div className="mt-6 flex gap-5 overflow-x-auto no-scrollbar px-7 pb-2">
          {productsLoading &&
            [0, 1, 2].map((i) => (
              <Skeleton key={i} className="shrink-0 w-52 h-72 rounded-sm" />
            ))}
          {featured.map((p) => (
            <Link
              key={p.id}
              href="/bestellen"
              className="group shrink-0 w-52 press"
            >
              <div className="relative h-64 w-full bg-bg-elevated overflow-hidden border border-border-subtle rounded-sm shadow-soft">
                {p.image && (
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    sizes="208px"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                )}
              </div>
              <div className="pt-4">
                <h3 className="font-serif text-lg text-text-cream leading-tight">
                  {p.name}
                </h3>
                <p className="text-[11px] uppercase tracking-[0.2em] text-text-faint mt-1">
                  {p.category}
                </p>
                <p className="font-sans text-accent-gold-soft text-sm mt-2 tabular-nums">
                  {formatPrice(p.price)}
                </p>
              </div>
            </Link>
          ))}
        </div>
        <div className="px-7 mt-6">
          <Link href="/bestellen" className="gold-underline-btn">
            Gesamte Karte ansehen
          </Link>
        </div>
      </section>
      </Reveal>

      <div className="hairline-gold mx-7 my-12" />

      {/* Story / Editorial */}
      <Reveal y={20}>
      <section className="px-7 pb-4 animate-fade-up">
        <p className="text-[10px] uppercase tracking-[0.3em] text-accent-gold-soft">
          La Nostra Storia
        </p>
        <h2 className="font-serif text-3xl text-text-cream mt-2 leading-tight max-w-xs">
          Zwei Welten,
          <br />
          eine Leidenschaft.
        </h2>
        <div className="mt-6 relative h-64 w-full overflow-hidden border border-border-subtle rounded-sm shadow-soft">
          <Image
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80"
            alt="Tasty Tisch — orientalisch trifft italienisch"
            fill
            sizes="400px"
            className="object-cover"
          />
        </div>
        <p className="font-serif italic text-text-muted mt-6 leading-[1.8] text-[0.95rem]">
          Mitten in Kassel verschmelzen zwei kulinarische Traditionen: die
          würzige Wärme orientalischer Döner-Kunst und die klare Eleganz
          italienischer Küche. Jeder Teller ein kleines Versprechen — frische
          Zutaten, Handarbeit, Zeit.
        </p>
        <Link href="/profil/restaurant" className="gold-underline-btn mt-6 inline-block">
          Mehr über uns
        </Link>
      </section>
      </Reveal>

      <div className="hairline-gold mx-7 my-12" />

      {/* Aufmerksamkeiten */}
      <Reveal y={18}>
      <section className="px-7 pb-4">
        <p className="text-[10px] uppercase tracking-[0.3em] text-accent-gold-soft">
          Per Lei
        </p>
        <h2 className="font-serif text-3xl text-text-cream mt-2">
          Aktuelle Angebote
        </h2>
        <p className="font-serif italic text-text-muted mt-2 text-sm">
          Kleine Aufmerksamkeiten für unsere Gäste.
        </p>

        <div className="mt-6 space-y-5">
          {isAuthenticated ? (
            <>
              {couponsLoading && <CouponSkeleton />}
              {!couponsLoading &&
                coupons
                  .slice(0, 2)
                  .map((c) => <CouponCard key={c.id} coupon={c} />)}
              {!couponsLoading && coupons.length === 0 && (
                <div className="surface p-6">
                  <p className="font-serif italic text-accent-gold-soft text-sm">
                    Bald für Sie bereit.
                  </p>
                  <p className="font-serif text-text-cream text-lg mt-2">
                    Wir bereiten neue Angebote vor.
                  </p>
                </div>
              )}
              <div className="pt-2">
                <Link href="/coupons" className="gold-underline-btn">
                  Alle Angebote
                </Link>
              </div>
            </>
          ) : (
            <div className="surface p-6">
              <p className="font-serif italic text-accent-gold-soft text-sm">
                Werden Sie Teil unserer Familie.
              </p>
              <h3 className="font-serif text-2xl text-text-cream mt-2 leading-snug">
                Persönliche Angebote erwarten Sie.
              </h3>
              <Link
                href="/login"
                className="gold-underline-btn mt-5 inline-block"
              >
                Anmelden
              </Link>
            </div>
          )}
        </div>
      </section>
      </Reveal>

      {/* Footer */}
      <footer className="mt-16 px-7 pb-10">
        <div className="hairline-gold mb-8" />
        <p className="font-script text-2xl text-accent-gold leading-none">
          Tasty
        </p>
        <div className="mt-5 space-y-1.5 text-[12px] text-text-muted leading-relaxed">
          <p>Königsstraße 50 · 34117 Kassel</p>
          <p>+49 561 123 456</p>
          <p className="uppercase tracking-[0.18em] text-text-faint text-[10px] mt-3">
            Mo – So · 11:00 – 22:00
          </p>
        </div>
      </footer>
    </div>
  );
}
