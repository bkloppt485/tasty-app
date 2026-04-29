"use client";

import SubPageHeader from "@/components/SubPageHeader";

function H({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-serif text-xl text-text-cream mt-8 mb-3">{children}</h2>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-serif text-[0.95rem] text-text-cream/90 leading-[1.7] mb-3">
      {children}
    </p>
  );
}

export default function AGBPage() {
  return (
    <div>
      <SubPageHeader title="AGB" />

      <div className="px-7 pt-6 pb-12">
        <p className="text-[10px] uppercase tracking-[0.3em] text-accent-gold-soft">
          Allgemeine Geschäftsbedingungen
        </p>

        <H>§ 1 Geltungsbereich</H>
        <P>
          Die nachfolgenden Allgemeinen Geschäftsbedingungen gelten für alle
          Bestellungen, die Sie über die Tasty-App bei der Tasty Restaurant GmbH
          („Tasty&ldquo;) aufgeben. Mit Aufgabe Ihrer Bestellung erkennen Sie diese
          AGB an.
        </P>

        <H>§ 2 Vertragsschluss</H>
        <P>
          Die Darstellung der Speisen in der App stellt kein verbindliches
          Angebot dar. Mit dem Klick auf „Bestellung absenden&ldquo; geben Sie ein
          verbindliches Angebot ab. Der Vertrag kommt mit unserer
          Bestellbestätigung zustande.
        </P>

        <H>§ 3 Preise & Zahlung</H>
        <P>
          Alle Preise verstehen sich in Euro inklusive der gesetzlichen
          Mehrwertsteuer. Die Zahlung erfolgt bei Abholung im Restaurant in bar
          oder per Karte.
        </P>

        <H>§ 4 Abholung & Lieferung</H>
        <P>
          Die geschätzte Zubereitungszeit beträgt 15–25 Minuten. Bei Lieferung
          erfolgt diese innerhalb des Kasseler Stadtgebiets. Mindestbestellwert
          und Liefergebühren werden vor Abschluss der Bestellung angezeigt.
        </P>

        <H>§ 5 Widerruf</H>
        <P>
          Aufgrund der Beschaffenheit von leicht verderblichen Speisen besteht
          gemäß § 312g Abs. 2 Nr. 2 BGB kein Widerrufsrecht. Bei Mängeln
          kontaktieren Sie uns bitte umgehend.
        </P>

        <H>§ 6 Haftung</H>
        <P>
          Tasty haftet nach den gesetzlichen Bestimmungen für Schäden aus der
          Verletzung des Lebens, des Körpers oder der Gesundheit sowie für
          vorsätzlich oder grob fahrlässig verursachte Schäden.
        </P>

        <H>§ 7 Schlussbestimmungen</H>
        <P>
          Es gilt das Recht der Bundesrepublik Deutschland. Sollte eine
          Bestimmung dieser AGB unwirksam sein, bleibt die Wirksamkeit der
          übrigen Bestimmungen unberührt.
        </P>

        <P>Stand: April 2026</P>
      </div>
    </div>
  );
}
