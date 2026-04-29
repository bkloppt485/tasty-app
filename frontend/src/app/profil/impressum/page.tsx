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

export default function ImpressumPage() {
  return (
    <div>
      <SubPageHeader title="Impressum" />

      <div className="px-7 pt-6 pb-12">
        <p className="text-[10px] uppercase tracking-[0.3em] text-accent-gold-soft">
          Angaben gemäß § 5 TMG
        </p>

        <H>Anbieter</H>
        <P>
          Tasty Restaurant GmbH<br />
          Königsstraße 50<br />
          34117 Kassel<br />
          Deutschland
        </P>

        <H>Vertreten durch</H>
        <P>Geschäftsführer: Marco Rossi & Selim Yıldız</P>

        <H>Kontakt</H>
        <P>
          Telefon: +49 561 123 456<br />
          E-Mail: kontakt@tasty-kassel.de
        </P>

        <H>Registereintrag</H>
        <P>
          Eintragung im Handelsregister.<br />
          Registergericht: Amtsgericht Kassel<br />
          Registernummer: HRB 12345
        </P>

        <H>Umsatzsteuer-ID</H>
        <P>
          Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:
          DE123456789
        </P>

        <H>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</H>
        <P>
          Marco Rossi<br />
          Königsstraße 50<br />
          34117 Kassel
        </P>

        <H>Streitschlichtung</H>
        <P>
          Die Europäische Kommission stellt eine Plattform zur
          Online-Streitbeilegung (OS) bereit. Wir sind nicht bereit oder
          verpflichtet, an Streitbeilegungsverfahren vor einer
          Verbraucherschlichtungsstelle teilzunehmen.
        </P>
      </div>
    </div>
  );
}
